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
	) {
		return this.restaurantsService.create(createRestaurantInput);
	}

	@Query(() => [Restaurant], { name: 'restaurants' })
	async findAll() {
		return this.restaurantsService.findAll();
	}

	@Query(() => Restaurant, { name: 'restaurant' })
	async findOne(@Args('id', { type: () => Int }) id: number) {
		return this.restaurantsService.findOne(id);
	}

	@Mutation(() => Restaurant)
	async updateRestaurant(
		@Args('updateRestaurantInput') updateRestaurantInput: UpdateRestaurantInput,
	) {
		return this.restaurantsService.update(
			updateRestaurantInput.id,
			updateRestaurantInput,
		);
	}

	@Mutation(() => Restaurant)
	async removeRestaurant(@Args('id', { type: () => Int }) id: number) {
		return this.restaurantsService.remove(id);
	}

	@ResolveField('owner', () => User, { nullable: true })
	getOwner(@Parent() restaurant: Restaurant) {
		if (!restaurant.ownerId) return null;
		return this.usersService.findOne(restaurant.ownerId);
	}

	@ResolveField('menuItems', () => [MenuItem])
	getMenuItems(@Parent() restaurant: Restaurant) {
		return this.menuItemsService.findByRestaurant(restaurant.id);
	}
}
