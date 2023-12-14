import Route from '@ioc:Adonis/Core/Route'

// get all support requests
Route.get('/requests', async () => {
  return {
    users: 'requests are currently not available'
  }
})
