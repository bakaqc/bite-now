import { Module } from '@nestjs/common';

import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';

import { UploadController } from './upload.controller';
import { UploadResolver } from './upload.resolver';
import { UploadScalar } from './upload.scalar';
import { UploadService } from './upload.service';

@Module({
	imports: [AuthModule, UsersModule],
	controllers: [UploadController],
	providers: [UploadService, UploadResolver, UploadScalar],
	exports: [UploadService],
})
export class UploadModule {}
