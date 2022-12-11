import { BaseTimeStampEntity } from '../../base.entity'
import { Entity, Column } from 'typeorm'

@Entity({ name: 'seats' })
export class SeatEntity extends BaseTimeStampEntity {
  @Column({ type: 'int' })
  capacity: number

  @Column({ type: 'int' })
  position: number

  @Column({ type: 'varchar' })
  content: string

  @Column({ type: 'varchar' })
  image: string

  @Column({ type: 'boolean' })
  isReady: boolean
}
