import { Transformer } from '../../../shared/transformers/transformer'
import { CategoryEntity } from '../entities/category.entity'

export class CategoryTransformer extends Transformer {
  transform(model: CategoryEntity): any {
    return {
      id: model.id,
      name: model.name,
      slug: model.slug,
      thumbnail: model.thumbnail,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }
}
