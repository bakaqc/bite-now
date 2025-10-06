import { Field, InputType } from '@nestjs/graphql';
import {
	IsEmail,
	IsEnum,
	IsOptional,
	IsString,
	MinLength,
} from 'class-validator';

import { Role } from '@/users/enums/role.enum';

@InputType()
export class RegisterInput {
	@Field()
	@IsEmail()
	email: string;

	@Field()
	@IsString()
	@MinLength(2)
	name: string;

	@Field()
	@IsString()
	@MinLength(6)
	password: string;

	@Field(() => Role, { nullable: true })
	@IsOptional()
	@IsEnum(Role)
	role?: Role;
}

@InputType()
export class LoginInput {
	@Field()
	@IsEmail()
	email: string;

	@Field()
	@IsString()
	password: string;
}
