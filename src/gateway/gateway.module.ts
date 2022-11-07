import { Module } from '@nestjs/common'
import { AppGateway } from './app.gateway'
import { UserService } from '../components/user/services/user.service'
import { JwtService } from '../components/auth/services/jwt.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GatewayRoomNamingStrategy } from './gatewayRoomNaming.strategy'
import { RoleService } from 'src/components/auth/services/role.service'
import { UserRoleService } from 'src/components/auth/services/userRole.service'

@Module({
  imports: [ConfigModule],
  providers: [
    AppGateway,
    JwtService,
    UserService,
    ConfigService,
    GatewayRoomNamingStrategy,
    RoleService,
    UserRoleService,
  ],
})
export class GatewayModule {}
