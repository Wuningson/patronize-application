import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.post('/login', 'AccountsController.login');
  Route.post('/account', 'AccountsController.createAccount');
  Route.get('/account', 'AccountsController.getUserDetails').middleware('auth');
}).prefix('/api');
