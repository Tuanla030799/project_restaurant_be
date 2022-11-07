import { ApiProperty, PickType } from '@nestjs/swagger'
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsEmail,
} from 'class-validator'

export class ForgotPasswordProperties {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string

  @ApiProperty()
  @IsString()
  @MaxLength(60)
  @MinLength(6)
  @IsNotEmpty()
  password: string
}

export class SendResetLinkDto extends PickType(ForgotPasswordProperties, [
  'email',
] as const) {}

export class ResetPasswordDto extends PickType(ForgotPasswordProperties, [
  'password',
  'token',
] as const) {}
