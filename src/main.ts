declare const module: any
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'

import { join } from 'path'
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.enableCors()
  if (process.env.APP_ENV !== 'production') {
    const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('NestJS API')
      .setVersion('1.0')
      .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('swaggerUI', app, document)
  }

  app.useGlobalPipes(new ValidationPipe())
  app.useStaticAssets(join(__dirname, 'public'))
  await app.listen(process.env.PORT, '0.0.0.0')

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }

  /* eslint-disable @typescript-eslint/no-var-requires */

  const fs = require('fs')
  const dir = './public'
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
    const dir1 = './public/uploads'
    if (!fs.existsSync(dir1)) {
      fs.mkdirSync(dir1)
    }
  }
}
bootstrap()
