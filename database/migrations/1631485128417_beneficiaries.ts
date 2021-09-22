import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Beneficiaries extends BaseSchema {
  protected tableName = 'beneficiaries';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.string('bankName').notNullable();
      table.string('accountName').notNullable();
      table.integer('pastackId').unsigned().notNullable();
      table.string('accountNumber', 10).notNullable().unique();
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
