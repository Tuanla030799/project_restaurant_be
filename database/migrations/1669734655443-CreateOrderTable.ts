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
            name: 'seatId',
            type: 'int',
          },
          {
            name: 'time',
            type: 'datetime',
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
            name: 'createdAt',
            type: 'timestamp',
            default: 'NOW()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'NOW()',
          },
          {
            name: 'deletedAt',
            isNullable: true,
            type: 'datetime',
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
