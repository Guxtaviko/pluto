import { Module } from '@nestjs/common'
import { PrismaService, ShorteningService } from 'src/common/providers'
import { LinksRepository } from 'src/repositories'
import { LinksController } from './links.controller'
import { LinksService } from './links.service'

@Module({
  controllers: [LinksController],
  providers: [LinksService, ShorteningService, LinksRepository, PrismaService],
  exports: [LinksService],
})
export class LinksModule {}
