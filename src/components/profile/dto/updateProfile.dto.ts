import { ApiProperty } from '@nestjs/swagger'
import {
  IsString,
  IsOptional,
  MaxLength,
  IsNotEmpty,
  IsPhoneNumber,
} from 'class-validator'

export class UpdateProfileDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @MaxLength(30)
  username: string

  @ApiProperty()
  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  address: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  firstName: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MaxLength(30)
  lastName: string
}

export class UpdatePasswordDto {
  @ApiProperty()
  @MaxLength(30)
  @IsString()
  @IsNotEmpty()
  password: string

  @ApiProperty()
  @MaxLength(30)
  @IsString()
  @IsNotEmpty()
  oldPassword: string
}
