import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core'
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config'
import { AppController } from './app.controller'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { GeoModule } from './geo/geo.module'
import { MetricsModule } from './metrics/metrics.module'
import { PoiModule } from './poi/poi.module'
import { ChatModule } from './chat/chat.module'
import { ResponseInterceptor, HttpExceptionFilter } from './common'

const configModuleCfg: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: ((): string | string[] => {
    const env = process.env.NODE_ENV || 'development'
    const envFileMap: Record<string, string | string[]> = {
      production: ['.env.production', '.env'],
      development: ['.env.dev', '.env'],
      dev: ['.env.dev', '.env'],
    }
    return envFileMap[env] || '.env'
  })(),
}

const typeOrmModuleCfg: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'sqlite.db',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
}

@Module({
  imports: [
    ConfigModule.forRoot(configModuleCfg),
    TypeOrmModule.forRoot(typeOrmModuleCfg),
    GeoModule,
    MetricsModule,
    PoiModule,
    ChatModule,
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
