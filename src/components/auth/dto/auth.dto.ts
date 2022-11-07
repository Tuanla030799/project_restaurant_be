import { ApiProperty, OmitType, PickType } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import { BaseUserProperties } from 'src/components/user/dto/user.dto'

export class UserLoginDto extends PickType(BaseUserProperties, [
  'email',
  'password',
] as const) {}

export class UserRegisterDto extends OmitType(
  BaseUserProperties,
  [] as const,
) {}

export class LoginGoogleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  idToken: string
}
