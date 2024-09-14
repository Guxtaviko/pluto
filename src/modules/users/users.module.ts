import { Module } from '@nestjs/common'
import { HashService, PrismaService } from 'src/common/providers'
import { UsersRepository } from 'src/repositories'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, PrismaService, HashService],
  exports: [UsersService],
})
export class UsersModule {}
