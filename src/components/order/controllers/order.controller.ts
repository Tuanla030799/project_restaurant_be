import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
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
import { OrderService } from '../services/order.service'
import { ApiResponseService } from 'src/shared/services/apiResponse/apiResponse.service'
import { Auth } from 'src/components/auth/decorators/auth.decorator'
import { JwtAuthGuard } from 'src/components/auth/guards/jwtAuth.guard'
import {
  GetListPaginationResponse,
  GetListResponse,
} from 'src/shared/services/apiResponse/apiResponse.interface'
import { OrderEntity } from '../entities/order.entity'
import { SelectQueryBuilder } from 'typeorm'
import { CreateOrderDto, UpdateOrderDto } from '../dto/order.dto'
import { QueryManyDto } from '../../../shared/dto/queryParams.dto'
import { OrderTransformer } from '../transformers/order.transformer'
import { AuthenticatedUser } from '../../auth/decorators/authenticatedUser.decorator'
import { Me } from '../../user/dto/user.dto'

@ApiTags('Categories')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/orders')
export class OrderController {
  constructor(
    private orderService: OrderService,
    private response: ApiResponseService,
  ) {}

  private entity = 'orders'

  @Get()
  @ApiOperation({ summary: 'Get list orders' })
  @ApiOkResponse({ description: 'List orders with param query' })
  async index(
    @Query() query: QueryManyDto,
  ): Promise<GetListResponse | GetListPaginationResponse> {
    const { search, includes, sortBy, sortType } = query

    const queryBuilder: SelectQueryBuilder<OrderEntity> =
      await this.orderService.queryOrder({
        entity: this.entity,
        fields: [],
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

      const data = await this.orderService.paginate(
        queryBuilder,
        paginateOption,
      )

      return this.response.paginate(data, new OrderTransformer())
    }

    return this.response.collection(
      await queryBuilder.getMany(),
      new OrderTransformer(),
    )
  }

  @Post()
  @ApiOperation({ summary: 'Admin create order by id' })
  @ApiOkResponse({ description: 'create order entity' })
  async create(
    @AuthenticatedUser() currentUser: Me,
    @Body() data: CreateOrderDto,
  ) {
    try {
      return await this.orderService.createOrder(currentUser.id, data)
    } catch (err) {
      return err
    }
  }

  @Patch(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin update order by id' })
  @ApiOkResponse({ description: 'Update order entity' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateOrderDto,
  ) {
    try {
      return await this.orderService.updateOrder(id, data)
    } catch (err) {
      return err
    }
  }
}
