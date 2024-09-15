import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService, TokenExpiredError } from '@nestjs/jwt'
import { EnvConfig } from 'src/config'
import { ConfigService } from 'src/modules'
import { FastifyRequest } from 'fastify'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from 'src/common/decorators'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvConfig>,

    private readonly reflector: Reflector,
  ) {}

  private extractToken(request: FastifyRequest) {
    const header = request.headers?.authorization as string
    if (!header) return null

    const [bearer, token] = header.split(' ')
    if (bearer !== 'Bearer' || !token) return null

    return token
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    const request = context.switchToHttp().getRequest()
    const token = this.extractToken(request)

    if (!token) {
      if (isPublic) return true

      throw new UnauthorizedException('Unauthorized')
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      })

      request.user = payload
    } catch (err) {
      const hasExpired =
        err?.name === 'TokenExpiredError' || err instanceof TokenExpiredError

      if (!hasExpired) throw new UnauthorizedException('Unauthorized')

      const expiredAt = err?.expiredAt
        ? new Date(err.expiredAt).toLocaleString()
        : 'unknown'

      throw new HttpException(
        {
          message: `Token expired at ${expiredAt}`,
          error: 'TOKEN_EXPIRED',
          statusCode: 498,
        },
        498,
      )
    }

    return true
  }
}
