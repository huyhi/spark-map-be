import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Resp } from '../utils/response.util'
import { ApiResponse } from '../interfaces/response.interface'

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map(data => {
        // 如果返回的数据已经是 ApiResponse 格式，直接返回
        if (data && typeof data === 'object' && 'success' in data && 'data' in data && 'msg' in data) {
          return data
        }
        // 否则包装成标准格式
        return Resp.success(data)
      })
    )
  }
} 