import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindManyOptions, FindOptionsSelect, FindOptionsWhere, In, Repository } from 'typeorm'
import { MetricsData, MetricsMeta } from './entities/metrics.entity'
import { DataType } from 'src/constant/enum'
import { GeoMeta, GeoMetaViewQuery } from '../geo/entities/geo-meta.entity'
import { GeoService } from '../geo/geo.service'
import { MetricsDataWithGeoMeta } from './entities/metrics.biz'
import { SingleMetricsResp } from './entities/metrics.resp'

@Injectable()
export class MetricsService {

  constructor(
    @InjectRepository(MetricsMeta)
    private metricsMetaRepository: Repository<MetricsMeta>,
    @InjectRepository(MetricsData)
    private metricsDataRepository: Repository<MetricsData>,
    private geoService: GeoService,
  ) { }

  async findMetricsMeta(year: number): Promise<MetricsMeta[]> {
    return this.metricsMetaRepository.find(
      {
        select: ['key', 'realName', 'maxVal', 'minVal'],
        where: {
          datatype: DataType.NUM,
          year,
        },
      }
    )
  }

  async findMetricsDataView(query: GeoMetaViewQuery): Promise<MetricsDataWithGeoMeta> {
    // query gb from metrics_meta
    const gbList = await this.geoService.queryGbs(query)
    return this.findMetricsDataByGb(gbList, query.year, query.keys)
  }

  async findMetricsDataByGb(gbs: number[], year: number, keys: string[]): Promise<MetricsDataWithGeoMeta> {
    if (gbs.length === 0) {
      return {
        geoMeta: [],
        metricsData: []
      }
    }

    let metricsDataQuery: FindManyOptions<MetricsData> = {
      select: ['gb', 'key', 'value'] as FindOptionsSelect<MetricsData>,
      where: {
        gb: In(gbs),
        year,
      },
    }

    if (keys.length > 0) {
      (metricsDataQuery.where as FindOptionsWhere<MetricsData>)['key'] = In(keys) as FindOptionsWhere<MetricsData>['key']
    }

    // query geo meta by gbs 
    const geoMeta = await this.geoService.findGeoMetaByGbs(gbs, year)
    const metricsData = await this.metricsDataRepository.find(metricsDataQuery)

    return {
      geoMeta,
      metricsData,
    }
  }

  map2MetricsResp(data: MetricsDataWithGeoMeta): SingleMetricsResp[] {
    let { geoMeta, metricsData } = data

    // convert geoMeta to map, key is gb, value is geoMeta
    let geoMetaMap = new Map<number, GeoMeta>()
    for (const item of geoMeta) {
      geoMetaMap.set(item.gb, item)
    }

    // convert to map, key is gb, value is metricsData
    let metricsDataMap = new Map<number, MetricsData[]>()
    for (const item of metricsData) {
      let gb = item.gb
      if (!metricsDataMap.has(gb)) {
        metricsDataMap.set(gb, [])
      }
      metricsDataMap.get(gb)?.push(item)
    }

    let respList: SingleMetricsResp[] = []
    for (const item of geoMeta) {
      let gb = item.gb
      let metricsData = metricsDataMap.get(gb)
      let metrics: { [key: string]: number } = {}
      if (metricsData) {
        for (const data of metricsData) {
          metrics[data.key] = data.value
        }
      }

      respList.push({
        meta: item,
        metrics,
      })
    }

    return respList
  }
}