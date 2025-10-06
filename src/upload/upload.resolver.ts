import { JwtAuthGuard, Roles } from '../auth';
import { Role } from '../users/enums/role.enum';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { UploadService, UploadedFile } from './upload.service';

@Resolver()
export class UploadResolver {
	constructor(private uploadService: UploadService) {}

	@Mutation(() => String)
	@UseGuards(JwtAuthGuard)
	@Roles(Role.RESTAURANT_OWNER, Role.ADMIN)
	async uploadRestaurantImage(
		@Args({ name: 'file', type: () => String })
		file: Promise<UploadedFile>,
	): Promise<string> {
		return this.uploadService.uploadRestaurantImage(file);
	}

	@Mutation(() => String)
	@UseGuards(JwtAuthGuard)
	@Roles(Role.RESTAURANT_OWNER, Role.ADMIN)
	async uploadMenuItemImage(
		@Args({ name: 'file', type: () => String })
		file: Promise<UploadedFile>,
	): Promise<string> {
		return this.uploadService.uploadMenuItemImage(file);
	}
}
