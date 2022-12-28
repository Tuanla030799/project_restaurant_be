import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { isEqual } from 'lodash'
import * as moment from 'moment'
import { QueryParams } from 'src/shared/interfaces/interface'
import { BaseService } from 'src/shared/services/base.service'
import {
  Between,
  Connection,
  getConnection,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  Repository,
  SelectQueryBuilder,
} from 'typeorm'
import { FoodRepository } from '../../food/repositories/food.repository'
import { SeatEntity } from '../../seat/entities/seat.entity'
import { SeatRepository } from '../../seat/repositories/seat.repository'
import { UserRepository } from '../../user/repositories/user.repository'
import { CreateOrderDto, UpdateOrderDto } from '../dto/order.dto'
import { UpdateOrderDetailsDto } from '../dto/orderDetail.dto'
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
    this.orderDetailRepository = this.connection.getCustomRepository(
      OrderDetailRepository,
    )
    this.userRepository = this.connection.getCustomRepository(UserRepository)
  }

  async showOrder(orderId) {
    const order = await this.repository.findOne({ id: orderId })
    if (!order) {
      throw new NotFoundException()
    }

    const orderDetails = await this.orderDetailRepository.find({
      where: { orderId: orderId },
    })
    const user = await this.userRepository.findOne({
      where: { id: order.userId },
    })
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

    const seatIds = JSON.parse(order.seatIds === null ? '[]' : order.seatIds)
    let seatsByOrder = []
    if (seatIds.length > 0) {
      seatsByOrder = await this.seatRepository.find({
        where: { id: In(JSON.parse(order.seatIds)) },
      })
    }

    const notReadySeatIds = await this.notReadySeatIds(null, order)

    const readySeats = await this.seatRepository.find({
      where: { id: Not(In(notReadySeatIds)), isReady: true },
    })

    const filterReadySeats = readySeats.filter((s) => {
      return !seatIds.includes(s.id)
    })

    const seatAttrs = seatsByOrder.concat(filterReadySeats).map((seat) => {
      const isChoose = seatIds.includes(seat.id)

      return {
        id: seat.id,
        capasity: seat.capasity,
        image: seat.image,
        content: seat.content,
        position: seat.position,
        isReady: seat.isReady,
        isChoose: isChoose,
      }
    })

    return {
      id: order.id,
      user: userAttrs,
      seats: seatAttrs,
      status: order.status,
      time: order.time,
      note: order.note,
      totalPrice: order.totalPrice,
      amount: order.amount,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      fullName: order.fullName,
      phone: order.phone,
      orderDetails: orderDetails,
    }
  }

  async createOrder(userId, data: CreateOrderDto) {
    const order = this.repository.create({
      userId: userId,
      time: data.time,
      note: data.note,
      totalPrice: data.totalPrice,
      amount: data.amount,
      fullName: data.fullName,
      phone: data.phone,
    })

    const foodIdsParam = data.orderDetails.map((od) => od.foodId)
    const foods = await this.seatRepository.findByIds(foodIdsParam)
    const foodIdsExisted = foods.map((food) => food.id)
    const notFoundFoodIds = foodIdsParam.filter(
      (id) => !foodIdsExisted.includes(id),
    )

    if (notFoundFoodIds.length > 0) {
      throw new NotFoundException()
    }
    
    await this.repository.save(order)
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

    if (Object.keys(data).length === 0) {
      return { id: order.id }
    }

    const updateFields = (({ status, note, amount, fullName, phone }) => ({
      status,
      note,
      amount,
      fullName,
      phone,
    }))(data)

    const notReadySeatIds = await this.notReadySeatIds(data.time, order)

    const readySeats = await this.seatRepository.find({
      where: { id: Not(In(notReadySeatIds)), isReady: true },
    })

    let updateFieldsCopy = {}
    if (data.seatIds?.length > 0) {
      updateFieldsCopy = Object.assign(
        {},
        { id: order.id, seatIds: JSON.stringify(data.seatIds) },
        updateFields,
      )
      const invalidSeatIds = data.seatIds.some((id) => {
        return notReadySeatIds.includes(id as number)
      })

      if (invalidSeatIds) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            errorCode: 1002,
            message: 'The seats is already booked!',
            readySeats: readySeats
          },
          HttpStatus.BAD_REQUEST,
        )
      }

      const seatIds = JSON.parse(order.seatIds === null ? '[]' : order.seatIds)
      if (!isEqual(seatIds, data.seatIds)) {
        await getConnection()
          .createQueryBuilder()
          .update(SeatEntity)
          .set({ isReady: true })
          .where({ id: In(seatIds) })
          .execute()
      }
    } else {
      updateFieldsCopy = Object.assign({}, { id: order.id }, updateFields)
    }

    await this.repository.save({ ...order, ...updateFieldsCopy })

    if (data.status == OrderStatus.APPROVE) {
      const seatIds = JSON.parse(order.seatIds === null ? '[]' : order.seatIds)
      if (seatIds.length > 0) {
        const invalidSeatIds = seatIds.some((id) => {
          return notReadySeatIds.includes(id as number)
        })

        if (invalidSeatIds) {
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              errorCode: 1002,
              message: 'The seats is already booked!',
              readySeats: readySeats
            },
            HttpStatus.BAD_REQUEST,
          )
        }

        await getConnection()
          .createQueryBuilder()
          .update(SeatEntity)
          .set({ isReady: false })
          .where({ id: In(seatIds) })
          .execute()
      } else {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            errorCode: 1003,
            message: "You haven't chosen a seat yet!",
          },
          HttpStatus.BAD_REQUEST,
        )
      }
    }

    if (
      data.status == OrderStatus.REJECT ||
      data.status == OrderStatus.FINISH
    ) {
      await getConnection()
        .createQueryBuilder()
        .update(SeatEntity)
        .set({ isReady: true })
        .where({
          id: In(JSON.parse(order.seatIds === null ? '[]' : order.seatIds)),
        })
        .execute()
    }

    let result = {}
    if (data.seatIds?.length > 0) {
      result = Object.assign(
        {},
        { id: order.id, seatIds: data.seatIds },
        updateFields,
      )
    } else {
      result = Object.assign({}, { id: order.id }, updateFields)
    }

    return result
  }

  async notReadySeatIds(timeParam, order) {
    const time = timeParam ? timeParam : order.time
    const timeOrder = new Date(time)
    const lessTimeOrder = moment(this.plusHours(timeOrder, 2)).format(
      'YYYY-MM-DD HH:mm',
    )
    const moreTimeOrder = moment(this.subtractHours(timeOrder, 2)).format(
      'YYYY-MM-DD HH:mm',
    )

    const orders = await this.repository.find({
      where: [
        {
          id: Not(order.id),
          status: OrderStatus.APPROVE,
          time: Between(
            moreTimeOrder,
            moment(new Date(time)).format('YYYY-MM-DD HH:mm'),
          ),
        },
        {
          id: Not(order.id),
          status: OrderStatus.APPROVE,
          time: Between(
            moment(new Date(time)).format('YYYY-MM-DD HH:mm'),
            lessTimeOrder,
          ),
        },
      ],
    })

    const notReadySeatIds = orders.reduce((arr, order) => {
      return [
        ...arr,
        ...JSON.parse(order.seatIds === null ? '[]' : order.seatIds),
      ]
    }, [])

    return notReadySeatIds
  }

  subtractHours(date, hours) {
    const dateCopy = new Date(date)
    dateCopy.setHours(dateCopy.getHours() - hours)

    return dateCopy
  }

  plusHours(date, hours) {
    const dateCopy = new Date(date)
    dateCopy.setHours(dateCopy.getHours() + hours)

    return dateCopy
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
