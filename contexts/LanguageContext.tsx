import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageCode, SUPPORTED_LANGUAGES } from '@/types/language';
import { translations, Translation } from '@/constants/translations';

const LANGUAGE_STORAGE_KEY = 'kaweely_language';

export const [LanguageProvider, useLanguage] = createContextHook(() => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const timeoutId = setTimeout(() => {
      console.warn('Language loading timeout, using default');
      setIsLoading(false);
    }, 2000);

    try {
      const stored = await Promise.race([
        AsyncStorage.getItem(LANGUAGE_STORAGE_KEY),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500))
      ]);
      
      if (stored && typeof stored === 'string' && stored.trim().length > 0) {
        const trimmedStored = stored.trim();
        
        if (trimmedStored === 'null' || trimmedStored === 'undefined' || trimmedStored === 'NaN') {
          console.warn('Invalid language value (null/undefined/NaN), clearing');
          AsyncStorage.removeItem(LANGUAGE_STORAGE_KEY).catch(console.error);
          return;
        }
        
        if (trimmedStored.startsWith('{') || trimmedStored.startsWith('[')) {
          console.warn('Language storage contains JSON object/array instead of language code, clearing');
          AsyncStorage.removeItem(LANGUAGE_STORAGE_KEY).catch(console.error);
          return;
        }
        
        if (trimmedStored.length > 10) {
          console.warn('Invalid language code (too long), clearing');
          AsyncStorage.removeItem(LANGUAGE_STORAGE_KEY).catch(console.error);
          return;
        }
        
        const validLanguages = ['en', 'ar', 'fr', 'es', 'de', 'it', 'tr', 'ru', 'zh', 'hi'];
        if (validLanguages.includes(trimmedStored)) {
          setCurrentLanguage(trimmedStored as LanguageCode);
        } else {
          console.warn('Unknown language code:', trimmedStored, 'clearing');
          AsyncStorage.removeItem(LANGUAGE_STORAGE_KEY).catch(console.error);
        }
      }
    } catch (error) {
      console.error('Error loading language:', error);
      AsyncStorage.removeItem(LANGUAGE_STORAGE_KEY).catch(console.error);
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  const changeLanguage = useCallback(async (languageCode: LanguageCode) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
      setCurrentLanguage(languageCode);
      console.log('Language changed to:', languageCode);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  }, []);

  const t = translations[currentLanguage];
  const currentLanguageInfo = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage);
  const isRTL = currentLanguageInfo?.rtl || false;

  return useMemo(() => ({
    currentLanguage,
    changeLanguage,
    t,
    isRTL,
    isLoading,
    languages: SUPPORTED_LANGUAGES,
  }), [currentLanguage, changeLanguage, t, isRTL, isLoading]);
});

export type UseLanguageReturn = {
  currentLanguage: LanguageCode;
  changeLanguage: (languageCode: LanguageCode) => Promise<void>;
  t: Translation;
  isRTL: boolean;
  isLoading: boolean;
  languages: typeof SUPPORTED_LANGUAGES;
};
