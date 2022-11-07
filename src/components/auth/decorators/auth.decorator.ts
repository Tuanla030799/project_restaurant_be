import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../guards/jwtAuth.guard'
import { RoleGuard } from '../guards/role.guard'

export function Auth(...roles: string[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(JwtAuthGuard, RoleGuard),
  )
}
