import { SortType } from '../constant/constant'

/**
 * Entity general form
 */
export interface Entity {
  [key: string]: any
}

/**
 * Response entity form
 */
export type ResponseEntity = Entity

/**
 * Length aware meta
 */
export interface LengthAwareMeta {
  pagination: {
    total: number
    perPage: number
    currentPage: number
    totalPages: number
  }
}

/**
 * Query params
 */
export interface QueryParams {
  /** Entity */
  entity: string
  /** search by some fields */
  fields?: string[]
  /** search by keyword */
  keyword?: string | ''
  /** sort list by */
  sortBy?: string
  /** sort type */
  sortType?: SortType
  /** include with relation table */
  includes?: string[]
  /** filter some field with exact value */
  filter?: { [key: string]: string }
}
