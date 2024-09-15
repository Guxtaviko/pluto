import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from '../users.controller'
import { UsersService } from '../users.service'
import { AuthGuard } from 'src/common/guards'

// Mock the decorators
jest.mock('src/common/decorators', () => ({
  ...jest.requireActual('src/common/decorators'),
  CurrentUser: jest.fn(
    () => (target: any, key: string | symbol, index: number) => {
      const metadataKey = `__custom_decorator_${String(key)}_${index}`
      Reflect.defineMetadata(metadataKey, 'mockedUser', target)
    },
  ),
  RefreshToken: jest.fn(
    () => (target: any, key: string | symbol, index: number) => {
      const metadataKey = `__custom_decorator_${String(key)}_${index}`
      Reflect.defineMetadata(metadataKey, 'mockedRefreshToken', target)
    },
  ),
}))

describe('UsersController', () => {
  let controller: UsersController
  let service: UsersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getById: jest
              .fn()
              .mockResolvedValue({ id: '1', name: 'Test User' }),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile()

    controller = module.get<UsersController>(UsersController)
    service = module.get<UsersService>(UsersService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('me', () => {
    it('should return user data', async () => {
      const result = await controller.me('1')
      expect(result).toEqual({ id: '1', name: 'Test User' })
      expect(service.getById).toHaveBeenCalledWith('1')
    })
  })
})
