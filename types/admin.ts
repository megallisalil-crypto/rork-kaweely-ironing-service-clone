import { OrderStatus, SubscriptionType } from "./order";
import { PromoCode } from "./promoCode";

export type AdminRole = "super_admin" | "manager" | "support";

export type AdminProfile = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  permissions: AdminPermission[];
  createdAt: Date;
  lastLogin?: Date;
};

export type AdminPermission = 
  | "view_orders" 
  | "edit_orders" 
  | "manage_users" 
  | "view_analytics" 
  | "manage_pricing"
  | "manage_promo_codes"
  | "manage_subscriptions"
  | "view_reports"
  | "manage_settings"
  | "delete_data";

export type OrderMetrics = {
  totalOrders: number;
  pendingOrders: number;
  completedToday: number;
  revenue: number;
  averageOrderValue: number;
  customerSatisfaction: number;
};

export type StatusChangeRequest = {
  orderId: string;
  newStatus: OrderStatus;
  reason?: string;
  changedBy: string;
};

export type AdvancedAnalytics = {
  dailyRevenue: { date: string; revenue: number; orders: number }[];
  weeklyRevenue: { week: string; revenue: number; orders: number }[];
  monthlyRevenue: { month: string; revenue: number; orders: number }[];
  popularServices: { name: string; count: number; revenue: number }[];
  peakHours: { hour: number; orders: number }[];
  customerRetention: number;
  averageDeliveryTime: number;
  orderStatusDistribution: { status: OrderStatus; count: number; percentage: number }[];
};

export type RevenueStats = {
  today: number;
  yesterday: number;
  thisWeek: number;
  lastWeek: number;
  thisMonth: number;
  lastMonth: number;
  growth: {
    daily: number;
    weekly: number;
    monthly: number;
  };
};

export type CustomerStats = {
  totalCustomers: number;
  newCustomersToday: number;
  newCustomersThisWeek: number;
  newCustomersThisMonth: number;
  activeSubscriptions: number;
  returningCustomers: number;
  averageOrdersPerCustomer: number;
};

export type ServiceStats = {
  mostPopularService: string;
  leastPopularService: string;
  totalServicesCompleted: number;
  averageServiceTime: number;
  expressOrders: number;
  standardOrders: number;
};

export type PromoCodeStats = {
  totalCodes: number;
  activeCodes: number;
  expiredCodes: number;
  totalUsage: number;
  totalDiscountGiven: number;
  mostUsedCode: { code: string; usage: number } | null;
};

export type SubscriptionStats = {
  activeSubscriptions: number;
  totalSubscribers: number;
  subscriptionRevenue: number;
  popularPlan: string;
  churnRate: number;
  averageSubscriptionLength: number;
};

export type SystemSettings = {
  deliveryFee: number;
  expressFee: number;
  minimumOrderValue: number;
  taxRate: number;
  maintenanceMode: boolean;
  acceptingOrders: boolean;
  businessHours: {
    open: string;
    close: string;
    days: string[];
  };
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
};

export type AdminLog = {
  id: string;
  action: string;
  description: string;
  adminId: string;
  adminName: string;
  timestamp: Date;
  metadata?: Record<string, any>;
};
