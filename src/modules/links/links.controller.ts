import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { ApiQuery, ApiTags } from '@nestjs/swagger'
import { Auth, CurrentUser, Domain, Public } from 'src/common/decorators'
import { CreateLinkDto } from './dto/create-link-dto'
import { UpdateLinkDto } from './dto/update-link.dto'
import { LinksService } from './links.service'

@ApiTags('Links')
@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Auth()
  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getLinks(
    @CurrentUser('sub') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const links = await this.linksService.getLinks(userId, { page, limit })

    return links
  }

  @Public()
  @Auth()
  @Post()
  async createLink(
    @Body() { url }: CreateLinkDto,
    @Domain() domain: string,
    @CurrentUser('sub') userId?: string,
  ) {
    const { shortUrl } = await this.linksService.createLink({ url }, userId)

    return {
      shortUrl: `${domain}/${shortUrl}`,
    }
  }

  @Auth()
  @Put(':id')
  async updateLink(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() { url }: UpdateLinkDto,
  ) {
    return await this.linksService.updateLink(id, { url }, userId)
  }

  @Auth()
  @Delete(':id')
  async deleteLink(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
  ) {
    return await this.linksService.deleteLink(id, userId)
  }
}
