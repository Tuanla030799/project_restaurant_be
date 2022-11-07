import { Transformer } from '../../../shared/transformers/transformer'

export class PermissionTransformer extends Transformer {
  transform(model) {
    return {
      id: model.id,
      name: model.name,
      slug: model.slug,
    }
  }
}
