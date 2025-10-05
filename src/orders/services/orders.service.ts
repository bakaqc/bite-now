import { Injectable } from '@nestjs/common';

import { CreateOrderInput, UpdateOrderInput } from '@/orders/dtos';
import { OrderStatus } from '@/orders/enums/order-status.enum';
import { PrismaService } from '@/providers/prisma/prisma.service';

@Injectable()
export class OrdersService {
	constructor(private readonly prisma: PrismaService) {}

	async create(createOrderInput: CreateOrderInput) {
		// Sử dụng transaction để đảm bảo tất cả operations thành công
		return this.prisma.$transaction(async (tx) => {
			// Tạo order trước
			const order = await tx.order.create({
				data: {
					userId: createOrderInput.userId,
					totalPrice: createOrderInput.totalPrice,
					deliveryAddress: createOrderInput.deliveryAddress,
					paymentMethod: createOrderInput.paymentMethod,
					status: OrderStatus.PENDING,
				},
			});

			// Tạo order items
			await Promise.all(
				createOrderInput.items.map((item) =>
					tx.orderItem.create({
						data: {
							orderId: order.id,
							menuItemId: item.menuItemId,
							quantity: item.quantity,
							unitPrice: item.unitPrice,
							totalPrice: item.unitPrice * item.quantity,
						},
					}),
				),
			);

			// Trả về order với items
			return tx.order.findUnique({
				where: { id: order.id },
				include: {
					items: {
						include: {
							menuItem: {
								include: {
									restaurant: true,
								},
							},
						},
					},
					user: true,
				},
			});
		});
	}

	async findAll() {
		return this.prisma.order.findMany({
			include: {
				items: {
					include: {
						menuItem: {
							include: {
								restaurant: true,
							},
						},
					},
				},
				user: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});
	}

	async findOne(id: number) {
		return this.prisma.order.findUnique({
			where: { id },
			include: {
				items: {
					include: {
						menuItem: {
							include: {
								restaurant: true,
							},
						},
					},
				},
				user: true,
			},
		});
	}

	async update(id: number, updateOrderInput: UpdateOrderInput) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { id: _, items, userId, ...updateData } = updateOrderInput;
		return this.prisma.order.update({
			where: { id },
			data: updateData,
			include: {
				items: {
					include: {
						menuItem: true,
					},
				},
				user: true,
			},
		});
	}

	async remove(id: number) {
		return this.prisma.order.delete({
			where: { id },
			include: {
				items: true,
				user: true,
			},
		});
	}

	async findByUser(userId: number) {
		return this.prisma.order.findMany({
			where: { userId },
			include: {
				items: {
					include: {
						menuItem: {
							include: {
								restaurant: true,
							},
						},
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});
	}

	async findByStatus(status: OrderStatus) {
		return this.prisma.order.findMany({
			where: { status },
			include: {
				items: {
					include: {
						menuItem: {
							include: {
								restaurant: true,
							},
						},
					},
				},
				user: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});
	}

	async updateStatus(id: number, status: OrderStatus) {
		return this.prisma.order.update({
			where: { id },
			data: { status },
			include: {
				items: {
					include: {
						menuItem: true,
					},
				},
				user: true,
			},
		});
	}
}
