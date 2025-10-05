import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateRestaurantInput {
	@Field(() => String)
	name: string;

	@Field(() => String, { nullable: true })
	description?: string;

	@Field(() => String)
	address: string;

	@Field(() => String, { nullable: true })
	phone?: string;

	@Field(() => Int, { nullable: true })
	ownerId?: number;

	@Field(() => Boolean, { nullable: true, defaultValue: true })
	isActive?: boolean;
}
