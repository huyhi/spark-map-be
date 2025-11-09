import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Enable CORS for cross-origin requests
  app.enableCors({
    origin: true, // 允许所有来源，或者你可以指定具体的域名数组
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    credentials: true, // 允许发送cookies
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })

  await app.listen(process.env.PORT ?? 8000)
}
bootstrap()
