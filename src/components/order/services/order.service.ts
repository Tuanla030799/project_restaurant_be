import { Injectable, NotFoundException } from '@nestjs/common'
import { identity } from 'lodash'
import { async } from 'rxjs'
import { QueryParams } from 'src/shared/interfaces/interface'
import { BaseService } from 'src/shared/services/base.service'
import { Connection, Repository, SelectQueryBuilder } from 'typeorm'
import { FoodRepository } from '../../food/repositories/food.repository'
import { SeatRepository } from '../../seat/repositories/seat.repository'
import { CreateOrderDto, UpdateOrderDto } from '../dto/order.dto'
import { OrderEntity } from '../entities/order.entity'
import { OrderRepository } from '../repositories/order.repository'
import { OrderDetailRepository } from '../repositories/orderDetail.repository'

@Injectable()
export class OrderService extends BaseService {
  public repository: Repository<any>
  public entity: any = OrderEntity
  public seatRepository: Repository<any>
  public foodRepository: Repository<any>
  public orderDetailRepository: Repository<any>

  constructor(private connection: Connection) {
    super()
    this.repository = this.connection.getCustomRepository(OrderRepository)
    this.seatRepository = this.connection.getCustomRepository(SeatRepository)
    this.foodRepository = this.connection.getCustomRepository(FoodRepository)
    this.orderDetailRepository = this.connection.getCustomRepository(
      OrderDetailRepository,
    )
  }

  async showOrder(orderId) {
    const order = await this.repository.findOne({ id: orderId })
    if (!order) {
      throw new NotFoundException()
    }

    const orderDetails = await this.orderDetailRepository.find({where: {orderId: orderId}})

    return {
      id: order.id,
      userId: order.userId,
      seatId: order.seatId,
      status: order.status,
      time: order.time,
      note: order.note,
      totalPrice: order.totalPrice,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      orderDetails: orderDetails
    }
  }

  async createOrder(userId, data: CreateOrderDto) {
    const seat = await this.seatRepository.findOne({ id: data.seatId })
    if (!seat) {
      throw new NotFoundException()
    }
    const order = this.repository.create({
      seatId: data.seatId,
      userId: userId,
      time: data.time,
      note: data.note,
      totalPrice: data.totalPrice,
    })
    await this.repository.save(order)

    const foodIdsParam = data.orderDetails.map((od) => od.foodId)
    const foods = await this.seatRepository.findByIds(foodIdsParam)
    const foodIdsExisted = foods.map((food) => food.id)
    const notFoundFoodIds = foodIdsParam.filter(
      (id) => !foodIdsExisted.includes(id),
    )

    if (notFoundFoodIds.length > 0) {
      throw new NotFoundException()
    }

    const orderDetails = data.orderDetails.map((od) => {
      return this.orderDetailRepository.create({
        foodId: od.foodId,
        orderId: order.id,
        price: od.price,
        quantity: od.quantity,
      })
    })
    await this.orderDetailRepository.save(orderDetails)
  }

  async updateOrder(orderId, data: UpdateOrderDto) {
    const order = await this.repository.findOne({ id: orderId })
    if (!order) {
      throw new NotFoundException()
    }

    return await this.repository.save({
      id: orderId,
      status: data.status,
    })
  }

  async queryOrder(
    params: QueryParams & {
      // update include -> string[] in future
      includes?: any
    },
  ): Promise<SelectQueryBuilder<OrderEntity>> {
    const include = []

    if (params.includes) {
      const arr = params.includes.split(',')
      arr.map((i: any) => include.push(i))
    }

    const { entity, fields, keyword, sortBy, sortType } = params

    const baseQuery: SelectQueryBuilder<OrderEntity> = await this.queryBuilder({
      entity,
      fields,
      keyword,
      sortBy,
      sortType,
    })
    return baseQuery
  }
}
