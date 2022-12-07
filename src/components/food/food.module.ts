import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { foodProviders } from './food.providers'
import { FoodController } from './controllers/food.controller'
import { FoodEntity } from './entities/food.entity'

@Module({
  imports: [TypeOrmModule.forFeature([FoodEntity]), ConfigModule],
  controllers: [FoodController],
  providers: [...foodProviders],
})
export class FoodModule {}
