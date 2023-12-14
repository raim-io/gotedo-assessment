import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
//import User from './User'

export default class SupportRequest extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public first_name: string

  @column()
  public last_name: string

  @column()
  public email: string

  @column()
  public title: string

  @column()
  public text: string

  @column()
  public file_path: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  //@belongsTo(() => User, {
  //  requestId: 'user_id',
  //})
  //public user: BelongsTo<typeof User>
}
