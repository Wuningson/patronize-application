import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Transfers extends BaseSchema {
  protected tableName = 'transfers';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.string('amount').notNullable();
      table.integer('senderId').unsigned().references('id').inTable('accounts');
      table.integer('receiverId').unsigned().references('id').inTable('accounts');

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
