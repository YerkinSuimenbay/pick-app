import { Args, Mutation, Resolver } from '@nestjs/graphql'

import { AuthUser, CurrentUser } from '../../auth/decorators'
import { User } from '../../user/entities'
import { SendInputDto } from '../dto/send-input.dto'
import { SendService } from '../services/send.service'

@Resolver()
export class SendResolver {
  constructor(private readonly sendService: SendService) {}

  @Mutation()
  @AuthUser()
  createSend(@Args('input') input: SendInputDto, @CurrentUser() user: User) {
    return this.sendService.create(input, user)
  }

  @Mutation()
  @AuthUser()
  cancelSend(@Args('id') id: number, @CurrentUser() user: User) {
    return this.sendService.cancel(id, user)
  }
}
