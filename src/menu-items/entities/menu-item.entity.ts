import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

import { Restaurant } from '@/restaurants/entities';

@ObjectType()
export class MenuItem {
	@Field(() => Int)
	id: number;

	@Field(() => Int)
	restaurantId: number;

	@Field(() => String)
	name: string;

	@Field(() => String, { nullable: true })
	description?: string;

	@Field(() => Float)
	price: number;

	@Field(() => Boolean)
	isAvailable: boolean;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	@Field(() => Restaurant)
	restaurant: Restaurant;
}
