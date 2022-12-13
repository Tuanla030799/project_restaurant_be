import { ApiProperty, IntersectionType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsEnum, IsNumber, IsOptional } from 'class-validator'
import { QueryProperties } from 'src/shared/dto/queryParams.dto'
import { FoodType, FoodStatus, FoodInventory } from '../entities/food.entity'

export class QueryFoodProperties {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  categoryId: number

  @ApiProperty()
  @IsOptional()
  @IsEnum(FoodType)
  type: FoodType

  @ApiProperty()
  @IsOptional()
  @IsEnum(FoodStatus)
  status: FoodStatus

  @ApiProperty()
  @IsOptional()
  @IsEnum(FoodInventory)
  inventory: FoodInventory
}

export class QueryManyFoodDto extends IntersectionType(
  QueryProperties,
  QueryFoodProperties,
) {}
