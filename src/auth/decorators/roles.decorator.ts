import { SetMetadata } from '@nestjs/common';

import { ROLES_KEY } from '@/auth/guards/auth.guard';
import { Role } from '@/users/enums/role.enum';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
