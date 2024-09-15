import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { FastifyRequest } from 'fastify'

export const Domain = createParamDecorator(
  (data: null, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as FastifyRequest
    const hostname = request.hostname
    const protocol = request.protocol

    return `${protocol}://${hostname}`
  },
)
