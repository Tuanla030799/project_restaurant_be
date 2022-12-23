import { array } from '@hapi/joi'
import { MigrationInterface, QueryRunner, Table } from 'typeorm'
import { OrderStatus } from '../../src/components/order/entities/order.enum'

export class CreateOrderTable1669734655443 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'orders',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'seatIds',
            type: 'varchar',
            isNullable: true
          },
          {
            name: 'time',
            type: 'timestamp with time zone',
          },
          {
            name: 'amount',
            type: 'int',
          },
          {
            name: 'status',
            type: 'int',
            default: OrderStatus.PENDING
          },
          {
            name: 'note',
            type: 'varchar',
            isNullable: true
          },
          {
            name: 'totalPrice',
            type: 'float',
          },
          {
            name: 'fullName',
            type: 'varchar',
          },
          {
            name: 'phone',
            type: 'varchar',
          },
          {
            name: 'createdAt',
            type: 'timestamp with time zone',
            default: 'NOW()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp with time zone',
            default: 'NOW()',
          },
          {
            name: 'deletedAt',
            isNullable: true,
            type: 'timestamp with time zone',
          },
        ],
      }),
      true,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('orders')
  }
}
