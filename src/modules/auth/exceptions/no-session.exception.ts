import { ApolloError } from 'apollo-server-errors'

export class NoSessionException extends ApolloError {
  constructor() {
    super('Недействительная сессия', 'NO_SESSION')

    Object.defineProperty(this, 'name', { value: 'NoSessionException' })
  }
}
