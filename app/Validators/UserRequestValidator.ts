import { schema, rules } from '@ioc:Adonis/Core/Validator';

const UserRequestSchema = schema.create({
	first_name: schema.string(),
	last_name: schema.string(),
	email: schema.string({}, [
		rules.email(),
	]),
	title: schema.string(),
	message: schema.string(),
})

export default UserRequestSchema;
