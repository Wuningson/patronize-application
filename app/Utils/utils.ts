import axios from 'axios';

export default class PaystackUtils {
  private static axiosInstance = axios.create({
    headers: {
      'authorization': `Bearer ${process.env.SECRET_KEY}`,
      'content-type': 'application/json',
    },
    baseURL: `https://api.paystack.co`,
  });

  public static async generatePaymentLink(payload: GeneratePaymentLinkPayload) {
    const { email, amount, reference, callbackUrl, channel } = payload;
    const koboValue = amount * 100;

    const response = await this.axiosInstance.post<GeneratePaymentLinkResponse>(
      '/transaction/initialize',
      {
        email,
        reference,
        amount: koboValue,
        channels: [channel],
        ...(callbackUrl && { callbackUrl }),
      }
    );

    return response.data;
  }

  public static get<T>(url: string) {
    return this.axiosInstance.get<T>(url);
  }

  public static async fetchBankList() {
    const {
      data: { data },
    } = await this.axiosInstance.get<FetchPaystackBankResponse>('/bank');

    return data.map(({ name, code }) => ({ name, code }));
  }

  public static async resolveAccountNumber({ bankCode, accountNumber }: AccountDetails) {
    const {
      data: { status, data },
    } = await this.axiosInstance.get<ResolveAccountNumberResponse>(
      `/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`
    );

    if (!status) {
      throw Error('Invalid account details');
    }

    return data;
  }

  public static async addTransferRecipient({
    name,
    bankCode,
    accountNumber,
  }: AddTransferRecipientPayload) {
    const {
      data: { data, status },
    } = await this.axiosInstance.post<AddTransferRecipientResponse>('/transferrecipient', {
      name,
      type: 'nuban',
      bank_code: bankCode,
      account_number: accountNumber,
    });

    if (status) {
      return data.recipient_code;
    } else {
      throw Error('Could not add transfer recipient');
    }
  }

  public static async initiateWithdrawal({
    amount,
    reference,
    paystackId,
  }: InitiateWithdrawalPayload) {
    const koboValue = amount * 100;
    const {
      data: { status },
    } = await this.axiosInstance.post('/transfer', {
      reference,
      amount: koboValue,
      source: 'balance',
      recipient: paystackId,
    });

    if (!status) {
      throw Error('Could not initiate withdrawal');
    }
  }
}
