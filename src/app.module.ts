import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { GlobalModule } from './modules'

@Module({
  imports: [GlobalModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
