import { Transform } from 'class-transformer'
import { IsDateString, IsOptional } from 'class-validator'

export class GetOrdersOfUserRequestDto {
  readonly page: number
  readonly limit: number

  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  @IsOptional()
  readonly status?: number

  @IsOptional()
  readonly orderStartTime?: Date | string

  @IsOptional()
  readonly orderEndTime?: Date | string
}
