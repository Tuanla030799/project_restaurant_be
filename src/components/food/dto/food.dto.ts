import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
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
  @IsEnum(FoodType)
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
  @IsNumber()
  @IsOptional()
  discount: number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  rating: number

  @ApiProperty()
  @IsString()
  @IsOptional()
  image: string

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  liked: number

  @ApiProperty()
  @IsNumber()
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
}

export class CreateFoodDto extends OmitType(FoodProperties, [] as const) {}

export class UpdateFoodDto extends PartialType(FoodProperties) {}
