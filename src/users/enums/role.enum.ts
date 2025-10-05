import { registerEnumType } from '@nestjs/graphql';

export enum Role {
	CUSTOMER = 'CUSTOMER',
	RESTAURANT_OWNER = 'RESTAURANT_OWNER',
	ADMIN = 'ADMIN',
}

registerEnumType(Role, {
	name: 'Role',
});
