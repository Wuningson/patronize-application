import Account from './Account';
import { DateTime } from 'luxon';
import Beneficiary from './Beneficiary';
import CamelCaseNamingStrategy from './NamingStrategy';
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';

export default class Withdrawal extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy();

  @column({ isPrimary: true })
  public id: number;

  @column()
  public amount: string;

  @column()
  public beneficiaryId: number;

  @column()
  public accountId: number;

  @column()
  public reference: string;

  @column()
  public status: PaymentStatus;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_At: DateTime;

  @belongsTo(() => Beneficiary, { localKey: 'beneficiaryId' })
  public beneficiary: BelongsTo<typeof Beneficiary>;

  @belongsTo(() => Account, { localKey: 'accountId' })
  public account: BelongsTo<typeof Account>;
}
