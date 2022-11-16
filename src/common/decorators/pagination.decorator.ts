import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { PaginationDto } from '../dto'

export const Pagination = createParamDecorator(
  (data: number, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context).getContext()
    let pagination: PaginationDto | undefined =
      ctx.req.body.variables?.pagination

    if (data) {
      pagination.limit = data
      pagination.offset = pagination.offset ?? 0
    } else if (pagination) {
      const maxLimit = 50
      const { limit = 20, offset = 0 } = pagination

      pagination.limit = Math.min(limit, maxLimit)
      pagination.offset = offset
    } else {
      pagination = {
        limit: 100,
        offset: 0,
      }
    }

    return pagination
  },
)
