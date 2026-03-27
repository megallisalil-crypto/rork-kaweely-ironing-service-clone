import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PromoCode, AppliedPromoCode } from "@/types/promoCode";

const PROMO_CODES_STORAGE_KEY = "kaweely_promo_codes";

export const [PromoCodeProvider, usePromoCodes] = createContextHook(() => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPromoCodes();
  }, []);

  const loadPromoCodes = async () => {
    try {
      const stored = await AsyncStorage.getItem(PROMO_CODES_STORAGE_KEY);
      if (stored) {
        const codes = JSON.parse(stored, (key, value) => {
          if (key === 'createdAt' || key === 'expiresAt') {
            return value ? new Date(value) : value;
          }
          return value;
        });
        console.log('[PromoCodeContext] Loaded', codes.length, 'promo codes');
        setPromoCodes(codes);
      }
    } catch (error) {
      console.error('[PromoCodeContext] Failed to load promo codes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePromoCodes = useCallback(async (codes: PromoCode[]) => {
    try {
      await AsyncStorage.setItem(PROMO_CODES_STORAGE_KEY, JSON.stringify(codes));
      console.log('[PromoCodeContext] Saved', codes.length, 'promo codes');
    } catch (error) {
      console.error('[PromoCodeContext] Failed to save promo codes:', error);
    }
  }, []);

  const createPromoCode = useCallback(async (data: {
    code: string;
    type: 'percentage' | 'free_order';
    discountPercentage?: number;
    usageLimit: number;
    expiresAt?: Date;
    description?: string;
  }) => {
    const existingCode = promoCodes.find(p => p.code.toLowerCase() === data.code.toLowerCase());
    if (existingCode) {
      throw new Error('Promo code already exists');
    }

    const newPromoCode: PromoCode = {
      id: Date.now().toString(),
      code: data.code.toUpperCase(),
      type: data.type,
      discountPercentage: data.discountPercentage,
      isActive: true,
      usageLimit: data.usageLimit,
      usageCount: 0,
      createdAt: new Date(),
      expiresAt: data.expiresAt,
      description: data.description,
    };

    const updatedCodes = [...promoCodes, newPromoCode];
    setPromoCodes(updatedCodes);
    await savePromoCodes(updatedCodes);
    console.log('[PromoCodeContext] Created promo code:', newPromoCode.code);
    return newPromoCode;
  }, [promoCodes, savePromoCodes]);

  const deletePromoCode = useCallback(async (id: string) => {
    const updatedCodes = promoCodes.filter(p => p.id !== id);
    setPromoCodes(updatedCodes);
    await savePromoCodes(updatedCodes);
    console.log('[PromoCodeContext] Deleted promo code:', id);
  }, [promoCodes, savePromoCodes]);

  const togglePromoCodeStatus = useCallback(async (id: string) => {
    const updatedCodes = promoCodes.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    );
    setPromoCodes(updatedCodes);
    await savePromoCodes(updatedCodes);
    console.log('[PromoCodeContext] Toggled promo code status:', id);
  }, [promoCodes, savePromoCodes]);

  const validatePromoCode = useCallback((code: string, orderTotal: number): { 
    valid: boolean; 
    error?: string; 
    promoCode?: PromoCode;
  } => {
    const promoCode = promoCodes.find(p => p.code.toLowerCase() === code.toLowerCase());

    if (!promoCode) {
      return { valid: false, error: 'Invalid promo code' };
    }

    if (!promoCode.isActive) {
      return { valid: false, error: 'This promo code is no longer active' };
    }

    if (promoCode.usageCount >= promoCode.usageLimit) {
      return { valid: false, error: 'This promo code has reached its usage limit' };
    }

    if (promoCode.expiresAt && new Date() > promoCode.expiresAt) {
      return { valid: false, error: 'This promo code has expired' };
    }

    return { valid: true, promoCode };
  }, [promoCodes]);

  const applyPromoCode = useCallback(async (code: string, orderTotal: number): Promise<AppliedPromoCode> => {
    const validation = validatePromoCode(code, orderTotal);
    
    if (!validation.valid || !validation.promoCode) {
      throw new Error(validation.error || 'Invalid promo code');
    }

    const promoCode = validation.promoCode;
    let discountAmount = 0;

    if (promoCode.type === 'percentage') {
      discountAmount = orderTotal * ((promoCode.discountPercentage || 0) / 100);
    } else if (promoCode.type === 'free_order') {
      discountAmount = orderTotal;
    }

    const updatedCodes = promoCodes.map(p =>
      p.id === promoCode.id ? { ...p, usageCount: p.usageCount + 1 } : p
    );
    setPromoCodes(updatedCodes);
    await savePromoCodes(updatedCodes);

    console.log('[PromoCodeContext] Applied promo code:', promoCode.code, 'Discount:', discountAmount);

    return {
      code: promoCode.code,
      type: promoCode.type,
      discountAmount,
      discountPercentage: promoCode.discountPercentage,
    };
  }, [promoCodes, validatePromoCode, savePromoCodes]);

  const stats = useMemo(() => {
    const totalCodes = promoCodes.length;
    const activeCodes = promoCodes.filter(p => p.isActive).length;
    const totalUsage = promoCodes.reduce((sum, p) => sum + p.usageCount, 0);
    const percentageCodes = promoCodes.filter(p => p.type === 'percentage').length;
    const freeOrderCodes = promoCodes.filter(p => p.type === 'free_order').length;

    return {
      totalCodes,
      activeCodes,
      totalUsage,
      percentageCodes,
      freeOrderCodes,
    };
  }, [promoCodes]);

  return useMemo(() => ({
    promoCodes,
    isLoading,
    createPromoCode,
    deletePromoCode,
    togglePromoCodeStatus,
    validatePromoCode,
    applyPromoCode,
    stats,
  }), [
    promoCodes,
    isLoading,
    createPromoCode,
    deletePromoCode,
    togglePromoCodeStatus,
    validatePromoCode,
    applyPromoCode,
    stats,
  ]);
});
