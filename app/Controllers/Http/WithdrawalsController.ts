import randomstring from 'randomstring';
import Account from 'App/Models/Account';
import PaystackUtils from 'App/Utils/utils';
import Withdrawal from 'App/Models/Withdrawal';
import Beneficiary from 'App/Models/Beneficiary';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class WithdrawalsController {
  public async initiateWithdrawalToBeneficiary({ auth, request, response }: HttpContextContract) {
    if (!auth.user) {
      throw Error('Unauthorized');
    }

    const withdrawalSchema = schema.create({
      amount: schema.string(),
      beneficiaryId: schema.number([rules.exists({ table: 'beneficiaries', column: 'id' })]),
    });

    const { amount, beneficiaryId } = await request.validate({
      schema: withdrawalSchema,
    });

    const { id } = auth.user;

    const validateAmount = parseFloat(amount);

    if (isNaN(validateAmount)) {
      throw Error('Amount is not a valid number');
    }

    const beneficiary = await Beneficiary.find(beneficiaryId);

    if (!beneficiary) {
      throw Error('Invalid beneficiary id');
    }

    if (beneficiary.accountId !== id) {
      throw Error('Unauthorized');
    }

    const reference = randomstring.generate({ length: 10, charset: 'alphabetic' }).toLowerCase();

    const account = await Account.find(id);

    if (!account) {
      throw Error('Something went wrong');
    }

    const updatedBalance = parseFloat(account.balance) - parseFloat(amount);
    account.balance = String(updatedBalance);

    await PaystackUtils.initiateWithdrawal({
      reference,
      amount: validateAmount,
      paystackId: beneficiary.recipientCode,
    });

    await Withdrawal.create({
      amount,
      reference,
      beneficiaryId,
      accountId: id,
    });
    await account.save();

    response.json({ message: 'Withdrawal initiated successfully' });
  }

  public async fetchWithdrawalHistory({ auth, request, response }: HttpContextContract) {
    if (!auth.user) {
      throw Error('Unauthorized');
    }

    const { status } = request.qs();
    const { id } = auth.user;

    let withdrawals: Withdrawal[];

    const mainQuery = Withdrawal.query().where('accountId', id);

    if (status) {
      withdrawals = await mainQuery.where('status', status);
    } else {
      withdrawals = await mainQuery;
    }
    const data = withdrawals.map((el) => el.serialize());
    return response.json(data);
  }
}
