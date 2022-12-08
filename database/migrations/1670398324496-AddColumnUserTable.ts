// import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

// export class AddFieldTypeOption1642050020423 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.addColumn(
//       'users',
//       new TableColumn({
//         name: 'phone',
//         type: 'varchar',
//         isNullable: true,
//       }),
//     )
//     await queryRunner.addColumn(
//       'users',
//       new TableColumn({
//         name: 'address',
//         type: 'varchar',
//         isNullable: true,
//       }),
//     )
//     await queryRunner.addColumn(
//       'users',
//       new TableColumn({
//         name: 'avatar',
//         type: 'varchar',
//         isNullable: true,
//       }),
//     )
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.dropColumn('users', 'phone')
//     await queryRunner.dropColumn('users', 'address')
//     await queryRunner.dropColumn('users', 'avatar')
//   }
// }
