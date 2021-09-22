import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Deposits extends BaseSchema {
  protected tableName = 'deposits';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.string('amount').notNullable();
      table.string('reference').notNullable();
      table.enum('type', ['bank_transfer', 'card']);
      table.enum('status', ['pending', 'successful', 'failed']).notNullable();
      table.integer('accountId').unsigned().references('id').inTable('accounts');

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
