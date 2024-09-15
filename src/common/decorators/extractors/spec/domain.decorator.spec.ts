import { domainDecorator } from '../domain.decorator'
import { ExecutionContext } from '@nestjs/common'
import { FastifyRequest } from 'fastify'

describe('Domain Decorator', () => {
  it('should return the correct domain', () => {
    const mockRequest = {
      hostname: 'example.com',
      protocol: 'https',
    } as FastifyRequest

    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext

    const result = domainDecorator(null, mockExecutionContext)
    expect(result).toBe('https://example.com')
  })

  it('should return the correct domain with http protocol', () => {
    const mockRequest = {
      hostname: 'example.com',
      protocol: 'http',
    } as FastifyRequest

    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext

    const result = domainDecorator(null, mockExecutionContext)
    expect(result).toBe('http://example.com')
  })
})
