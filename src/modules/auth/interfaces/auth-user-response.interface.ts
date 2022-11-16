import { User } from '../../user/entities/user.entity'

export interface IAuthUserResponse {
  token: string
  refreshToken: string
  user: User
  // roles: string[]
}
