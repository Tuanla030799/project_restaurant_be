import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { CreateOrderDetailDto } from './orderDetail.dto'

export class OrderProperties {
  @ApiProperty()
  @IsNotEmpty()
  time: Date

  @ApiProperty()
  @IsOptional()
  @IsString()
  note: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  totalPrice: number

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullName: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone: string

  @IsArray()
  @ValidateNested()
  @Type(() => CreateOrderDetailDto)
  @ApiProperty()
  orderDetails: CreateOrderDetailDto[]
}

export class CreateOrderDto extends OmitType(OrderProperties, [] as const) {}

export class UpdateOrderDto extends PartialType(OrderProperties) {
  @ApiProperty()
  @IsNumber()
  status: number
}
