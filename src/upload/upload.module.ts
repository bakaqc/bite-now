import { Module } from '@nestjs/common';

import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';

import { UploadResolver } from './upload.resolver';
import { UploadService } from './upload.service';

@Module({
	imports: [AuthModule, UsersModule],
	providers: [UploadService, UploadResolver],
	exports: [UploadService],
})
export class UploadModule {}
