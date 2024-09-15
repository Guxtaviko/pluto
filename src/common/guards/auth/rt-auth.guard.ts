import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { EnvConfig } from 'src/config'
import { ConfigService } from 'src/modules'
import { FastifyRequest } from 'fastify'

@Injectable()
export class RtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvConfig>,
  ) {}

  private extractToken(request: FastifyRequest) {
    const header = request.headers?.authorization as string
    if (!header) return null

    const [bearer, token] = header.split(' ')
    if (bearer !== 'Bearer' || !token) return null

    return token
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const token = this.extractToken(request)
    if (!token) throw new UnauthorizedException('Unauthorized')

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      })

      request.token = token
      request.user = payload
    } catch (error) {
      throw new UnauthorizedException('Unauthorized')
    }

    return true
  }
}
