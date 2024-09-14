import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name)

  async onModuleInit() {
    await this.$connect().catch((err) => {
      this.logger.error('Failed to connect to the database')
      throw err
    })
  }

  async onModuleDestroy() {
    await this.$disconnect().catch((err) => {
      this.logger.error('Failed to disconnect from the database')
      throw err
    })
  }
}
