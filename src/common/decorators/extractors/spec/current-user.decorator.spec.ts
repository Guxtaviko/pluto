import { ExecutionContext } from '@nestjs/common'
import { CurrentUser, currentUserDecorator } from '../current-user.decorator'
import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('CurrentUser Decorator', () => {
  let mockExecutionContext: ExecutionContext

  beforeEach(() => {
    mockExecutionContext = {
      switchToHttp: vi.fn().mockReturnValue({
        getRequest: vi.fn().mockReturnValue({
          user: {
            sub: '123',
            email: 'test@example.com',
          },
        }),
      }),
    } as unknown as ExecutionContext
  })

  it('should return the entire user object if no data key is provided', () => {
    const result = currentUserDecorator(null, mockExecutionContext)
    expect(result).toEqual({
      sub: '123',
      email: 'test@example.com',
    })
  })

  it('should return the specific user property if data key is provided', () => {
    const result = currentUserDecorator('email', mockExecutionContext)
    expect(result).toBe('test@example.com')
  })

  it('should return undefined if the user property does not exist', () => {
    const result = currentUserDecorator(
      'nonexistent' as unknown as keyof CurrentUser,
      mockExecutionContext,
    )
    expect(result).toBeUndefined()
  })
})
