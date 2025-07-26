import { Injectable, Inject } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { GeoMeta } from './entities/geo-meta.entity'

export interface CreateGeoMetricDto {
  name: string
  latitude: number
  longitude: number
  description?: string
  category?: string
}

export interface UpdateGeoMetricDto {
  name?: string
  latitude?: number
  longitude?: number
  description?: string
  category?: string
}

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
      where: {
        year: year
      }
    })

    await this.cacheManager.set(cacheKey, data)
    return data
  }
}
