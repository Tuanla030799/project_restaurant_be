import { number } from '@hapi/joi'
import { Injectable } from '@nestjs/common'
import { assign, parseInt } from 'lodash'
import { QueryParams } from 'src/shared/interfaces/interface'
import { BaseService } from 'src/shared/services/base.service'
import { Connection, Repository, SelectQueryBuilder } from 'typeorm'
import { CreateFoodDto } from '../dto/food.dto'
import { FoodEntity } from '../entities/food.entity'
import { FoodRepository } from '../repositories/food.repository'

@Injectable()
export class FoodService extends BaseService {
  public repository: Repository<any>
  public entity: any = FoodEntity

  constructor(private connection: Connection) {
    super()
    this.repository = this.connection.getCustomRepository(FoodRepository)
  }

  async saveFood(params: {
    file: Express.Multer.File
    data: CreateFoodDto
  }): Promise<void> {
    const { file, data } = params

    const generateSlug = await this.generateSlug(data.name)

    const food = this.repository.create({
      name: data.name,
      type: data.type,
      slug: generateSlug,
      summary: data.summary,
      content: data.content,
      discount: data.discount,
      rating: data.rating,
      price: data.price,
      liked: Number(data.liked) ? Number(data.liked) : 0,
      soldQuantity: data.soldQuantity,
      inventory: data.inventory,
      status: data.status,
      categoryId: data.categoryId,
      image: process.env.APP_URL + '/public/uploads/' + file.filename,
    })

    await this.repository.save(food)
  }

  async queryFood(
    params: QueryParams & {
      // update include -> string[] in future
      includes?: any
    },
  ): Promise<SelectQueryBuilder<FoodEntity>> {
    const include = []

    if (params.includes) {
      const arr = params.includes.split(',')
      arr.map((i: any) => include.push(i))
    }

    const { entity, fields, keyword, sortBy, sortType, filters } = params

    const baseQuery: SelectQueryBuilder<FoodEntity> = await this.queryBuilder({
      entity,
      fields,
      keyword,
      sortBy,
      sortType,
      filters,
    })
    return baseQuery
  }
}
