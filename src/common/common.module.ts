import { Global, Module } from '@nestjs/common'

import { DateScalar } from './scalars'
import { TestResolver } from './test.resolver'

@Global()
@Module({
  providers: [DateScalar, TestResolver],
})
export class CommonModule {}
