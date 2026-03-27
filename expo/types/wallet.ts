export type TransactionType = "add_money" | "send_money" | "receive_money" | "order_payment" | "refund";

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: Date;
  recipientName?: string;
  recipientId?: string;
};

export type WalletUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
};
