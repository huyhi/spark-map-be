import {
  Controller,
  Get,
} from '@nestjs/common'
import { PoiService } from './poi.service'
import { Resp } from '../common'

@Controller('api/poi')
export class PoiController {
  constructor(private readonly poiService: PoiService) { }

  @Get('dataView')
  async findPoiDataView() {
    const data = await this.poiService.findPoiDataView()
    return Resp.success(data)
  }
}
