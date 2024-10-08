import { AuthGuard } from '../auth.guard'
import {
  ExecutionContext,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common'
import { JwtService, TokenExpiredError } from '@nestjs/jwt'
import { ConfigService } from 'src/modules'
import { FastifyRequest } from 'fastify'
import { z } from 'zod'
import { EnvConfig } from 'src/config'
import { Reflector } from '@nestjs/core'

describe('AuthGuard', () => {
  let authGuard: AuthGuard
  let jwtService: JwtService
  let configService: ConfigService<any>
  let reflector: Reflector

  beforeEach(() => {
    jwtService = new JwtService({})
    configService = new ConfigService(z.object({}), {})
    reflector = new Reflector()
    authGuard = new AuthGuard(
      jwtService,
      configService as ConfigService<EnvConfig>,
      reflector,
    )
  })

  it('should return true if route is public', async () => {
    const mockRequest = {
      headers: {},
    } as FastifyRequest

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true)

    const result = await authGuard.canActivate(mockContext)
    expect(result).toBe(true)
  })

  it('should return true if token is valid', async () => {
    const mockRequest = {
      headers: {
        authorization: 'Bearer validToken',
      },
      user: null,
    } as unknown as FastifyRequest & { user: any }

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false)
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ userId: 1 })
    jest.spyOn(configService, 'get').mockReturnValue('secret')

    const result = await authGuard.canActivate(mockContext)
    expect(result).toBe(true)
    expect(mockRequest.user).toEqual({ userId: 1 })
  })

  it('should throw UnauthorizedException if token is missing', async () => {
    const mockRequest = {
      headers: {},
    } as FastifyRequest

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false)

    await expect(authGuard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    )
  })

  it('should throw UnauthorizedException if token is invalid', async () => {
    const mockRequest = {
      headers: {
        authorization: 'Bearer invalidToken',
      },
    } as FastifyRequest

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false)
    jest
      .spyOn(jwtService, 'verifyAsync')
      .mockRejectedValue(new Error('Invalid token'))
    jest.spyOn(configService, 'get').mockReturnValue('secret')

    await expect(authGuard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    )
  })

  it('should throw HttpException if token is expired', async () => {
    const mockRequest = {
      headers: {
        authorization: 'Bearer expiredToken',
      },
    } as FastifyRequest

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext

    const tokenExpiredError = new TokenExpiredError('jwt expired', new Date())
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false)
    jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue(tokenExpiredError)
    jest.spyOn(configService, 'get').mockReturnValue('secret')

    await expect(authGuard.canActivate(mockContext)).rejects.toThrow(
      HttpException,
    )
  })
})
