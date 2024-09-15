import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { Auth, CurrentUser } from 'src/common/decorators'

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Auth()
  @Get('me')
  async me(@CurrentUser('sub') id: string) {
    return this.usersService.getById(id)
  }
}
