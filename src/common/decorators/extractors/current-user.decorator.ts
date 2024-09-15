import { createParamDecorator, ExecutionContext } from '@nestjs/common'

type CurrentUser = {
  sub: string
  email: string
}

export const CurrentUser = createParamDecorator(
  (data: keyof CurrentUser, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return data ? request.user[data] : request.user
  },
)
