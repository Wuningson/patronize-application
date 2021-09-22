import Account from './Account';
import { DateTime } from 'luxon';
import CamelCaseNamingStrategy from './NamingStrategy';
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';

export default class Transfer extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy();

  @column({ isPrimary: true })
  public id: number;

  @column()
  public amount: string;

  @column()
  public senderId: number;

  @column()
  public receiverId: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => Account, { localKey: 'senderId' })
  public sender: BelongsTo<typeof Account>;

  @belongsTo(() => Account, { localKey: 'receiverId' })
  public receiver: BelongsTo<typeof Account>;
}
