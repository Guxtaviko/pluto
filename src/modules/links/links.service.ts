import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { ShorteningService } from 'src/common/providers'
import { LinksRepository } from 'src/repositories'
import { CreateLinkDto } from './dto/create-link-dto'
import { UpdateLinkDto } from './dto/update-link.dto'

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

  async createLink({ url }: CreateLinkDto, userId?: string) {
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

  async getLinks(userId: string, { page = 1, limit = 10 }) {
    const offset = (page - 1) * limit

    const links = await this.linksRepository.userLinks(userId, {
      offset,
      limit,
    })

    return links
  }

  async deleteLink(id: string, userId: string) {
    const link = await this.linksRepository.findById(id)
    if (!link) throw new NotFoundException('Link not found')

    if (link.userId !== userId) throw new ForbiddenException('Forbidden')

    const deletedLink = await this.linksRepository.delete(id)
    return deletedLink
  }

  async updateLink(id: string, { url }: UpdateLinkDto, userId?: string) {
    const link = await this.linksRepository.findById(id)
    if (!link) throw new NotFoundException('Link not found')

    if (link.userId !== userId) throw new ForbiddenException('Forbidden')

    const updatedLink = await this.linksRepository.update(id, { url })
    return updatedLink
  }
}
