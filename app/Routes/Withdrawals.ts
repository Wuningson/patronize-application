import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.get('/withdrawal', 'WithdrawalsController.fetchWithdrawalHistory');
  Route.post('/withdrawal', 'WithdrawalsController.initiateWithdrawalToBeneficiary');
})
  .prefix('/api')
  .middleware('auth');
