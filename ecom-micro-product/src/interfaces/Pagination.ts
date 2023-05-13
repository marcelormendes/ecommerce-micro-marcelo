export interface Pagination {
  page: number
  limit: number
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  pages: number
  limit: number
  total: number
}
