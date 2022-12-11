import { EntityRepository, Repository } from 'typeorm'
import { OrderEntity } from '../entities/order.entity'

@EntityRepository(OrderEntity)
export class OrderRepository extends Repository<OrderEntity> {}
