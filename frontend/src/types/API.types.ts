import { HttpStatus } from '@app/enums/http.enum'

export type HttpResponse<T = unknown> = {
  data: T
  statusCode: HttpStatus
  message?: string
  pageSize?: number
  pageNumber?: number
  totalPages?: number
  totalCount?: number
  hasPreviousPage?: boolean
  hasNextPage?: boolean
}

export type HttpError = {
  statusCode: HttpStatus
  message: string | string[]
  errors?: any
}

export type ApiError = {
  status: number
  data: HttpError
}

export type RequestWithId = {
  id: string
}

export type PaginationParams = {
  pageSize: number
  pageNumber: number
  sortField?: string
  sortOrder?: 'ASC' | 'DESC'
}
