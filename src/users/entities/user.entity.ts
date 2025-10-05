import { Field, Int, ObjectType } from '@nestjs/graphql';

import { Order } from '@/orders/entities';
import { Restaurant } from '@/restaurants/entities';
import { Role } from '@/users/enums/role.enum';

@ObjectType()
export class User {
	@Field(() => Int)
	id: number;

	@Field(() => String)
	email: string;

	@Field(() => String)
	name: string;

	@Field(() => Role)
	role: Role;

	@Field(() => Boolean)
	isActive: boolean;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	@Field(() => [Restaurant])
	restaurants: Restaurant[];

	@Field(() => [Order])
	orders: Order[];
}
