import { Module } from '@nestjs/common'
import { AuthModule, GlobalModule, UsersModule } from './modules'
import { LinksModule } from './modules/links/links.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [GlobalModule, AuthModule, UsersModule, LinksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
