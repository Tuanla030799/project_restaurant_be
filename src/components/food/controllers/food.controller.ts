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
import { QueryManyDto } from 'src/shared/dto/queryParams.dto'
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
import { FileFastifyInterceptor } from 'fastify-file-interceptor'
import { diskStorage } from 'multer'
import { extname } from 'path'

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

  @ApiConsumes('multipart/form-data')
  @Post()
  @Auth('admin')
  @ApiOperation({ summary: 'Admin create new food' })
  @ApiOkResponse({ description: 'New food entity' })
  @UseInterceptors(
    FileFastifyInterceptor('file', {
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
      fileFilter: (req, file: Express.Multer.File, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return new Error('Only image files are allowed!')
        }
        cb(null, true)
      },
    }),
  )
  async createFood(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: CreateFoodDto,
  ): Promise<SuccessfullyOperation> {
    await this.foodService.saveFood({ file, data })

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
  async readCategories(
    @Query() query: QueryManyDto,
  ): Promise<GetListResponse | GetListPaginationResponse> {
    const { search, includes, sortBy, sortType } = query

    const queryBuilder: SelectQueryBuilder<FoodEntity> =
      await this.foodService.queryFood({
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

      const data = await this.foodService.paginate(queryBuilder, paginateOption)

      return this.response.paginate(data, new FoodTransformer())
    }

    return this.response.collection(
      await queryBuilder.getMany(),
      new FoodTransformer(),
    )
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
