import { Module } from '@nestjs/common';

import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';

import { CloudinaryService } from './cloudinary.service';
import { UploadController } from './upload.controller';
// import { UploadResolver } from './upload.resolver'; // Temporarily disabled
import { UploadScalar } from './upload.scalar';
import { UploadService } from './upload.service';

@Module({
	imports: [AuthModule, UsersModule],
	controllers: [UploadController],
	providers: [UploadService, UploadScalar, CloudinaryService], // Removed UploadResolver temporarily
	exports: [UploadService],
})
export class UploadModule {}
