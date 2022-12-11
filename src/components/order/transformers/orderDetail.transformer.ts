import { Transformer } from '../../../shared/transformers/transformer'
import { OrderDetailEntity } from '../entities/orderDetail.entity'

export class OrderDetailTransformer extends Transformer {
  transform(model: OrderDetailEntity): any {
    return {
      id: model.id,
      foodId: model.foodId,
      orderId: model.orderId,
      price: model.price,
      quantity: model.quantity,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }
}
