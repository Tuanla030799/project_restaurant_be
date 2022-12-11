import { EntityRepository, Repository } from 'typeorm'
import { SeatEntity } from '../entities/seat.entity'

@EntityRepository(SeatEntity)
export class SeatRepository extends Repository<SeatEntity> {}
