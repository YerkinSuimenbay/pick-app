import { Injectable, Logger } from '@nestjs/common'
import { GqlOptionsFactory } from '@nestjs/graphql'
import { ConfigService } from '@nestjs/config'
import { ApolloDriverConfig } from '@nestjs/apollo'
import { GraphQLUpload } from 'graphql-upload'

import { corsSettings } from './cors'

import { adminDirectiveTransformer } from '../common/directives'

@Injectable()
export class GraphQLConfigService implements GqlOptionsFactory {
  logger = new Logger(GraphQLConfigService.name)

  constructor(private readonly configService: ConfigService) {}

  createGqlOptions(): ApolloDriverConfig {
    return {
      typePaths: ['src/**/*.graphql'],
      resolvers: {
        Upload: GraphQLUpload,
      },
      transformSchema: (schema) => adminDirectiveTransformer(schema, 'admin'),
      introspection: true,
      cors: corsSettings,
      debug: this.configService.get<string>('NODE_ENV') === 'development',
      playground: this.configService.get<string>('NODE_ENV') !== 'production',
    }
  }
}
