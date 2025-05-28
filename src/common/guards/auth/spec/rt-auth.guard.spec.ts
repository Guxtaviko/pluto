import { RtAuthGuard } from '../rt-auth.guard'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from 'src/modules'
import { ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { z } from 'zod'
import { describe, it, expect, beforeEach, vi} from 'vitest'

describe('RtAuthGuard', () => {
  let rtAuthGuard: RtAuthGuard
  let jwtService: JwtService
  let configService: ConfigService<any>

  beforeEach(() => {
    jwtService = new JwtService({})
    configService = new ConfigService(z.object({}), {})
    rtAuthGuard = new RtAuthGuard(jwtService, configService)
  })

  describe('canActivate', () => {
    it('should return true if token is valid', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer validToken',
        },
      } as FastifyRequest & { token?: string; user?: any }

      const mockContext = {
        switchToHttp: vi.fn().mockReturnValue({
          getRequest: vi.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext

      vi.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ userId: 1 })
      vi.spyOn(configService, 'get').mockReturnValue('secret')

      const result = await rtAuthGuard.canActivate(mockContext)

      expect(result).toBe(true)
      expect(mockRequest.token).toBe('validToken')
      expect(mockRequest.user).toEqual({ userId: 1 })
    })

    it('should throw UnauthorizedException if token is invalid', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer invalidToken',
        },
      } as FastifyRequest

      const mockContext = {
        switchToHttp: vi.fn().mockReturnValue({
          getRequest: vi.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext

      vi
        .spyOn(jwtService, 'verifyAsync')
        .mockRejectedValue(new Error('Invalid token'))
      vi.spyOn(configService, 'get').mockReturnValue('secret')

      await expect(rtAuthGuard.canActivate(mockContext)).rejects.toThrow(
        UnauthorizedException,
      )
    })

    it('should throw UnauthorizedException if no token is provided', async () => {
      const mockRequest = {
        headers: {},
      } as FastifyRequest

      const mockContext = {
        switchToHttp: vi.fn().mockReturnValue({
          getRequest: vi.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext

      await expect(rtAuthGuard.canActivate(mockContext)).rejects.toThrow(
        UnauthorizedException,
      )
    })
  })
})
