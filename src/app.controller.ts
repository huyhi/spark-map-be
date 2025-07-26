import { Controller, Get } from '@nestjs/common'
import { Resp } from './common'

@Controller()
export class AppController {

  @Get()
  getHello() {
    // 这会被全局拦截器自动包装成统一格式
    return 'Hello World!'
  }

  @Get('success')
  getSuccess() {
    // 手动使用 ResponseUtil 创建成功响应
    return Resp.success({ message: 'Hello World!' }, '请求成功')
  }

  @Get('error')
  getError() {
    // 抛出异常会被全局异常过滤器处理
    throw new Error('这是一个测试错误')
  }
}
