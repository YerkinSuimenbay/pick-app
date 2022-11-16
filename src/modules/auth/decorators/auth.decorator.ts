import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'

import { JwtAuthGuard, JwtRefreshAuthGuard, RolesGuard } from '../guards'

export function AuthUser() {
  return applyDecorators(UseGuards(JwtAuthGuard, RolesGuard))
}

export function RefreshAuthUser() {
  return applyDecorators(UseGuards(JwtRefreshAuthGuard, RolesGuard))
}

export const IS_PUBLIC_KEY = 'isPublic'

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)
