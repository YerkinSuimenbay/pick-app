import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'

import { GoogleGuard, FacebookGuard } from '../guards'
import { JwtAuthGuard, JwtRefreshAuthGuard, RolesGuard } from '../guards'

export function AuthUser() {
  return applyDecorators(UseGuards(JwtAuthGuard, RolesGuard))
}

export function RefreshAuthUser() {
  return applyDecorators(UseGuards(JwtRefreshAuthGuard, RolesGuard))
}

export function GoogleAuthUser() {
  return applyDecorators(UseGuards(GoogleGuard))
}

export function FacebookAuthUser() {
  return applyDecorators(UseGuards(FacebookGuard))
}

export const IS_PUBLIC_KEY = 'isPublic'

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)
