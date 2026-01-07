export type SOSUrgencyLevel = "express";

export type SOSPricing = {
  baseMultiplier: number;
  subscriberDiscount: number;
  expressMultiplier: number;
  expressDeliveryTime: number;
};

export type SOSRequest = {
  id: string;
  orderId?: string;
  urgencyLevel: SOSUrgencyLevel;
  requestedAt: Date;
  estimatedDelivery: Date;
  isSubscriber: boolean;
  multiplier: number;
  status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled";
};
