import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class CreateUserRoleTable1650204109718 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'userRole',
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
            name: 'roleId',
            type: 'int',
          },
        ],
      }),
      true,
    )
    await queryRunner.createIndex(
      'userRole',
      new TableIndex({
        name: 'IDX_USER_ROLE_USER_ID',
        columnNames: ['userId'],
      }),
    )

    await queryRunner.createIndex(
      'userRole',
      new TableIndex({
        name: 'IDX_USER_ROLE_ROLE_ID',
        columnNames: ['roleId'],
      }),
    )

    // await queryRunner.createForeignKey(
    //   'userRole',
    //   new TableForeignKey({
    //     columnNames: ['userId'],
    //     referencedColumnNames: ['id'],
    //     referencedTableName: 'users',
    //     onDelete: 'CASCADE',
    //   }),
    // );

    // await queryRunner.createForeignKey(
    //   'userRole',
    //   new TableForeignKey({
    //     columnNames: ['roleId'],
    //     referencedColumnNames: ['id'],
    //     referencedTableName: 'roles',
    //     onDelete: 'CASCADE',
    //   }),
    // );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('userRole')
  }
}
