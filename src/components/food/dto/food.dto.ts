import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator'
import { FoodInventory, FoodStatus, FoodType } from '../entities/food.entity'

export class FoodProperties {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty()
  // @IsEnum(FoodType)
  type: FoodType

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  summary: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string

  @ApiProperty()
  @IsNumberString()
  @IsOptional()
  discount: number

  @ApiProperty()
  @IsNumberString()
  @IsOptional()
  rating: number

  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  price: number

  @ApiProperty()
  @IsNumberString()
  @IsOptional()
  liked: number

  @ApiProperty()
  @IsNumberString()
  @IsOptional()
  soldQuantity: number

  @ApiProperty()
  @IsEnum(FoodInventory)
  @IsOptional()
  inventory: FoodInventory

  @ApiProperty()
  @IsEnum(FoodStatus)
  @IsOptional()
  status: FoodStatus

  @ApiProperty()
  @IsNumberString()
  categoryId: number
}

export class CreateFoodDto extends OmitType(FoodProperties, [] as const) {}

export class UpdateFoodDto extends PartialType(FoodProperties) {}
