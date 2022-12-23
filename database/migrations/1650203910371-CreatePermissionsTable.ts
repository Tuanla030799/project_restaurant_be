import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class CreatePermissionsTable1650203910371 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'permissions',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'slug',
            type: 'varchar',
          },
          {
            name: 'deletedAt',
            isNullable: true,
            type: 'timestamp with time zone',
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
        ],
      }),
      true,
    )
    await queryRunner.createIndex(
      'permissions',
      new TableIndex({
        name: 'IDX_PERMISSION_SLUG',
        columnNames: ['slug'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('permissions')
  }
}
