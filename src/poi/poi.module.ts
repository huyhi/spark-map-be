import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CacheModule } from '@nestjs/cache-manager'
import { PoiService } from './poi.service'
import { Poi } from './entities/poi.entity'
import { PoiController } from './poi.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([Poi]),
    CacheModule.register({
      ttl: 60 * 60 * 1000, // 缓存1小时（毫秒）
      max: 100, // 最大缓存条目数
    })
  ],
  controllers: [PoiController],
  providers: [PoiService],
  exports: [PoiService, TypeOrmModule],
})
export class PoiModule { }
