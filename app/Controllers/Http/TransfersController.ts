import Account from 'App/Models/Account';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';

export default class TransfersController {
  public async initiateTransfer({ request, response, auth }: HttpContextContract) {
    if (!auth.user) {
      throw Error('Unauthorized');
    }

    const initiateTransferSchema = schema.create({
      amount: schema.string(),
      email: schema.string({}, [rules.exists({ table: 'accounts', column: 'email' })]),
    });

    const { amount, email } = await request.validate({
      schema: initiateTransferSchema,
    });

    const validateAmount = parseFloat(amount);

    if (isNaN(validateAmount)) {
      throw Error('Amount is not a valid number');
    }

    const { id } = auth.user;

    const trx = await Database.transaction({ isolationLevel: 'read committed' });

    const senderAccount = await Account.find(id);

    if (!senderAccount) {
      throw Error('Could not initiate transfer, sender account not found');
    }

    const receiverAccount = await Account.findBy('email', email);
    if (!receiverAccount) {
      throw Error('Could not initiate transfer, receiver account not found');
    }

    senderAccount.useTransaction(trx);
    receiverAccount.useTransaction(trx);

    const updatedSenderBalance = parseFloat(senderAccount.balance) - parseFloat(amount);
    if (updatedSenderBalance < 0) {
      throw Error('Insufficient balance');
    }

    senderAccount.balance = String(updatedSenderBalance);
    receiverAccount.balance = String(parseFloat(receiverAccount.balance) + parseFloat(amount));
    await senderAccount.save();
    await receiverAccount.save();
    await trx.commit();

    response.json({ msg: 'Transfer successful' });
  }
}
