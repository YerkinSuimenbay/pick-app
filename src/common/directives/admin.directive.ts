import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'
import { defaultFieldResolver, GraphQLSchema } from 'graphql'

import { User } from '../../modules/user/entities'

export function adminDirectiveTransformer(
  schema: GraphQLSchema,
  directiveName: string,
) {
  const typeDirectiveArgumentMaps: Record<string, any> = {}
  return mapSchema(schema, {
    [MapperKind.TYPE]: (type) => {
      const adminDirective = getDirective(schema, type, directiveName)?.[0]
      if (adminDirective) {
        typeDirectiveArgumentMaps[type.name] = adminDirective
      }
      return undefined
    },
    [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
      const adminDirective =
        getDirective(schema, fieldConfig, directiveName)?.[0] ??
        typeDirectiveArgumentMaps[typeName]

      if (adminDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig
        fieldConfig.resolve = async function (source, args, context, info) {
          const user = context.req.user as User | null

          if (user?.isAdmin) {
            return resolve(source, args, context, info)
          }

          return null
        }

        return fieldConfig
      }
    },
  })
}
