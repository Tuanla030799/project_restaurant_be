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
            name: 'phone',
            isNullable: true,
            type: 'varchar',
          },
          {
            name: 'address',
            isNullable: true,
            type: 'varchar',
          },
          {
            name: 'avatar',
            isNullable: true,
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
            default: false,
            type: 'boolean',
          },
          {
            name: 'verifiedAt',
            isNullable: true,
            type: 'timestamp with time zone',
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
