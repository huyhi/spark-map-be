import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common'
import {
  GeoService,
} from './geo.service'
import { Resp } from '../common'

@Controller('geo')
export class GeoController {
  constructor(private readonly geoService: GeoService) { }

  @Get('meta/:year')
  async getGeoMetaByYear(@Param('year', ParseIntPipe) year: number) {
    const data = await this.geoService.getGeoMetaByYear(year)
    // 由于全局拦截器会自动包装响应，这里可以直接返回数据
    // 但如果需要自定义消息，可以使用 ResponseUtil.success()
    return Resp.success(data, `成功获取${year}年的地理数据`)
  }
}