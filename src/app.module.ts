import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { AuthModule } from '@/auth/auth.module';
import { MenuItemsModule } from '@/menu-items/menu-items.module';
import { OrdersModule } from '@/orders/orders.module';
import { PrismaModule } from '@/providers/prisma/prisma.module';
import { RestaurantsModule } from '@/restaurants/restaurants.module';
import { UploadModule } from '@/upload/upload.module';
import { UsersModule } from '@/users/users.module';

@Module({
	imports: [
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: true, // Tự động tạo schema từ decorators
			playground: true, // Bật GraphQL Playground
			introspection: true, // Cho phép introspection
		}),
		AuthModule,
		UploadModule,
		UsersModule,
		RestaurantsModule,
		MenuItemsModule,
		OrdersModule,
		PrismaModule,
	],
})
export class AppModule {}
