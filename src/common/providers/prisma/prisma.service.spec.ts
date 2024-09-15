import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from './prisma.service'

describe('PrismaService', () => {
  let service: PrismaService
  let prismaClientMock: {
    $connect: jest.Mock
    $disconnect: jest.Mock
  }

  beforeEach(async () => {
    prismaClientMock = {
      $connect: jest.fn(),
      $disconnect: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: {
            ...prismaClientMock,
            onModuleInit: PrismaService.prototype.onModuleInit,
            onModuleDestroy: PrismaService.prototype.onModuleDestroy,
            logger: {
              error: jest.fn(),
            },
          },
        },
      ],
    }).compile()

    service = module.get<PrismaService>(PrismaService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should call $connect on onModuleInit', async () => {
    prismaClientMock.$connect.mockResolvedValueOnce('Connected')

    await service.onModuleInit()
    expect(prismaClientMock.$connect).toHaveBeenCalled()
  })

  it('should throw error if $connect fails on onModuleInit', async () => {
    const error = new Error('Connection error')
    prismaClientMock.$connect.mockRejectedValue(error)

    await expect(service.onModuleInit()).rejects.toThrow(error)
  })

  it('should call $disconnect on onModuleDestroy', async () => {
    prismaClientMock.$disconnect.mockResolvedValueOnce('Disconnected')

    await service.onModuleDestroy()
    expect(prismaClientMock.$disconnect).toHaveBeenCalled()
  })

  it('should throw error if $disconnect fails on onModuleDestroy', async () => {
    const error = new Error('Disconnection error')
    prismaClientMock.$disconnect.mockRejectedValue(error)

    await expect(service.onModuleDestroy()).rejects.toThrow(error)
  })
})
