import { registerEnumType } from '@nestjs/graphql';

export enum OrderStatus {
	PENDING = 'PENDING',
	CONFIRMED = 'CONFIRMED',
	COOKING = 'COOKING',
	OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
	DELIVERED = 'DELIVERED',
	CANCELLED = 'CANCELLED',
}

registerEnumType(OrderStatus, {
	name: 'OrderStatus',
});
