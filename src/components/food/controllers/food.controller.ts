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
  Req,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

import { IPaginationOptions } from 'src/shared/services/pagination'
import { CreateFoodDto, UpdateFoodDto } from '../dto/food.dto'
import { FoodService } from '../services/food.service'
import { FoodTransformer } from '../transformers/food.transformer'
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
import { FoodEntity } from '../entities/food.entity'
import { SelectQueryBuilder } from 'typeorm'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { assign, isNil } from 'lodash'
import { QueryManyFoodDto } from '../dto/queryFood.dto'
import { FileInterceptor } from '@nestjs/platform-express'

@ApiTags('Foods')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/foods')
export class FoodController {
  constructor(
    private foodService: FoodService,
    private response: ApiResponseService,
    private commonService: CommonService,
  ) {}

  private entity = 'foods'
  private fields = ['name', 'foodType']
  private relations = ['categories']

  @ApiConsumes('multipart/form-data')
  @Post()
  @Auth('admin')
  @ApiOperation({ summary: 'Admin create new food' })
  @ApiOkResponse({ description: 'New food entity' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9)
          const ext = extname(file.originalname)
          const filename = `${uniqueSuffix}${ext}`
          callback(null, filename)
        },
      }),
    }),
  )
  async createFood(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Body() data: CreateFoodDto,
  ): Promise<SuccessfullyOperation> {
    console.log('aaaaaaI')

    await this.foodService.saveFood({ file, data })

    return this.response.success({
      message: this.commonService.getMessage({
        message: Messages.successfullyOperation.create,
        keywords: [this.entity],
      }),
    })
  }

  @Post('a')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin create new food' })
  @ApiOkResponse({ description: 'New food entity' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination:
          process.env.APP_ENV === 'local'
            ? 'public/uploads'
            : 'dist/public/uploads',
        filename: (req, file: Express.Multer.File, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('')
          cb(null, `${randomName}${extname(file.originalname)}`)
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<SuccessfullyOperation> {
    console.log('aaaaaaI')

    console.log(file)
    const new_file = assign({}, file, {
      key: file.filename,
      location: process.env.APP_URL + '/uploads/' + file.filename,
    })

    console.log(new_file)

    return this.response.success({
      message: this.commonService.getMessage({
        message: Messages.successfullyOperation.create,
        keywords: [this.entity],
      }),
    })
  }

  @Get()
  @ApiOperation({ summary: 'Get list foods' })
  @ApiOkResponse({ description: 'List foods with param query' })
  async readFoods(
    @Query() query: QueryManyFoodDto,
  ): Promise<GetListResponse | GetListPaginationResponse> {
    const {
      search,
      includes,
      sortBy,
      sortType,
      categoryId,
      type,
      status,
      inventory,
    } = query

    const filters = { categoryId, type, status, inventory }

    let queryBuilder: SelectQueryBuilder<FoodEntity> =
      await this.foodService.queryFood({
        entity: this.entity,
        fields: this.fields,
        keyword: search,
        includes,
        sortBy,
        sortType,
        filters,
      })

    let joinAndSelects = []

    if (!isNil(includes)) {
      const includesParams = Array.isArray(includes) ? includes : [includes]

      joinAndSelects = this.commonService.includesParamToJoinAndSelects({
        includesParams,
        relations: this.relations,
      })

      if (joinAndSelects.length > 0) {
        console.log('a')
        joinAndSelects.forEach((joinAndSelect) => {
          queryBuilder = queryBuilder.leftJoinAndSelect(
            `${this.entity}.${joinAndSelect}`,
            `${joinAndSelect}`,
          )
        })
      }
    }

    if (filters.categoryId && filters.categoryId !== null) {
      queryBuilder.andWhere(`${this.entity}.categoryId = :categoryId`, {
        categoryId,
      })
    }

    if (filters.type && filters.type !== null) {
      queryBuilder.andWhere(`${this.entity}.type = :type`, {
        type,
      })
    }

    if (filters.status && filters.status !== null) {
      queryBuilder.andWhere(`${this.entity}.status = :status`, {
        status,
      })
    }

    if (filters.inventory && filters.inventory !== null) {
      queryBuilder.andWhere(`${this.entity}.inventory = :inventory`, {
        inventory,
      })
    }

    if (query.perPage || query.page) {
      const paginateOption: IPaginationOptions = {
        limit: query.perPage ? query.perPage : 10,
        page: query.page ? query.page : 1,
      }

      const data = await this.foodService.paginate(queryBuilder, paginateOption)

      return this.response.paginate(data, new FoodTransformer())
    }

    const foods = await queryBuilder.getMany()

    //in FoodTransformer() joinAndSelects.length > 0 ? joinAndSelects : undefined,
    return this.response.collection(foods, new FoodTransformer())
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get food by id' })
  @ApiOkResponse({ description: 'food entity' })
  async readFood(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetItemResponse> {
    const food = await this.foodService.findOneOrFail(id)

    return this.response.item(food, new FoodTransformer())
  }

  @Put(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin update Food by id' })
  @ApiOkResponse({ description: 'Update Food entity' })
  async updateFood(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateFoodDto,
  ): Promise<SuccessfullyOperation> {
    await this.foodService.findOneOrFail(id)

    await this.foodService.update(id, data)

    return this.response.success({
      message: this.commonService.getMessage({
        message: Messages.successfullyOperation.update,
        keywords: ['Food'],
      }),
    })
  }

  @Delete(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin delete Food by id' })
  @ApiOkResponse({ description: 'Delete Food successfully' })
  async deleteFood(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessfullyOperation> {
    await this.foodService.findOneOrFail(id)

    await this.foodService.destroy(id)

    return this.response.success({
      message: this.commonService.getMessage({
        message: Messages.successfullyOperation.delete,
        keywords: ['Food'],
      }),
    })
  }
}
