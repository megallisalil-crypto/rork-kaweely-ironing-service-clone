export type DriverStatus = 'available' | 'busy' | 'offline';

export type DriverStats = {
  totalEarnings: number;
  todayEarnings: number;
  totalDeliveries: number;
  todayDeliveries: number;
  averageRating: number;
  completionRate: number;
  activeTime: number;
};

export type DriverLocation = {
  latitude: number;
  longitude: number;
  heading?: number;
};

export type DriverProfile = {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicleType: string;
  vehiclePlate: string;
  licenseNumber: string;
  status: DriverStatus;
  currentLocation?: DriverLocation;
  isOnline: boolean;
  rating: number;
  completedOrders: number;
  stats: DriverStats;
  createdAt: Date;
  lastActive: Date;
};

export type DriverOrder = {
  id: string;
  orderNumber: string;
  type: 'pickup' | 'delivery';
  customerName: string;
  customerPhone: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  status: 'assigned' | 'en_route' | 'arrived' | 'completed';
  assignedAt: Date;
  estimatedTime?: number;
  distance?: number;
  earnings: number;
  items: Array<{
    name: string;
    quantity: number;
  }>;
  notes?: string;
};

export type DriverNotification = {
  id: string;
  type: 'new_order' | 'order_update' | 'payment' | 'rating' | 'system';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: Date;
};

export type DriverEarning = {
  id: string;
  orderId: string;
  orderNumber: string;
  amount: number;
  type: 'pickup' | 'delivery' | 'bonus' | 'tip';
  date: Date;
  paid: boolean;
};
