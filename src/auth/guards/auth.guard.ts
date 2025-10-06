import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

import { Role } from '@/users/enums/role.enum';
import { UsersService } from '@/users/services/users.service';

export const ROLES_KEY = 'roles';

interface JwtPayload {
	sub: number;
	email: string;
	role: Role;
}

interface RequestWithUser {
	headers: {
		authorization?: string;
	};
	user?: any;
}

interface GraphQLContext {
	req: RequestWithUser;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private usersService: UsersService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context);
		const { req }: GraphQLContext = ctx.getContext();

		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			throw new UnauthorizedException('No token provided');
		}

		const token = authHeader.substring(7);
		try {
			const payload = this.jwtService.verify<JwtPayload>(token);
			const user = await this.usersService.findOne(payload.sub);

			if (!user || !user.isActive) {
				throw new UnauthorizedException('Invalid user');
			}

			req.user = user;
			return true;
		} catch {
			throw new UnauthorizedException('Invalid token');
		}
	}
}

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (!requiredRoles) {
			return true;
		}

		const ctx = GqlExecutionContext.create(context);
		const { req }: GraphQLContext = ctx.getContext();
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const user = req.user;

		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		return requiredRoles.some((role) => user?.role === role);
	}
}
