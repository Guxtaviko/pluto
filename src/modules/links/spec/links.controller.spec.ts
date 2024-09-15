import { Test, TestingModule } from '@nestjs/testing'
import { Link } from '@prisma/client'
import { CreateLinkDto } from '../dto/create-link-dto'
import { UpdateLinkDto } from '../dto/update-link.dto'
import { LinksController } from '../links.controller'
import { LinksService } from '../links.service'

// Mock the decorators
jest.mock('src/common/decorators', () => ({
  ...jest.requireActual('src/common/decorators'),
  Auth: jest.fn(() => (target: any, key: string | symbol, index: number) => {
    const metadataKey = `__custom_decorator_${String(key)}_${index}`
    Reflect.defineMetadata(metadataKey, 'mockedUser', target)
  }),
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

describe('LinksController', () => {
  let controller: LinksController
  let service: LinksService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LinksController],
      providers: [
        {
          provide: LinksService,
          useValue: {
            getLinks: jest.fn(),
            createLink: jest.fn(),
            updateLink: jest.fn(),
            deleteLink: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<LinksController>(LinksController)
    service = module.get<LinksService>(LinksService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('getLinks', () => {
    it('should return an array of links', async () => {
      const result = ['test']
      jest
        .spyOn(service, 'getLinks')
        .mockResolvedValue(result as unknown as Link[])

      expect(await controller.getLinks('userId')).toBe(result)
    })
  })

  describe('createLink', () => {
    it('should return a shortUrl', async () => {
      const result = { shortUrl: 'shortUrl' }
      jest.spyOn(service, 'createLink').mockResolvedValue(result as Link)

      expect(
        await controller.createLink(
          { url: 'test' } as CreateLinkDto,
          'domain',
          'userId',
        ),
      ).toEqual({
        shortUrl: 'domain/shortUrl',
      })
    })
  })

  describe('updateLink', () => {
    it('should return the updated link', async () => {
      const result = { url: 'updatedUrl' }
      jest.spyOn(service, 'updateLink').mockResolvedValue(result as Link)

      expect(
        await controller.updateLink('userId', 'id', {
          url: 'updatedUrl',
        } as UpdateLinkDto),
      ).toBe(result)
    })
  })

  describe('deleteLink', () => {
    it('should return the deleted link', async () => {
      const result = { id: 'id' }
      jest.spyOn(service, 'deleteLink').mockResolvedValue(result as Link)

      expect(await controller.deleteLink('userId', 'id')).toBe(result)
    })
  })
})
