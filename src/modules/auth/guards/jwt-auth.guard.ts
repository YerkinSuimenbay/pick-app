import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { GqlExecutionContext } from '@nestjs/graphql'

import { IS_PUBLIC_KEY } from '../decorators'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    const request = ctx.getContext().req

    return request
  }

  handleRequest(err: any, data: any, info: any, context: any) {
    if (err || !data) {
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
      )
      if (isPublic) {
        return undefined
      }
      throw err || new UnauthorizedException()
    }

    const ctx = GqlExecutionContext.create(context)
    ctx.getContext().req.payload = data.payload
    return data.user
  }
}

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwtRefresh') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req
  }
}
