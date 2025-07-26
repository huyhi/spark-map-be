import { ApiResponse } from '../interfaces/response.interface'

export class Resp {
  /**
   * 创建成功响应
   * @param data 响应数据
   * @param msg 消息
   * @returns 统一格式的成功响应
   */
  static success<T>(data: T, msg = ''): ApiResponse<T> {
    return {
      success: true,
      data,
      msg
    }
  }

  /**
   * 创建失败响应
   * @param msg 错误消息
   * @param data 可选的错误数据
   * @returns 统一格式的失败响应
   */
  static error<T = any>(msg = 'service error', data: T = null as T): ApiResponse<T> {
    return {
      success: false,
      data,
      msg
    }
  }
} 