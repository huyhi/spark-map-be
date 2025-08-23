import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CacheModule } from '@nestjs/cache-manager'
import { MetricsController } from './metrics.controller'
import { MetricsService } from './metrics.service'
import { MetricsMeta, MetricsData } from './entities/metrics.entity'
import { GeoModule } from '../geo/geo.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([MetricsMeta, MetricsData]),
    GeoModule,
    CacheModule.register({
      ttl: 60 * 60 * 1000, // 缓存1小时（毫秒）
      max: 100, // 最大缓存条目数
    })
  ],
  controllers: [MetricsController],
  providers: [MetricsService],
  exports: [MetricsService],
})
export class MetricsModule { } 