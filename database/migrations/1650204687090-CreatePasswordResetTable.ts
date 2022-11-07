import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class CreatePasswordResetTable1650204687090
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'passwordResets',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'email',
            type: 'varchar',
          },
          {
            name: 'token',
            type: 'varchar',
          },
          {
            name: 'expire',
            isNullable: true,
            type: 'datetime',
            default: '(DATE_ADD(NOW(), INTERVAL 2 DAY))',
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
        ],
      }),
      true,
    )
    await queryRunner.createIndex(
      'passwordResets',
      new TableIndex({
        name: 'IDX_PWD_RESET_EMAIL',
        columnNames: ['email'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('passwordResets')
  }
}
