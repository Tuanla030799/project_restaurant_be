import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class CreateUsersTable1650203158607 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
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
            name: 'username',
            type: 'varchar',
            default: "''",
          },
          {
            name: 'password',
            default: "''",
            type: 'varchar',
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
            name: 'status',
            type: 'enum',
            enum: ['ACTIVE', 'INACTIVE'],
          },
          {
            name: 'socketId',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'verifyToken',
            default: "''",
            type: 'varchar',
          },
          {
            name: 'verified',
            default: 0,
            type: 'boolean',
          },
          {
            name: 'verifiedAt',
            isNullable: true,
            type: 'datetime',
          },
          {
            name: 'deletedAt',
            isNullable: true,
            type: 'datetime',
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
      'users',
      new TableIndex({
        name: 'IDX_USER_EMAIL',
        columnNames: ['email'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users')
  }
}
