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
	): Promise<any> {
		return await this.menuItemsService.create(createMenuItemInput);
	}

	@Query(() => [MenuItem], { name: 'menuItems' })
	async findAll(): Promise<any[]> {
		return await this.menuItemsService.findAll();
	}

	@Query(() => MenuItem, { name: 'menuItem' })
	async findOne(@Args('id', { type: () => Int }) id: number): Promise<any> {
		return await this.menuItemsService.findOne(id);
	}

	@Query(() => [MenuItem], { name: 'menuItemsByRestaurant' })
	async findByRestaurant(
		@Args('restaurantId', { type: () => Int }) restaurantId: number,
	): Promise<any[]> {
		return await this.menuItemsService.findByRestaurant(restaurantId);
	}

	@Mutation(() => MenuItem)
	async updateMenuItem(
		@Args('updateMenuItemInput') updateMenuItemInput: UpdateMenuItemInput,
	): Promise<any> {
		return await this.menuItemsService.update(
			updateMenuItemInput.id,
			updateMenuItemInput,
		);
	}

	@Mutation(() => MenuItem)
	async removeMenuItem(
		@Args('id', { type: () => Int }) id: number,
	): Promise<any> {
		return await this.menuItemsService.remove(id);
	}

	@ResolveField('restaurant', () => Restaurant)
	getRestaurant(@Parent() menuItem: MenuItem): Promise<any> {
		return this.restaurantsService.findOne(menuItem.restaurantId);
	}
}
