import Account from './Account';
import { DateTime } from 'luxon';
import CamelCaseNamingStrategy from './NamingStrategy';
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';

export default class Deposit extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy();

  @column({ isPrimary: true })
  public id: number;

  @column()
  public amount: string;

  @column()
  public type?: DepositType;

  @column()
  public accountId: number;

  @column()
  public reference: string;

  @column()
  public status: PaymentStatus;

  @column.dateTime()
  public confirmedAt?: DateTime;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => Account, { localKey: 'accountId' })
  public account: BelongsTo<typeof Account>;
}
