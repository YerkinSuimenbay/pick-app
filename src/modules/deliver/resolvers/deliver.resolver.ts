import { Mutation, Resolver } from '@nestjs/graphql'

import { AuthUser, CurrentUser } from '../../auth/decorators'
import { User } from '../../user/entities'
import { DeliverInputDto } from '../dto/deliver-input.dto'
import { DeliverService } from '../services/deliver.service'

@Resolver()
export class DeliverResolver {
  constructor(private readonly deliverService: DeliverService) {}

  @Mutation()
  @AuthUser()
  createDeliver(input: DeliverInputDto, @CurrentUser() user: User) {
    return this.deliverService.create(input, user)
  }
}
