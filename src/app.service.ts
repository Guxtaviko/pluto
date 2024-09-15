import { Injectable, NotFoundException } from '@nestjs/common'
import { LinksService } from './modules/links/links.service'

@Injectable()
export class AppService {
  constructor(private readonly linksService: LinksService) {}

  async redirect(shortUrl: string): Promise<string> {
    const link = await this.linksService.findByShortUrl(shortUrl)
    if (!link || link?.deletedAt) throw new NotFoundException('Link not found')

    await this.linksService.registerClick(link.id)

    return link.url
  }
}
