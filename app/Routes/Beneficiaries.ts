import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.post('/beneficiary', 'BeneficiariesController.addBeneficiary');
  Route.get('/beneficiary', 'BeneficiariesController.fetchAccountBeneficiaries');
})
  .prefix('/api')
  .middleware('auth');

Route.get('/bank/codes', 'BeneficiariesController.fetchBankCodes').prefix('/api');
