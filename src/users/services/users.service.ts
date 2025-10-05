import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

import { PrismaService } from '@/providers/prisma/prisma.service';
import { CreateUserInput, UpdateUserInput } from '@/users/dtos';

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	async create(createUserInput: CreateUserInput) {
		// Hash password using argon2
		const hashedPassword = await argon2.hash(createUserInput.password || '');

		return this.prisma.user.create({
			data: {
				email: createUserInput.email,
				name: createUserInput.name,
				password: hashedPassword,
				role: createUserInput.role ?? 'CUSTOMER',
				isActive: createUserInput.isActive ?? true,
			},
		});
	}

	async findAll() {
		return this.prisma.user.findMany({
			include: {
				restaurants: true,
				orders: {
					include: {
						items: true,
					},
				},
			},
		});
	}

	async findOne(id: number) {
		return this.prisma.user.findUnique({
			where: { id },
			include: {
				restaurants: true,
				orders: {
					include: {
						items: true,
					},
				},
			},
		});
	}

	async update(id: number, updateUserInput: UpdateUserInput) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { id: _, ...updateData } = updateUserInput;

		// Hash password if it's being updated
		if (updateData.password) {
			updateData.password = await argon2.hash(updateData.password);
		}

		return this.prisma.user.update({
			where: { id },
			data: updateData,
		});
	}

	async remove(id: number) {
		return this.prisma.user.delete({
			where: { id },
		});
	}

	async findByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: { email },
		});
	}

	async findRestaurantsByOwner(ownerId: number) {
		return this.prisma.restaurant.findMany({
			where: { ownerId },
		});
	}

	async findOrdersByUser(userId: number) {
		return this.prisma.order.findMany({
			where: { userId },
			include: {
				items: {
					include: {
						menuItem: true,
					},
				},
			},
		});
	}
}
