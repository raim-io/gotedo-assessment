import Application from '@ioc:Adonis/Core/Application';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SupportRequest from 'App/Models/SupportRequest';
import User from 'App/Models/User';
import UserRequestSchema from 'App/Validators/UserRequestValidator';

export default class UserRequestsController {
	// get all users along with their respective support request(s)
	public async store({ request, response }: HttpContextContract) {
		
		try {
			const payload: any = await request.validate({ schema: UserRequestSchema });

			// find & link user via email, or create new
			let user = await User.findBy('email', payload.email);
			if (!user) {
				user = await User.create({
					email: payload.email,
					full_name: `${payload.first_name} ${payload.last_name}`
				});
			}

			// create new support request
			const supportRequest = new SupportRequest();
			supportRequest.fill({
				...payload,
				user_email: user.email,
			});
	
			// await supportRequest.save();

			// save & link support request to user via email
			await user.related('supportRequests').save(supportRequest)

			return response.status(201).send(supportRequest);		
		} catch (error) {
			response.status(500);
			throw new Error(error.message);
		}
	}

	// upload a file
	public async uploadFile({ request, response }: HttpContextContract) {
		try {
			// file handling
			const fileExists = request.file('file');
			
			if (!fileExists) {
				response.status(400).send('File field cannot be empty! Choose a file for uploading.');
			}

			const fileName = `${new Date().getTime()}_${fileExists?.clientName}`;
			await fileExists?.move(Application.tmpPath('uploads'), {
				name: fileName,
			});

			response.status(201).send('File successfully uploaded.');
		} catch (error) {
			response.status(500);
			throw new Error(error.message);
		}
	}
}
