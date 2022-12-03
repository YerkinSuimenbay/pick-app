import { Allow, IsNotEmpty } from 'class-validator'

export class AuthAppleLoginDto {
  @IsNotEmpty()
  idToken: string

  @Allow()
  firstName?: string

  @Allow()
  lastName?: string
}
