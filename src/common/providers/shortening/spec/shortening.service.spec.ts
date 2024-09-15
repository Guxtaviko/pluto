import { Test, TestingModule } from '@nestjs/testing'
import { ShorteningService } from '../shortening.service'
import { LinksRepository } from 'src/repositories'
import { Link } from '@prisma/client'

describe('ShorteningService', () => {
  let service: ShorteningService
  let linksRepository: LinksRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShorteningService,
        {
          provide: LinksRepository,
          useValue: {
            findByShortUrl: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<ShorteningService>(ShorteningService)
    linksRepository = module.get<LinksRepository>(LinksRepository)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('convert', () => {
    it('should throw an error if longUrl is not provided', () => {
      expect(() => service['convert']('')).toThrow('Long URL is required')
    })

    it('should return a hash of the longUrl', () => {
      const longUrl = 'https://example.com'
      const hash = service['convert'](longUrl)
      expect(hash).toHaveLength(32)
    })
  })

  describe('generateShortUrl', () => {
    it('should generate a short URL', async () => {
      const longUrl = 'https://example.com'
      jest.spyOn(linksRepository, 'findByShortUrl').mockResolvedValue(null)

      const shortUrl = await service.generateShortUrl(longUrl)
      expect(shortUrl).toHaveLength(service['SHORT_URL_LENGTH'])
    })

    it('should retry if short URL already exists', async () => {
      const longUrl = 'https://example.com'
      jest
        .spyOn(linksRepository, 'findByShortUrl')
        .mockResolvedValueOnce({ shortUrl: 'exists' } as Link)
        .mockResolvedValue(null)

      const shortUrl = await service.generateShortUrl(longUrl)
      expect(shortUrl).toHaveLength(service['SHORT_URL_LENGTH'])
    })
  })
})
