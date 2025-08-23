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

  async findGeoMetaByGbs(gbs: number[], year: number, light: boolean = true): Promise<GeoMeta[]> {
    let selectedFields = ['gb', 'year', 'name']
    if (!light) {
      selectedFields.push('level', 'lat', 'lng', 'geojson')
    }

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
}
