import { EntityRepository, Repository } from 'typeorm'
import { FoodEntity } from '../entities/food.entity'

@EntityRepository(FoodEntity)
export class FoodRepository extends Repository<FoodEntity> {}
