import { Injectable } from '@nestjs/common'
import { QueryParams } from 'src/shared/interfaces/interface'
import { BaseService } from 'src/shared/services/base.service'
import { Connection, Repository, SelectQueryBuilder } from 'typeorm'
import { CreateCategoryDto } from '../dto/category.dto'
import { CategoryEntity } from '../entities/category.entity'
import { CategoryRepository } from '../repositories/category.repository'

@Injectable()
export class CategoryService extends BaseService {
  public repository: Repository<any>
  public entity: any = CategoryEntity

  constructor(private connection: Connection) {
    super()
    this.repository = this.connection.getCustomRepository(CategoryRepository)
  }

  async saveCategory(data: CreateCategoryDto) {
    const generateSlug = await this.generateSlug(data.name)

    data['slug'] = generateSlug

    this.save(data)
  }

  async queryCategory(
    params: QueryParams & {
      // update include -> string[] in future
      includes?: any
    },
  ): Promise<SelectQueryBuilder<CategoryEntity>> {
    const include = []

    if (params.includes) {
      const arr = params.includes.split(',')
      arr.map((i: any) => include.push(i))
    }

    const { entity, fields, keyword, sortBy, sortType } = params

    const baseQuery: SelectQueryBuilder<CategoryEntity> =
      await this.queryBuilder({
        entity,
        fields,
        keyword,
        sortBy,
        sortType,
      })
    return baseQuery
  }
}
