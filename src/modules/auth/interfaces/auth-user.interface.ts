import { User } from '../../user/entities/user.entity'

export interface ILoginUserResponse {
  user: User
  token: string
  refreshToken: string
}
