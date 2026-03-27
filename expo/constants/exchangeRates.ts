import { CurrencyCode } from '@/types/currency';

export const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  EGP: 1,
  USD: 0.032,
  EUR: 0.03,
  GBP: 0.026,
  SAR: 0.12,
  AED: 0.12,
  TRY: 1.1,
  RUB: 3.2,
  CNY: 0.23,
  INR: 2.7,
};

export function convertCurrency(amount: number, from: CurrencyCode, to: CurrencyCode): number {
  if (from === to) return amount;
  
  const amountInEGP = from === 'EGP' ? amount : amount / EXCHANGE_RATES[from];
  const convertedAmount = to === 'EGP' ? amountInEGP : amountInEGP * EXCHANGE_RATES[to];
  
  return Math.round(convertedAmount * 100) / 100;
}

export function formatCurrency(amount: number, currencyCode: CurrencyCode, symbol: string): string {
  const formatted = amount.toFixed(2);
  
  switch (currencyCode) {
    case 'USD':
    case 'GBP':
      return `${symbol}${formatted}`;
    case 'EUR':
      return `${formatted}${symbol}`;
    default:
      return `${formatted} ${symbol}`;
  }
}
