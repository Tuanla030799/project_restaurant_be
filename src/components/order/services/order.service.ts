import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { QueryParams } from 'src/shared/interfaces/interface'
import { BaseService } from 'src/shared/services/base.service'
import { Connection, getConnection, In, LessThanOrEqual, MoreThanOrEqual, Repository, SelectQueryBuilder } from 'typeorm'
import { FoodRepository } from '../../food/repositories/food.repository'
import { SeatEntity } from '../../seat/entities/seat.entity'
import { SeatRepository } from '../../seat/repositories/seat.repository'
import { UserRepository } from '../../user/repositories/user.repository'
import { CreateOrderDto, UpdateOrderDto } from '../dto/order.dto'
import { OrderEntity } from '../entities/order.entity'
import { OrderStatus } from '../entities/order.enum'
import { OrderRepository } from '../repositories/order.repository'
import { OrderDetailRepository } from '../repositories/orderDetail.repository'

@Injectable()
export class OrderService extends BaseService {
  public repository: Repository<any>
  public entity: any = OrderEntity
  public seatRepository: Repository<any>
  public foodRepository: Repository<any>
  public orderDetailRepository: Repository<any>
  public userRepository: Repository<any>

  constructor(private connection: Connection) {
    super()
    this.repository = this.connection.getCustomRepository(OrderRepository)
    this.seatRepository = this.connection.getCustomRepository(SeatRepository)
    this.foodRepository = this.connection.getCustomRepository(FoodRepository)
    this.orderDetailRepository = this.connection.getCustomRepository(OrderDetailRepository)
    this.userRepository = this.connection.getCustomRepository(UserRepository)
  }

  async showOrder(orderId) {
    const order = await this.repository.findOne({ id: orderId })
    if (!order) {
      throw new NotFoundException()
    }

    const orderDetails = await this.orderDetailRepository.find({where: {orderId: orderId}})
    const user = await this.userRepository.findOne({ where: {id: order.userId} })
    const userAttrs = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      address: user.address,
      avatar: user.avatar,
    }
    const seats = await this.seatRepository.find({ where: {id: In(JSON.parse(order.seatIds))} })

    return {
      id: order.id,
      user: userAttrs,
      seats: seats,
      status: order.status,
      time: order.time,
      note: order.note,
      totalPrice: order.totalPrice,
      amount: order.amount,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      orderDetails: orderDetails
    }
  }

  async createOrder(userId, data: CreateOrderDto) {
    const seat = await this.seatRepository.findOne({ where: {isReady: true, capacity: MoreThanOrEqual(data.amount) } })
    let seatIds = [seat?.id]
    if (!seat) {
      const seats = await this.seatRepository.find({ where: {isReady: true, capacity: LessThanOrEqual(data.amount) } })
      seats.forEach(seat => {
        const secondSeat = seats.find(st => st.id !== seat.id && (st.capacity + seat.capacity) >= data.amount)
        if (secondSeat) {
          const sumCapacitySeats = seat.capacity + secondSeat.capacity
          if (data.amount > sumCapacitySeats) {
            throw new HttpException({
              status: HttpStatus.BAD_REQUEST,
              errorCode: 1000,
              message: "Khong du ban"
            }, HttpStatus.BAD_REQUEST);
          }

          return seatIds = [seat.id, secondSeat.id]
        } else {
          seatIds = []
        }
      })

      if (seatIds.length < 1) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          errorCode: 1000,
          message: "Khong du ban"
        }, HttpStatus.BAD_REQUEST);
      }
    }

    const order = this.repository.create({
      seatIds: JSON.stringify(seatIds),
      userId: userId,
      time: data.time,
      note: data.note,
      totalPrice: data.totalPrice,
      amount: data.amount
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

    if (data.status == OrderStatus.APPROVE) {
      await getConnection()
        .createQueryBuilder()
        .update(SeatEntity)
        .set({ isReady: false })
        .where({id: In(JSON.parse(order.seatIds))})
        .execute();
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
