import { DateTime } from 'luxon'
import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import SupportRequest from './SupportRequest';

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: Number

  @column()
  public email: string;

  @column()
  public full_name: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => SupportRequest, {
    foreignKey: 'user_email',
    localKey: 'email'
  })
  public supportRequests: HasMany<typeof SupportRequest>
}
