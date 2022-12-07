import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddColumnIntoFoodTable1670402441571 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'foods',
      new TableColumn({
        name: 'liked',
        type: 'int',
      }),
    )
    await queryRunner.addColumn(
      'foods',
      new TableColumn({
        name: 'soldQuantity',
        type: 'int',
      }),
    )
    await queryRunner.addColumn(
      'foods',
      new TableColumn({
        name: 'status',
        type: 'enum',
        enum: ['SOLD', 'STOCKING'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('foods', 'liked')
    await queryRunner.dropColumn('foods', 'soldQuantity')
  }
}
