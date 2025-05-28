import { Test, TestingModule } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import { AuthService } from '../auth.service'
import { UsersService } from '../../users/users.service'
import { HashService } from 'src/common/providers'
import { ConfigService } from '../../global'
import { BadRequestException, UnauthorizedException } from '@nestjs/common'
import { RegisterDto } from '../dto/register-dto'
import { LoginDto } from '../dto/login-dto'
import { EnvConfig } from 'src/config'
import { User } from '@prisma/client'
import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('AuthService', () => {
  let authService: AuthService
  let usersService: UsersService
  let hashService: HashService
  let jwtService: JwtService
  let configService: ConfigService<EnvConfig>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            getUserByEmail: vi.fn(),
            createUser: vi.fn(),
            updateRtHash: vi.fn(),
            getById: vi.fn(),
          },
        },
        {
          provide: HashService,
          useValue: {
            hash: vi.fn(),
            compare: vi.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: vi.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: vi.fn(),
          },
        },
      ],
    }).compile()

    authService = module.get<AuthService>(AuthService)
    usersService = module.get<UsersService>(UsersService)
    hashService = module.get<HashService>(HashService)
    jwtService = module.get<JwtService>(JwtService)
    configService = module.get<ConfigService<EnvConfig>>(ConfigService)

    vi.spyOn(configService, 'get').mockImplementation((key: string) => {
      if (key === 'JWT_RT_SECRET') return 'testRtSecret'
      if (key === 'JWT_RT_EXPIRES_IN') return '3600s'

      return ''
    })
  })

  describe('register', () => {
    it('should throw an error if email is already taken', async () => {
      vi.spyOn(usersService, 'getUserByEmail').mockResolvedValueOnce({
        id: '1',
      } as User)

      const dto: RegisterDto = { email: 'test@test.com', password: 'password' }

      await expect(authService.register(dto)).rejects.toThrow(
        BadRequestException,
      )
    })

    it('should create a new user', async () => {
      vi.spyOn(usersService, 'getUserByEmail').mockResolvedValueOnce(null)
      vi.spyOn(hashService, 'hash').mockResolvedValueOnce('hashedPassword')
      vi
        .spyOn(usersService, 'createUser')
        .mockResolvedValueOnce({ id: '1', email: 'test@test.com' } as User)

      const dto: RegisterDto = { email: 'test@test.com', password: 'password' }

      const result = await authService.register(dto)

      expect(result).toEqual({ id: '1', email: 'test@test.com' })
    })
  })

  describe('login', () => {
    it('should throw an error if credentials are invalid', async () => {
      vi.spyOn(usersService, 'getUserByEmail').mockResolvedValueOnce(null)

      const dto: LoginDto = { email: 'test@test.com', password: 'password' }

      await expect(authService.login(dto)).rejects.toThrow(
        UnauthorizedException,
      )
    })

    it('should return tokens if credentials are valid', async () => {
      const user = {
        id: '1',
        email: 'test@test.com',
        password: 'hashedPassword',
      }
      vi
        .spyOn(usersService, 'getUserByEmail')
        .mockResolvedValueOnce(user as User)
      vi.spyOn(hashService, 'compare').mockResolvedValueOnce(true)
      vi
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValueOnce('accessToken')
        .mockResolvedValueOnce('refreshToken')
      vi
        .spyOn(authService, 'updateRtHash')
        .mockResolvedValueOnce(null as unknown as User)

      const dto: LoginDto = { email: 'test@test.com', password: 'password' }

      const result = await authService.login(dto)

      expect(result).toEqual({
        access_token: 'accessToken',
        refresh_token: 'refreshToken',
      })
    })
  })

  describe('logout', () => {
    it('should update refresh token hash to null', async () => {
      vi
        .spyOn(authService, 'updateRtHash')
        .mockResolvedValueOnce(null as unknown as User)

      const result = await authService.logout('1')

      expect(result).toBeNull()
    })
  })

  describe('refresh', () => {
    it('should throw an error if refresh token is invalid', async () => {
      vi.spyOn(usersService, 'getById').mockResolvedValueOnce(null)

      await expect(authService.refresh('1', 'invalidToken')).rejects.toThrow(
        UnauthorizedException,
      )
    })

    it('should return new tokens if refresh token is valid', async () => {
      const user = { id: '1', email: 'test@test.com', rtHash: 'hashedRt' }
      vi.spyOn(usersService, 'getById').mockResolvedValueOnce(user as User)
      vi.spyOn(hashService, 'compare').mockResolvedValueOnce(true)
      vi
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValueOnce('newAccessToken')
        .mockResolvedValueOnce('newRefreshToken')
      vi
        .spyOn(authService, 'updateRtHash')
        .mockResolvedValueOnce(null as unknown as User)

      const result = await authService.refresh('1', 'validToken')

      expect(result).toEqual({
        access_token: 'newAccessToken',
        refresh_token: 'newRefreshToken',
      })
    })
  })
})
