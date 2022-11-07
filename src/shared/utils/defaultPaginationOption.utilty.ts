import { QueryPaginateDto } from '../dto/queryParams.dto'
import { IPaginationOptions } from '../services/pagination'

export const defaultPaginationOption = (
  option: QueryPaginateDto,
): IPaginationOptions => ({
  limit: option.perPage ? option.perPage : 10,
  page: option.page ? Number(option.page) : 1,
})
