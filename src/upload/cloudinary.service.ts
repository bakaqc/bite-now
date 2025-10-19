import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

export interface CloudinaryResponse {
	public_id: string;
	version: number;
	signature: string;
	width: number;
	height: number;
	format: string;
	resource_type: string;
	created_at: string;
	tags: string[];
	bytes: number;
	type: string;
	etag: string;
	placeholder: boolean;
	url: string;
	secure_url: string;
	access_mode: string;
	original_filename: string;
}

@Injectable()
export class CloudinaryService {
	constructor() {
		// Configure Cloudinary
		cloudinary.config({
			cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
			api_key: process.env.CLOUDINARY_API_KEY,
			api_secret: process.env.CLOUDINARY_API_SECRET,
		});
	}

	async uploadImage(
		file: Express.Multer.File,
		folder: string,
	): Promise<CloudinaryResponse> {
		return new Promise((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				{
					folder: `bite-now/${folder}`,
					resource_type: 'image',
					format: 'jpg', // Convert all images to JPG for consistency
					quality: 'auto', // Auto optimize quality
					fetch_format: 'auto', // Auto format selection
					transformation: [
						{ width: 1200, height: 1200, crop: 'limit' }, // Limit max size
						{ quality: 'auto:good' }, // Good quality with auto compression
					],
				},
				(error, result) => {
					if (error) {
						// Always reject with an Error instance
						const errorMessage =
							typeof error === 'string' ? error : JSON.stringify(error);
						reject(new Error(errorMessage));
					} else {
						resolve(result as CloudinaryResponse);
					}
				},
			);

			// Convert buffer to stream and pipe to Cloudinary
			const bufferStream = new Readable();
			bufferStream.push(file.buffer);
			bufferStream.push(null);
			bufferStream.pipe(uploadStream);
		});
	}

	async uploadMultipleImages(
		files: Express.Multer.File[],
		folder: string,
	): Promise<CloudinaryResponse[]> {
		const uploadPromises = files.map((file) => this.uploadImage(file, folder));
		return Promise.all(uploadPromises);
	}

	async deleteImage(publicId: string): Promise<any> {
		return cloudinary.uploader.destroy(publicId);
	}

	// Helper method to extract public_id from Cloudinary URL
	extractPublicId(url: string): string {
		const parts = url.split('/');
		const fileWithExtension = parts[parts.length - 1];
		const publicId = fileWithExtension.split('.')[0];
		return `bite-now/${parts[parts.length - 2]}/${publicId}`;
	}
}
