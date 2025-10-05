import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/providers/prisma/prisma.service';
import {
	CreateRestaurantInput,
	UpdateRestaurantInput,
} from '@/restaurants/dtos';

@Injectable()
export class RestaurantsService {
	constructor(private readonly prisma: PrismaService) {}

	async create(createRestaurantInput: CreateRestaurantInput) {
		return await this.prisma.restaurant.create({
			data: createRestaurantInput,
		});
	}

	async findAll() {
		return await this.prisma.restaurant.findMany({
			include: {
				owner: true,
			},
		});
	}

	async findOne(id: number) {
		return await this.prisma.restaurant.findUnique({
			where: { id },
			include: {
				owner: true,
			},
		});
	}

	async update(id: number, updateRestaurantInput: UpdateRestaurantInput) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { id: _, ...updateData } = updateRestaurantInput;
		return await this.prisma.restaurant.update({
			where: { id },
			data: updateData,
		});
	}

	async remove(id: number) {
		return await this.prisma.restaurant.delete({
			where: { id },
		});
	}
}
