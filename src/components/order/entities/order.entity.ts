import { BaseTimeStampEntity } from '../../base.entity'
import { Entity, Column, OneToMany } from 'typeorm'
import { OrderDetailEntity } from './orderDetail.entity'

@Entity({ name: 'orders' })
export class OrderEntity extends BaseTimeStampEntity {
  @Column({ type: 'int' })
  userId: number

  @Column({ type: 'int' })
  seatId: number

  @Column({ type: 'timestamp' })
  time: Date

  @Column({ type: 'varchar' })
  note: string

  @Column({ type: 'varchar' })
  status: string

  @Column({ type: 'float' })
  totalPrice: number

  @OneToMany(() => OrderDetailEntity, (orderDetail) => orderDetail.order)
  orderDetails: OrderDetailEntity[]
}
