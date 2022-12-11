import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { orderProviders } from './order.providers'
import { OrderController } from './controllers/order.controller'
import { OrderEntity } from './entities/order.entity'
import { OrderDetailEntity } from './entities/orderDetail.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderDetailEntity]),
    ConfigModule,
  ],
  controllers: [OrderController],
  providers: [...orderProviders],
})
export class OrderModule {}
