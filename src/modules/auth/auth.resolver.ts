import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { AuthService } from './services/auth.service'
import { RegisterInputDto } from './dto/register-input.dto'

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation()
  register(@Args('input') input: RegisterInputDto) {
    console.log('gege')
    return this.authService.register(input)
  }

  @Mutation()
  login(@Args('email') email: string, @Args('password') password: string) {
    return this.authService.login(email, password)
  }
}
