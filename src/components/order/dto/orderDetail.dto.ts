import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator'

export class OrderDetailProperties {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  id: number

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

export class UpdateOrderDetailsDto extends PartialType(OrderDetailProperties) {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderDetailDto)
  orderDetails: UpdateOrderDetailDto[]
}
