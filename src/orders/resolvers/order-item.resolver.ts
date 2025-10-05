import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { MenuItem } from '@/menu-items/entities';
import { MenuItemsService } from '@/menu-items/services/menu-items.service';
import { OrderItem } from '@/orders/entities';

@Resolver(() => OrderItem)
export class OrderItemResolver {
	constructor(private readonly menuItemsService: MenuItemsService) {}

	@ResolveField('menuItem', () => MenuItem)
	getMenuItem(@Parent() orderItem: OrderItem) {
		return this.menuItemsService.findOne(orderItem.menuItemId);
	}
}
