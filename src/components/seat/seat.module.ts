import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { seatProviders } from './seat.providers'
import { SeatController } from './controllers/seat.controller'
import { SeatEntity } from './entities/seat.entity'

@Module({
  imports: [TypeOrmModule.forFeature([SeatEntity]), ConfigModule],
  controllers: [SeatController],
  providers: [...seatProviders],
})
export class SeatModule {}
