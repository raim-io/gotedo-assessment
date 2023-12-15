import { schema, rules } from '@ioc:Adonis/Core/Validator';

const UserSchema = schema.create({
	email: schema.string({}, [
		rules.email(),
		//rules.unique({
		//	table: 'users', 
		//	column: 'email'
		//}),
	]),
	full_name: schema.string(),
})

export default UserSchema;
