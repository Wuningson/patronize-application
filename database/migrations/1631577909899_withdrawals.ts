import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Withdrawals extends BaseSchema {
  protected tableName = 'withdrawals';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.string('amount').notNullable();
      table.string('reference').notNullable();
      table.enum('status', ['pending', 'failed', 'successful']).notNullable();
      table.integer('accountId').unsigned().references('id').inTable('accounts');
      table.integer('beneficiaryId').unsigned().references('id').inTable('beneficiaries');

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('createdAt', { useTz: true });
      table.timestamp('updatedAt', { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
