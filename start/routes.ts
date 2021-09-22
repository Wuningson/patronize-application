import '../app/Routes/Accounts';
import '../app/Routes/Deposits';
import '../app/Routes/Transfers';
import '../app/Routes/Withdrawals';
import '../app/Routes/Beneficiaries';
import Route from '@ioc:Adonis/Core/Route';

Route.get('/', async () => {
  return { hello: 'world' };
});
