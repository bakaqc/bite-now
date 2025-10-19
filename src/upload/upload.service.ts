import { Injectable } from '@nestjs/common';

import { CloudinaryService } from './cloudinary.service';

export interface FileUpload {
	filename: string;
	mimetype: string;
	encoding: string;
	createReadStream: () => NodeJS.ReadableStream;
}

export interface UploadResult {
	filename: string;
	url: string;
	size: number;
	mimetype: string;
	publicId: string;
}

@Injectable()
export class UploadService {
	constructor(private cloudinaryService: CloudinaryService) {}

	async uploadFile(
		file: Express.Multer.File,
		folder: string,
	): Promise<UploadResult> {
		// Validate file type (chỉ cho phép ảnh)
		if (!file.mimetype.startsWith('image/')) {
			throw new Error('Only image files are allowed');
		}

		// Upload to Cloudinary
		const result = await this.cloudinaryService.uploadImage(file, folder);

		return {
			filename: result.original_filename,
			url: result.secure_url,
			size: result.bytes,
			mimetype: file.mimetype,
			publicId: result.public_id,
		};
	}

	async uploadMultipleFiles(
		files: Express.Multer.File[],
		folder: string,
	): Promise<UploadResult[]> {
		// Validate all files are images
		for (const file of files) {
			if (!file.mimetype.startsWith('image/')) {
				throw new Error(`File ${file.originalname} is not an image`);
			}
		}

		// Upload all files to Cloudinary
		const results = await this.cloudinaryService.uploadMultipleImages(
			files,
			folder,
		);

		return results.map((result, index) => ({
			filename: result.original_filename,
			url: result.secure_url,
			size: result.bytes,
			mimetype: files[index].mimetype,
			publicId: result.public_id,
		}));
	}

	async uploadRestaurantImage(
		file: Express.Multer.File,
	): Promise<UploadResult> {
		return this.uploadFile(file, 'restaurants');
	}

	async uploadMenuItemImage(file: Express.Multer.File): Promise<UploadResult> {
		return this.uploadFile(file, 'menu-items');
	}

	async uploadMultipleRestaurantImages(
		files: Express.Multer.File[],
	): Promise<UploadResult[]> {
		return this.uploadMultipleFiles(files, 'restaurants');
	}

	async uploadMultipleMenuItemImages(
		files: Express.Multer.File[],
	): Promise<UploadResult[]> {
		return this.uploadMultipleFiles(files, 'menu-items');
	}

	async deleteImage(publicId: string): Promise<any> {
		return this.cloudinaryService.deleteImage(publicId);
	}
}
