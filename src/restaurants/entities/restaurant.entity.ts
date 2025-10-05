import { Field, Int, ObjectType } from '@nestjs/graphql';

import { MenuItem } from '@/menu-items/entities';
import { User } from '@/users/entities';

@ObjectType()
export class Restaurant {
	@Field(() => Int)
	id: number;

	@Field(() => String)
	name: string;

	@Field(() => String, { nullable: true })
	description?: string;

	@Field(() => String)
	address: string;

	@Field(() => String, { nullable: true })
	phone?: string;

	@Field(() => Boolean)
	isActive: boolean;

	@Field(() => Int, { nullable: true })
	ownerId?: number;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	@Field(() => User, { nullable: true })
	owner?: User;

	@Field(() => [MenuItem])
	menuItems: MenuItem[];
}
