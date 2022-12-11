import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty } from 'class-validator'

export class SeatProperties {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isReady: boolean
}

export class CreateSeatDto extends OmitType(SeatProperties, [] as const) {}

export class UpdateSeatDto extends PartialType(SeatProperties) {}
