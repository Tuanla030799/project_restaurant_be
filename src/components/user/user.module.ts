import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProfileModule } from '../profile/profile.module'
import { UserController } from './controllers/user.controller'
import { UserEntity } from './entities/user.entity'
import { userProviders } from './user.providers'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ProfileModule,
    ConfigModule,
  ],
  controllers: [UserController],
  providers: [...userProviders],
})
export class UserModule {}
