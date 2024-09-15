import { Controller, Get, Param, Response } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AppService } from './app.service'
import { FastifyReply } from 'fastify'

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':shortUrl')
  async redirect(
    @Response() res: FastifyReply,
    @Param('shortUrl') shortUrl: string,
  ) {
    const url = await this.appService.redirect(shortUrl)
    res.redirect(url, 302)
  }
}
