import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { HashService } from 'src/common/providers'
import { EnvConfig } from 'src/config'
import { ConfigService } from '../global'
import { UsersService } from '../users/users.service'
import { LoginDto } from './dto/login-dto'
import { RegisterDto } from './dto/register-dto'

@Injectable()
export class AuthService {
  private readonly rtSecret: string
  private readonly rtExpiresIn: string

  constructor(
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvConfig>,
  ) {
    this.rtSecret = this.configService.get('JWT_RT_SECRET')
    this.rtExpiresIn = this.configService.get('JWT_RT_EXPIRES_IN')
  }

  private async userToToken(user: { id: string; email: string }) {
    const payload = { sub: user.id, email: user.email }

    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(payload),
      await this.jwtService.signAsync(payload, {
        secret: this.rtSecret,
        expiresIn: this.rtExpiresIn,
      }),
    ])

    await this.updateRtHash(user.id, refreshToken)

    const tokens = { access_token: accessToken, refresh_token: refreshToken }
    return tokens
  }

  async updateRtHash(id: string, refreshToken: string | null) {
    const rtHash = refreshToken
      ? await this.hashService.hash(refreshToken)
      : null

    return this.usersService.updateRtHash(id, rtHash)
  }

  async register(dto: RegisterDto) {
    const isEmailTaken = await this.usersService
      .getUserByEmail(dto.email)
      .then(Boolean)

    if (isEmailTaken) throw new BadRequestException('Email is already taken')

    const password = await this.hashService.hash(dto.password)

    const user = await this.usersService.createUser({ ...dto, password }, false)

    return user
  }

  async login({ email, password }: LoginDto) {
    const unauthorizedError = new UnauthorizedException('Invalid credentials')

    if (!email || !password) throw unauthorizedError

    const user = await this.usersService.getUserByEmail(email)
    if (!user) throw unauthorizedError

    const isPasswordValid = await this.hashService.compare({
      digest: password,
      hash: user.password,
    })

    if (!isPasswordValid) throw unauthorizedError

    return this.userToToken(user)
  }

  async logout(id: string) {
    return this.updateRtHash(id, null)
  }

  async refresh(id: string, rt: string) {
    const unauthorizedError = new UnauthorizedException('Invalid refresh token')
    const user = await this.usersService.getById(id)

    if (!user || !user.rtHash) throw unauthorizedError

    const isRtValid = await this.hashService.compare({
      digest: rt,
      hash: user.rtHash,
    })

    if (!isRtValid) throw unauthorizedError

    return this.userToToken(user)
  }
}
