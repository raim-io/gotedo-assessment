import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator';
import User from 'App/Models/User'

export default class UsersController {
	// create a new user
	public async store({ request, response }: HttpContextContract) {
		const {email, full_name} = request.body();
		
		const user = await User.findBy('email', email);

		if (!email || !full_name) {
			response.status(400);
			throw new Error("Request body cannot be blank!, input email or full_name field");
		}

		if (user) {
			response.status(201);
			throw new Error("User with this email already exists!");
		}

		try {
			const newUser = new User();
			newUser.fill({
				email,
				full_name,
			});
	
			await newUser.save();

			if (!newUser) {
				response.status(400);
				throw new Error("Oops, an error ocurred while creating new user.");
			}
	
			response.status(201).send(newUser);		
		} catch (error) {
			response.status(400);
			throw new Error(error.message);
			
		}
	}

	// get all users
	public async index({response}: HttpContextContract) {
		try {
			const users = await User.all();

			return response.status(200).send(users);
		} catch (error) {
			response.status(500);
			throw new Error(error.message);
			
		}
	} 

	// get a single user by id or email
	public async show({params, response}: HttpContextContract) {

		if (!params.id) {
			response.status(400);
			throw new Error("Request parameter cannot be blank!, specify Id in request parameter.")
		}

		try {	
			const user = await User.find(params.id);
			if (!user) {
				response.status(404);
				throw new Error(`User with the Id "${params.id}" was not found.`);
			}
	
			response.status(200).send(user);
		} catch (error) {
			response.status(400);
			throw new Error(error.message);
		}

	}

	// update a user by Id
	public async update({ params, request, response }: HttpContextContract) {
		if (!params.id) {
			response.status(400);
			throw new Error("Id parameter cannot be blank!");
		}

		try {
			const user = await User.find(params.id);

			if (!user) {
				response.status(400);
				throw new Error(`User with the Id "${params.id}" was not found!`);
			}

			const userSchema = schema.create({
				email: schema.string(),
				full_name: schema.string(),
			})

			const payload: any = await request.validate({ schema: userSchema });

			user.email = payload.email;
			user.full_name = payload.full_name

			await user.save();

			response.status(200).send(user);
		} catch (error) {
			response.status(200);
			throw new Error(error.message);
		}
	}

	// delete a user
	public async destroy({ params, response }: HttpContextContract) {
		if (!params.id) {
			response.status(400);
			throw new Error("Id parameter cannot be blank!");
		}

		try {
			const user = await User.find(params.id);
	
			if (!user) {
				response.status(400);
				throw new Error(`User with the id "${params.id}" was not found`);
			}
	
			await user.delete();
	
			response.status(200).send(user)
			
		} catch (error) {
			response.status(400);
			throw new Error(error.message);
		}
	}
}
