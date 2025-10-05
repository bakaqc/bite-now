import { Module } from '@nestjs/common';

import { PrismaModule } from '@/providers/prisma/prisma.module';
import { UsersResolver } from '@/users/resolvers';
import { UsersService } from '@/users/services/users.service';

@Module({
	imports: [PrismaModule],
	providers: [UsersResolver, UsersService],
	exports: [UsersService],
})
export class UsersModule {}
