import { UserEntity } from '../components/user/entities/user.entity'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GatewayRoomNamingStrategy {
  userPrivateChannel(user: UserEntity): string {
    return `App.Entity.${user.id}`
  }
}
