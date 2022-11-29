import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CategoryProperties {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  thumbnail: string
}

export class CreateCategoryDto extends OmitType(
  CategoryProperties,
  [] as const,
) {}

export class UpdateCategoryDto extends PartialType(CategoryProperties) {}
