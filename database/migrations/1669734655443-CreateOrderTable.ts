import { MigrationInterface, QueryRunner, Table } from 'typeorm'

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
            name: 'firstName',
            default: "''",
            type: 'varchar',
          },
          {
            name: 'lastName',
            default: "''",
            type: 'varchar',
          },
          {
            name: 'phone',
            type: 'varchar',
          },
          {
            name: 'time',
            type: 'datetime',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['WAITING', 'SUCCESS', 'REJECT'],
          },
          {
            name: 'note',
            type: 'varchar',
          },
          {
            name: 'totalPrice',
            type: 'float',
          },
          {
            name: 'quantity',
            type: 'int',
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
