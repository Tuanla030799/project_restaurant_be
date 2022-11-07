import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { ProfileModule } from './profile/profile.module'

@Module({
  imports: [AuthModule, ProfileModule, UserModule],
})
export class ComponentsModule {}
