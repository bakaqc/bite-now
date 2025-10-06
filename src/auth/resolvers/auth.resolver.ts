import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthPayload, LoginInput, RegisterInput } from '@/auth/dtos';
import { JwtAuthGuard } from '@/auth/guards/auth.guard';
import { AuthService } from '@/auth/services/auth.service';
import { User } from '@/users/entities/user.entity';

@Resolver()
export class AuthResolver {
	constructor(private authService: AuthService) {}

	@Mutation(() => AuthPayload)
	async register(
		@Args('registerInput') registerInput: RegisterInput,
	): Promise<AuthPayload> {
		return this.authService.register(registerInput);
	}

	@Mutation(() => AuthPayload)
	async login(
		@Args('loginInput') loginInput: LoginInput,
	): Promise<AuthPayload> {
		return this.authService.login(loginInput);
	}

	@Query(() => User)
	@UseGuards(JwtAuthGuard)
	me(@Context() context: { req: { user: User } }): Promise<User> {
		return Promise.resolve(context.req.user);
	}
}
