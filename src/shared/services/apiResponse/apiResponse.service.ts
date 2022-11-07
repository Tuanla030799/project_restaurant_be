import { Injectable, BadRequestException } from '@nestjs/common'
import { Pagination } from '../pagination'
import { TransformerInterface } from '../../transformers/transformer'
import {
  GetItemResponse,
  GetListPaginationResponse,
  GetListResponse,
  SuccessfullyOperation,
} from './apiResponse.interface'
import Messages from '../../message/message'
import { Entity, ResponseEntity } from 'src/shared/interfaces/interface'

@Injectable()
export class ApiResponseService {
  /**
   * Bind an item to a transformer and start building a response
   *
   * @param {*} Object
   * @param {*} Transformer
   *
   * @return Object
   */
  item(entity: Entity, transformer: TransformerInterface): GetItemResponse {
    return { data: transformer.get(entity) }
  }

  /**
   * Bind an item to a object response
   *
   * @param {*} data
   *
   * @return Object data
   */
  object(data: any) {
    return { data }
  }

  /**
   * Bind a collection to a transformer and start building a response
   *
   * @param {*} collection
   * @param {*} transformer
   *
   * @return Object
   */
  collection(
    collection: Entity[],
    transformer: TransformerInterface,
  ): GetListResponse {
    return {
      data: collection.map((i) => {
        return transformer.get(i)
      }),
    }
  }

  /**
   * Create a new primitive resource object
   *
   * @param collection
   * @param transformer
   *
   * @return object
   */
  primitive(data: Entity): { data: ResponseEntity } {
    return { data }
  }

  /**
   * Response success api
   *
   * @param params.message message specific successful operation
   *
   * @return message specific successful operation pr default message
   */
  success(params?: { message: string }): SuccessfullyOperation {
    const message = params?.message ?? Messages.successfullyOperation.general

    return { data: { success: true, message: message } }
  }

  /**
   * Bind a paginator to a transformer and start building a response
   *
   * @param {*} LengthAwarePaginator
   * @param {*} Transformer
   *
   * @return Object
   */
  paginate(
    paginator: Entity,
    transformer: TransformerInterface,
  ): GetListPaginationResponse {
    if (!(paginator instanceof Pagination)) {
      throw new BadRequestException(
        `ApiResponse.paginate expect a Pagination instead a ${typeof paginator}`,
      )
    }

    const items = paginator.items.map((i) => {
      return transformer.get(i)
    })

    return {
      data: items,
      meta: {
        pagination: {
          total: paginator.meta.totalItems,
          perPage: paginator.meta.itemsPerPage,
          currentPage: paginator.meta.currentPage,
          totalPages: paginator.meta.totalPages,
        },
      },
    }
  }
}
