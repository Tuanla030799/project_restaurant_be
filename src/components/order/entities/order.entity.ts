import { BaseTimeStampEntity } from '../../base.entity'
import { Entity, Column, OneToMany, ManyToOne } from 'typeorm'
import { OrderDetailEntity } from './orderDetail.entity'
import { UserEntity } from '../../user/entities/user.entity'
import { SeatEntity } from '../../seat/entities/seat.entity'

@Entity({ name: 'orders' })
export class OrderEntity extends BaseTimeStampEntity {
  @Column({ type: 'int' })
  userId: number

  @Column({ type: 'varchar' })
  seatIds: string

  @Column({ type: 'timestamptz' })
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

  @Column({ type: 'timestamptz' })
  deletedAt: Date

  @OneToMany(() => OrderDetailEntity, (orderDetail) => orderDetail.order)
  orderDetails: OrderDetailEntity[]

  @ManyToOne(() => UserEntity, (user) => user.orders, { onDelete: 'CASCADE', onUpdate:'CASCADE' })
  user: UserEntity;
}
