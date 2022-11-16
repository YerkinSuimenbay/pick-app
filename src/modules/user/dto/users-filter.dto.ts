import { UserStatus } from '../enums'

export class UsersFilterDto {
  search: string
  status: UserStatus
}
