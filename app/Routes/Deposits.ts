import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.get('/deposit', 'DepositsController.fetchDeposits');
  Route.post('/deposit', 'DepositsController.generatePaymentLink');
})
  .prefix('/api')
  .middleware('auth');

Route.post('/callback', 'DepositsController.paymentCallback').prefix('/api');
