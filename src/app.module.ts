import { Module } from '@nestjs/common'
import { AuthModule, GlobalModule, UsersModule } from './modules'
import { LinksModule } from './modules/links/links.module'

@Module({
  imports: [GlobalModule, AuthModule, UsersModule, LinksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
