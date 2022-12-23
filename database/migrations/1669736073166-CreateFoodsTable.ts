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
            enum: ['FOOD', 'DRINK', 'FAST', 'SNACKS'],
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
            isNullable: true,
          },
          {
            name: 'rating',
            type: 'int',
            isNullable: true,
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
            isNullable: true,
          },
          {
            name: 'soldQuantity',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'inventory',
            type: 'enum',
            enum: ['SOLD', 'STOCKING'],
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['PUBLISH', 'HIDE'],
            isNullable: true,
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
    await queryRunner.dropTable('foods')
  }
}
