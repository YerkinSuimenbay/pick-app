import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { GqlExecutionContext } from '@nestjs/graphql'

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwtRefresh') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req
  }

  handleRequest(err: any, data: any, info: any, context: any) {
    if (err || !data) {
      console.log(err, data)
      throw err || new UnauthorizedException()
    }

    const ctx = GqlExecutionContext.create(context)
    ctx.getContext().req.payload = data.payload
    return data.user
  }
}
