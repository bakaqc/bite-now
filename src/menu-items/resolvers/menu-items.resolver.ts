import {
	Args,
	Int,
	Mutation,
	Parent,
	Query,
	ResolveField,
	Resolver,
} from '@nestjs/graphql';

import { CreateMenuItemInput, UpdateMenuItemInput } from '@/menu-items/dtos';
import { MenuItem } from '@/menu-items/entities';
import { MenuItemsService } from '@/menu-items/services/menu-items.service';
import { Restaurant } from '@/restaurants/entities';
import { RestaurantsService } from '@/restaurants/services';

@Resolver(() => MenuItem)
export class MenuItemsResolver {
	constructor(
		private readonly menuItemsService: MenuItemsService,
		private readonly restaurantsService: RestaurantsService,
	) {}

	@Mutation(() => MenuItem)
	async createMenuItem(
		@Args('createMenuItemInput') createMenuItemInput: CreateMenuItemInput,
	) {
		return this.menuItemsService.create(createMenuItemInput);
	}

	@Query(() => [MenuItem], { name: 'menuItems' })
	async findAll() {
		return this.menuItemsService.findAll();
	}

	@Query(() => MenuItem, { name: 'menuItem' })
	async findOne(@Args('id', { type: () => Int }) id: number) {
		return this.menuItemsService.findOne(id);
	}

	@Query(() => [MenuItem], { name: 'menuItemsByRestaurant' })
	async findByRestaurant(
		@Args('restaurantId', { type: () => Int }) restaurantId: number,
	) {
		return this.menuItemsService.findByRestaurant(restaurantId);
	}

	@Mutation(() => MenuItem)
	async updateMenuItem(
		@Args('updateMenuItemInput') updateMenuItemInput: UpdateMenuItemInput,
	) {
		return this.menuItemsService.update(
			updateMenuItemInput.id,
			updateMenuItemInput,
		);
	}

	@Mutation(() => MenuItem)
	async removeMenuItem(@Args('id', { type: () => Int }) id: number) {
		return this.menuItemsService.remove(id);
	}

	@ResolveField('restaurant', () => Restaurant)
	getRestaurant(@Parent() menuItem: MenuItem) {
		return this.restaurantsService.findOne(menuItem.restaurantId);
	}
}
