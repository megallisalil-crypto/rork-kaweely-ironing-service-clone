import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect, useMemo, useCallback } from "react";
import { UserLoyalty, LoyaltyTier, LoyaltyTransaction, LoyaltyReward } from "@/types/loyalty";

const STORAGE_KEY = "kaweely_loyalty";

const tierThresholds = {
  bronze: 0,
  silver: 500,
  gold: 1500,
  platinum: 3000,
};

const availableRewards: LoyaltyReward[] = [
  {
    id: "1",
    title: "15% Discount",
    description: "Get 15% off your next order",
    pointsCost: 200,
    type: "discount",
    value: 15,
    icon: "tag",
  },
  {
    id: "2",
    title: "Free Express Delivery",
    description: "One free express delivery service",
    pointsCost: 300,
    type: "free_service",
    value: 1,
    icon: "zap",
  },
  {
    id: "3",
    title: "25% Discount",
    description: "Get 25% off your next order",
    pointsCost: 400,
    type: "discount",
    value: 25,
    icon: "sparkles",
  },
  {
    id: "4",
    title: "Premium Upgrade",
    description: "Upgrade to premium service for free",
    pointsCost: 500,
    type: "upgrade",
    value: 1,
    icon: "crown",
  },
  {
    id: "5",
    title: "Free Order (up to EGP 100)",
    description: "Get a free order up to EGP 100",
    pointsCost: 800,
    type: "free_service",
    value: 100,
    icon: "gift",
  },
];

const initialLoyalty: UserLoyalty = {
  points: 0,
  tier: "bronze",
  lifetimePoints: 0,
  transactions: [],
};

export const [LoyaltyProvider, useLoyalty] = createContextHook(() => {
  const [loyalty, setLoyalty] = useState<UserLoyalty>(initialLoyalty);

  const loyaltyQuery = useQuery({
    queryKey: ["loyalty"],
    queryFn: async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored && typeof stored === 'string' && stored.trim().length > 0) {
          const trimmedStored = stored.trim();
          
          if (!trimmedStored.startsWith('{') && !trimmedStored.startsWith('[')) {
            console.warn("Stored loyalty value is not valid JSON, clearing and using initial data");
            try {
              await AsyncStorage.removeItem(STORAGE_KEY);
            } catch (e) {
              console.error("Error removing invalid loyalty data:", e);
            }
            return initialLoyalty;
          }
          
          try {
            const parsed: UserLoyalty = JSON.parse(trimmedStored);
            return {
              ...parsed,
              transactions: parsed.transactions.map((t) => ({
                ...t,
                date: new Date(t.date),
              })),
            };
          } catch (parseError) {
            console.error("Error parsing loyalty data:", parseError);
            try {
              await AsyncStorage.removeItem(STORAGE_KEY);
            } catch (e) {
              console.error("Error removing corrupted loyalty data:", e);
            }
            return initialLoyalty;
          }
        }
        return initialLoyalty;
      } catch (error) {
        console.error("Error loading loyalty data:", error);
        try {
          await AsyncStorage.removeItem(STORAGE_KEY);
        } catch (e) {
          console.error("Error clearing loyalty AsyncStorage:", e);
        }
        return initialLoyalty;
      }
    },
  });

  const syncMutation = useMutation({
    mutationFn: async (updatedLoyalty: UserLoyalty) => {
      try {
        const jsonString = JSON.stringify(updatedLoyalty);
        if (!jsonString || jsonString === 'undefined' || jsonString === 'null') {
          console.error('Invalid JSON string generated for loyalty');
          return updatedLoyalty;
        }
        await AsyncStorage.setItem(STORAGE_KEY, jsonString);
        return updatedLoyalty;
      } catch (error) {
        console.error('Error syncing loyalty:', error);
        return updatedLoyalty;
      }
    },
  });

  const { mutate: syncLoyalty } = syncMutation;

  useEffect(() => {
    if (loyaltyQuery.data) {
      setLoyalty(loyaltyQuery.data);
    }
  }, [loyaltyQuery.data]);

  const calculateTier = useCallback((lifetimePoints: number): LoyaltyTier => {
    if (lifetimePoints >= tierThresholds.platinum) return "platinum";
    if (lifetimePoints >= tierThresholds.gold) return "gold";
    if (lifetimePoints >= tierThresholds.silver) return "silver";
    return "bronze";
  }, []);

  const earnPoints = useCallback(
    (amount: number, description: string, orderId?: string) => {
      const transaction: LoyaltyTransaction = {
        id: Date.now().toString(),
        type: "earned",
        points: amount,
        description,
        date: new Date(),
        orderId,
      };

      const newLifetimePoints = loyalty.lifetimePoints + amount;
      const newTier = calculateTier(newLifetimePoints);

      const updated: UserLoyalty = {
        points: loyalty.points + amount,
        tier: newTier,
        lifetimePoints: newLifetimePoints,
        transactions: [transaction, ...loyalty.transactions],
      };

      setLoyalty(updated);
      syncLoyalty(updated);

      return updated;
    },
    [loyalty, calculateTier, syncLoyalty]
  );

  const redeemPoints = useCallback(
    (pointsCost: number, description: string) => {
      if (loyalty.points < pointsCost) {
        return null;
      }

      const transaction: LoyaltyTransaction = {
        id: Date.now().toString(),
        type: "redeemed",
        points: pointsCost,
        description,
        date: new Date(),
      };

      const updated: UserLoyalty = {
        ...loyalty,
        points: loyalty.points - pointsCost,
        transactions: [transaction, ...loyalty.transactions],
      };

      setLoyalty(updated);
      syncLoyalty(updated);

      return updated;
    },
    [loyalty, syncLoyalty]
  );

  const pointsToNextTier = useMemo(() => {
    const currentTier = loyalty.tier;
    if (currentTier === "platinum") return 0;

    const nextTier: LoyaltyTier =
      currentTier === "bronze"
        ? "silver"
        : currentTier === "silver"
        ? "gold"
        : "platinum";

    return tierThresholds[nextTier] - loyalty.lifetimePoints;
  }, [loyalty]);

  return useMemo(
    () => ({
      loyalty,
      availableRewards,
      earnPoints,
      redeemPoints,
      pointsToNextTier,
      isLoading: loyaltyQuery.isLoading,
    }),
    [loyalty, earnPoints, redeemPoints, pointsToNextTier, loyaltyQuery.isLoading]
  );
});
