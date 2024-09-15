import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from './public.decorator'
import { applyDecorators } from '@nestjs/common'
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger'

export const ApiBearer =
  () => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const reflector = new Reflector()

    const isPublic = reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      descriptor.value,
      target,
    ])

    if (isPublic) return

    applyDecorators(
      ApiBearerAuth(),
      ApiUnauthorizedResponse({
        description: 'Unauthorized',
      }),
    )(target, propertyKey, descriptor)
  }
