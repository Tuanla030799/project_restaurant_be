import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { ProfileModule } from './profile/profile.module'
import { CategoryModule } from './category/category.module'
import { FoodModule } from './food/food.module'
import { SeatModule } from './seat/seat.module'
import { OrderModule } from './order/order.module'

@Module({
  imports: [
    AuthModule,
    ProfileModule,
    UserModule,
    CategoryModule,
    FoodModule,
    SeatModule,
    OrderModule,
  ],
})
export class ComponentsModule {}
