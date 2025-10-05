import {
	Args,
	Int,
	Mutation,
	Parent,
	Query,
	ResolveField,
	Resolver,
} from '@nestjs/graphql';

import { CreateOrderInput, UpdateOrderInput } from '@/orders/dtos';
import { Order } from '@/orders/entities';
import { OrderStatus } from '@/orders/enums/order-status.enum';
import { OrdersService } from '@/orders/services/orders.service';
import { User } from '@/users/entities';
import { UsersService } from '@/users/services/users.service';

@Resolver(() => Order)
export class OrdersResolver {
	constructor(
		private readonly ordersService: OrdersService,
		private readonly usersService: UsersService,
	) {}

	@Mutation(() => Order)
	async createOrder(
		@Args('createOrderInput') createOrderInput: CreateOrderInput,
	) {
		return this.ordersService.create(createOrderInput);
	}

	@Query(() => [Order], { name: 'orders' })
	async findAll() {
		return this.ordersService.findAll();
	}

	@Query(() => Order, { name: 'order' })
	async findOne(@Args('id', { type: () => Int }) id: number) {
		return this.ordersService.findOne(id);
	}

	@Query(() => [Order], { name: 'ordersByUser' })
	async findByUser(@Args('userId', { type: () => Int }) userId: number) {
		return this.ordersService.findByUser(userId);
	}

	@Query(() => [Order], { name: 'ordersByStatus' })
	async findByStatus(
		@Args('status', { type: () => OrderStatus }) status: OrderStatus,
	) {
		return this.ordersService.findByStatus(status);
	}

	@Mutation(() => Order)
	async updateOrder(
		@Args('updateOrderInput') updateOrderInput: UpdateOrderInput,
	) {
		return this.ordersService.update(updateOrderInput.id, updateOrderInput);
	}

	@Mutation(() => Order)
	async updateOrderStatus(
		@Args('id', { type: () => Int }) id: number,
		@Args('status', { type: () => OrderStatus }) status: OrderStatus,
	) {
		return this.ordersService.updateStatus(id, status);
	}

	@Mutation(() => Order)
	async removeOrder(@Args('id', { type: () => Int }) id: number) {
		return this.ordersService.remove(id);
	}

	@ResolveField('user', () => User)
	getUser(@Parent() order: Order) {
		return this.usersService.findOne(order.userId);
	}
}
