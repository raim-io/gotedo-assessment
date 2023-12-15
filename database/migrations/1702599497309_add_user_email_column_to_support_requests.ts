import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddUserEmailColumnToSupportRequests extends BaseSchema {
  protected tableName = 'support_requests'

  public async up() {
    if (!(await this.schema.hasColumn(this.tableName, 'user_email'))) {
      this.schema.alterTable(this.tableName, (table) => {
        // referencing users table via email
        table.string('user_email', 255).notNullable().references('email').inTable('users')
      })
    }

    // add aindex to email column to aide referencing
    //this.schema.alterTable('users', (table) => {
    //  table.index('email')
    //})
  }

  public async down() {
    if (await this.schema.hasColumn(this.tableName, 'user_email')) {
      this.schema.alterTable('this.tableName', (table) => {
        table.dropColumn('user_email')
      })
    }
  }
}
