import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

import configTable from '../../config/tables';

export default class CreateFkTransactionToCategory1596586494945
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      configTable.TRANSACTIONS,
      new TableColumn({
        name: 'category_id',
        type: 'uuid',
        isNullable: true,
      }),
    );
    await queryRunner.createForeignKey(
      configTable.TRANSACTIONS,
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: configTable.CATEGORIES,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        name: 'transactionsProvider',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      configTable.TRANSACTIONS,
      'transactionsProvider',
    );
    await queryRunner.dropColumn(configTable.TRANSACTIONS, 'category_id');
  }
}
