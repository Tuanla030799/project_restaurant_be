import { Module } from '@nestjs/common'
import { AuthController } from './controllers/auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ForgotPasswordController } from './controllers/forgotPassword/forgotPassword.controller'
import { PermissionController } from './controllers/permission/permission.controller'
import { RoleController } from './controllers/role/role.controller'
import { authProviders } from './auth.providers'

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('APP_KEY'),
        signOptions: {
          expiresIn: configService.get('JWT_TTL'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [...authProviders],
  controllers: [
    AuthController,
    ForgotPasswordController,
    PermissionController,
    RoleController,
  ],
})
export class AuthModule {}
