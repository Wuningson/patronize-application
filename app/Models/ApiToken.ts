import Account from './Account';
import { DateTime } from 'luxon';
import CamelCaseNamingStrategy from './NamingStrategy';
import { column, BaseModel, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm';

export default class ApiTokens extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy();

  @column({ isPrimary: true })
  public id: number;

  @column()
  public token: string;

  @column()
  public accountId: number;

  @column()
  public name: string;

  @column()
  public type: string;

  @column()
  public expires_at: DateTime;

  @belongsTo(() => Account, { localKey: 'accountId' })
  public account: BelongsTo<typeof Account>;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;
}
