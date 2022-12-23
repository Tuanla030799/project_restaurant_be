import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateRolesTable1650203383282 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'roles',
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
            name: 'level',
            default: 0,
            type: 'int',
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('roles')
  }
}
