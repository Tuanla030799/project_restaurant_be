import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class OrderDetailProperties {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  foodId: number

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price: number

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  quantity: number
}

export class CreateOrderDetailDto extends OmitType(
  OrderDetailProperties,
  [] as const,
) {}

export class UpdateOrderDetailDto extends PartialType(OrderDetailProperties) {}
