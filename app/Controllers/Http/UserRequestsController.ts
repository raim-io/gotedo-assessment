import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SupportRequest from 'App/Models/SupportRequest';
import User from 'App/Models/User';

export default class UserRequestsController {
	// get all users along with their respective support request(s)
	public async store({ params, request, response }: HttpContextContract) {
		try {
			const email = params.email;

			const user = await User.findBy('email', email);
		} catch (error) {
			response.status(500);
			throw new Error(error.message);
		}
	}
}
