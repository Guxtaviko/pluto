import { Link } from '@prisma/client'

export abstract class LinksContract {
  abstract findById(id: string): Promise<Link | null>

  abstract findByShortUrl(shortUrl: string): Promise<Link | null>

  abstract findByUserId(userId: string): Promise<Link[]>

  abstract create(data: { url: string; userId?: string }): Promise<Link>

  abstract update(id: string, data: { url?: string }): Promise<Link>

  abstract delete(id: string): Promise<Link>

  abstract registerClick(id: string): Promise<void>

  abstract userLinks(
    userId: string,
    filters: {
      limit?: number
      offset?: number
    },
  ): Promise<Link[]>
}
