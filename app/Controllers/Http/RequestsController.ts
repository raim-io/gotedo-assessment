import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SupportRequest from 'App/Models/SupportRequest';

export default class RequestsController {
	// create a new support request
	public async store({ request, response }: HttpContextContract) {
		const {first_name, last_name, email, title, text, file_path} = request.body();
		
		if (!first_name || !last_name || !email || !title || !text || !file_path) {
			response.status(400);
			throw new Error('Incomplete fields! Add "first_name", "last_name", "email", "title", "text", and "file_path" fields to the request body');
		}
		
		try {
			const newSupportRequest = new SupportRequest();
			newSupportRequest.fill({
				first_name,
				last_name,
				email,
				title,
				text,
				file_path,
			});
	
			await newSupportRequest.save();

			if (!newSupportRequest) {
				response.status(400);
				throw new Error("Oops, an error ocurred while creating new support request.");
			}
	
			response.status(201).send(newSupportRequest);		
		} catch (error) {
			response.status(400);
			throw new Error(error.message);
			
		}
	}

	// get all support requests
	public async index({response}: HttpContextContract) {
		try {
			const supportRequests = await SupportRequest.all();

			return response.status(200).send(supportRequests);
		} catch (error) {
			response.status(500);
			throw new Error(error.message);
			
		}
	} 
}
