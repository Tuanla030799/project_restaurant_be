export enum SortType {
  DESC = 'DESC',
  ASC = 'ASC',
}

export enum BaseAbleType {
  product = 'PRODUCT',
  post = 'POST',
}

export const SortByProperties = {
  UPDATED_AT: 'updatedAt',
  CREATED_AT: 'createdAt',
} as const

export const DEFAULT_SORT_BY = SortByProperties.UPDATED_AT

export const DEFAULT_SORT_TYPE = SortType.DESC
