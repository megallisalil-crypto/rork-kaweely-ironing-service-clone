import { useState, useEffect, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { DriverProfile, DriverStatus, DriverOrder, DriverNotification, DriverEarning } from "@/types/driver";
import { safeJsonParse, safeJsonStringify } from "@/utils/safeJsonParse";
import { OrderManager } from "@/utils/OrderManager";
import { Order } from "@/types/order";

const DRIVER_STORAGE_KEY = "kaweely_driver_profile";
const DRIVER_ORDERS_KEY = "kaweely_driver_orders";
const DRIVER_NOTIFICATIONS_KEY = "kaweely_driver_notifications";
const DRIVER_EARNINGS_KEY = "kaweely_driver_earnings";

export const [DriverProvider, useDriver] = createContextHook(() => {
  const [driverProfile, setDriverProfile] = useState<DriverProfile | null>(null);
  const [driverOrders, setDriverOrders] = useState<DriverOrder[]>([]);
  const [notifications, setNotifications] = useState<DriverNotification[]>([]);
  const [earnings, setEarnings] = useState<DriverEarning[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDriver();
  }, []);

  const loadDriver = async () => {
    try {
      const [profileData, ordersData, notificationsData, earningsData] = await Promise.all([
        AsyncStorage.getItem(DRIVER_STORAGE_KEY),
        AsyncStorage.getItem(DRIVER_ORDERS_KEY),
        AsyncStorage.getItem(DRIVER_NOTIFICATIONS_KEY),
        AsyncStorage.getItem(DRIVER_EARNINGS_KEY),
      ]);

      if (profileData) {
        const profile = safeJsonParse<DriverProfile>(profileData);
        if (profile) {
          profile.createdAt = new Date(profile.createdAt);
          profile.lastActive = new Date(profile.lastActive);
          setDriverProfile(profile);
        }
      }

      if (ordersData) {
        const orders = safeJsonParse<DriverOrder[]>(ordersData) || [];
        orders.forEach(order => {
          order.assignedAt = new Date(order.assignedAt);
        });
        setDriverOrders(orders);
      }

      if (notificationsData) {
        const notifs = safeJsonParse<DriverNotification[]>(notificationsData) || [];
        notifs.forEach(notif => {
          notif.createdAt = new Date(notif.createdAt);
        });
        setNotifications(notifs);
      }

      if (earningsData) {
        const earningsData2 = safeJsonParse<DriverEarning[]>(earningsData) || [];
        earningsData2.forEach(earning => {
          earning.date = new Date(earning.date);
        });
        setEarnings(earningsData2);
      }
    } catch (error) {
      console.error("Error loading driver data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createDriverProfile = useCallback(async (data: {
    name: string;
    phone: string;
    email: string;
    vehicleType: string;
    vehiclePlate: string;
    licenseNumber: string;
  }) => {
    const newProfile: DriverProfile = {
      id: Date.now().toString(),
      ...data,
      status: 'offline',
      isOnline: false,
      rating: 5.0,
      completedOrders: 0,
      stats: {
        totalEarnings: 0,
        todayEarnings: 0,
        totalDeliveries: 0,
        todayDeliveries: 0,
        averageRating: 5.0,
        completionRate: 100,
        activeTime: 0,
      },
      createdAt: new Date(),
      lastActive: new Date(),
    };

    setDriverProfile(newProfile);
    const jsonString = safeJsonStringify(newProfile);
    if (jsonString) {
      await AsyncStorage.setItem(DRIVER_STORAGE_KEY, jsonString);
    }
    
    return newProfile;
  }, []);

  const updateDriverStatus = useCallback(async (status: DriverStatus) => {
    if (!driverProfile) return;

    const updatedProfile = {
      ...driverProfile,
      status,
      isOnline: status !== 'offline',
      lastActive: new Date(),
    };

    setDriverProfile(updatedProfile);
    const jsonString = safeJsonStringify(updatedProfile);
    if (jsonString) {
      await AsyncStorage.setItem(DRIVER_STORAGE_KEY, jsonString);
    }
  }, [driverProfile]);

  const acceptOrder = useCallback(async (orderId: string) => {
    const allOrders = await OrderManager.getAllOrders();
    const order = allOrders.find(o => o.id === orderId);
    if (!order || !driverProfile) return;

    const driverOrder: DriverOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      type: order.status === 'pickup_scheduled' ? 'pickup' : 'delivery',
      customerName: order.customerName,
      customerPhone: order.phoneNumber,
      address: order.deliveryAddress || 'Customer Address',
      location: {
        latitude: 30.0444 + (Math.random() - 0.5) * 0.1,
        longitude: 31.2357 + (Math.random() - 0.5) * 0.1,
      },
      status: 'assigned',
      assignedAt: new Date(),
      estimatedTime: 25,
      distance: 5 + Math.random() * 10,
      earnings: 25 + Math.random() * 25,
      items: order.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
      })),
      notes: order.notes,
    };

    const updatedOrders = [...driverOrders, driverOrder];
    setDriverOrders(updatedOrders);
    const jsonString = safeJsonStringify(updatedOrders);
    if (jsonString) {
      await AsyncStorage.setItem(DRIVER_ORDERS_KEY, jsonString);
    }

    await OrderManager.updateOrderStatus(
      orderId,
      order.status === 'pickup_scheduled' ? 'pickup_in_progress' : 'delivery_in_progress'
    );

    addNotification({
      type: 'new_order',
      title: 'Order Accepted',
      message: `You accepted order ${order.orderNumber}`,
    });
  }, [driverProfile, driverOrders]);

  const updateOrderStatus = useCallback(async (orderId: string, status: DriverOrder['status']) => {
    const updatedOrders = driverOrders.map(order => 
      order.id === orderId ? { ...order, status } : order
    );
    setDriverOrders(updatedOrders);
    const jsonString = safeJsonStringify(updatedOrders);
    if (jsonString) {
      await AsyncStorage.setItem(DRIVER_ORDERS_KEY, jsonString);
    }

    if (status === 'completed' && driverProfile) {
      const order = driverOrders.find(o => o.id === orderId);
      if (order) {
        const earning: DriverEarning = {
          id: Date.now().toString(),
          orderId: order.id,
          orderNumber: order.orderNumber,
          amount: order.earnings,
          type: order.type,
          date: new Date(),
          paid: false,
        };

        const updatedEarnings = [...earnings, earning];
        setEarnings(updatedEarnings);
        const earningsJson = safeJsonStringify(updatedEarnings);
        if (earningsJson) {
          await AsyncStorage.setItem(DRIVER_EARNINGS_KEY, earningsJson);
        }

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEarnings = updatedEarnings
          .filter(e => e.date >= todayStart)
          .reduce((sum, e) => sum + e.amount, 0);

        const updatedProfile = {
          ...driverProfile,
          completedOrders: driverProfile.completedOrders + 1,
          stats: {
            ...driverProfile.stats,
            totalEarnings: driverProfile.stats.totalEarnings + order.earnings,
            todayEarnings,
            totalDeliveries: driverProfile.completedOrders + 1,
            todayDeliveries: driverProfile.stats.todayDeliveries + 1,
          },
        };

        setDriverProfile(updatedProfile);
        const profileJson = safeJsonStringify(updatedProfile);
        if (profileJson) {
          await AsyncStorage.setItem(DRIVER_STORAGE_KEY, profileJson);
        }

        await OrderManager.updateOrderStatus(
          orderId,
          order.type === 'pickup' ? 'processing' : 'completed'
        );

        addNotification({
          type: 'payment',
          title: 'Earnings Updated',
          message: `You earned $${order.earnings.toFixed(2)} from order ${order.orderNumber}`,
        });
      }
    }
  }, [driverOrders, driverProfile, earnings]);

  const addNotification = useCallback((notif: Omit<DriverNotification, 'id' | 'read' | 'createdAt'>) => {
    const newNotif: DriverNotification = {
      ...notif,
      id: Date.now().toString(),
      read: false,
      createdAt: new Date(),
    };

    const updatedNotifs = [newNotif, ...notifications].slice(0, 50);
    setNotifications(updatedNotifs);
    const jsonString = safeJsonStringify(updatedNotifs);
    if (jsonString) {
      AsyncStorage.setItem(DRIVER_NOTIFICATIONS_KEY, jsonString).catch(console.error);
    }
  }, [notifications]);

  const markNotificationAsRead = useCallback(async (notificationId: string) => {
    const updatedNotifs = notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifs);
    const jsonString = safeJsonStringify(updatedNotifs);
    if (jsonString) {
      await AsyncStorage.setItem(DRIVER_NOTIFICATIONS_KEY, jsonString);
    }
  }, [notifications]);

  const activeOrders = useMemo(() => 
    driverOrders.filter(o => o.status !== 'completed'),
    [driverOrders]
  );

  const completedOrders = useMemo(() => 
    driverOrders.filter(o => o.status === 'completed'),
    [driverOrders]
  );

  const unreadNotifications = useMemo(() => 
    notifications.filter(n => !n.read).length,
    [notifications]
  );

  const todayEarnings = useMemo(() => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    return earnings
      .filter(e => e.date >= todayStart)
      .reduce((sum, e) => sum + e.amount, 0);
  }, [earnings]);

  return useMemo(() => ({
    driverProfile,
    driverOrders,
    activeOrders,
    completedOrders,
    notifications,
    unreadNotifications,
    earnings,
    todayEarnings,
    isLoading,
    createDriverProfile,
    updateDriverStatus,
    acceptOrder,
    updateOrderStatus: updateOrderStatus,
    addNotification,
    markNotificationAsRead,
  }), [
    driverProfile,
    driverOrders,
    activeOrders,
    completedOrders,
    notifications,
    unreadNotifications,
    earnings,
    todayEarnings,
    isLoading,
    createDriverProfile,
    updateDriverStatus,
    acceptOrder,
    updateOrderStatus,
    addNotification,
    markNotificationAsRead,
  ]);
});
