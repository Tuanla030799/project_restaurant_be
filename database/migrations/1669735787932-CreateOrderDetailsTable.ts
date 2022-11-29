import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateOrderDetailsTable1669735787932
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'orderDetails',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'foodId',
            type: 'int',
          },
          {
            name: 'orderId',
            type: 'int',
          },
          {
            name: 'price',
            type: 'float',
          },
          {
            name: 'quantity',
            type: 'int',
          },
          {
            name: 'discount',
            type: 'float',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['AVAILABLE', 'UNAVAILABLE'],
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
    await queryRunner.dropTable('orderDetails')
  }
}
