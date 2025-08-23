import {
  Controller,
  Get,
  Query,
} from '@nestjs/common'
import { MetricsService } from './metrics.service'
import { Resp } from '../common'
import { MetricsResp, SingleMetricsResp } from './entities/metrics.resp'
import { GeoMetaViewQuery } from '../geo/entities/geo-meta.entity'
import { GeoService } from '../geo/geo.service'

@Controller('metrics')
export class MetricsController {

  constructor(
    private readonly metricsService: MetricsService,
    private readonly geoService: GeoService,
  ) { }

  @Get('meta')
  async findMetricsMeta(
    @Query('year') year: number,
  ) {
    const data = await this.metricsService.findMetricsMeta(year)
    return Resp.success(data)
  }

  @Get('dataView')
  async findMetricsDataView(
    @Query('year') year: number,
    @Query('keys') keys: string,
    @Query('sortKey') sortKey?: string,
    @Query('order') order: 'asc' | 'desc' = 'asc',
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 100,
  ) {
    if (offset < 0) {
      return Resp.error('offset must be greater than or equal to 0')
    }
    if (limit <= 0 || limit > 100) {
      return Resp.error('limit must be greater than 0 and less than or equal to 100')
    }

    const query: GeoMetaViewQuery = {
      year,
      keys: keys ? keys.split(',') : [],
      sortKey: sortKey || 'gb',
      order,
      offset,
      limit,
    }
    const data = await this.metricsService.findMetricsDataView(query)

    return Resp.success(this.metricsService.map2MetricsResp(data))
  }

  @Get('dataByKey')
  async findMetricsDataByKey(
    @Query('level') level: number,
    @Query('key') key: string,
    @Query('year') year: number,
  ) {
    // find all gbs by adLevel
    const gbs = await this.geoService.findGbsByAdLevel(level, year)
    const data = await this.metricsService.findMetricsDataByGb(gbs, year, [key])
    return Resp.success(data)
  }

  @Get('dataByGb')
  async findMetricsDataByGb(
    @Query('gb') gb: number,
    @Query('keys') keys: string,
    @Query('year') year: number,
  ) {
    const keysArray = keys ? keys.split(',') : []
    const data = await this.metricsService.findMetricsDataByGb([gb], year, keysArray)
    return Resp.success(this.metricsService.map2MetricsResp(data))
  }
} 