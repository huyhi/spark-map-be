import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CacheModule } from '@nestjs/cache-manager'
import { GeoController } from './geo.controller'
import { GeoService } from './geo.service'
import { GeoMeta } from './entities/geo-meta.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([GeoMeta]),
    CacheModule.register({
      ttl: 60 * 60 * 1000, // 缓存1小时（毫秒）
      max: 100, // 最大缓存条目数
    })
  ],
  controllers: [GeoController],
  providers: [GeoService],
  exports: [GeoService],
})
export class GeoMetricsModule { }
