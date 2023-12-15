import { schema, rules } from '@ioc:Adonis/Core/Validator';

const RequestSchema = schema.create({
	first_name: schema.string(),
	last_name: schema.string(),
	email: schema.string({}, [
		rules.email(),
	]),
	title: schema.string(),
	message: schema.string(),
	file_path: schema.string.nullableAndOptional(),
})

export default RequestSchema;
