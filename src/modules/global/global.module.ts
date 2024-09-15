import { Global, Module } from '@nestjs/common'
import { ConfigService } from './config.service'
import { EnvConfig, envSchema } from 'src/config'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { z } from 'zod'

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvConfig>) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
      }),
    }),
  ],
  providers: [
    {
      provide: ConfigService,
      useValue:
        process.env.NODE_ENV === 'test'
          ? new ConfigService(z.object({}), {})
          : new ConfigService(envSchema),
    },
  ],
  exports: [ConfigService, JwtModule],
})
export class GlobalModule {}
