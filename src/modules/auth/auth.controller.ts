import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register-dto'
import { User } from '@prisma/client'
import { RtAuth } from 'src/common/decorators/auth/rt-auth.decorator'
import { CurrentUser, RefreshToken } from 'src/common/decorators'

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<User> {
    return this.authService.register(dto)
  }

  @Post('login')
  async login(
    @Body() dto: RegisterDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    return this.authService.login(dto)
  }

  @RtAuth()
  @Post('refresh')
  async refresh(
    @CurrentUser('sub') userId: string,
    @RefreshToken() refreshToken: string,
  ) {
    return this.authService.refresh(userId, refreshToken)
  }
}
