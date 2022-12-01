import { TimeStampEntity } from '../../base.entity'
import { Entity, Column } from 'typeorm'
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator'

export enum CategoryStatus {
  publish = 'PUBLISH',
  hide = 'HIDE',
}
@Notifiable()
@Entity({ name: 'categories' })
export class CategoryEntity extends TimeStampEntity {
  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar' })
  slug: string

  @Column({ type: 'varchar' })
  thumbnail: string
}
