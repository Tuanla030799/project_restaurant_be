import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateFoodsTable1669736073166 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'foods',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'slug',
            type: 'varchar',
          },
          {
            name: 'categoryId',
            type: 'int',
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['FOOD', 'DRINK'],
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'summary',
            type: 'varchar',
          },
          {
            name: 'content',
            type: 'text',
          },
          {
            name: 'discount',
            type: 'float',
          },
          {
            name: 'rating',
            type: 'int',
          },
          {
            name: 'image',
            type: 'varchar',
          },
          {
            name: 'price',
            type: 'float',
          },
          {
            name: 'liked',
            type: 'int',
          },
          {
            name: 'soldQuantity',
            type: 'int',
          },
          {
            name: 'inventory',
            type: 'enum',
            enum: ['SOLD', 'STOCKING'],
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['PUBLISH', 'HIDE'],
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
    await queryRunner.dropTable('foods')
  }
}
