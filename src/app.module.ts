import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core'
import { AppController } from './app.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GeoModule } from './geo/geo.module'
import { MetricsModule } from './metrics/metrics.module'
import { PoiModule } from './poi/poi.module'
import { ResponseInterceptor, HttpExceptionFilter } from './common'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'sqlite.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
    GeoModule,
    MetricsModule,
    PoiModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule { }
