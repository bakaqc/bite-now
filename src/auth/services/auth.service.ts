import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

import { AuthPayload, LoginInput, RegisterInput } from '@/auth/dtos';
import { PrismaService } from '@/providers/prisma/prisma.service';
import { UsersService } from '@/users/services/users.service';

@Injectable()
export class AuthService {
	constructor(
		private prismaService: PrismaService,
		private usersService: UsersService,
		private jwtService: JwtService,
	) {}

	async register(registerInput: RegisterInput): Promise<AuthPayload> {
		const { email, password, name, role } = registerInput;

		// Check if user already exists
		const existingUser = await this.prismaService.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			throw new UnauthorizedException('User already exists');
		}

		// Hash password
		const hashedPassword = await argon2.hash(password);

		// Create user
		const user = await this.prismaService.user.create({
			data: {
				email,
				name,
				password: hashedPassword,
				role: role || 'CUSTOMER',
			},
		});

		// Generate JWT token
		const accessToken = this.jwtService.sign({
			sub: user.id,
			email: user.email,
			role: user.role,
		});

		return {
			accessToken,
			user: {
				...user,
				role: user.role as import('@/users/enums/role.enum').Role,
			},
		};
	}

	async login(loginInput: LoginInput): Promise<AuthPayload> {
		const { email, password } = loginInput;

		// Find user
		const user = await this.prismaService.user.findUnique({
			where: { email },
		});

		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		// Verify password
		const isPasswordValid = await argon2.verify(user.password || '', password);

		if (!isPasswordValid) {
			throw new UnauthorizedException('Invalid credentials');
		}

		// Check if user is active
		if (!user.isActive) {
			throw new UnauthorizedException('Account is deactivated');
		}

		// Generate JWT token
		const accessToken = this.jwtService.sign({
			sub: user.id,
			email: user.email,
			role: user.role,
		});

		return {
			accessToken,
			user: {
				...user,
				role: user.role as import('@/users/enums/role.enum').Role,
			},
		};
	}

	async validateUser(userId: number) {
		return this.usersService.findOne(userId);
	}
}
