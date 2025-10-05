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
	async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
		return this.usersService.create(createUserInput);
	}

	@Query(() => [User], { name: 'users' })
	async findAll() {
		return this.usersService.findAll();
	}

	@Query(() => User, { name: 'user' })
	async findOne(@Args('id', { type: () => Int }) id: number) {
		return this.usersService.findOne(id);
	}

	@Query(() => User, { name: 'userByEmail' })
	async findByEmail(@Args('email') email: string) {
		return this.usersService.findByEmail(email);
	}

	@Mutation(() => User)
	async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
		return this.usersService.update(updateUserInput.id, updateUserInput);
	}

	@Mutation(() => User)
	async removeUser(@Args('id', { type: () => Int }) id: number) {
		return this.usersService.remove(id);
	}

	@ResolveField('restaurants', () => [Restaurant])
	getRestaurants(@Parent() user: User) {
		return this.usersService.findRestaurantsByOwner(user.id);
	}

	@ResolveField('orders', () => [Order])
	getOrders(@Parent() user: User) {
		return this.usersService.findOrdersByUser(user.id);
	}
}
