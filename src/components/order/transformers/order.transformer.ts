import { Transformer } from '../../../shared/transformers/transformer'
import { OrderEntity } from '../entities/order.entity'

export class OrderTransformer extends Transformer {
  transform(model: OrderEntity) {
    return {
      id: model.id,
      userId: model.userId,
      seatId: model.seatId,
      status: model.status,
      time: model.time,
      note: model.note,
      totalPrice: model.totalPrice,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }
}
