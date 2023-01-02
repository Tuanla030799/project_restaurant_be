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
import { CreateOrderDto, ReadySeatsDto, UpdateOrderDto } from '../dto/order.dto'
import { QueryManyDto } from '../../../shared/dto/queryParams.dto'
import { OrderTransformer } from '../transformers/order.transformer'
import { AuthenticatedUser } from '../../auth/decorators/authenticatedUser.decorator'
import { Me } from '../../user/dto/user.dto'
import { UpdateOrderDetailsDto } from '../dto/orderDetail.dto'
import { Pagination } from 'nestjs-typeorm-paginate'
import { GetOrdersOfUserRequestDto } from '../../user/dto/get-orders-of-user-request.dto'
import { GetOrdersResDto } from '../dto/get-orders-res.dto'

@ApiTags('Orders')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  @Auth('admin')
  @ApiOperation({ summary: 'Get list orders' })
  @ApiOkResponse({ description: 'List orders with param query' })
  async index(
    @Query() query: GetOrdersOfUserRequestDto,
  ): Promise<GetOrdersResDto> {
    const orders = await this.orderService.getOrders({
      page: query.page || 1,
      limit: query.limit || 10,
      status: query.status,
      orderStartTime: query?.orderStartTime,
      orderEndTime: query?.orderEndTime,
    })
    return new GetOrdersResDto(orders)
  }

  @Get(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Get order by id' })
  @ApiOkResponse({ description: 'order entity' })
  async show(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.orderService.showOrder(id)
    } catch (err) {
      throw err
    }
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
      throw err
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
      throw err
    }
  }
}
