import { Injectable } from '@nestjs/common';

import { CreateMenuItemInput, UpdateMenuItemInput } from '@/menu-items/dtos';
import { PrismaService } from '@/providers/prisma/prisma.service';

@Injectable()
export class MenuItemsService {
	constructor(private readonly prisma: PrismaService) {}

	async create(createMenuItemInput: CreateMenuItemInput) {
		return this.prisma.menuItem.create({
			data: {
				name: createMenuItemInput.name,
				description: createMenuItemInput.description,
				price: createMenuItemInput.price,
				isAvailable: createMenuItemInput.isAvailable ?? true,
				restaurantId: createMenuItemInput.restaurantId,
			},
		});
	}

	async findAll() {
		return this.prisma.menuItem.findMany({
			include: {
				restaurant: true,
			},
		});
	}

	async findOne(id: number) {
		return this.prisma.menuItem.findUnique({
			where: { id },
			include: {
				restaurant: true,
			},
		});
	}

	async update(id: number, updateMenuItemInput: UpdateMenuItemInput) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { id: _, ...updateData } = updateMenuItemInput;
		return this.prisma.menuItem.update({
			where: { id },
			data: updateData,
		});
	}

	async remove(id: number) {
		return this.prisma.menuItem.delete({
			where: { id },
		});
	}

	async findByRestaurant(restaurantId: number) {
		return this.prisma.menuItem.findMany({
			where: { restaurantId },
		});
	}
}
