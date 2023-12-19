import Application from '@ioc:Adonis/Core/Application';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import SupportRequest from 'App/Models/SupportRequest';
import User from 'App/Models/User';
import RequestSchema from 'App/Validators/RequestValidator';

export default class RequestsController {
// -- primary controllers --
	// create a new support request
	public async store({ request, response }: HttpContextContract) {
		
		try {
			const payload: any = await request.validate({ schema: RequestSchema });
	
			// file handling
			const fileExists = request.file('file');
			if (fileExists) {
				const fileName = `${new Date().getTime()}_${fileExists?.clientName}`;
				await fileExists?.move(Application.tmpPath('uploads'), {
					name: fileName,
				});
	
				payload.file_path = `tmp/uploads/${fileName}`;
			}

			// find & link user via email, or create new
			let user = await User.findBy('email', payload.email);
			if (!user) {
				user = await User.create({
					email: payload.email,
					full_name: `${payload.first_name} ${payload.last_name}`
				});
			}

			const supportRequest = new SupportRequest();
			supportRequest.fill({
				...payload,
				user_email: user.email,
			});
	
			// await supportRequest.save();

			// save & link support request to user via email
			await user.related('supportRequests').save(supportRequest)

			//if (!newSupportRequest) {
			//	response.status(400);
			//	throw new Error("Oops, an error ocurred while creating new support request.");
			//}
	
			return response.status(201).send(supportRequest );		
		} catch (error) {
			response.status(500);
			throw new Error(error.message);
			
		}
	}

	// get all support requests linked to the same email
	public async indexViaEmail({params, response}: HttpContextContract) {
		try {
			const userEmail = params.email;
			//if (!userEmail) {
			//	response.status(400).send({message: "Request parameter cannot be blank!, specify user's email in request parameter."})
			//}

			const supportRequests = await SupportRequest.query().where('user_email', userEmail).exec();

			if (!supportRequests || supportRequests.length === 0) {
				return response.status(404).send({ message: 'There are currently no support requests linked to this email address.' });
			}
			
			return response.status(200).send(supportRequests);		
		} catch (error) {
			response.status(500);
			throw new Error(error.message);
		}
	}

	// get all support requests
	public async index({response}: HttpContextContract) {
		try {
			const supportRequests = await SupportRequest.all();

			if (supportRequests.length === 0) {
				return response.status(200).send({ message: 'There are currently no support requests.' });
			}
			
			return response.status(200).send(supportRequests);		
		} catch (error) {
			response.status(500);
			throw new Error(error.message);
		}
	}


// -- secondary controller
	// delete a support request
	public async destroy({ params, response }: HttpContextContract) {
		const requestId = params.id;

		if (!requestId) {
			response.status(400).send({message: "Request parameter cannot be blank!, specify Id in request parameter."});
		}

		try {
			const supportRequest = await User.find(requestId);
	
			if (!supportRequest) {
				return response.status(404).send(`User with the id '${requestId}' was not found, and may not exist.`);
			}
	
			await supportRequest.delete();
	
			return response.status(200).send(supportRequest);			
		} catch (error) {
			response.status(500);
			throw new Error(error.message);
		}
	}
}
