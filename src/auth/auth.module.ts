import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthResolver } from '@/auth/resolvers/auth.resolver';
import { AuthService } from '@/auth/services/auth.service';
import { JwtStrategy } from '@/auth/strategies/jwt.strategy';
import { PrismaModule } from '@/providers/prisma/prisma.module';
import { UsersModule } from '@/users/users.module';

@Module({
	imports: [
		PassportModule,
		JwtModule.register({
			secret: process.env.JWT_SECRET || 'bakaqc',
			signOptions: { expiresIn: '7d' },
		}),
		PrismaModule,
		UsersModule,
	],
	providers: [AuthService, AuthResolver, JwtStrategy],
	exports: [AuthService, JwtModule],
})
export class AuthModule {}
