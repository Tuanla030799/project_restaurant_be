import { TimeStampEntity } from '../../base.entity'
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm'
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator'
import { CategoryEntity } from '../../category/entities/category.entity'

export enum FoodStatus {
  publish = 'PUBLISH',
  hide = 'HIDE',
}

export enum FoodInventory {
  sold = 'SOLD',
  stocking = 'STOCKING',
}

export enum FoodType {
  drink = 'DRINK',
  food = 'FOOD',
  fast = 'FAST',
  snack = 'SNACKS',
}

@Notifiable()
@Entity({ name: 'foods' })
export class FoodEntity extends TimeStampEntity {
  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar' })
  slug: string

  @Column({ type: 'int' })
  categoryId: number

  @Column({ type: 'enum', enum: FoodType })
  type: FoodType

  @Column({ type: 'varchar' })
  summary: string

  @Column({ type: 'varchar' })
  content: string

  @Column({ type: 'int' })
  discount: number

  @Column({ type: 'int' })
  rating: number

  @Column({ type: 'varchar' })
  image: string

  @Column({ type: 'float' })
  price: number

  @Column({ type: 'int' })
  liked: number

  @Column({ type: 'int' })
  soldQuantity: number

  @Column({ type: 'enum', enum: FoodStatus })
  status: FoodStatus

  @Column({ type: 'enum', enum: FoodInventory })
  inventory: FoodInventory

  @ManyToOne(() => CategoryEntity, (category) => category.foods)
  @JoinColumn({
    name: 'categoryId',
    referencedColumnName: 'id',
  })
  public categories: CategoryEntity
}
