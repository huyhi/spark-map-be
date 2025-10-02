export interface ApiResponse<T = any> {
  success: boolean
  data: T
  total?: number
  msg: string
} 