import { Connection } from 'typeorm'
import { SeatEntity } from '../../src/components/seat/entities/seat.entity'

export default class SeatsTableSeeder {
  async up(connection: Connection): Promise<any> {
    const seed = [
      {
        capacity: 2,
        position: 1,
        content: 'Bàn dành cho 2 người'
      },
      {
        capacity: 2,
        position: 2,
        content: 'Bàn dành cho 2 người'
      },
      {
        capacity: 4,
        position: 3,
        content: 'Bàn dành cho 4 người'
      },
      {
        capacity: 4,
        position: 4,
        content: 'Bàn dành cho 4 người'
      },
      {
        capacity: 6,
        position: 5,
        content: 'Bàn dành cho 6 người'
      },
      {
        capacity: 6,
        position: 6,
        content: 'Bàn dành cho 6 người'
      },
      {
        capacity: 8,
        position: 7,
        content: 'Bàn dành cho 8 người'
      },
      {
        capacity: 8,
        position: 8,
        content: 'Bàn dành cho 8 người'
      },
      {
        capacity: 10,
        position: 9,
        content: 'Bàn dành cho 10 người'
      },
    ]
    const Seats = seed.map((item) => {
      const seat = new SeatEntity()

      seat.capacity = item.capacity
      seat.content = item.content
      seat.position = item.position

      return seat
    })
    await connection.manager.save(Seats)
  }
}
