import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Accounts extends BaseSchema {
  protected tableName = 'accounts';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.string('email').notNullable();
      table.string('password').notNullable();
      table.string('lastName').notNullable();
      table.string('firstName').notNullable();
      table.string('balance').notNullable().defaultTo('0');

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
