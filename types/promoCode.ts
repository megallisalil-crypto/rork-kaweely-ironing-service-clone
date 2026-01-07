export type PromoCodeType = 'percentage' | 'free_order';

export interface PromoCode {
  id: string;
  code: string;
  type: PromoCodeType;
  discountPercentage?: number;
  isActive: boolean;
  usageLimit: number;
  usageCount: number;
  createdAt: Date;
  expiresAt?: Date;
  description?: string;
}

export interface AppliedPromoCode {
  code: string;
  type: PromoCodeType;
  discountAmount: number;
  discountPercentage?: number;
}
