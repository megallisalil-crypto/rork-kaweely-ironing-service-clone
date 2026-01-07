export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  type: 'service' | 'product';
};

export type PremiumService = {
  id: string;
  name: string;
  price: number;
  enabled: boolean;
};

export type Cart = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  deliveryCost: number;
  premiumServices: PremiumService[];
};
