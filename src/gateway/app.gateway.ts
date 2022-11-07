/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Logger, UseGuards } from '@nestjs/common'
import { Socket, Server } from 'socket.io'
import { JwtService } from '../components/auth/services/jwt.service'
import { WsAuthGuard } from './guards/wsAuth.guard'
import { UserEntity } from '../components/user/entities/user.entity'
import { GatewayRoomNamingStrategy } from './gatewayRoomNaming.strategy'

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  public onlineUsers = new Set()
  constructor(
    private jwtService: JwtService,
    private gatewayRoomNamingStrategy: GatewayRoomNamingStrategy,
  ) {}
  @WebSocketServer() server: Server
  private logger: Logger = new Logger('AppGateway')

  // @SubscribeMessage('msgToServer')
  // async handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
  //   const user = await this.getUser(client);
  //   if (!user) {
  //     client.disconnect();
  //     this.logger.error('authentication failed ' + client.id);
  //   } else {
  //     this.logger.warn('authentication success! ' + user.username);
  //     this.onlineUsers.add(user.id);
  //     this.dispatchUsersOnline();
  //   }
  // }

  afterInit(server: Server): any {
    this.onlineUsers = new Set()
    server.emit('GatewayInit')
  }

  @UseGuards(WsAuthGuard)
  async handleConnection(client: Socket) {
    const user: UserEntity = await this.getUser(client)
    if (!user) {
      client.disconnect()
      this.logger.error('authentication failed ' + client.id)
    } else {
      this.logger.warn('authentication success! ' + user.email)
      client.join(this.gatewayRoomNamingStrategy.userPrivateChannel(user))
      this.onlineUsers.add(user.id)
      this.dispatchUsersOnline()
    }
  }

  handleDisconnect(client: Socket): any {
    const user: any = this.getUser(client)
    this.onlineUsers.delete(user.userId)
    this.logger.warn('user disconnected ' + user.username)
    client.leave(this.gatewayRoomNamingStrategy.userPrivateChannel(user))
    this.dispatchUsersOnline()
  }

  private async getUser(socket: Socket) {
    const token = socket.handshake.query.token
    const user: any = await this.jwtService.verify(token)
    return user
  }

  private dispatchUsersOnline() {
    this.server.emit('users/online', Array.from(this.onlineUsers))
  }
}
