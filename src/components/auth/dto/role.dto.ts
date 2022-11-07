import { ApiProperty, PartialType, PickType } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, IsString } from 'class-validator'

export class RoleProperties {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ type: Number, default: 1 })
  @IsInt()
  @IsNotEmpty()
  level: number
}

export class CreateRoleDto extends PickType(RoleProperties, [
  'name',
  'level',
] as const) {}

export class UpdateRoleDto extends PartialType(RoleProperties) {}
