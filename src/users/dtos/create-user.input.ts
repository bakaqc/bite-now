import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsIn } from 'class-validator';

import { Role } from '@/users/enums/role.enum';

@InputType()
export class CreateUserInput {
	@Field(() => String)
	@IsEmail()
	email: string;

	@Field(() => String)
	name: string;

	@Field(() => String, { nullable: true })
	password?: string;

	@Field(() => Role, { nullable: true, defaultValue: Role.CUSTOMER })
	@IsIn(Object.values(Role))
	role?: Role;

	@Field(() => Boolean, { nullable: true, defaultValue: true })
	isActive?: boolean;
}
