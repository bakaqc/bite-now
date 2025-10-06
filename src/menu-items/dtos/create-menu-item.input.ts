import { Field, Float, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateMenuItemInput {
	@Field(() => Int)
	restaurantId: number;

	@Field(() => String)
	name: string;

	@Field(() => String, { nullable: true })
	description?: string;

	@Field(() => Float)
	price: number;

	@Field(() => String, { nullable: true })
	imageUrl?: string;

	@Field(() => Boolean, { nullable: true, defaultValue: true })
	isAvailable?: boolean;
}
