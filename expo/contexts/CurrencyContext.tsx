import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CurrencyCode, SUPPORTED_CURRENCIES } from '@/types/currency';
import { convertCurrency, formatCurrency } from '@/constants/exchangeRates';

const CURRENCY_STORAGE_KEY = 'kaweely_currency';

export const [CurrencyProvider, useCurrency] = createContextHook(() => {
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyCode>('EGP');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCurrency();
  }, []);

  const loadCurrency = async () => {
    const timeoutId = setTimeout(() => {
      console.warn('Currency loading timeout, using default');
      setIsLoading(false);
    }, 2000);

    try {
      const stored = await Promise.race([
        AsyncStorage.getItem(CURRENCY_STORAGE_KEY),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500))
      ]);
      
      if (stored && typeof stored === 'string' && stored.trim().length > 0) {
        const trimmedStored = stored.trim();
        
        if (trimmedStored === 'null' || trimmedStored === 'undefined' || trimmedStored === 'NaN') {
          console.warn('Invalid currency value, clearing');
          AsyncStorage.removeItem(CURRENCY_STORAGE_KEY).catch(console.error);
          return;
        }
        
        if (trimmedStored.startsWith('{') || trimmedStored.startsWith('[')) {
          console.warn('Currency storage contains JSON, clearing');
          AsyncStorage.removeItem(CURRENCY_STORAGE_KEY).catch(console.error);
          return;
        }
        
        const validCurrencies = SUPPORTED_CURRENCIES.map(c => c.code);
        if (validCurrencies.includes(trimmedStored as CurrencyCode)) {
          setCurrentCurrency(trimmedStored as CurrencyCode);
        } else {
          console.warn('Unknown currency code:', trimmedStored, 'clearing');
          AsyncStorage.removeItem(CURRENCY_STORAGE_KEY).catch(console.error);
        }
      }
    } catch (error) {
      console.error('Error loading currency:', error);
      AsyncStorage.removeItem(CURRENCY_STORAGE_KEY).catch(console.error);
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  const changeCurrency = useCallback(async (currencyCode: CurrencyCode) => {
    try {
      await AsyncStorage.setItem(CURRENCY_STORAGE_KEY, currencyCode);
      setCurrentCurrency(currencyCode);
      console.log('Currency changed to:', currencyCode);
    } catch (error) {
      console.error('Error saving currency:', error);
    }
  }, []);

  const convert = useCallback((amount: number, from: CurrencyCode = 'EGP'): number => {
    return convertCurrency(amount, from, currentCurrency);
  }, [currentCurrency]);

  const format = useCallback((amount: number, from: CurrencyCode = 'EGP'): string => {
    const converted = convert(amount, from);
    const currencyInfo = SUPPORTED_CURRENCIES.find(c => c.code === currentCurrency);
    return formatCurrency(converted, currentCurrency, currencyInfo?.symbol || currentCurrency);
  }, [convert, currentCurrency]);

  const currentCurrencyInfo = useMemo(
    () => SUPPORTED_CURRENCIES.find(c => c.code === currentCurrency),
    [currentCurrency]
  );

  return useMemo(() => ({
    currentCurrency,
    changeCurrency,
    convert,
    format,
    isLoading,
    currencies: SUPPORTED_CURRENCIES,
    currentCurrencyInfo,
  }), [currentCurrency, changeCurrency, convert, format, isLoading, currentCurrencyInfo]);
});

export type UseCurrencyReturn = {
  currentCurrency: CurrencyCode;
  changeCurrency: (currencyCode: CurrencyCode) => Promise<void>;
  convert: (amount: number, from?: CurrencyCode) => number;
  format: (amount: number, from?: CurrencyCode) => string;
  isLoading: boolean;
  currencies: typeof SUPPORTED_CURRENCIES;
  currentCurrencyInfo: typeof SUPPORTED_CURRENCIES[0] | undefined;
};
