import PaystackUtils from 'App/Utils/utils';
import Beneficiary from 'App/Models/Beneficiary';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class BeneficiariesController {
  public async addBeneficiary({ auth, request, response }: HttpContextContract) {
    if (!auth.user) {
      throw Error('Unauthorized');
    }

    const addBeneficiarySchema = schema.create({
      bankCode: schema.string(),
      bankName: schema.string(),
      accountNumber: schema.string({}, [rules.minLength(10), rules.maxLength(10)]),
    });

    const { bankName, accountNumber, bankCode } = await request.validate({
      schema: addBeneficiarySchema,
    });

    // Validate Bank details exists
    const check = await PaystackUtils.resolveAccountNumber({ bankCode, accountNumber });

    const { account_name: accountName } = check;

    const recipientCode = await PaystackUtils.addTransferRecipient({
      bankCode,
      accountNumber,
      name: accountName,
    });

    const { id } = auth.user;

    const beneficiary = await Beneficiary.create({
      bankName,
      accountName,
      recipientCode,
      accountId: id,
      accountNumber,
    });

    if (!beneficiary) {
      throw Error('Could not create beneficiary');
    }

    response.json(beneficiary);
  }

  public async fetchAccountBeneficiaries({ auth, response }: HttpContextContract) {
    if (!auth.user) {
      throw Error('Unauthorized');
    }

    const { id } = auth.user;

    const beneficiaries = await Beneficiary.query().where('accountId', id);
    response.json(beneficiaries);
  }

  public async fetchBankCodes({ response }: HttpContextContract) {
    const banks = await PaystackUtils.fetchBankList();
    response.json(banks);
  }
}
