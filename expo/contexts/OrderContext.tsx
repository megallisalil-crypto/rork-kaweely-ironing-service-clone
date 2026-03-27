import createContextHook from "@nkzw/create-context-hook";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Order, OrderStatus, OrderStats, ClothingItem, SubscriptionType } from "@/types/order";
import { sendOrderNotification } from "@/utils/notifications";
import { useLoyalty } from "@/contexts/LoyaltyContext";
import { OrderManager } from "@/utils/OrderManager";
import { useSOS } from "@/contexts/SOSContext";

export const [OrderProvider, useOrders] = createContextHook(() => {
  const { earnPoints } = useLoyalty();
  const sosContext = useSOS();
  const updateSOSStatus = sosContext?.updateSOSStatus;
  const sosRequests = useMemo(() => sosContext?.sosRequests || [], [sosContext?.sosRequests]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [pendingFeedback, setPendingFeedback] = useState<{ orderId: string; orderNumber: string } | null>(null);

  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const orders = await OrderManager.getAllOrders();
      return orders;
    },
    staleTime: 10000,
    gcTime: 300000,
    refetchInterval: 15000,
  });

  const syncMutation = useMutation({
    mutationFn: async (updatedOrders: Order[]) => {
      await OrderManager.saveOrders(updatedOrders);
      return updatedOrders;
    },
  });

  const { mutate: syncOrders } = syncMutation;

  useEffect(() => {
    if (ordersQuery.data) {
      setOrders(ordersQuery.data);
    }
  }, [ordersQuery.data]);

  useEffect(() => {
    const unsubscribe = OrderManager.subscribeToChanges((updatedOrders) => {
      setOrders(updatedOrders);
    });
    return unsubscribe;
  }, []);

  const stats = useMemo<OrderStats>(() => {
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

  const addOrder = useCallback(async (orderData: {
    customerName: string;
    phoneNumber: string;
    items: ClothingItem[];
    subscription: SubscriptionType;
    deliveryAddress?: string;
    pickupDate?: Date;
    notes?: string;
    isExpress?: boolean;
    expressDeliveryTime?: Date;
    isSOS?: boolean;
    sosActivatedAt?: Date;
    sosDeliveryTime?: Date;
    sosMultiplier?: number;
  }) => {
    const now = new Date();
    const pickupDate = orderData.pickupDate || new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const expressDeliveryTime = orderData.expressDeliveryTime || (orderData.isExpress ? new Date(now.getTime() + 2 * 60 * 60 * 1000) : undefined);
    
    const currentOrders = await OrderManager.getAllOrders();
    
    const newOrder: Order = {
      id: Date.now().toString(),
      orderNumber: `KW-${String(currentOrders.length + 1).padStart(3, "0")}`,
      ...orderData,
      pickupDate,
      expressDeliveryTime,
      totalPrice: orderData.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      status: "pickup_scheduled",
      createdAt: now,
      updatedAt: now,
      statusHistory: [
        {
          status: "pending",
          timestamp: now,
        },
        {
          status: "pickup_scheduled",
          timestamp: now,
        },
      ],
    };

    await OrderManager.addOrder(newOrder);
    
    sendOrderNotification(newOrder.orderNumber, "pickup_scheduled");
    return newOrder;
  }, []);

  const updateOrderStatus = useCallback((orderId: string, newStatus: OrderStatus) => {
    const updated = orders.map((order) => {
      if (order.id === orderId) {
        sendOrderNotification(order.orderNumber, newStatus);
        
        if (newStatus === "completed" && order.status !== "completed") {
          const pointsEarned = Math.floor(order.totalPrice * 0.1);
          earnPoints(pointsEarned, `Order ${order.orderNumber} completed`, orderId);
          
          setPendingFeedback({ orderId: order.id, orderNumber: order.orderNumber });
          
          const linkedSOS = sosRequests.find(sos => sos.orderId === orderId);
          if (linkedSOS && updateSOSStatus) {
            updateSOSStatus(linkedSOS.id, "completed");
            console.log("[OrderContext] Marked SOS as completed:", linkedSOS.id);
          }
        }
        
        return {
          ...order,
          status: newStatus,
          updatedAt: new Date(),
          statusHistory: [
            ...order.statusHistory,
            {
              status: newStatus,
              timestamp: new Date(),
            },
          ],
        };
      }
      return order;
    });

    setOrders(updated);
    syncOrders(updated);
  }, [orders, syncOrders, earnPoints, sosRequests, updateSOSStatus]);

  const getOrderById = useCallback((orderId: string) => {
    return orders.find((order) => order.id === orderId);
  }, [orders]);

  const getOrdersByStatus = useCallback((status: OrderStatus) => {
    return orders.filter((order) => order.status === status);
  }, [orders]);

  const clearPendingFeedback = useCallback(() => {
    setPendingFeedback(null);
  }, []);

  const cancelOrder = useCallback((orderId: string) => {
    const updated = orders.map((order) => {
      if (order.id === orderId) {
        sendOrderNotification(order.orderNumber, "cancelled");
        
        return {
          ...order,
          status: "cancelled" as OrderStatus,
          updatedAt: new Date(),
          statusHistory: [
            ...order.statusHistory,
            {
              status: "cancelled" as OrderStatus,
              timestamp: new Date(),
            },
          ],
        };
      }
      return order;
    });

    setOrders(updated);
    syncOrders(updated);
  }, [orders, syncOrders]);



  return useMemo(
    () => ({
      orders,
      stats,
      isLoading: ordersQuery.isLoading,
      addOrder,
      updateOrderStatus,
      cancelOrder,
      getOrderById,
      getOrdersByStatus,
      pendingFeedback,
      clearPendingFeedback,
    }),
    [orders, stats, ordersQuery.isLoading, addOrder, updateOrderStatus, cancelOrder, getOrderById, getOrdersByStatus, pendingFeedback, clearPendingFeedback]
  );
});
