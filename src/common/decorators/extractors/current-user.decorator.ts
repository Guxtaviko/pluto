import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export type CurrentUser = {
  sub: string
  email: string
}

export const currentUserDecorator = (
  data: keyof CurrentUser | null,
  ctx: ExecutionContext,
) => {
  const request = ctx.switchToHttp().getRequest()
  return data ? request.user?.[data] : request.user
}

export const CurrentUser = createParamDecorator(currentUserDecorator)
