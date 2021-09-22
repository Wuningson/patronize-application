import Account from '../../Models/Account';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class AccountsController {
  // rules.exist({table: 'table name', column: 'id'})
  public async createAccount({ request, response }: HttpContextContract) {
    const accountSchema = schema.create({
      lastName: schema.string(),
      firstName: schema.string(),
      email: schema.string({}, [
        rules.email(),
        rules.unique({ table: 'accounts', column: 'email' }),
      ]),
      password: schema.string({}, [rules.minLength(8)]),
    });

    const { lastName, firstName, email, password } = await request.validate({
      schema: accountSchema,
    });

    const account = await Account.create({ lastName, firstName, email, password });
    if (!account) {
      throw Error('Could not create account');
    }

    response.json({ message: 'Account created successfully' });
  }

  public async login({ request, response, auth }: HttpContextContract) {
    const loginSchema = schema.create({
      email: schema.string({}, [rules.email()]),
      password: schema.string({}, [rules.minLength(8)]),
      expiresIn: schema.string.optional(),
    });

    const { email, password, expiresIn } = await request.validate({
      schema: loginSchema,
    });

    const options: Record<string, string> = {};
    if (expiresIn) {
      options['expiresIn'] = expiresIn;
    }

    const token = await auth.use('api').attempt(email, password, options);
    response.json(token);
  }

  public async getUserDetails({ response, auth }: HttpContextContract) {
    if (!auth.user) {
      throw Error('Unauthorized');
    }

    const user = await Account.find(auth.user.id);
    if (!user) {
      throw Error('Something went wrong');
    }
    const data = user.serialize();
    response.json(data);
  }
}
