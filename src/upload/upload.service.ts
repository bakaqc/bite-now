import { Injectable } from '@nestjs/common';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface FileUpload {
	filename: string;
	mimetype: string;
	encoding: string;
	createReadStream: () => NodeJS.ReadableStream;
}

@Injectable()
export class UploadService {
	private readonly uploadPath = join(process.cwd(), 'uploads');

	constructor() {
		// Tạo thư mục uploads nếu chưa tồn tại
		if (!existsSync(this.uploadPath)) {
			mkdirSync(this.uploadPath, { recursive: true });
		}
	}

	async uploadFile(
		upload: Promise<FileUpload>,
		subfolder = '',
	): Promise<string> {
		const { createReadStream, filename, mimetype } = await upload;

		// Validate file type (chỉ cho phép ảnh)
		if (!mimetype.startsWith('image/')) {
			throw new Error('Only image files are allowed');
		}

		// Tạo tên file unique
		const timestamp = Date.now();
		const uniqueFilename = `${timestamp}-${filename}`;

		// Tạo đường dẫn đầy đủ
		const targetPath = subfolder
			? join(this.uploadPath, subfolder)
			: this.uploadPath;

		// Tạo thư mục con nếu cần
		if (!existsSync(targetPath)) {
			mkdirSync(targetPath, { recursive: true });
		}

		const fullPath = join(targetPath, uniqueFilename);

		// Lưu file
		return new Promise((resolve, reject) => {
			const stream = createReadStream();
			const writeStream = createWriteStream(fullPath);

			stream.pipe(writeStream);

			writeStream.on('finish', () => {
				// Trả về URL tương đối để lưu vào database
				const relativeUrl = subfolder
					? `/uploads/${subfolder}/${uniqueFilename}`
					: `/uploads/${uniqueFilename}`;
				resolve(relativeUrl);
			});

			writeStream.on('error', reject);
		});
	}

	async uploadRestaurantImage(upload: Promise<FileUpload>): Promise<string> {
		return this.uploadFile(upload, 'restaurants');
	}

	async uploadMenuItemImage(upload: Promise<FileUpload>): Promise<string> {
		return this.uploadFile(upload, 'menu-items');
	}
}
