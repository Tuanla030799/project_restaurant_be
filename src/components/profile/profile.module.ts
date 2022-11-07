import { Module } from '@nestjs/common'
import { ProfileController } from './controllers/profile.controller'
import { userProviders } from '../user/user.providers'

@Module({
  controllers: [ProfileController],
  imports: [],
  providers: [...userProviders],
})
export class ProfileModule {}
