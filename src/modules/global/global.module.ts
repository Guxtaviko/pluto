import { Global, Module } from '@nestjs/common'
import { ConfigService } from './config.service'
import { envSchema } from 'src/config'
import { ConfigModule } from '@nestjs/config'

@Global()
@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(envSchema),
    },
  ],
  exports: [ConfigService],
})
export class GlobalModule {}
