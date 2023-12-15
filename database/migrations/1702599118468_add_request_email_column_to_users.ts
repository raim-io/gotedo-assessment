import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddRrequestEmailColumToUsers extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    if (!(await this.schema.hasColumn(this.tableName, 'request_email'))) {
      this.schema.alterTable(this.tableName, (table) => {
        // referencing support_request table via email
        table.string('request_email', 255).references('email').inTable('support_requests')
      })
    }
  }

  public async down() {
    if (await this.schema.hasColumn(this.tableName, 'request_email')) {
      this.schema.alterTable(this.tableName, (table) => {
        table.dropColumn('request_email')
      })
    }
  }
}
