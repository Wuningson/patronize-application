import Account from './Account';
import { DateTime } from 'luxon';
import CamelCaseNamingStrategy from './NamingStrategy';
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';

export default class Beneficiary extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy();

  @column({ isPrimary: true })
  public id: number;

  @column()
  public bankName: string;

  @column()
  public accountName: string;

  @column()
  public accountNumber: string;

  @column()
  public accountId: number;

  @column()
  public recipientCode: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => Account, { localKey: 'accountId' })
  public account: BelongsTo<typeof Account>;
}
