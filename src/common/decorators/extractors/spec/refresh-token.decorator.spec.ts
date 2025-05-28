import { ExecutionContext } from '@nestjs/common'
import { refreshTokenDecorator } from '../refresh-token.decorator'
import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('RefreshToken Decorator', () => {
  let mockExecutionContext: Partial<ExecutionContext>

  beforeEach(() => {
    mockExecutionContext = {
      switchToHttp: vi.fn().mockReturnValue({
        getRequest: vi.fn().mockReturnValue({
          token: 'mockRefreshToken',
        }),
      }),
    }
  })

  it('should extract the refresh token from the request', () => {
    const result = refreshTokenDecorator(
      null,
      mockExecutionContext as ExecutionContext,
    )
    expect(result).toBe('mockRefreshToken')
  })

  it('should return undefined if there is no token in the request', () => {
    mockExecutionContext.switchToHttp = vi.fn().mockReturnValue({
      getRequest: vi.fn().mockReturnValue({}),
    })

    const result = refreshTokenDecorator(
      null,
      mockExecutionContext as ExecutionContext,
    )
    expect(result).toBeUndefined()
  })
})
