import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import User from 'App/Models/User';
import UserSchema from 'App/Validators/UserValidator';

export default class UsersController {
// -- primary controller --
	// create a new user
	public async store({ request, response }: HttpContextContract) {
		try {
			const payload: any = await request.validate({schema: UserSchema})
	
			// console.log(payload);

			// validate request input
			if (!payload.email || !payload.full_name) {
				return response.status(400).send({message: 'Request body cannot be blank! fill in the email and full_name fields.'});
			}

			// check for user's existence
			const userExists = await User.findBy('email', payload.email);
			if (userExists) {
				return response.status(400).send({message: 'User with this email already exists!'});
			}

			// create new user instance
			const newUser = new User();
			newUser.fill({
				...payload,
			});
			await newUser.save(); // save newly created user
	
			return response.status(201).send(newUser);		
		} catch (error) {
			response.status(500);
			throw new Error(error.message);	
		}
	}


// -- secondary controllers --
	// get all users
	public async index({response}: HttpContextContract) {
		try {
			const users = await User.all();

			if (users.length === 0) {
				return response.status(200).send({ message: 'There are currently no users.' });
			}
			
			return response.status(200).send(users);		
		} catch (error) {
			response.status(500);
			throw new Error(error.message);
		}
	} 

	
	// get a single user by id
	public async show({ params, response }: HttpContextContract) {
		try {
			const userId = params.id;
	
			//if (!userId) {
			//	return response.status(400).send({message: "Request parameter cannot be blank!, specify Id in request parameter."})
			//}

			const user = await User.find(userId);

			if (!user) {
				return response.status(404).send({message: `User with the Id '${userId}' was not found.`});
			}

			response.status(200).send(user);
		} catch (error) {
			response.status(500);
			throw new Error(error.message);
		}

	}

	// update a user by Id
	public async update({ params, request, response }: HttpContextContract) {
		try {
			const userId = params.id;
	
			//if (!userId) {
			//	return response.status(400).send({message: "Request parameter cannot be blank!, specify Id in request parameter."});
			//}

			const user: any = await User.find(userId);

			if (!user) {
				return response.status(404).send({message: `User with the Id '${userId}' was not found, and may not exist.`});
			}

			const userSchema = schema.create({
				email: schema.string({}, [
					rules.email(),
					rules.unique({ // define email uniqueness
						table: 'users',
						column: 'email',
						whereNot: {id: userId}
					}),
				]),
				full_name: schema.string(),
			})

			const payload: any = await request.validate({ schema: userSchema });

			user.email = payload.email;
			user.full_name = payload.full_name

			await user.save();

			return response.status(200).send(user);
		} catch (error) {
			response.status(500);
			throw new Error(error.message);
		}
	}

	// delete a user
	public async destroy({ params, response }: HttpContextContract) {
		const userId = params.id;

		if (!userId) {
			response.status(400).send({message: "Request parameter cannot be blank!, specify Id in request parameter."});
		}

		try {
			const user = await User.find(userId);
	
			if (!user) {
				return response.status(404).send(`User with the id '${userId}' was not found, and may not exist.`);
			}
	
			await user.delete();
	
			return response.status(200).send(user);			
		} catch (error) {
			response.status(500);
			throw new Error(error.message);
		}
	}
}
