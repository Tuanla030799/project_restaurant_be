import { Transformer } from '../../../shared/transformers/transformer'
import { SeatEntity } from '../entities/seat.entity'

export class SeatTransformer extends Transformer {
  transform(model: SeatEntity): any {
    return {
      id: model.id,
      content: model.content,
      isReady: model.isReady,
      position: model.position,
      image: model.image,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }
}
