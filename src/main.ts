import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { docsBuilder, docsOptions, EnvConfig } from './config'
import { ZodValidationPipe } from 'nestjs-zod'

async function bootstrap() {
  const logger = new Logger('Bootstrap')

  const adapter = new FastifyAdapter()
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  )
  app.useGlobalPipes(new ZodValidationPipe())

  const configService = app.get<ConfigService<EnvConfig>>(ConfigService)

  const port = configService.get('PORT')
  const url = `http://localhost:${port}`

  const document = SwaggerModule.createDocument(
    app,
    docsBuilder.addServer(url).build(),
  )

  app.use('/docs', docsOptions(document))

  await app.listen(port, '0.0.0.0').then(() => {
    console.clear()
    logger.log(
      `\n - Server running on ${url} \n - Access the documentation at ${url}/docs`,
    )
  })
}

bootstrap().catch((err) => {
  console.error(err)
  process.exit(1)
})
