import { BaseTimeStampEntity } from '../../base.entity'
import { Entity, Column, ManyToOne } from 'typeorm'
import { OrderEntity } from './order.entity'

@Entity({ name: 'orderDetails' })
export class OrderDetailEntity extends BaseTimeStampEntity {
  @Column({ type: 'int' })
  foodId: number

  @Column({ type: 'int' })
  orderId: number

  @Column({ type: 'float' })
  price: number

  @Column({ type: 'int' })
  quantity: number

  @ManyToOne(() => OrderEntity, (order) => order.orderDetails)
  order: OrderEntity
}
