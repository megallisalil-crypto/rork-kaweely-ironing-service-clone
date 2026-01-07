export type OrderStatus = "pending" | "pickup_scheduled" | "pickup_in_progress" | "processing" | "ready" | "delivery_in_progress" | "completed" | "cancelled";

export type SubscriptionType = "week" | "month" | "3months" | "6months" | "year" | "student" | "couples" | "mothers" | "none";

export type ClothingItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  specialCare?: string[];
};

export type DeliveryDays = string[];

export type DriverLocation = {
  latitude: number;
  longitude: number;
  timestamp: Date;
};

export type PremiumService = {
  id: string;
  name: string;
  price: number;
  selected: boolean;
};

export type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  phoneNumber: string;
  items: ClothingItem[];
  totalPrice: number;
  status: OrderStatus;
  subscription: SubscriptionType;
  createdAt: Date;
  updatedAt: Date;
  pickupDate?: Date;
  deliveryDays?: DeliveryDays;
  selectedTimeSlot?: string;
  deliveryAddress?: string;
  notes?: string;
  assignedDriverId?: string;
  assignedDriverName?: string;
  driverLocation?: DriverLocation;
  estimatedArrival?: Date;
  isExpress?: boolean;
  expressDeliveryTime?: Date;
  premiumServices?: PremiumService[];
  isSOS?: boolean;
  sosActivatedAt?: Date;
  sosDeliveryTime?: Date;
  sosMultiplier?: number;
  statusHistory: {
    status: OrderStatus;
    timestamp: Date;
  }[];
};

export type OrderStats = {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  cancelled: number;
};
