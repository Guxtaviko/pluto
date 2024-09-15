import { Injectable } from '@nestjs/common'
import { createHash } from 'node:crypto'
import { LinksRepository } from 'src/repositories'

@Injectable()
export class ShorteningService {
  private readonly SHORT_URL_LENGTH = 6
  constructor(private readonly linksRepository: LinksRepository) {}

  private convert(longUrl: string): string {
    if (!longUrl) throw new Error('Long URL is required')

    // use MD5 to hash the long url
    const digest = createHash('MD5').update(longUrl).digest('hex')

    return digest
  }

  async generateShortUrl(longUrl: string): Promise<string> {
    const hash = this.convert(longUrl)
    let counter = 0

    while (counter < hash.length - this.SHORT_URL_LENGTH) {
      const shortUrl = hash.substring(counter, counter + this.SHORT_URL_LENGTH)
      const link = await this.linksRepository.findByShortUrl(shortUrl)

      if (!link) return shortUrl

      counter++
    }

    return this.generateShortUrl(hash)
  }
}
