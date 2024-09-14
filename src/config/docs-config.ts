import { DocumentBuilder, OpenAPIObject } from '@nestjs/swagger'
import { patchNestJsSwagger } from 'nestjs-zod'
import { version } from '../../package.json'
import { apiReference } from '@scalar/nestjs-api-reference'

patchNestJsSwagger()

export const docsBuilder = new DocumentBuilder()
  .setTitle('Pluto API')
  .setDescription('Pluto is a URL shortener service')
  .setVersion(version)
  .addBearerAuth()

export const docsOptions = (document: OpenAPIObject) =>
  apiReference({
    theme: 'kepler',
    withFastify: true,
    spec: {
      content: document,
    },
  })
