import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

import { IPaginationOptions } from 'src/shared/services/pagination'
import { QueryManyDto } from 'src/shared/dto/queryParams.dto'
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto'
import { CategoryService } from '../services/category.service'
import { CategoryTransformer } from '../transformers/category.transformer'
import { ApiResponseService } from 'src/shared/services/apiResponse/apiResponse.service'
import { Auth } from 'src/components/auth/decorators/auth.decorator'
import { JwtAuthGuard } from 'src/components/auth/guards/jwtAuth.guard'
import {
  GetItemResponse,
  GetListPaginationResponse,
  GetListResponse,
  SuccessfullyOperation,
} from 'src/shared/services/apiResponse/apiResponse.interface'
import Messages from 'src/shared/message/message'
import { CommonService } from 'src/shared/services/common.service'
import { CategoryEntity } from '../entities/category.entity'
import { SelectQueryBuilder } from 'typeorm'

@ApiTags('Categories')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@Controller('/api/categories')
export class CategoryController {
  constructor(
    private categoryService: CategoryService,
    private response: ApiResponseService,
    private commonService: CommonService,
  ) {}

  private entity = 'categories'
  private fields = ['name', 'categoryType']

  @Post()
  @Auth('admin')
  @ApiOperation({ summary: 'Admin create new category' })
  @ApiOkResponse({ description: 'New category entity' })
  async createCategory(
    @Body() data: CreateCategoryDto,
  ): Promise<SuccessfullyOperation> {
    console.log('aaaaa', data)

    await this.categoryService.saveCategory(data)

    return this.response.success({
      message: this.commonService.getMessage({
        message: Messages.successfullyOperation.create,
        keywords: ['category'],
      }),
    })
  }

  @Get()
  @ApiOperation({ summary: 'Get list categories' })
  @ApiOkResponse({ description: 'List categories with param query' })
  async readCategories(
    @Query() query: QueryManyDto,
  ): Promise<GetListResponse | GetListPaginationResponse> {
    const { search, includes, sortBy, sortType } = query

    const queryBuilder: SelectQueryBuilder<CategoryEntity> =
      await this.categoryService.queryCategory({
        entity: this.entity,
        fields: this.fields,
        keyword: search,
        includes,
        sortBy,
        sortType,
      })

    if (query.perPage || query.page) {
      const paginateOption: IPaginationOptions = {
        limit: query.perPage ? query.perPage : 10,
        page: query.page ? query.page : 1,
      }

      const data = await this.categoryService.paginate(
        queryBuilder,
        paginateOption,
      )

      return this.response.paginate(data, new CategoryTransformer())
    }

    return this.response.collection(
      await queryBuilder.getMany(),
      new CategoryTransformer(),
    )
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by id' })
  @ApiOkResponse({ description: 'Category entity' })
  async readCategory(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetItemResponse> {
    const category = await this.categoryService.findOneOrFail(id)

    return this.response.item(category, new CategoryTransformer())
  }

  @Put(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin update category by id' })
  @ApiOkResponse({ description: 'Update category entity' })
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateCategoryDto,
  ): Promise<SuccessfullyOperation> {
    await this.categoryService.findOneOrFail(id)

    await this.categoryService.update(id, data)

    return this.response.success({
      message: this.commonService.getMessage({
        message: Messages.successfullyOperation.update,
        keywords: ['category'],
      }),
    })
  }

  @Delete(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin delete category by id' })
  @ApiOkResponse({ description: 'Delete category successfully' })
  async deleteCategory(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessfullyOperation> {
    await this.categoryService.findOneOrFail(id)

    await this.categoryService.destroy(id)

    return this.response.success({
      message: this.commonService.getMessage({
        message: Messages.successfullyOperation.delete,
        keywords: ['category'],
      }),
    })
  }
}
