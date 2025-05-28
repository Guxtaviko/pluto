import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from 'src/common/providers'
import { UsersRepository } from '../users.repository'
import { User } from '@prisma/client'
import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('UsersRepository', () => {
  let usersRepository: UsersRepository
  let prismaService: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: vi.fn(),
              create: vi.fn(),
              update: vi.fn(),
              delete: vi.fn(),
            },
          },
        },
      ],
    }).compile()

    usersRepository = module.get<UsersRepository>(UsersRepository)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  it('should be defined', () => {
    expect(usersRepository).toBeDefined()
  })

  describe('findById', () => {
    it('should return a user if found', async () => {
      const user = {
        id: '1',
        email: 'test@test.com',
        password: 'password',
        name: 'Test',
        rtHash: null,
      } as User
      vi.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user)

      expect(await usersRepository.findById('1')).toEqual(user)
    })

    it('should return null if user not found', async () => {
      vi.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null)

      expect(await usersRepository.findById('1')).toBeNull()
    })
  })

  describe('findByEmail', () => {
    it('should return a user if found', async () => {
      const user = {
        id: '1',
        email: 'test@test.com',
        password: 'password',
        name: 'Test',
        rtHash: null,
      } as User
      vi.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user)

      expect(await usersRepository.findByEmail('test@test.com')).toEqual(user)
    })

    it('should return null if user not found', async () => {
      vi.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null)

      expect(await usersRepository.findByEmail('test@test.com')).toBeNull()
    })
  })

  describe('create', () => {
    it('should create and return a user', async () => {
      const user = {
        id: '1',
        email: 'test@test.com',
        password: 'password',
        name: 'Test',
        rtHash: null,
      } as User
      vi.spyOn(prismaService.user, 'create').mockResolvedValue(user)

      expect(
        await usersRepository.create({
          email: 'test@test.com',
          password: 'password',
          name: 'Test',
        }),
      ).toEqual(user)
    })
  })

  describe('update', () => {
    it('should update and return a user', async () => {
      const user = {
        id: '1',
        email: 'test@test.com',
        password: 'password',
        name: 'Updated Test',
        rtHash: null,
      } as User
      vi.spyOn(prismaService.user, 'update').mockResolvedValue(user)

      expect(
        await usersRepository.update('1', { name: 'Updated Test' }),
      ).toEqual(user)
    })
  })

  describe('delete', () => {
    it('should delete and return a user', async () => {
      const user = {
        id: '1',
        email: 'test@test.com',
        password: 'password',
        name: 'Test',
        rtHash: null,
      } as User
      vi.spyOn(prismaService.user, 'update').mockResolvedValue(user)

      expect(await usersRepository.delete('1')).toEqual(user)
    })
  })

  describe('updateRtHash', () => {
    it('should update and return a user with rtHash', async () => {
      const user = {
        id: '1',
        email: 'test@test.com',
        password: 'password',
        name: 'Test',
        rtHash: 'newHash',
      } as User
      vi.spyOn(prismaService.user, 'update').mockResolvedValue(user)

      expect(await usersRepository.updateRtHash('1', 'newHash')).toEqual(user)
    })

    it('should update and return a user with null rtHash', async () => {
      const user = {
        id: '1',
        email: 'test@test.com',
        password: 'password',
        name: 'Test',
        rtHash: null,
      } as User
      vi.spyOn(prismaService.user, 'update').mockResolvedValue(user)

      expect(await usersRepository.updateRtHash('1', null)).toEqual(user)
    })
  })
})
