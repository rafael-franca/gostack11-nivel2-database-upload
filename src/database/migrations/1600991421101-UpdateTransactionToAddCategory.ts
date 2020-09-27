import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class UpdateTransactionToAddCategory1600991421101 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.addColumn('transactions', new TableColumn({
        name: 'category_id',
        type: 'uuid',
        isNullable: true
      }));

      await queryRunner.createForeignKey('transactions', new TableForeignKey({
        name: 'CategoryTransaction',
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropForeignKey('transactions', 'CategoryTransaction');
      await queryRunner.dropColumn('transactions', 'category_id');
    }

}
