import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect, useMemo, useCallback } from "react";

const SUBSCRIPTION_STORAGE_KEY = "kaweely_subscription";

export type SubscriptionPlanType = "week" | "month" | "3months" | "6months" | "year" | "student" | "couples" | "mothers" | "family" | "none";

export type SubscriptionData = {
  planType: SubscriptionPlanType;
  planId: string;
  planTitle: string;
  price: number;
  startDate: Date;
  endDate?: Date;
  deliveryDays?: string[];
  deliveryTime?: string;
  paymentMethod?: string;
  isActive: boolean;
  totalPieces: number;
  usedPieces: number;
  remainingPieces: number;
  totalPickupsPerWeek: number;
  usedPickupsThisWeek: number;
  remainingPickupsThisWeek: number;
  weekStartDate: Date;
};

export const [SubscriptionProvider, useSubscription] = createContextHook(() => {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);

  const subscriptionQuery = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      try {
        const stored = await AsyncStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
        console.log("[SubscriptionContext] Loading subscription from storage");
        
        if (!stored || stored === 'null' || stored === 'undefined' || stored.trim() === '' || stored === 'NaN' || stored === '[object Object]') {
          console.log("[SubscriptionContext] No subscription data found or invalid value");
          await AsyncStorage.removeItem(SUBSCRIPTION_STORAGE_KEY);
          return null;
        }
        
        const trimmedStored = stored.trim();
        
        if (!trimmedStored || trimmedStored === '[object Object]' || (!trimmedStored.startsWith('{'))) {
          console.warn("[SubscriptionContext] Stored value is not valid JSON, clearing");
          await AsyncStorage.removeItem(SUBSCRIPTION_STORAGE_KEY);
          return null;
        }
        
        if (trimmedStored.includes('NaN') || trimmedStored.includes('undefined')) {
          console.warn("[SubscriptionContext] Stored value contains invalid values, clearing");
          await AsyncStorage.removeItem(SUBSCRIPTION_STORAGE_KEY);
          return null;
        }
        
        try {
          const parsedSubscription = JSON.parse(trimmedStored);
          console.log("[SubscriptionContext] Successfully loaded subscription");
          return {
            ...parsedSubscription,
            startDate: new Date(parsedSubscription.startDate),
            endDate: parsedSubscription.endDate ? new Date(parsedSubscription.endDate) : undefined,
            weekStartDate: parsedSubscription.weekStartDate ? new Date(parsedSubscription.weekStartDate) : new Date(parsedSubscription.startDate),
          } as SubscriptionData;
        } catch (parseError) {
          console.error("[SubscriptionContext] JSON Parse error:", parseError);
          await AsyncStorage.removeItem(SUBSCRIPTION_STORAGE_KEY);
          return null;
        }
      } catch (error) {
        console.error("[SubscriptionContext] Error loading subscription:", error);
        await AsyncStorage.removeItem(SUBSCRIPTION_STORAGE_KEY);
        return null;
      }
    },
    staleTime: 0,
    gcTime: 0,
  });

  const syncMutation = useMutation({
    mutationFn: async (updatedSubscription: SubscriptionData | null) => {
      try {
        if (!updatedSubscription) {
          console.log('[SubscriptionContext] Clearing subscription');
          await AsyncStorage.removeItem(SUBSCRIPTION_STORAGE_KEY);
          return null;
        }
        
        const jsonString = JSON.stringify(updatedSubscription, (key, value) => {
          if (value !== value) return null;
          if (value === Infinity || value === -Infinity) return null;
          if (typeof value === 'number' && !isFinite(value)) return null;
          return value;
        });
        
        if (!jsonString || jsonString === 'undefined' || jsonString === 'null' || jsonString === 'NaN' || jsonString.includes('NaN')) {
          console.error('[SubscriptionContext] Invalid JSON string generated, not syncing');
          return updatedSubscription;
        }
        
        console.log('[SubscriptionContext] Syncing subscription');
        await AsyncStorage.setItem(SUBSCRIPTION_STORAGE_KEY, jsonString);
        return updatedSubscription;
      } catch (error) {
        console.error('[SubscriptionContext] Error syncing subscription:', error);
        await AsyncStorage.removeItem(SUBSCRIPTION_STORAGE_KEY);
        return updatedSubscription;
      }
    },
  });

  const { mutate: syncSubscription } = syncMutation;

  useEffect(() => {
    if (subscriptionQuery.data !== undefined) {
      setSubscription(subscriptionQuery.data);
    }
  }, [subscriptionQuery.data]);

  const activateSubscription = useCallback((data: Omit<SubscriptionData, 'isActive' | 'startDate' | 'usedPieces' | 'remainingPieces' | 'usedPickupsThisWeek' | 'remainingPickupsThisWeek' | 'weekStartDate'>) => {
    const now = new Date();
    
    const endDate = new Date(now);
    switch (data.planType) {
      case "week":
        endDate.setDate(endDate.getDate() + 7);
        break;
      case "month":
        endDate.setDate(endDate.getDate() + 30);
        break;
      case "3months":
        endDate.setDate(endDate.getDate() + 90);
        break;
      case "6months":
        endDate.setDate(endDate.getDate() + 180);
        break;
      case "year":
        endDate.setDate(endDate.getDate() + 365);
        break;
      case "student":
      case "couples":
      case "mothers":
      case "family":
        endDate.setDate(endDate.getDate() + 30);
        break;
      default:
        endDate.setDate(endDate.getDate() + 30);
    }
    
    const newSubscription: SubscriptionData = {
      ...data,
      startDate: now,
      endDate: endDate,
      isActive: true,
      usedPieces: 0,
      remainingPieces: data.totalPieces,
      usedPickupsThisWeek: 0,
      remainingPickupsThisWeek: data.totalPickupsPerWeek,
      weekStartDate: now,
    };

    console.log("[SubscriptionContext] Activating subscription:", newSubscription);
    setSubscription(newSubscription);
    syncSubscription(newSubscription);
    return newSubscription;
  }, [syncSubscription]);

  const cancelSubscription = useCallback(() => {
    console.log("[SubscriptionContext] Canceling subscription");
    setSubscription(null);
    syncSubscription(null);
  }, [syncSubscription]);

  const clearSubscription = useCallback(() => {
    setSubscription(null);
    syncSubscription(null);
  }, [syncSubscription]);

  const checkAndResetWeeklyPickups = useCallback((sub: SubscriptionData): SubscriptionData => {
    const now = new Date();
    const weekStartDate = new Date(sub.weekStartDate);
    const daysSinceWeekStart = Math.floor((now.getTime() - weekStartDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceWeekStart >= 7) {
      console.log("[SubscriptionContext] Week has passed, resetting pickup count");
      return {
        ...sub,
        usedPickupsThisWeek: 0,
        remainingPickupsThisWeek: sub.totalPickupsPerWeek,
        weekStartDate: now,
      };
    }
    
    return sub;
  }, []);

  const deductPieces = useCallback((pieces: number) => {
    if (!subscription) {
      console.warn("[SubscriptionContext] Cannot deduct pieces: no active subscription");
      return false;
    }

    if (subscription.remainingPieces < pieces) {
      console.warn("[SubscriptionContext] Insufficient pieces remaining");
      return false;
    }

    const checkedSubscription = checkAndResetWeeklyPickups(subscription);

    if (checkedSubscription.remainingPickupsThisWeek <= 0) {
      console.warn("[SubscriptionContext] No pickups remaining this week");
      return false;
    }

    const updatedSubscription: SubscriptionData = {
      ...checkedSubscription,
      usedPieces: checkedSubscription.usedPieces + pieces,
      remainingPieces: checkedSubscription.remainingPieces - pieces,
      usedPickupsThisWeek: checkedSubscription.usedPickupsThisWeek + 1,
      remainingPickupsThisWeek: checkedSubscription.remainingPickupsThisWeek - 1,
    };

    console.log("[SubscriptionContext] Deducting", pieces, "pieces and 1 pickup. New remaining:", updatedSubscription.remainingPieces, "pieces,", updatedSubscription.remainingPickupsThisWeek, "pickups");
    setSubscription(updatedSubscription);
    syncSubscription(updatedSubscription);
    return true;
  }, [subscription, syncSubscription, checkAndResetWeeklyPickups]);

  useEffect(() => {
    if (subscription) {
      const checkedSubscription = checkAndResetWeeklyPickups(subscription);
      if (checkedSubscription !== subscription) {
        setSubscription(checkedSubscription);
        syncSubscription(checkedSubscription);
      }
    }
  }, [subscription, checkAndResetWeeklyPickups, syncSubscription]);

  return useMemo(
    () => ({
      subscription,
      isLoading: subscriptionQuery.isLoading,
      activateSubscription,
      cancelSubscription,
      clearSubscription,
      deductPieces,
    }),
    [subscription, subscriptionQuery.isLoading, activateSubscription, cancelSubscription, clearSubscription, deductPieces]
  );
});
