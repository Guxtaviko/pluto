import { ExecutionContext } from '@nestjs/common'
import { refreshTokenDecorator } from '../refresh-token.decorator'

describe('RefreshToken Decorator', () => {
  let mockExecutionContext: Partial<ExecutionContext>

  beforeEach(() => {
    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
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
    mockExecutionContext.switchToHttp = jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({}),
    })

    const result = refreshTokenDecorator(
      null,
      mockExecutionContext as ExecutionContext,
    )
    expect(result).toBeUndefined()
  })
})
