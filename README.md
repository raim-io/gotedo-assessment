# Gotedo backend coding assessment

const {first_name, last_name, email, title, text} = request.body();
		const file = request.file('_file'); // file handling

		if (!first_name || !last_name || !email || !title || !text) {
			return response.status(400).send('Incomplete fields! Add "first_name", "last_name", "email", "title", "text", and "file_path" fields to the request body');
		}
		
		if (file) {
			await file.move(Application.tmpPath('uploads'));
		}




		################## uesrs
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('email', 255).notNullable()
      table.string('full_name', 255).notNullable()

      // referencing support_request table via email
      table.string('request_email', 255).references('email').inTable('support_requests')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}


######################### support_requests
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'support_requests'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('first_name', 255).notNullable()
      table.string('last_name', 255).notNullable
      table.string('email', 255).notNullable()
      table.string('title') // support request title
      table.text('message', 'long') // support request message
      table.string('file_path').nullable() // stores the path to the file

      // referencing users table via email
      table.string('user_email', 255).references('email').inTable('users')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

