import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { graphqlUploadExpress } from 'graphql-upload'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  // CORS
  app.enableCors({
    origin: true,
    credentials: true,
  })

  const configService = app.get(ConfigService)

  app.useStaticAssets(configService.get<string>('STORAGE_ROOT'), {
    prefix: '/storage',
  })

  app.use(
    graphqlUploadExpress({
      maxFileSize: 1024 * 1024 * 8, // 8 MB
      maxFiles: 10,
    }),
  )

  await app.listen(configService.get<number>('PORT') || 3000)
}
bootstrap()
