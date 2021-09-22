import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Beneficiaries extends BaseSchema {
  protected tableName = 'beneficiaries';

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('pastackId');
      table.integer('paystackId').unsigned().notNullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
