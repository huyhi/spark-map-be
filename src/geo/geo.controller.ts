import {
  Controller,
  Get,
  Query,
} from '@nestjs/common'
import {
  GeoService,
} from './geo.service'
import { Resp } from '../common'

@Controller('api/geo')
export class GeoController {
  constructor(private readonly geoService: GeoService) { }

  @Get('meta')
  async getGeoMetaByYear(
    @Query('year') year: number = 2020,
    @Query('adLevel') adLevel: number,
  ) {
    const data = await this.geoService.getGeoMetaByAdLevel(year, adLevel)
    const mergedFeatureCollection = this.geoService.mergeToFeatureCollection(data)

    return Resp.success(
      mergedFeatureCollection,
      `Successfully retrieved geographic data for year ${year}`
    )
  }
}