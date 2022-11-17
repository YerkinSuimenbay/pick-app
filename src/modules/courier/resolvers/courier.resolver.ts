import { Mutation, Resolver } from '@nestjs/graphql'

import { AuthUser, CurrentUser } from '../../auth/decorators'
import { User } from '../../user/entities'
import { CourierInputDto } from '../dto/courier-input.dto'
import { CourierService } from '../services'

@Resolver()
export class CourierResolver {
  constructor(private readonly courierService: CourierService) {}

  @Mutation()
  @AuthUser()
  createCourier(input: CourierInputDto, @CurrentUser() user: User) {
    return this.courierService.create(input, user)
  }
}
