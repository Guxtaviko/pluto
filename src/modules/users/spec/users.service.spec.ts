import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from '../users.service'
import { UsersRepository } from 'src/repositories'
import { HashService } from 'src/common/providers'
import { NotFoundException } from '@nestjs/common'
import { CreateUserDto } from '../dto/create-user-dto'
import { User } from '@prisma/client'
import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('UsersService', () => {
  let service: UsersService
  let usersRepository: UsersRepository
  let hashService: HashService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            findById: vi.fn(),
            findByEmail: vi.fn(),
            create: vi.fn(),
            delete: vi.fn(),
            updateRtHash: vi.fn(),
          },
        },
        {
          provide: HashService,
          useValue: {
            hash: vi.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
    usersRepository = module.get<UsersRepository>(UsersRepository)
    hashService = module.get<HashService>(HashService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getById', () => {
    it('should return a user by id', async () => {
      const user = { id: '1', email: 'test@test.com' }
      vi.spyOn(usersRepository, 'findById').mockResolvedValue(user as User)

      expect(await service.getById('1')).toEqual(user)
    })
  })

  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      const user = { id: '1', email: 'test@test.com' }
      vi.spyOn(usersRepository, 'findByEmail').mockResolvedValue(user as User)

      expect(await service.getUserByEmail('test@test.com')).toEqual(user)
    })
  })

  describe('createUser', () => {
    it('should create a new user with hashed password', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@test.com',
        password: 'password',
      }
      const hashedPassword = 'hashedPassword'
      const newUser = { id: '1', ...createUserDto, password: hashedPassword }

      vi.spyOn(hashService, 'hash').mockResolvedValue(hashedPassword)
      vi.spyOn(usersRepository, 'create').mockResolvedValue(newUser as User)

      expect(await service.createUser(createUserDto)).toEqual(newUser)
    })

    it('should create a new user without hashing password', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@test.com',
        password: 'password',
      }
      const newUser = { id: '1', ...createUserDto }

      vi.spyOn(usersRepository, 'create').mockResolvedValue(newUser as User)

      expect(await service.createUser(createUserDto, false)).toEqual(newUser)
    })
  })

  describe('deleteUser', () => {
    it('should delete a user by id', async () => {
      const user = { id: '1', email: 'test@test.com' }

      vi.spyOn(usersRepository, 'findById').mockResolvedValue(user as User)
      vi.spyOn(usersRepository, 'delete').mockResolvedValue(user as User)

      expect(await service.deleteUser('1')).toEqual(user)
    })

    it('should throw NotFoundException if user does not exist', async () => {
      vi.spyOn(usersRepository, 'findById').mockResolvedValue(null)

      await expect(service.deleteUser('1')).rejects.toThrow(NotFoundException)
    })
  })

  describe('updateRtHash', () => {
    it('should update the refresh token hash', async () => {
      const id = '1'
      const rtHash = 'newHash'
      const updatedUser = { id, rtHash }

      vi
        .spyOn(usersRepository, 'updateRtHash')
        .mockResolvedValue(updatedUser as User)

      expect(await service.updateRtHash(id, rtHash)).toEqual(updatedUser)
    })
  })
})
