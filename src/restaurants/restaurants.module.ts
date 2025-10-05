import { Module, forwardRef } from '@nestjs/common';

import { MenuItemsModule } from '@/menu-items/menu-items.module';
import { PrismaModule } from '@/providers/prisma/prisma.module';
import { RestaurantsResolver } from '@/restaurants/resolvers';
import { RestaurantsService } from '@/restaurants/services';
import { UsersModule } from '@/users/users.module';

@Module({
	imports: [PrismaModule, UsersModule, forwardRef(() => MenuItemsModule)],
	providers: [RestaurantsResolver, RestaurantsService],
	exports: [RestaurantsService],
})
export class RestaurantsModule {}
