import { Injectable } from '@nestjs/common'
import { LinksContract } from './links.contract'
import { PrismaService } from 'src/common/providers'
import { Link } from '@prisma/client'

@Injectable()
export class LinksRepository implements LinksContract {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Link | null> {
    return this.prisma.link.findUnique({
      where: {
        id,
      },
    })
  }

  async findByShortUrl(shortUrl: string): Promise<Link | null> {
    return this.prisma.link.findUnique({
      where: {
        shortUrl,
      },
    })
  }

  async findByUserId(userId: string): Promise<Link[]> {
    return this.prisma.link.findMany({
      where: {
        userId,
      },
    })
  }

  async create(data: {
    url: string
    shortUrl: string
    userId?: string
  }): Promise<Link> {
    return this.prisma.link.create({
      data: {
        url: data.url,
        shortUrl: data.shortUrl,
        userId: data.userId,
      },
    })
  }

  async update(id: string, data: { url?: string }): Promise<Link> {
    return this.prisma.link.update({
      where: {
        id,
      },
      data,
    })
  }

  async delete(id: string): Promise<Link> {
    return this.prisma.link.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    })
  }

  async registerClick(id: string): Promise<void> {
    await this.prisma.link.update({
      where: {
        id,
      },
      data: {
        clicks: {
          increment: 1,
        },
      },
    })
  }

  async userLinks(
    userId: string,
    {
      limit,
      offset,
    }: {
      limit?: number
      offset?: number
    },
  ): Promise<Link[]> {
    return this.prisma.link.findMany({
      where: {
        userId,
      },
      take: limit,
      skip: offset,
    })
  }
}
