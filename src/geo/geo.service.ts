import { Injectable, Inject } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsSelect, In, Repository } from 'typeorm'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { GeoMeta, GeoMetaViewQuery } from './entities/geo-meta.entity'

@Injectable()
export class GeoService {
  constructor(
    @InjectRepository(GeoMeta)
    private geoMetaRepository: Repository<GeoMeta>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }


  async getGeoMetaByAdLevel(year: number, adLevel: number): Promise<GeoMeta[]> {
    const data = await this.geoMetaRepository.find({
      select: ['id', 'name', 'gb', 'level', 'year', 'lat', 'lng', 'geojson'],
      where: {
        level: adLevel,
        year: year
      }
    })
    return data
  }

  /**
   * 根据年份读取数据（带缓存）
   * @param year 年份
   * @returns 指定年份的所有数据
   */
  async getGeoMetaByYear(year: number): Promise<GeoMeta[]> {
    const cacheKey = `geo_meta_year_${year}`

    // 尝试从缓存获取数据
    const cachedData = await this.cacheManager.get<GeoMeta[]>(cacheKey)
    if (cachedData) {
      return cachedData
    }

    const data = await this.geoMetaRepository.find({
      select: ['name', 'gb', 'level', 'year', 'lat', 'lng', 'geojson'],
      where: {
        year: year
      }
    })

    await this.cacheManager.set(cacheKey, data)
    return data
  }

  async findGeoMetaByGbs(gbs: number[], year: number): Promise<GeoMeta[]> {
    let selectedFields = ['id', 'name', 'gb', 'level', 'year']

    const data = await this.geoMetaRepository.find({
      select: selectedFields as FindOptionsSelect<GeoMeta>,
      where: {
        gb: In(gbs),
        year,
      }
    })

    // sort by gb, make data sequence same as gbs
    data.sort((a, b) => gbs.indexOf(a.gb) - gbs.indexOf(b.gb))
    return data
  }

  async findGbsByAdLevel(level: number, year: number): Promise<number[]> {
    const data = await this.geoMetaRepository.find({
      select: ['gb', 'level'],
      where: {
        level,
        year,
      }
    })

    return data.map(item => item.gb)
  }

  async queryGbs(query: GeoMetaViewQuery): Promise<number[]> {
    const gbList = await this.geoMetaRepository.find({
      select: ['gb'],
      where: {
        year: query.year,
      },
      order: {
        [query.sortKey || 'gb']: query.order,
      },
      skip: query.offset,
      take: query.limit,
    })

    return gbList.map(item => item.gb)
  }

  /**
   * 将多个 GeoMeta 对象中的 geojson 合并为一个 FeatureCollection
   * @param geoMetaList GeoMeta 对象数组
   * @returns 合并后的 FeatureCollection
   */
  mergeToFeatureCollection(geoMetaList: GeoMeta[]): any {
    return {
      type: 'FeatureCollection',
      features: geoMetaList.map(geoMeta => ({
        type: 'Feature',
        properties: {
          id: geoMeta.id,
          name: geoMeta.name,
          gb: geoMeta.gb,
          level: geoMeta.level,
          year: geoMeta.year,
          lat: geoMeta.lat,
          lng: geoMeta.lng,
        },
        geometry: JSON.parse(geoMeta.geojson)
      }))
    }
  }
}
