import { CurrencyCode } from '@/types/currency';

export const CRYPTO_LEGAL_CURRENCIES: CurrencyCode[] = [
  'USD',
  'EUR', 
  'GBP',
  'SAR',
  'AED',
  'TRY',
  'CNY',
  'INR',
];

export const CRYPTO_ILLEGAL_CURRENCIES: CurrencyCode[] = [
  'EGP',
  'RUB',
];

export function isCryptoLegalForCurrency(currencyCode: CurrencyCode): boolean {
  return CRYPTO_LEGAL_CURRENCIES.includes(currencyCode);
}
