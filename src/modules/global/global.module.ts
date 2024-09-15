import { Global, Module } from '@nestjs/common'
import { ConfigService } from './config.service'
import { EnvConfig, envSchema } from 'src/config'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

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
      useValue: new ConfigService(envSchema),
    },
  ],
  exports: [ConfigService, JwtModule],
})
export class GlobalModule {}
