import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const refreshTokenDecorator = (data: null, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()

  return request.token
}

export const RefreshToken = createParamDecorator(refreshTokenDecorator)
