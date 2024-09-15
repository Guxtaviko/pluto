import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiBearer, CurrentUser, Domain } from 'src/common/decorators'
import { CreateLinkDto } from './dto/create-link-dto'
import { LinksService } from './links.service'

@ApiTags('Links')
@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @ApiBearer()
  @Post()
  async createLink(
    @Body() { url }: CreateLinkDto,
    @Domain() domain: string,
    @CurrentUser('sub') userId?: string,
  ) {
    const { shortUrl } = await this.linksService.createLink(url, userId)

    return {
      shortUrl: `${domain}/${shortUrl}`,
    }
  }
}
