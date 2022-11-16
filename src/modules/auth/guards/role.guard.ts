import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'

import { UserRole, ROLES_KEY } from '../decorators/role.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const gqlContext = GqlExecutionContext.create(context).getContext()

    const requiredRoles = this.reflector.get<UserRole[]>(
      ROLES_KEY,
      context.getHandler(),
    )
    const { user } = gqlContext.req

    if (!requiredRoles || user.isAdmin) {
      return true
    }

    return (requiredRoles ?? []).some((role) =>
      (user.roles ?? []).some((r: any) => r.name === role),
    )
  }
}
