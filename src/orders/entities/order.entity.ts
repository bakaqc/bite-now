import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

import { MenuItem } from '@/menu-items/entities';
import { OrderStatus } from '@/orders/enums/order-status.enum';
import { User } from '@/users/entities';

@ObjectType()
export class OrderItem {
	@Field(() => Int)
	id: number;

	@Field(() => Int)
	orderId: number;

	@Field(() => Int)
	menuItemId: number;

	@Field(() => Int)
	quantity: number;

	@Field(() => Float)
	unitPrice: number;

	@Field(() => Float)
	totalPrice: number;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => MenuItem)
	menuItem: MenuItem;
}

@ObjectType()
export class Order {
	@Field(() => Int)
	id: number;

	@Field(() => Int)
	userId: number;

	@Field(() => [OrderItem])
	items: OrderItem[];

	@Field(() => Float)
	totalPrice: number;

	@Field(() => OrderStatus)
	status: OrderStatus;

	@Field(() => String, { nullable: true })
	deliveryAddress?: string;

	@Field(() => String, { nullable: true })
	paymentMethod?: string;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	@Field(() => User)
	user: User;
}
