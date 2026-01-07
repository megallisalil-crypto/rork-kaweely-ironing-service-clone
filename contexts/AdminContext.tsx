import { createContext, useContext, ReactNode, useState, useEffect, useMemo, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { 
  AdminProfile, 
  OrderMetrics, 
  AdvancedAnalytics,
  RevenueStats,
  CustomerStats,
  ServiceStats,
  PromoCodeStats,
  SubscriptionStats,
  SystemSettings,
  AdminLog
} from "@/types/admin";
import { Order, OrderStatus, OrderStats, ClothingItem } from "@/types/order";
import { OrderManager } from "@/utils/OrderManager";
import { safeJsonParse, safeJsonStringify } from "@/utils/safeJsonParse";

const ADMIN_STORAGE_KEY = "kaweely_admin_profile_v2";
const ADMIN_LOGS_KEY = "kaweely_admin_logs";
const ADMIN_SETTINGS_KEY = "kaweely_admin_settings";

type AdminContextType = {
  adminProfile: AdminProfile | null;
  orders: Order[];
  stats: OrderStats;
  metrics: OrderMetrics;
  revenueStats: RevenueStats;
  customerStats: CustomerStats;
  serviceStats: ServiceStats;
  promoCodeStats: PromoCodeStats;
  subscriptionStats: SubscriptionStats;
  analytics: AdvancedAnalytics;
  systemSettings: SystemSettings;
  adminLogs: AdminLog[];
  isLoading: boolean;
  createAdminProfile: (data: { name: string; email: string }) => Promise<AdminProfile>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  bulkUpdateOrders: (orderIds: string[], status: OrderStatus) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  createTestOrder: () => Promise<void>;
  clearAllData: () => Promise<void>;
  clearOrders: () => Promise<void>;
  clearPromoCodes: () => Promise<void>;
  clearSubscriptions: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  updateSystemSettings: (settings: Partial<SystemSettings>) => Promise<void>;
  exportData: (type: 'orders' | 'analytics' | 'all') => Promise<string>;
  logAction: (action: string, description: string, metadata?: Record<string, any>) => Promise<void>;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const defaultSystemSettings: SystemSettings = {
  deliveryFee: 15,
  expressFee: 50,
  minimumOrderValue: 100,
  taxRate: 0.05,
  maintenanceMode: false,
  acceptingOrders: true,
  businessHours: {
    open: "08:00",
    close: "22:00",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  },
  notifications: {
    email: true,
    sms: true,
    push: true,
  },
};

export function AdminProvider({ children }: { children: ReactNode }) {
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(defaultSystemSettings);
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAdminProfile = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(ADMIN_STORAGE_KEY);
      if (stored) {
        const profile = safeJsonParse<AdminProfile>(stored);
        if (profile && profile.id) {
          console.log('[AdminContext] ✅ Loaded admin profile:', profile.name);
          setAdminProfile(profile);
          
          const updatedProfile = { ...profile, lastLogin: new Date() };
          const jsonString = safeJsonStringify(updatedProfile);
          if (jsonString) {
            await AsyncStorage.setItem(ADMIN_STORAGE_KEY, jsonString);
          }
          setAdminProfile(updatedProfile);
        } else {
          console.warn('[AdminContext] Invalid admin profile data');
          await AsyncStorage.removeItem(ADMIN_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('[AdminContext] Failed to load admin profile:', error);
      await AsyncStorage.removeItem(ADMIN_STORAGE_KEY);
    }
  }, []);

  const loadOrders = useCallback(async () => {
    try {
      const loadedOrders = await OrderManager.getAllOrders();
      console.log('[AdminContext] ✅ Loaded', loadedOrders.length, 'orders');
      setOrders(loadedOrders);
    } catch (error) {
      console.error('[AdminContext] Failed to load orders:', error);
      setOrders([]);
    }
  }, []);

  const loadSystemSettings = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(ADMIN_SETTINGS_KEY);
      if (stored) {
        const settings = safeJsonParse<SystemSettings>(stored);
        if (settings) {
          console.log('[AdminContext] ✅ Loaded system settings');
          setSystemSettings(settings);
        } else {
          console.warn('[AdminContext] Invalid settings data');
          await AsyncStorage.removeItem(ADMIN_SETTINGS_KEY);
        }
      }
    } catch (error) {
      console.error('[AdminContext] Failed to load settings:', error);
      await AsyncStorage.removeItem(ADMIN_SETTINGS_KEY);
    }
  }, []);

  const loadAdminLogs = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(ADMIN_LOGS_KEY);
      if (stored) {
        const logs = safeJsonParse<AdminLog[]>(stored);
        if (logs && Array.isArray(logs)) {
          const logsWithDates = logs.map(log => ({
            ...log,
            timestamp: new Date(log.timestamp),
          }));
          console.log('[AdminContext] ✅ Loaded', logsWithDates.length, 'admin logs');
          setAdminLogs(logsWithDates.slice(-100));
        } else {
          console.warn('[AdminContext] Invalid logs data');
          await AsyncStorage.removeItem(ADMIN_LOGS_KEY);
        }
      }
    } catch (error) {
      console.error('[AdminContext] Failed to load logs:', error);
      await AsyncStorage.removeItem(ADMIN_LOGS_KEY);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await Promise.all([
        loadAdminProfile(), 
        loadOrders(), 
        loadSystemSettings(),
        loadAdminLogs()
      ]);
      setIsLoading(false);
    };
    init();
  }, [loadAdminProfile, loadOrders, loadSystemSettings, loadAdminLogs]);

  useEffect(() => {
    console.log('[AdminContext] Setting up OrderManager subscription');
    const unsubscribe = OrderManager.subscribeToChanges((updatedOrders) => {
      console.log('[AdminContext] 📬 Orders updated:', updatedOrders.length);
      setOrders(updatedOrders);
    });
    return unsubscribe;
  }, []);

  const logAction = useCallback(async (
    action: string, 
    description: string, 
    metadata?: Record<string, any>
  ) => {
    if (!adminProfile) return;

    const newLog: AdminLog = {
      id: Date.now().toString(),
      action,
      description,
      adminId: adminProfile.id,
      adminName: adminProfile.name,
      timestamp: new Date(),
      metadata,
    };

    const updatedLogs = [newLog, ...adminLogs].slice(0, 100);
    setAdminLogs(updatedLogs);
    const jsonString = safeJsonStringify(updatedLogs);
    if (jsonString) {
      await AsyncStorage.setItem(ADMIN_LOGS_KEY, jsonString);
    }
    console.log('[AdminContext] 📝 Logged action:', action);
  }, [adminProfile, adminLogs]);

  const createAdminProfile = useCallback(async (profileData: {
    name: string;
    email: string;
  }) => {
    const newProfile: AdminProfile = {
      id: Date.now().toString(),
      ...profileData,
      role: "super_admin",
      permissions: [
        "view_orders",
        "edit_orders",
        "manage_users",
        "view_analytics",
        "manage_pricing",
        "manage_promo_codes",
        "manage_subscriptions",
        "view_reports",
        "manage_settings",
        "delete_data",
      ],
      createdAt: new Date(),
      lastLogin: new Date(),
    };

    console.log('[AdminContext] Creating admin profile:', newProfile.name);
    const jsonString = safeJsonStringify(newProfile);
    if (jsonString) {
      await AsyncStorage.setItem(ADMIN_STORAGE_KEY, jsonString);
    }
    setAdminProfile(newProfile);
    await logAction('PROFILE_CREATED', `Admin profile created for ${newProfile.name}`);
    console.log('[AdminContext] ✅ Admin profile saved');
    
    return newProfile;
  }, [logAction]);

  const updateOrderStatus = useCallback(async (orderId: string, newStatus: OrderStatus) => {
    console.log('[AdminContext] Updating order:', orderId, 'to', newStatus);
    await OrderManager.updateOrderStatus(orderId, newStatus);
    await logAction('ORDER_STATUS_UPDATED', `Order ${orderId} status updated to ${newStatus}`, { orderId, newStatus });
  }, [logAction]);

  const bulkUpdateOrders = useCallback(async (orderIds: string[], newStatus: OrderStatus) => {
    console.log('[AdminContext] Bulk updating', orderIds.length, 'orders to', newStatus);
    for (const orderId of orderIds) {
      await OrderManager.updateOrderStatus(orderId, newStatus);
    }
    await logAction('BULK_UPDATE', `${orderIds.length} orders updated to ${newStatus}`, { orderIds, newStatus });
  }, [logAction]);

  const deleteOrder = useCallback(async (orderId: string) => {
    console.log('[AdminContext] Deleting order:', orderId);
    const allOrders = await OrderManager.getAllOrders();
    const updated = allOrders.filter(o => o.id !== orderId);
    await OrderManager.saveOrders(updated);
    await logAction('ORDER_DELETED', `Order ${orderId} deleted`, { orderId });
  }, [logAction]);

  const createTestOrder = useCallback(async () => {
    const testOrder: Order = {
      id: Date.now().toString(),
      orderNumber: `TEST-${String(orders.length + 1).padStart(3, "0")}`,
      customerName: "Test Customer",
      phoneNumber: "+1234567890",
      items: [
        {
          id: "1",
          name: "T-Shirt",
          category: "Shirts",
          quantity: 2,
          price: 50,
        } as ClothingItem,
        {
          id: "2",
          name: "Jeans",
          category: "Pants",
          quantity: 1,
          price: 80,
        } as ClothingItem,
      ],
      subscription: "none",
      totalPrice: 180,
      status: "pickup_scheduled",
      createdAt: new Date(),
      updatedAt: new Date(),
      pickupDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      statusHistory: [
        { status: "pending", timestamp: new Date() },
        { status: "pickup_scheduled", timestamp: new Date() },
      ],
    };

    console.log('[AdminContext] Creating test order:', testOrder.orderNumber);
    await OrderManager.addOrder(testOrder);
    await logAction('TEST_ORDER_CREATED', `Test order ${testOrder.orderNumber} created`);
    console.log('[AdminContext] ✅ Test order created');
  }, [orders.length, logAction]);

  const clearOrders = useCallback(async () => {
    console.log('[AdminContext] 🗑️ Clearing all orders');
    await AsyncStorage.removeItem("kaweely_orders");
    setOrders([]);
    await logAction('ORDERS_CLEARED', 'All orders cleared from system');
    console.log('[AdminContext] ✅ Orders cleared');
  }, [logAction]);

  const clearPromoCodes = useCallback(async () => {
    console.log('[AdminContext] 🗑️ Clearing all promo codes');
    await AsyncStorage.removeItem("kaweely_promo_codes");
    await logAction('PROMO_CODES_CLEARED', 'All promo codes cleared');
    console.log('[AdminContext] ✅ Promo codes cleared');
  }, [logAction]);

  const clearSubscriptions = useCallback(async () => {
    console.log('[AdminContext] 🗑️ Clearing all subscriptions');
    await AsyncStorage.removeItem("kaweely_subscription");
    await logAction('SUBSCRIPTIONS_CLEARED', 'All subscriptions cleared');
    console.log('[AdminContext] ✅ Subscriptions cleared');
  }, [logAction]);

  const clearAllData = useCallback(async () => {
    console.log('[AdminContext] 🗑️ Clearing all admin and app data');
    await AsyncStorage.multiRemove([
      ADMIN_STORAGE_KEY,
      ADMIN_LOGS_KEY,
      "kaweely_orders",
      "kaweely_admin_profile",
      "kaweely_promo_codes",
      "kaweely_subscription",
      "kaweely_wallet",
      "kaweely_cart",
    ]);
    setAdminProfile(null);
    setOrders([]);
    setAdminLogs([]);
    console.log('[AdminContext] ✅ All data cleared');
  }, []);

  const refreshOrders = useCallback(async () => {
    await loadOrders();
  }, [loadOrders]);

  const updateSystemSettings = useCallback(async (newSettings: Partial<SystemSettings>) => {
    const updated = { ...systemSettings, ...newSettings };
    setSystemSettings(updated);
    const jsonString = safeJsonStringify(updated);
    if (jsonString) {
      await AsyncStorage.setItem(ADMIN_SETTINGS_KEY, jsonString);
    }
    await logAction('SETTINGS_UPDATED', 'System settings updated', { settings: newSettings });
    console.log('[AdminContext] ✅ System settings updated');
  }, [systemSettings, logAction]);

  const stats: OrderStats = useMemo(() => {
    const stats: OrderStats = {
      total: orders.length,
      pending: 0,
      processing: 0,
      completed: 0,
      cancelled: 0,
    };

    orders.forEach((order) => {
      if (order.status in stats) {
        stats[order.status as keyof typeof stats]++;
      }
    });

    return stats;
  }, [orders]);

  const metrics: OrderMetrics = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const completedToday = orders.filter(
      (o) => o.status === "completed" && o.updatedAt >= todayStart
    );

    const revenue = orders
      .filter((o) => o.status === "completed")
      .reduce((sum, o) => sum + o.totalPrice, 0);

    const avgOrderValue = orders.length > 0 ? revenue / orders.length : 0;

    const completedOrders = orders.filter((o) => o.status === "completed");
    const totalRating = completedOrders.length * 4.5;
    const customerSatisfaction = completedOrders.length > 0 ? totalRating / completedOrders.length : 0;

    return {
      totalOrders: orders.length,
      pendingOrders: orders.filter(
        (o) => o.status === "pending" || o.status === "pickup_scheduled"
      ).length,
      completedToday: completedToday.length,
      revenue,
      averageOrderValue: avgOrderValue,
      customerSatisfaction,
    };
  }, [orders]);

  const revenueStats: RevenueStats = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(thisWeekStart.getDate() - now.getDay());
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const completedOrders = orders.filter(o => o.status === "completed");

    const today = completedOrders.filter(o => o.updatedAt >= todayStart).reduce((sum, o) => sum + o.totalPrice, 0);
    const yesterday = completedOrders.filter(o => o.updatedAt >= yesterdayStart && o.updatedAt < todayStart).reduce((sum, o) => sum + o.totalPrice, 0);
    const thisWeek = completedOrders.filter(o => o.updatedAt >= thisWeekStart).reduce((sum, o) => sum + o.totalPrice, 0);
    const lastWeek = completedOrders.filter(o => o.updatedAt >= lastWeekStart && o.updatedAt < thisWeekStart).reduce((sum, o) => sum + o.totalPrice, 0);
    const thisMonth = completedOrders.filter(o => o.updatedAt >= thisMonthStart).reduce((sum, o) => sum + o.totalPrice, 0);
    const lastMonth = completedOrders.filter(o => o.updatedAt >= lastMonthStart && o.updatedAt < thisMonthStart).reduce((sum, o) => sum + o.totalPrice, 0);

    return {
      today,
      yesterday,
      thisWeek,
      lastWeek,
      thisMonth,
      lastMonth,
      growth: {
        daily: yesterday > 0 ? ((today - yesterday) / yesterday) * 100 : 0,
        weekly: lastWeek > 0 ? ((thisWeek - lastWeek) / lastWeek) * 100 : 0,
        monthly: lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0,
      },
    };
  }, [orders]);

  const customerStats: CustomerStats = useMemo(() => {
    const uniqueCustomers = new Set(orders.map(o => o.customerName));
    
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const newToday = new Set(orders.filter(o => o.createdAt >= todayStart).map(o => o.customerName)).size;
    const newThisWeek = new Set(orders.filter(o => o.createdAt >= weekStart).map(o => o.customerName)).size;
    const newThisMonth = new Set(orders.filter(o => o.createdAt >= monthStart).map(o => o.customerName)).size;

    const customerOrderCounts = new Map<string, number>();
    orders.forEach(o => {
      customerOrderCounts.set(o.customerName, (customerOrderCounts.get(o.customerName) || 0) + 1);
    });
    const returningCustomers = Array.from(customerOrderCounts.values()).filter(count => count > 1).length;

    return {
      totalCustomers: uniqueCustomers.size,
      newCustomersToday: newToday,
      newCustomersThisWeek: newThisWeek,
      newCustomersThisMonth: newThisMonth,
      activeSubscriptions: 0,
      returningCustomers,
      averageOrdersPerCustomer: uniqueCustomers.size > 0 ? orders.length / uniqueCustomers.size : 0,
    };
  }, [orders]);

  const serviceStats: ServiceStats = useMemo(() => {
    const expressOrders = orders.filter(o => o.isExpress).length;
    const completedOrders = orders.filter(o => o.status === "completed");
    
    return {
      mostPopularService: "Dry Cleaning",
      leastPopularService: "Alterations",
      totalServicesCompleted: completedOrders.length,
      averageServiceTime: 48,
      expressOrders,
      standardOrders: orders.length - expressOrders,
    };
  }, [orders]);

  const promoCodeStats: PromoCodeStats = useMemo(() => {
    return {
      totalCodes: 0,
      activeCodes: 0,
      expiredCodes: 0,
      totalUsage: 0,
      totalDiscountGiven: 0,
      mostUsedCode: null,
    };
  }, []);

  const subscriptionStats: SubscriptionStats = useMemo(() => {
    return {
      activeSubscriptions: 0,
      totalSubscribers: 0,
      subscriptionRevenue: 0,
      popularPlan: "Monthly",
      churnRate: 0,
      averageSubscriptionLength: 0,
    };
  }, []);

  const analytics: AdvancedAnalytics = useMemo(() => {
    const completedOrders = orders.filter(o => o.status === "completed");
    
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();

    const dailyRevenue = last7Days.map(date => {
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      
      const dayOrders = completedOrders.filter(o => o.updatedAt >= dayStart && o.updatedAt < dayEnd);
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: dayOrders.reduce((sum, o) => sum + o.totalPrice, 0),
        orders: dayOrders.length,
      };
    });

    const statusDistribution = [
      'pending', 'pickup_scheduled', 'pickup_in_progress', 
      'processing', 'ready', 'delivery_in_progress', 
      'completed', 'cancelled'
    ].map(status => {
      const count = orders.filter(o => o.status === status).length;
      return {
        status: status as OrderStatus,
        count,
        percentage: orders.length > 0 ? (count / orders.length) * 100 : 0,
      };
    });

    return {
      dailyRevenue,
      weeklyRevenue: [],
      monthlyRevenue: [],
      popularServices: [],
      peakHours: [],
      customerRetention: 0,
      averageDeliveryTime: 48,
      orderStatusDistribution: statusDistribution,
    };
  }, [orders]);

  const exportData = useCallback(async (type: 'orders' | 'analytics' | 'all'): Promise<string> => {
    const data: any = {};
    
    if (type === 'orders' || type === 'all') {
      data.orders = orders;
    }
    
    if (type === 'analytics' || type === 'all') {
      data.analytics = {
        metrics,
        revenueStats,
        customerStats,
        serviceStats,
      };
    }
    
    if (type === 'all') {
      data.settings = systemSettings;
      data.logs = adminLogs;
    }

    await logAction('DATA_EXPORTED', `Data exported: ${type}`);
    return JSON.stringify(data, null, 2);
  }, [orders, metrics, revenueStats, customerStats, serviceStats, systemSettings, adminLogs, logAction]);

  const value = useMemo(
    () => ({
      adminProfile,
      orders,
      stats,
      metrics,
      revenueStats,
      customerStats,
      serviceStats,
      promoCodeStats,
      subscriptionStats,
      analytics,
      systemSettings,
      adminLogs,
      isLoading,
      createAdminProfile,
      updateOrderStatus,
      bulkUpdateOrders,
      deleteOrder,
      createTestOrder,
      clearAllData,
      clearOrders,
      clearPromoCodes,
      clearSubscriptions,
      refreshOrders,
      updateSystemSettings,
      exportData,
      logAction,
    }),
    [
      adminProfile,
      orders,
      stats,
      metrics,
      revenueStats,
      customerStats,
      serviceStats,
      promoCodeStats,
      subscriptionStats,
      analytics,
      systemSettings,
      adminLogs,
      isLoading,
      createAdminProfile,
      updateOrderStatus,
      bulkUpdateOrders,
      deleteOrder,
      createTestOrder,
      clearAllData,
      clearOrders,
      clearPromoCodes,
      clearSubscriptions,
      refreshOrders,
      updateSystemSettings,
      exportData,
      logAction,
    ]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
}
