import { UseGuards } from '@nestjs/common';
import { Args, Field, Mutation, ObjectType, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard, Roles } from '@/auth';
import { Role } from '@/users/enums/role.enum';

import { FileUpload, UploadService } from './upload.service';

@ObjectType()
export class UploadResponse {
	@Field()
	filename: string;

	@Field()
	url: string;
}

@Resolver()
export class UploadResolver {
	constructor(private uploadService: UploadService) {}

	@Mutation(() => UploadResponse)
	@UseGuards(JwtAuthGuard)
	@Roles(Role.RESTAURANT_OWNER, Role.ADMIN)
	async uploadRestaurantImage(
		@Args({ name: 'file', type: () => String })
		file: Promise<FileUpload>,
	): Promise<UploadResponse> {
		const url = await this.uploadService.uploadRestaurantImage(file);
		return {
			filename: url.split('/').pop() || '',
			url,
		};
	}

	@Mutation(() => UploadResponse)
	@UseGuards(JwtAuthGuard)
	@Roles(Role.RESTAURANT_OWNER, Role.ADMIN)
	async uploadMenuItemImage(
		@Args({ name: 'file', type: () => String })
		file: Promise<FileUpload>,
	): Promise<UploadResponse> {
		const url = await this.uploadService.uploadMenuItemImage(file);
		return {
			filename: url.split('/').pop() || '',
			url,
		};
	}
}
