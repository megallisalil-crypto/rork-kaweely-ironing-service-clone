export type LoyaltyTier = "bronze" | "silver" | "gold" | "platinum";

export type LoyaltyReward = {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  type: "discount" | "free_service" | "upgrade";
  value: number;
  icon: string;
};

export type LoyaltyTransaction = {
  id: string;
  type: "earned" | "redeemed";
  points: number;
  description: string;
  date: Date;
  orderId?: string;
};

export type UserLoyalty = {
  points: number;
  tier: LoyaltyTier;
  lifetimePoints: number;
  transactions: LoyaltyTransaction[];
};
