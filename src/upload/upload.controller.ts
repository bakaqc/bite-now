import {
	Controller,
	Post,
	UploadedFile,
	UploadedFiles,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

import { JwtAuthGuard, Roles } from '@/auth';
import { Role } from '@/users/enums/role.enum';

@Controller('upload')
export class UploadController {
	@Post('restaurant')
	@UseGuards(JwtAuthGuard)
	@Roles(Role.RESTAURANT_OWNER, Role.ADMIN)
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: join(process.cwd(), 'uploads', 'restaurants'),
				filename: (req, file, callback) => {
					const uniqueSuffix =
						Date.now() + '-' + Math.round(Math.random() * 1e9);
					const ext = extname(file.originalname);
					callback(null, `restaurant-${uniqueSuffix}${ext}`);
				},
			}),
			fileFilter: (req, file, callback) => {
				if (!file.mimetype.startsWith('image/')) {
					return callback(new Error('Only image files are allowed'), false);
				}
				callback(null, true);
			},
		}),
	)
	uploadRestaurantImage(@UploadedFile() file: Express.Multer.File) {
		return {
			filename: file.filename,
			url: `/uploads/restaurants/${file.filename}`,
			size: file.size,
			mimetype: file.mimetype,
		};
	}

	@Post('menu-item')
	@UseGuards(JwtAuthGuard)
	@Roles(Role.RESTAURANT_OWNER, Role.ADMIN)
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: join(process.cwd(), 'uploads', 'menu-items'),
				filename: (req, file, callback) => {
					const uniqueSuffix =
						Date.now() + '-' + Math.round(Math.random() * 1e9);
					const ext = extname(file.originalname);
					callback(null, `menuitem-${uniqueSuffix}${ext}`);
				},
			}),
			fileFilter: (req, file, callback) => {
				if (!file.mimetype.startsWith('image/')) {
					return callback(new Error('Only image files are allowed'), false);
				}
				callback(null, true);
			},
		}),
	)
	uploadMenuItemImage(@UploadedFile() file: Express.Multer.File) {
		return {
			filename: file.filename,
			url: `/uploads/menu-items/${file.filename}`,
			size: file.size,
			mimetype: file.mimetype,
		};
	}

	@Post('restaurant/multiple')
	@UseGuards(JwtAuthGuard)
	@Roles(Role.RESTAURANT_OWNER, Role.ADMIN)
	@UseInterceptors(
		FilesInterceptor('files', 10, {
			storage: diskStorage({
				destination: join(process.cwd(), 'uploads', 'restaurants'),
				filename: (req, file, callback) => {
					const uniqueSuffix =
						Date.now() + '-' + Math.round(Math.random() * 1e9);
					const ext = extname(file.originalname);
					callback(null, `restaurant-${uniqueSuffix}${ext}`);
				},
			}),
			fileFilter: (req, file, callback) => {
				if (!file.mimetype.startsWith('image/')) {
					return callback(new Error('Only image files are allowed'), false);
				}
				callback(null, true);
			},
		}),
	)
	uploadMultipleRestaurantImages(
		@UploadedFiles() files: Express.Multer.File[],
	) {
		return {
			count: files.length,
			files: files.map((file) => ({
				filename: file.filename,
				url: `/uploads/restaurants/${file.filename}`,
				size: file.size,
				mimetype: file.mimetype,
			})),
		};
	}

	@Post('menu-item/multiple')
	@UseGuards(JwtAuthGuard)
	@Roles(Role.RESTAURANT_OWNER, Role.ADMIN)
	@UseInterceptors(
		FilesInterceptor('files', 10, {
			storage: diskStorage({
				destination: join(process.cwd(), 'uploads', 'menu-items'),
				filename: (req, file, callback) => {
					const uniqueSuffix =
						Date.now() + '-' + Math.round(Math.random() * 1e9);
					const ext = extname(file.originalname);
					callback(null, `menuitem-${uniqueSuffix}${ext}`);
				},
			}),
			fileFilter: (req, file, callback) => {
				if (!file.mimetype.startsWith('image/')) {
					return callback(new Error('Only image files are allowed'), false);
				}
				callback(null, true);
			},
		}),
	)
	uploadMultipleMenuItemImages(@UploadedFiles() files: Express.Multer.File[]) {
		return {
			count: files.length,
			files: files.map((file) => ({
				filename: file.filename,
				url: `/uploads/menu-items/${file.filename}`,
				size: file.size,
				mimetype: file.mimetype,
			})),
		};
	}
}
