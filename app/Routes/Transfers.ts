import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.post('transfer', 'TransfersController.initiateTransfer');
})
  .prefix('/api')
  .middleware('auth');
