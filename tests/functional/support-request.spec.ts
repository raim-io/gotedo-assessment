import { test, configure } from '@japa/runner';
import { assert } from '@japa/assert';

import SupportRequest from 'App/Models/SupportRequest';
import User from 'App/Models/User';

import { join } from 'path';


configure({
  files: ['tests/**/*.spec.js'],
  plugins: [assert()]
})

test('support request was submitted and the data persisted', async ({ client, assert }) => {
	// dummy data
	const data = {
		first_name: 'Test',
		last_name: 'User',
		email: 'test@example.com',
		title: 'Test Title',
		message: 'Test Message',
	};
	
	// make post reqest to submit request
	const response = await client
		.post('/requests')
		.json(data)

  // Check if the support request is created via this email
	const supportRequest = await SupportRequest.query().where('email', data.email);
	assert.isTrue(
		supportRequest.length > 0,
		'Support request with this email was created and persisted.'
	);

	// Check if the request matches that which was submitted
	const persistedRequest = await SupportRequest.findBy('email', data.email)
	assert.isDefined(persistedRequest);
	assert.equal(persistedRequest?.first_name, data.first_name); 
	assert.equal(persistedRequest?.last_name, data.last_name); 
	assert.equal(persistedRequest?.email, data.email); 
	assert.equal(persistedRequest?.title, data.title); 
	assert.equal(persistedRequest?.message, data.message); 

	response.assertBodyContains(data);
	response.assertStatus(201);
	response.dumpBody();
})

test('multiple support requests with the same email address is linked to the same user', async ({ client, assert }) => {
	// dummy data
	const data1 = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    title: 'Doe Test Title',
    message: 'Doe Test Message',
	}
	const data2 = {
    first_name: 'John',
    last_name: 'Dow',
    email: 'john@example.com',
    title: 'Dow Test Title',
    message: 'Dow Test Message',
	}

	// post requests
	await client
		.post('/requests')
		.json(data1)
	await client
		.post('/requests')
		.json(data2)
	
	// Check if user exists
	const user = await User.findBy('email', data1.email);
	assert.isDefined(user);

  // Check if the support request is created and linked to the user
	const supportRequest = await SupportRequest.query().where('email', data1.email);
	assert.isTrue(
		supportRequest.length > 0,
		'Support requests with this email exists.'
	);
	assert.equal(supportRequest[0].user_email, data1.email); // Check if the user email matches
	
	// make get request to recieve users linked to a single address
	const response = await client
		.get(`/requests/${data1.email}`)

	response.assertStatus(200);
	response.dump();
})

test('file is successfully uploaded and stored', async ({ client }) => {

	// Log the absolute path to check if it matches the file's actual location
	//console.log(join(__dirname, '../files/resume@gotedo.pdf'));
	//console.log(fs.existsSync(join(__dirname, '../files/resume@gotedo.pdf')));
	
	// dummy data
	const data = {
		first_name: 'Test',
		last_name: 'File',
		email: 'filetest@example.com',
		title: 'File Test Title',
		message: 'File Test Message',
	};
	
	// make post request to upload a file
	const response = await client
		.post('/requests')
		.field('first_name', data.first_name)
		.field('last_name', data.last_name)
		.field('email', data.email)
		.field('title', data.title)
		.field('message', data.message)
		.file('file', join(__dirname, '../files/resume@gotedo.pdf'))
		
	const filePath = await getUploadedFilePath();

	response.assertBodyContains({
		file_path: filePath // file path matches that which was uploaded
	})
	response.assertStatus(201);
	response.dumpBody();


	// helper function to get the path of the uploaded path
	async function getUploadedFilePath() {
		// Retrieve the file path based on the uploaded file's information stored in the database
		const supportRequest = await SupportRequest.query()
			.where('email', data.email)
			.orderBy('created_at', 'desc') // getting the most recent support request
			.first();
		
		const filePath = supportRequest ? supportRequest.file_path : null;
	
		return filePath;
	}
})
