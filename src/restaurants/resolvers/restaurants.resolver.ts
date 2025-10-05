import {
	Args,
	Int,
	Mutation,
	Parent,
	Query,
	ResolveField,
	Resolver,
} from '@nestjs/graphql';

import { MenuItem } from '@/menu-items/entities';
import { MenuItemsService } from '@/menu-items/services/menu-items.service';
import {
	CreateRestaurantInput,
	UpdateRestaurantInput,
} from '@/restaurants/dtos';
import { Restaurant } from '@/restaurants/entities';
import { RestaurantsService } from '@/restaurants/services/restaurants.service';
import { User } from '@/users/entities';
import { UsersService } from '@/users/services/users.service';

@Resolver(() => Restaurant)
export class RestaurantsResolver {
	constructor(
		private readonly restaurantsService: RestaurantsService,
		private readonly usersService: UsersService,
		private readonly menuItemsService: MenuItemsService,
	) {}

	@Mutation(() => Restaurant)
	async createRestaurant(
		@Args('createRestaurantInput') createRestaurantInput: CreateRestaurantInput,
	): Promise<any> {
		return await this.restaurantsService.create(createRestaurantInput);
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
	async updateRestaurant(
		@Args('updateRestaurantInput') updateRestaurantInput: UpdateRestaurantInput,
	): Promise<any> {
		return await this.restaurantsService.update(
			updateRestaurantInput.id,
			updateRestaurantInput,
		);
	}

	@Mutation(() => Restaurant)
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
