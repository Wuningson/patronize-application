import Deposit from './Deposit';
import { DateTime } from 'luxon';
import Transfer from './Transfer';
import Withdrawal from './Withdrawal';
import Beneficiary from './Beneficiary';
import Hash from '@ioc:Adonis/Core/Hash';
import CamelCaseNamingStrategy from './NamingStrategy';
import { BaseModel, beforeSave, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm';
import ApiTokens from './ApiToken';

export default class Account extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy();

  @column({ isPrimary: true })
  public id: number;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public firstName: string;

  @column()
  public lastName: string;

  @column()
  public email: string;

  @column()
  public balance: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @hasMany(() => ApiTokens, { foreignKey: 'accountId' })
  public tokens: HasMany<typeof ApiTokens>;

  @hasMany(() => Beneficiary, { foreignKey: 'accountId' })
  public beneficiaries: HasMany<typeof Beneficiary>;

  @hasMany(() => Deposit, { foreignKey: 'accountId' })
  public deposits: HasMany<typeof Deposit>;

  @hasMany(() => Transfer, { foreignKey: 'senderId' })
  public initiatedTransfers: HasMany<typeof Transfer>;

  @hasMany(() => Transfer, { foreignKey: 'receiverId' })
  public receivedTransfers: HasMany<typeof Transfer>;

  @hasMany(() => Withdrawal, { foreignKey: 'accountId' })
  public withdrawals: HasMany<typeof Withdrawal>;

  @beforeSave()
  public static async hashPassword(account: Account) {
    if (account.$dirty.password) {
      account.password = await Hash.make(account.password);
    }
  }
}
