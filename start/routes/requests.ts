import Route from '@ioc:Adonis/Core/Route'

// create a support request
Route.post('/requests', 'RequestsController.store');

// get all support requests
Route.get('/requests', 'RequestsController.index');

// delete a support request by id
Route.get('/requests/:id', 'RequestsController.destroy');
