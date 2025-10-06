import { UseGuards } from '@nestjs/common';
import {
	Args,
	Context,
	Int,
	Mutation,
	Parent,
	Query,
	ResolveField,
	Resolver,
} from '@nestjs/graphql';

import { JwtAuthGuard, Roles, RolesGuard } from '@/auth';
import { MenuItem } from '@/menu-items/entities';
import { MenuItemsService } from '@/menu-items/services/menu-items.service';
import {
	CreateRestaurantInput,
	UpdateRestaurantInput,
} from '@/restaurants/dtos';
import { Restaurant } from '@/restaurants/entities';
import { RestaurantsService } from '@/restaurants/services/restaurants.service';
import { User } from '@/users/entities';
import { Role } from '@/users/enums/role.enum';
import { UsersService } from '@/users/services/users.service';

@Resolver(() => Restaurant)
export class RestaurantsResolver {
	constructor(
		private readonly restaurantsService: RestaurantsService,
		private readonly usersService: UsersService,
		private readonly menuItemsService: MenuItemsService,
	) {}

	@Mutation(() => Restaurant)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.RESTAURANT_OWNER, Role.ADMIN)
	async createRestaurant(
		@Args('createRestaurantInput') createRestaurantInput: CreateRestaurantInput,
		@Context() context: { req: { user: User } },
	): Promise<Restaurant> {
		// Automatically set ownerId to current user if not provided
		const currentUser: User = context.req.user;
		if (!createRestaurantInput.ownerId) {
			createRestaurantInput.ownerId = currentUser.id;
		}
		const restaurant = await this.restaurantsService.create(
			createRestaurantInput,
		);
		return {
			...restaurant,
			description: restaurant.description ?? undefined,
			phone: restaurant.phone ?? undefined,
			imageUrl: restaurant.imageUrl ?? undefined,
			ownerId: restaurant.ownerId ?? undefined,
			isActive: restaurant.isActive,
			createdAt: restaurant.createdAt,
			updatedAt: restaurant.updatedAt,
			id: restaurant.id,
			name: restaurant.name,
			address: restaurant.address,
			menuItems: [],
		};
	}

	@Query(() => [Restaurant], { name: 'restaurants' })
	async findAll(): Promise<any[]> {
		return await this.restaurantsService.findAll();
	}

	@Query(() => Restaurant, { name: 'restaurant' })
	async findOne(@Args('id', { type: () => Int }) id: number): Promise<any> {
		return await this.restaurantsService.findOne(id);
	}

	@Mutation(() => Restaurant)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.RESTAURANT_OWNER, Role.ADMIN)
	async updateRestaurant(
		@Args('updateRestaurantInput') updateRestaurantInput: UpdateRestaurantInput,
	): Promise<any> {
		return await this.restaurantsService.update(
			updateRestaurantInput.id,
			updateRestaurantInput,
		);
	}

	@Mutation(() => Restaurant)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.RESTAURANT_OWNER, Role.ADMIN)
	async removeRestaurant(
		@Args('id', { type: () => Int }) id: number,
	): Promise<any> {
		return await this.restaurantsService.remove(id);
	}

	@ResolveField('owner', () => User, { nullable: true })
	getOwner(@Parent() restaurant: Restaurant): Promise<any> | null {
		if (!restaurant.ownerId) return null;
		return this.usersService.findOne(restaurant.ownerId);
	}

	@ResolveField('menuItems', () => [MenuItem])
	getMenuItems(@Parent() restaurant: Restaurant): Promise<any[]> {
		return this.menuItemsService.findByRestaurant(restaurant.id);
	}
}
