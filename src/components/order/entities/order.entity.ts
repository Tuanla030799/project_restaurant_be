import { BaseTimeStampEntity } from '../../base.entity'
import { Entity, Column, OneToMany } from 'typeorm'
import { OrderDetailEntity } from './orderDetail.entity'

@Entity({ name: 'orders' })
export class OrderEntity extends BaseTimeStampEntity {
  @Column({ type: 'int' })
  userId: number

  @Column({ type: 'varchar' })
  seatIds: string

  @Column({ type: 'timestamp' })
  time: Date

  @Column({ type: 'varchar' })
  note: string

  @Column({ type: 'int' })
  status: number

  @Column({ type: 'float' })
  totalPrice: number

  @Column({ type: 'int' })
  amount: number

  @Column({ type: 'varchar' })
  fullName: string

  @Column({ type: 'varchar' })
  phone: string

  @OneToMany(() => OrderDetailEntity, (orderDetail) => orderDetail.order)
  orderDetails: OrderDetailEntity[]
}
