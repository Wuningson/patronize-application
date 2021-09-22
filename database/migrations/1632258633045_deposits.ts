import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Deposits extends BaseSchema {
  protected tableName = 'deposits';

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp('confirmedAt', { useTz: true }).defaultTo(null);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
