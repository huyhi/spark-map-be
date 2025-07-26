export interface ApiResponse<T = any> {
  success: boolean
  data: T
  msg: string
} 