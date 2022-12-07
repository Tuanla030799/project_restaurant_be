import { Transformer } from '../../../shared/transformers/transformer'
import { FoodEntity } from '../entities/food.entity'

export class FoodTransformer extends Transformer {
  transform(model: FoodEntity): any {
    return {
      id: model.id,
      name: model.name,
      slug: model.slug,
      type: model.type,
      summary: model.summary,
      content: model.content,
      discount: model.discount,
      rating: model.rating,
      image: model.image,
      price: model.price,
      liked: model.liked,
      soldQuantity: model.soldQuantity,
      inventory: model.inventory,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
    }
  }
}
