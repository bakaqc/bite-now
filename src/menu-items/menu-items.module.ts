import { Module, forwardRef } from '@nestjs/common';

import { MenuItemsResolver } from '@/menu-items/resolvers';
import { MenuItemsService } from '@/menu-items/services';
import { PrismaModule } from '@/providers/prisma/prisma.module';
import { RestaurantsModule } from '@/restaurants/restaurants.module';

@Module({
	imports: [PrismaModule, forwardRef(() => RestaurantsModule)],
	providers: [MenuItemsResolver, MenuItemsService],
	exports: [MenuItemsService],
})
export class MenuItemsModule {}
