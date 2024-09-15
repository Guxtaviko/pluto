import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from 'src/common/providers'
import { LinksRepository } from '../links.repository'
import { Link } from '@prisma/client'

describe('LinksRepository', () => {
  let repository: LinksRepository
  let prisma: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LinksRepository,
        {
          provide: PrismaService,
          useValue: {
            link: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile()

    repository = module.get<LinksRepository>(LinksRepository)
    prisma = module.get<PrismaService>(PrismaService)
  })

  it('should find a link by id', async () => {
    const link = {
      id: '1',
      url: 'http://example.com',
      shortUrl: 'exmpl',
      userId: 'user1',
      deletedAt: null,
    } as Link
    jest.spyOn(prisma.link, 'findUnique').mockResolvedValue(link)

    expect(await repository.findById('1')).toBe(link)
    expect(prisma.link.findUnique).toHaveBeenCalledWith({ where: { id: '1' } })
  })

  it('should find a link by shortUrl', async () => {
    const link = {
      id: '1',
      url: 'http://example.com',
      shortUrl: 'exmpl',
      userId: 'user1',
      deletedAt: null,
    } as Link
    jest.spyOn(prisma.link, 'findUnique').mockResolvedValue(link)

    expect(await repository.findByShortUrl('exmpl')).toBe(link)
    expect(prisma.link.findUnique).toHaveBeenCalledWith({
      where: { shortUrl: 'exmpl' },
    })
  })

  it('should find links by userId', async () => {
    const links = [
      {
        id: '1',
        url: 'http://example.com',
        shortUrl: 'exmpl',
        userId: 'user1',
        deletedAt: null,
      },
      {
        id: '2',
        url: 'http://example2.com',
        shortUrl: 'exmpl2',
        userId: 'user1',
        deletedAt: null,
      },
    ] as Link[]
    jest.spyOn(prisma.link, 'findMany').mockResolvedValue(links)

    expect(await repository.findByUserId('user1')).toBe(links)
    expect(prisma.link.findMany).toHaveBeenCalledWith({
      where: { userId: 'user1' },
    })
  })

  it('should create a new link', async () => {
    const link = {
      id: '1',
      url: 'http://example.com',
      shortUrl: 'exmpl',
      userId: 'user1',
      deletedAt: null,
    } as Link
    const data = {
      url: 'http://example.com',
      shortUrl: 'exmpl',
      userId: 'user1',
    }
    jest.spyOn(prisma.link, 'create').mockResolvedValue(link)

    expect(await repository.create(data)).toBe(link)
    expect(prisma.link.create).toHaveBeenCalledWith({ data })
  })

  it('should update a link', async () => {
    const link = {
      id: '1',
      url: 'http://example.com',
      shortUrl: 'exmpl',
      userId: 'user1',
      deletedAt: null,
    } as Link
    const data = { url: 'http://newexample.com' }
    jest.spyOn(prisma.link, 'update').mockResolvedValue(link)

    expect(await repository.update('1', data)).toBe(link)
    expect(prisma.link.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data,
    })
  })

  it('should delete a link', async () => {
    const link = {
      id: '1',
      url: 'http://example.com',
      shortUrl: 'exmpl',
      userId: 'user1',
      deletedAt: new Date(),
    } as Link
    jest.spyOn(prisma.link, 'update').mockResolvedValue(link)

    expect(await repository.delete('1')).toBe(link)
    expect(prisma.link.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { deletedAt: expect.any(Date) },
    })
  })
})
