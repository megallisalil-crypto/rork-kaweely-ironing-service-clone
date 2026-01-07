import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect, useMemo, useCallback } from "react";
import { SOSRequest, SOSUrgencyLevel, SOSPricing } from "@/types/sos";
import { useSubscription } from "./SubscriptionContext";

const SOS_STORAGE_KEY = "kaweely_sos_requests";

const SOS_PRICING: SOSPricing = {
  baseMultiplier: 2.0,
  subscriberDiscount: 0.3,
  expressMultiplier: 2.8,
  expressDeliveryTime: 60,
};

export const [SOSProvider, useSOS] = createContextHook(() => {
  const { subscription } = useSubscription();
  const [sosRequests, setSosRequests] = useState<SOSRequest[]>([]);
  const [activeSOSCount, setActiveSOSCount] = useState(0);

  const sosQuery = useQuery({
    queryKey: ["sos_requests"],
    queryFn: async () => {
      try {
        const stored = await AsyncStorage.getItem(SOS_STORAGE_KEY);
        console.log("[SOSContext] Loading SOS requests from storage");
        
        if (!stored || stored === 'null' || stored === 'undefined' || stored.trim() === '') {
          console.log("[SOSContext] No SOS data found");
          return [];
        }
        
        const parsed = JSON.parse(stored);
        return parsed.map((req: any) => ({
          ...req,
          requestedAt: new Date(req.requestedAt),
          estimatedDelivery: new Date(req.estimatedDelivery),
        })) as SOSRequest[];
      } catch (error) {
        console.error("[SOSContext] Error loading SOS requests:", error);
        await AsyncStorage.removeItem(SOS_STORAGE_KEY);
        return [];
      }
    },
  });

  const syncMutation = useMutation({
    mutationFn: async (requests: SOSRequest[]) => {
      try {
        console.log("[SOSContext] Syncing SOS requests");
        await AsyncStorage.setItem(SOS_STORAGE_KEY, JSON.stringify(requests));
        return requests;
      } catch (error) {
        console.error("[SOSContext] Error syncing SOS requests:", error);
        return requests;
      }
    },
  });

  const { mutate: syncRequests } = syncMutation;

  useEffect(() => {
    if (sosQuery.data) {
      setSosRequests(sosQuery.data);
      const activeCount = sosQuery.data.filter(
        req => req.status === "pending" || req.status === "accepted" || req.status === "in_progress"
      ).length;
      setActiveSOSCount(activeCount);
    }
  }, [sosQuery.data]);

  const isSubscriber = useMemo(() => {
    return subscription !== null && subscription.isActive;
  }, [subscription]);

  const calculateSOSMultiplier = useCallback((urgencyLevel: SOSUrgencyLevel): number => {
    let multiplier = SOS_PRICING.expressMultiplier;
    
    if (isSubscriber) {
      multiplier = multiplier * (1 - SOS_PRICING.subscriberDiscount);
    }
    
    return multiplier;
  }, [isSubscriber]);

  const calculateSOSPrice = useCallback((basePrice: number, urgencyLevel: SOSUrgencyLevel): number => {
    const multiplier = calculateSOSMultiplier(urgencyLevel);
    return Math.round(basePrice * multiplier);
  }, [calculateSOSMultiplier]);

  const getEstimatedDeliveryTime = useCallback((urgencyLevel: SOSUrgencyLevel): Date => {
    const now = new Date();
    const minutes = SOS_PRICING.expressDeliveryTime;
    return new Date(now.getTime() + minutes * 60 * 1000);
  }, []);

  const createSOSRequest = useCallback((urgencyLevel: SOSUrgencyLevel): SOSRequest => {
    const now = new Date();
    const multiplier = calculateSOSMultiplier(urgencyLevel);
    
    const newRequest: SOSRequest = {
      id: `SOS-${Date.now()}`,
      urgencyLevel,
      requestedAt: now,
      estimatedDelivery: getEstimatedDeliveryTime(urgencyLevel),
      isSubscriber,
      multiplier,
      status: "pending",
    };

    const updated = [...sosRequests, newRequest];
    setSosRequests(updated);
    syncRequests(updated);
    setActiveSOSCount(activeSOSCount + 1);

    console.log("[SOSContext] Created SOS request:", newRequest);
    return newRequest;
  }, [sosRequests, isSubscriber, calculateSOSMultiplier, getEstimatedDeliveryTime, syncRequests, activeSOSCount]);

  const updateSOSStatus = useCallback((sosId: string, status: SOSRequest["status"]) => {
    const updated = sosRequests.map(req => {
      if (req.id === sosId) {
        return { ...req, status };
      }
      return req;
    });
    
    setSosRequests(updated);
    syncRequests(updated);
    
    const activeCount = updated.filter(
      req => req.status === "pending" || req.status === "accepted" || req.status === "in_progress"
    ).length;
    setActiveSOSCount(activeCount);
  }, [sosRequests, syncRequests]);

  const linkSOSToOrder = useCallback((sosId: string, orderId: string) => {
    const updated = sosRequests.map(req => {
      if (req.id === sosId) {
        return { ...req, orderId, status: "accepted" as const };
      }
      return req;
    });
    
    setSosRequests(updated);
    syncRequests(updated);
  }, [sosRequests, syncRequests]);

  const getActiveSOSRequests = useCallback(() => {
    return sosRequests.filter(
      req => req.status === "pending" || req.status === "accepted" || req.status === "in_progress"
    );
  }, [sosRequests]);

  const canRequestSOS = useMemo(() => {
    return activeSOSCount < 2;
  }, [activeSOSCount]);

  const getSOSPricing = useCallback(() => {
    return {
      ...SOS_PRICING,
      isSubscriber,
      subscriberBenefit: isSubscriber ? `${SOS_PRICING.subscriberDiscount * 100}% خصم` : null,
    };
  }, [isSubscriber]);

  return useMemo(
    () => ({
      sosRequests,
      activeSOSCount,
      isSubscriber,
      isLoading: sosQuery.isLoading,
      createSOSRequest,
      calculateSOSPrice,
      calculateSOSMultiplier,
      getEstimatedDeliveryTime,
      updateSOSStatus,
      linkSOSToOrder,
      getActiveSOSRequests,
      canRequestSOS,
      getSOSPricing,
    }),
    [
      sosRequests,
      activeSOSCount,
      isSubscriber,
      sosQuery.isLoading,
      createSOSRequest,
      calculateSOSPrice,
      calculateSOSMultiplier,
      getEstimatedDeliveryTime,
      updateSOSStatus,
      linkSOSToOrder,
      getActiveSOSRequests,
      canRequestSOS,
      getSOSPricing,
    ]
  );
});
