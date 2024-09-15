import { Module } from '@nestjs/common'
import { AuthModule, GlobalModule } from './modules'

@Module({
  imports: [GlobalModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
