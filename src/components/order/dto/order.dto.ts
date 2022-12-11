import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator'
import { isArrayLikeObject } from 'lodash'
import { CreateOrderDetailDto } from './orderDetail.dto'

export class OrderProperties {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  seatId: number

  @ApiProperty()
  @IsNotEmpty()
  time: Date

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  note: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  totalPrice: number

  @IsArray()
  @ValidateNested()
  @Type(() => CreateOrderDetailDto)
  @ApiProperty()
  orderDetails: CreateOrderDetailDto[]
}

export class CreateOrderDto extends OmitType(OrderProperties, [] as const) {}

export class UpdateOrderDto extends PartialType(OrderProperties) {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  status: number
}
