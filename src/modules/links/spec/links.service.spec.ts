import { NotFoundException, ForbiddenException } from '@nestjs/common'
import { ShorteningService } from 'src/common/providers'
import { LinksRepository } from 'src/repositories'
import { LinksService } from '../links.service'

describe('LinksService', () => {
  let linksService: LinksService
  let linksRepository: LinksRepository
  let shorteningService: ShorteningService

  beforeEach(() => {
    linksRepository = {
      findByShortUrl: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      registerClick: jest.fn(),
      userLinks: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    } as any
    shorteningService = {
      generateShortUrl: jest.fn(),
    } as any
    linksService = new LinksService(shorteningService, linksRepository)
  })

  describe('findByShortUrl', () => {
    it('should return a link', async () => {
      const shortUrl = 'shortUrl'
      const link = { id: '1', url: 'http://example.com', shortUrl }
      ;(linksRepository.findByShortUrl as jest.Mock).mockResolvedValue(link)

      const result = await linksService.findByShortUrl(shortUrl)
      expect(result).toEqual(link)
      expect(linksRepository.findByShortUrl).toHaveBeenCalledWith(shortUrl)
    })
  })

  describe('createLink', () => {
    it('should create and return a link', async () => {
      const url = 'http://example.com'
      const shortUrl = 'shortUrl'
      const userId = 'userId'
      const link = { id: '1', url, shortUrl, userId }
      ;(shorteningService.generateShortUrl as jest.Mock).mockResolvedValue(
        shortUrl,
      )
      ;(linksRepository.create as jest.Mock).mockResolvedValue(link)

      const result = await linksService.createLink({ url }, userId)
      expect(result).toEqual(link)
      expect(shorteningService.generateShortUrl).toHaveBeenCalledWith(url)
      expect(linksRepository.create).toHaveBeenCalledWith({
        url,
        shortUrl,
        userId,
      })
    })
  })

  describe('registerClick', () => {
    it('should register a click', async () => {
      const id = '1'
      ;(linksRepository.findById as jest.Mock).mockResolvedValue(true)

      await linksService.registerClick(id)
      expect(linksRepository.findById).toHaveBeenCalledWith(id)
      expect(linksRepository.registerClick).toHaveBeenCalledWith(id)
    })

    it('should throw NotFoundException if link does not exist', async () => {
      const id = '1'
      ;(linksRepository.findById as jest.Mock).mockResolvedValue(null)

      await expect(linksService.registerClick(id)).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe('getLinks', () => {
    it('should return user links', async () => {
      const userId = 'userId'
      const links = [
        { id: '1', url: 'http://example.com', shortUrl: 'shortUrl', userId },
      ]
      ;(linksRepository.userLinks as jest.Mock).mockResolvedValue(links)

      const result = await linksService.getLinks(userId, { page: 1, limit: 10 })
      expect(result).toEqual(links)
      expect(linksRepository.userLinks).toHaveBeenCalledWith(userId, {
        offset: 0,
        limit: 10,
      })
    })
  })

  describe('deleteLink', () => {
    it('should delete a link', async () => {
      const id = '1'
      const userId = 'userId'
      const link = {
        id,
        url: 'http://example.com',
        shortUrl: 'shortUrl',
        userId,
      }
      ;(linksRepository.findById as jest.Mock).mockResolvedValue(link)
      ;(linksRepository.delete as jest.Mock).mockResolvedValue(link)

      const result = await linksService.deleteLink(id, userId)
      expect(result).toEqual(link)
      expect(linksRepository.findById).toHaveBeenCalledWith(id)
      expect(linksRepository.delete).toHaveBeenCalledWith(id)
    })

    it('should throw NotFoundException if link does not exist', async () => {
      const id = '1'
      const userId = 'userId'
      ;(linksRepository.findById as jest.Mock).mockResolvedValue(null)

      await expect(linksService.deleteLink(id, userId)).rejects.toThrow(
        NotFoundException,
      )
    })

    it('should throw ForbiddenException if user is not the owner', async () => {
      const id = '1'
      const userId = 'userId'
      const link = {
        id,
        url: 'http://example.com',
        shortUrl: 'shortUrl',
        userId: 'otherUserId',
      }
      ;(linksRepository.findById as jest.Mock).mockResolvedValue(link)

      await expect(linksService.deleteLink(id, userId)).rejects.toThrow(
        ForbiddenException,
      )
    })
  })

  describe('updateLink', () => {
    it('should update and return a link', async () => {
      const id = '1'
      const url = 'http://newexample.com'
      const userId = 'userId'
      const link = {
        id,
        url: 'http://example.com',
        shortUrl: 'shortUrl',
        userId,
      }
      const updatedLink = { ...link, url }
      ;(linksRepository.findById as jest.Mock).mockResolvedValue(link)
      ;(linksRepository.update as jest.Mock).mockResolvedValue(updatedLink)

      const result = await linksService.updateLink(id, { url }, userId)
      expect(result).toEqual(updatedLink)
      expect(linksRepository.findById).toHaveBeenCalledWith(id)
      expect(linksRepository.update).toHaveBeenCalledWith(id, { url })
    })

    it('should throw NotFoundException if link does not exist', async () => {
      const id = '1'
      const url = 'http://newexample.com'
      const userId = 'userId'
      ;(linksRepository.findById as jest.Mock).mockResolvedValue(null)

      await expect(
        linksService.updateLink(id, { url }, userId),
      ).rejects.toThrow(NotFoundException)
    })

    it('should throw ForbiddenException if user is not the owner', async () => {
      const id = '1'
      const url = 'http://newexample.com'
      const userId = 'userId'
      const link = {
        id,
        url: 'http://example.com',
        shortUrl: 'shortUrl',
        userId: 'otherUserId',
      }
      ;(linksRepository.findById as jest.Mock).mockResolvedValue(link)

      await expect(
        linksService.updateLink(id, { url }, userId),
      ).rejects.toThrow(ForbiddenException)
    })
  })
})
