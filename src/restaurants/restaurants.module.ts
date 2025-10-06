import { Module, forwardRef } from '@nestjs/common';

import { AuthModule } from '@/auth/auth.module';
import { MenuItemsModule } from '@/menu-items/menu-items.module';
import { PrismaModule } from '@/providers/prisma/prisma.module';
import { RestaurantsResolver } from '@/restaurants/resolvers';
import { RestaurantsService } from '@/restaurants/services';
import { UsersModule } from '@/users/users.module';

@Module({
	imports: [
		AuthModule,
		PrismaModule,
		UsersModule,
		forwardRef(() => MenuItemsModule),
	],
	providers: [RestaurantsResolver, RestaurantsService],
	exports: [RestaurantsService],
})
export class RestaurantsModule {}
