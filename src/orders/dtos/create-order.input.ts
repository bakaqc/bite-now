import { Field, Float, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateOrderItemInput {
	@Field(() => Int)
	menuItemId: number;

	@Field(() => Int)
	quantity: number;

	@Field(() => Float)
	unitPrice: number;
}

@InputType()
export class CreateOrderInput {
	@Field(() => Int)
	userId: number;

	@Field(() => [CreateOrderItemInput])
	items: CreateOrderItemInput[];

	@Field(() => Float)
	totalPrice: number;

	@Field(() => String, {
		nullable: true,
	})
	deliveryAddress?: string;

	@Field(() => String, {
		nullable: true,
	})
	paymentMethod?: string;
}
