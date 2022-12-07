import { Injectable } from '@nestjs/common'
import { assign } from 'lodash'
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

    const dataWithSlug = assign(data, {
      slug: generateSlug,
    })

    const newFile = assign({}, file, {
      key: file.filename,
      location: process.env.APP_URL + '/public/uploads/' + file.filename,
    })

    const dataAssignUrlFile = assign(dataWithSlug, {
      avatar: newFile.location,
    })

    const image = { ...dataAssignUrlFile }

    await this.save(image)
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

    const { entity, fields, keyword, sortBy, sortType } = params

    const baseQuery: SelectQueryBuilder<FoodEntity> = await this.queryBuilder({
      entity,
      fields,
      keyword,
      sortBy,
      sortType,
    })
    return baseQuery
  }
}
