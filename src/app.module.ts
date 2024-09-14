import { Module } from '@nestjs/common'
import { GlobalModule, UsersModule } from './modules'

@Module({
  imports: [GlobalModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
