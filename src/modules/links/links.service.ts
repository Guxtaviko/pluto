import { Injectable, NotFoundException } from '@nestjs/common'
import { ShorteningService } from 'src/common/providers'
import { LinksRepository } from 'src/repositories'

@Injectable()
export class LinksService {
  constructor(
    private readonly shorteningService: ShorteningService,
    private readonly linksRepository: LinksRepository,
  ) {}

  async findByShortUrl(shortUrl: string) {
    const link = await this.linksRepository.findByShortUrl(shortUrl)

    return link
  }

  async createLink(url: string, userId?: string) {
    const shortUrl = await this.shorteningService.generateShortUrl(url)

    const link = await this.linksRepository.create({
      url,
      shortUrl,
      userId,
    })

    return link
  }

  async registerClick(id: string) {
    const exists = await this.linksRepository.findById(id)
    if (!exists) throw new NotFoundException('Link not found')

    await this.linksRepository.registerClick(id)
  }
}
