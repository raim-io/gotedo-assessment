import Route from '@ioc:Adonis/Core/Route'

// list all users || GET|HEAD /users
Route.get('/user-requests', 'UserRequestsController.store');
