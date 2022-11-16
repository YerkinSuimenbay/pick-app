import { Query, Resolver } from '@nestjs/graphql'

@Resolver()
export class TestResolver {
  @Query()
  test() {
    return 'Hello World!'
  }
}
