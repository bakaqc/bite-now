import {
	Controller,
	Post,
	UploadedFile,
	UploadedFiles,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard, Roles } from '@/auth';
import { Role } from '@/users/enums/role.enum';

import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
	constructor(private uploadService: UploadService) {}

	@Post('restaurant')
	@UseGuards(JwtAuthGuard)
	@Roles(Role.RESTAURANT_OWNER, Role.ADMIN)
	@UseInterceptors(FileInterceptor('file'))
	async uploadRestaurantImage(@UploadedFile() file: Express.Multer.File) {
		const result = await this.uploadService.uploadRestaurantImage(file);
		return result;
	}

	@Post('menu-item')
	@UseGuards(JwtAuthGuard)
	@Roles(Role.RESTAURANT_OWNER, Role.ADMIN)
	@UseInterceptors(FileInterceptor('file'))
	async uploadMenuItemImage(@UploadedFile() file: Express.Multer.File) {
		const result = await this.uploadService.uploadMenuItemImage(file);
		return result;
	}

	@Post('restaurant/multiple')
	@UseGuards(JwtAuthGuard)
	@Roles(Role.RESTAURANT_OWNER, Role.ADMIN)
	@UseInterceptors(FilesInterceptor('files', 10))
	async uploadMultipleRestaurantImages(
		@UploadedFiles() files: Express.Multer.File[],
	) {
		const results =
			await this.uploadService.uploadMultipleRestaurantImages(files);
		return {
			count: results.length,
			files: results,
		};
	}

	@Post('menu-item/multiple')
	@UseGuards(JwtAuthGuard)
	@Roles(Role.RESTAURANT_OWNER, Role.ADMIN)
	@UseInterceptors(FilesInterceptor('files', 10))
	async uploadMultipleMenuItemImages(
		@UploadedFiles() files: Express.Multer.File[],
	) {
		const results =
			await this.uploadService.uploadMultipleMenuItemImages(files);
		return {
			count: results.length,
			files: results,
		};
	}
}
