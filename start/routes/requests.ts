import Route from '@ioc:Adonis/Core/Route'

// create a support request
Route.post('/requests', 'RequestsController.store');

// get all support requests
Route.get('/requests', 'RequestsController.index');

// get all support requests linked to an email address
Route.get('/requests/:email', 'RequestsController.indexViaEmail');

// delete a support request by id
Route.delete('/requests/:id', 'RequestsController.destroy');
