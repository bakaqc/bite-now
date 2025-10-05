import { Module } from '@nestjs/common';

import { MenuItemsModule } from '@/menu-items/menu-items.module';
import { OrderItemResolver, OrdersResolver } from '@/orders/resolvers';
import { OrdersService } from '@/orders/services';
import { PrismaModule } from '@/providers/prisma/prisma.module';
import { UsersModule } from '@/users/users.module';

@Module({
	imports: [PrismaModule, UsersModule, MenuItemsModule],
	providers: [OrdersResolver, OrderItemResolver, OrdersService],
	exports: [OrdersService],
})
export class OrdersModule {}
