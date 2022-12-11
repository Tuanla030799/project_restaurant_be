import { EntityRepository, Repository } from 'typeorm'
import { OrderDetailEntity } from '../entities/orderDetail.entity'

@EntityRepository(OrderDetailEntity)
export class OrderDetailRepository extends Repository<OrderDetailEntity> {}
