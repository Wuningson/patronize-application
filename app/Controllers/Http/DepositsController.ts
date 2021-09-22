import { DateTime } from 'luxon';
import PaystackUtils from 'App/Utils/utils';
import randomstring from 'randomstring';
import Deposit from 'App/Models/Deposit';
import Account from 'App/Models/Account';
import Withdrawal from 'App/Models/Withdrawal';
import Database from '@ioc:Adonis/Lucid/Database';
import { schema } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class DepositsController {
  // public utils = new PaystackUtils();
  public async generatePaymentLink({ request, response, auth }: HttpContextContract) {
    if (!auth.user) {
      throw Error('Unauthorized');
    }

    const addBeneficiarySchema = schema.create({
      amount: schema.string(),
      channel: schema.enum(['card', 'bank_transfer'] as const),
    });

    const { amount, channel } = await request.validate({
      schema: addBeneficiarySchema,
    });

    const validateAmount = parseFloat(amount);

    if (isNaN(validateAmount)) {
      throw Error('Amount is not a valid number');
    }

    const { id, email } = auth.user;
    const reference = randomstring.generate(10).toLowerCase();

    await Deposit.create({ amount, accountId: id, status: 'pending', reference, type: channel });

    const { data } = await PaystackUtils.generatePaymentLink({
      email,
      channel,
      reference,
      amount: validateAmount,
    });

    const { authorization_url: paymentUrl } = data;

    response.json({ paymentUrl });
  }

  public async paymentCallback({ request, response }: HttpContextContract) {
    const paymentCallbackSchema = schema.create({
      event: schema.string(),
      data: schema.object().members({
        reference: schema.string(),
        paid_at: schema.string.optional(),
      }),
    });

    const { event, data } = await request.validate({
      schema: paymentCallbackSchema,
    });

    const { reference, paid_at: paidAt } = data;

    const trx = await Database.transaction({ isolationLevel: 'read committed' });
    if (event === 'charge.success') {
      const deposit = await Deposit.findBy('reference', reference);
      const account = await Account.find(deposit?.accountId);
      if (!deposit || !account) {
        return response.send('done');
      }

      deposit.useTransaction(trx);
      account.useTransaction(trx);

      const { data } = await PaystackUtils.get<VerifyTransaction>(
        `/transaction/verify/${reference}`
      );

      if (data.data.status === 'success') {
        deposit.status = 'successful';
        if (paidAt) {
          deposit.confirmedAt = DateTime.fromISO(paidAt);
          const amount = data.data.amount / 100;
          account.balance = String(parseFloat(account.balance) + amount);
        }
        await account.save();
        await deposit.save();
        await trx.commit();
      } else {
        await trx.rollback();
      }
    } else if (event === 'transfer.success') {
      const withdrawal = await Withdrawal.findBy('reference', reference);

      if (!withdrawal) {
        return response.send('done');
      }

      withdrawal.useTransaction(trx);

      const {
        data: { data },
      } = await PaystackUtils.get<VerifyTransaction>(`/transfer/verify/${reference}`);

      if (data.status === 'success') {
        withdrawal.status = 'successful';
        await withdrawal.save();
        await trx.commit();
      } else {
        await trx.rollback();
      }
    } else if (event === 'transfer.failed' || event === 'transfer.reversed') {
      const withdrawal = await Withdrawal.findBy('reference', reference);
      const account = await Account.find(withdrawal?.accountId);

      if (!withdrawal || !account) {
        return response.send('done');
      }
      account.useTransaction(trx);
      withdrawal.useTransaction(trx);

      withdrawal.useTransaction(trx);

      const {
        data: { data },
      } = await PaystackUtils.get<VerifyTransaction>(`/transfer/verify/${reference}`);

      const nairaValue = data.amount / 100;

      account.balance = String(account.balance + nairaValue);
      withdrawal.status = 'failed';
      await withdrawal.save();
      await account.save();

      trx.commit();
    }
    return response.send('done');
  }

  public async fetchDeposits({ request, response, auth }: HttpContextContract) {
    if (!auth.user) {
      throw Error('Unauthorized');
    }

    const { type, status } = request.qs();
    const { id } = auth.user;

    let deposits: Deposit[];

    const mainQuery = Deposit.query().where('accountId', id);

    if (type) {
      deposits = await mainQuery.where('type', type);
    } else if (status) {
      deposits = await mainQuery.where('status', status);
    } else if (type && status) {
      deposits = await mainQuery.where('type', type).where('status', status);
    } else {
      deposits = await mainQuery;
    }

    return response.json(deposits);
  }
}
