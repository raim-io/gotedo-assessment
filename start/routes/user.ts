import Route from '@ioc:Adonis/Core/Route'

// create a new user || POST	/users
Route.post('/users', 'UsersController.store');

// list all users || GET|HEAD /users
Route.get('/users', 'UsersController.index');

// get a single user || GET|HEAD	/users/:id 
Route.get('/users/:id', 'UsersController.show');

// update a user || PUT|PATCH	/users/:id
Route.put('/users/:id', 'UsersController.update');

// delete a user || DELETE	/users/:id
Route.delete('/users/:id', 'UsersController.destroy');
