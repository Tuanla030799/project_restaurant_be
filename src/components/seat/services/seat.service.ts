import { Injectable, NotFoundException } from '@nestjs/common'
import { QueryParams } from 'src/shared/interfaces/interface'
import { BaseService } from 'src/shared/services/base.service'
import { Connection, Repository, SelectQueryBuilder } from 'typeorm'
import { UpdateOrderDto } from '../../order/dto/order.dto'
import { OrderEntity } from '../../order/entities/order.entity'
import { OrderStatus } from '../../order/entities/order.enum'
import { OrderRepository } from '../../order/repositories/order.repository'
import { UpdateSeatDto } from '../dto/seat.dto'
import { SeatEntity } from '../entities/seat.entity'
import { SeatRepository } from '../repositories/seat.repository'

@Injectable()
export class SeatService extends BaseService {
  public repository: Repository<any>
  public entity: any = SeatEntity
  public orderRepository: Repository<OrderEntity>

  constructor(private connection: Connection) {
    super()
    this.repository = this.connection.getCustomRepository(SeatRepository)
    this.orderRepository = this.connection.getCustomRepository(OrderRepository)
  }

  async updateSeat(seatId, data: UpdateSeatDto) {
    const seat = await this.repository.findOne({ id: seatId })
    if (!seat) {
      throw new NotFoundException()
    }

    return await this.repository.save({
      id: seatId,
      isReady: data.isReady,
    })
  }

  async querySeat(
    params: QueryParams & {
      // update include -> string[] in future
      includes?: any
    },
  ): Promise<SelectQueryBuilder<SeatEntity>> {
    const include = []

    if (params.includes) {
      const arr = params.includes.split(',')
      arr.map((i: any) => include.push(i))
    }

    const { entity, fields, keyword, sortBy, sortType } = params

    const baseQuery: SelectQueryBuilder<SeatEntity> = await this.queryBuilder({
      entity,
      fields,
      keyword,
      sortBy,
      sortType,
    })

    return baseQuery
  }
}
