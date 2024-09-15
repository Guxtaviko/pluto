import { Test, TestingModule } from '@nestjs/testing'
import { User } from '@prisma/client'
import { AuthController } from '../auth.controller'
import { AuthService } from '../auth.service'
import { RegisterDto } from '../dto/register-dto'

describe('AuthController', () => {
  let authController: AuthController
  let authService: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile()

    authController = module.get<AuthController>(AuthController)
    authService = module.get<AuthService>(AuthService)
  })

  describe('register', () => {
    it('should register a user', async () => {
      const dto: RegisterDto = {
        email: 'test@example.com',
        password: 'password',
      }
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedpassword',
      } as User
      jest.spyOn(authService, 'register').mockResolvedValue(user)

      expect(await authController.register(dto)).toBe(user)
      expect(authService.register).toHaveBeenCalledWith(dto)
    })
  })

  describe('login', () => {
    it('should login a user', async () => {
      const dto: RegisterDto = {
        email: 'test@example.com',
        password: 'password',
      }
      const tokens = {
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      }
      jest.spyOn(authService, 'login').mockResolvedValue(tokens)

      expect(await authController.login(dto)).toBe(tokens)
      expect(authService.login).toHaveBeenCalledWith(dto)
    })
  })
})
