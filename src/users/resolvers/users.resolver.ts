import {
	Args,
	Int,
	Mutation,
	Parent,
	Query,
	ResolveField,
	Resolver,
} from '@nestjs/graphql';

import { Order } from '@/orders/entities';
import { Restaurant } from '@/restaurants/entities';
import { CreateUserInput, UpdateUserInput } from '@/users/dtos';
import { User } from '@/users/entities';
import { UsersService } from '@/users/services/users.service';

@Resolver(() => User)
export class UsersResolver {
	constructor(private readonly usersService: UsersService) {}

	@Mutation(() => User)
	async createUser(
		@Args('createUserInput') createUserInput: CreateUserInput,
	): Promise<any> {
		return await this.usersService.create(createUserInput);
	}

	@Query(() => [User], { name: 'users' })
	async findAll(): Promise<any[]> {
		return await this.usersService.findAll();
	}

	@Query(() => User, { name: 'user' })
	async findOne(@Args('id', { type: () => Int }) id: number): Promise<any> {
		return await this.usersService.findOne(id);
	}

	@Query(() => User, { name: 'userByEmail' })
	async findByEmail(@Args('email') email: string): Promise<any> {
		return await this.usersService.findByEmail(email);
	}

	@Mutation(() => User)
	async updateUser(
		@Args('updateUserInput') updateUserInput: UpdateUserInput,
	): Promise<any> {
		return await this.usersService.update(updateUserInput.id, updateUserInput);
	}

	@Mutation(() => User)
	async removeUser(@Args('id', { type: () => Int }) id: number): Promise<any> {
		return await this.usersService.remove(id);
	}

	@ResolveField('restaurants', () => [Restaurant])
	getRestaurants(@Parent() user: User): Promise<any[]> {
		return this.usersService.findRestaurantsByOwner(user.id);
	}

	@ResolveField('orders', () => [Order])
	getOrders(@Parent() user: User): Promise<any[]> {
		return this.usersService.findOrdersByUser(user.id);
	}
}
