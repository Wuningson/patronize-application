type DepositType = 'card' | 'bank_transfer';

interface GeneratePaymentLinkPayload {
  email: string;
  amount: number;
  reference: string;
  callbackUrl?: string;
  channel: 'card' | 'bank_transfer';
}

interface GeneratePaymentLinkResponse {
  status: string;
  message: string;
  data: {
    reference: string;
    access_code: string;
    authorization_url: string;
  };
}

type PaymentStatus = 'pending' | 'successful' | 'failed';

interface VerifyTransaction {
  data: {
    amount: number;
    status: string;
  };
}

interface PaystackBank {
  name: string;
  code: string;
}

interface FetchPaystackBankResponse {
  status: true;
  message: string;
  data: PaystackBank[];
}

interface AccountDetails {
  bankCode: string;
  accountNumber: string;
}

interface ResolveAccountNumberResponse {
  status: boolean;
  message: string;
  data: {
    account_number: string;
    account_name: string;
  };
}

interface AddTransferRecipientPayload {
  name: string;
  bankCode: string;
  accountNumber: string;
}

interface AddTransferRecipientResponse extends Pick<ResolveAccountNumberResponse, 'status'> {
  data: {
    recipient_code: string;
  };
}

interface InitiateWithdrawalPayload {
  amount: number;
  reference: string;
  paystackId: string;
}

interface InitiateWithdrawalResponse {
  status: boolean;
  message: string;
  data: {
    status: 'pending' | 'success' | 'failed';
  };
}
