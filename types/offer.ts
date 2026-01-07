export type OfferType = "birthday" | "mothers_day" | "islamic_event" | "egyptian_holiday" | "special";

export type SpecialOffer = {
  id: string;
  type: OfferType;
  title: string;
  description: string;
  discountPercentage: number;
  validUntil: Date;
  eventName: string;
  icon: string;
  isActive: boolean;
  backgroundColor?: string;
};

export type EventDate = {
  name: string;
  type: OfferType;
  gregorianDate?: string;
  islamicMonth?: number;
  islamicDay?: number;
  discountPercentage: number;
  icon: string;
  description: string;
  durationDays: number;
  backgroundColor?: string;
};
