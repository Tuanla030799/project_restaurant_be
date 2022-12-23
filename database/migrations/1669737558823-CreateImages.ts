import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateImages1669737558823 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'images',
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
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'image',
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
    await queryRunner.dropTable('images')
  }
}
