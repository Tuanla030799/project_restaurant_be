import { TimeStampEntity } from '../../base.entity'
import { Entity, Column, OneToMany } from 'typeorm'
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator'
import { FoodEntity } from 'src/components/food/entities/food.entity'

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

  @OneToMany(() => FoodEntity, (food) => food.categories)
  foods: FoodEntity[]
}
