import AsyncStorage from "@react-native-async-storage/async-storage";
import { Order, OrderStatus } from "@/types/order";

const ORDERS_STORAGE_KEY = "kaweely_orders";

let orderChangeListeners: ((orders: Order[]) => void)[] = [];

export const OrderManager = {
  subscribeToChanges(callback: (orders: Order[]) => void) {
    orderChangeListeners.push(callback);
    return () => {
      orderChangeListeners = orderChangeListeners.filter(cb => cb !== callback);
    };
  },

  notifyListeners(orders: Order[]) {
    orderChangeListeners.forEach((callback) => {
      try {
        callback([...orders]);
      } catch (error) {
        console.error('[OrderManager] Error in listener:', error);
      }
    });
  },

  async getAllOrders(): Promise<Order[]> {
    try {
      let stored: string | null = null;
      
      try {
        stored = await AsyncStorage.getItem(ORDERS_STORAGE_KEY);
      } catch (getError) {
        console.error('[OrderManager] Failed to get storage item:', getError);
        try {
          await AsyncStorage.removeItem(ORDERS_STORAGE_KEY);
        } catch {}
        return [];
      }
      
      if (!stored || stored === 'null' || stored === 'undefined') {
        return [];
      }
      
      let trimmedStored: string;
      try {
        trimmedStored = stored.trim();
      } catch (trimError) {
        console.error('[OrderManager] ❌ Failed to trim stored data:', trimError);
        await AsyncStorage.removeItem(ORDERS_STORAGE_KEY);
        return [];
      }
      
      if (!trimmedStored || trimmedStored.length === 0) {
        await AsyncStorage.removeItem(ORDERS_STORAGE_KEY);
        return [];
      }
      
      if (trimmedStored.includes('NaN') || 
          trimmedStored.includes('undefined') || 
          trimmedStored.includes('\u0000') ||
          /[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(trimmedStored)) {
        await AsyncStorage.removeItem(ORDERS_STORAGE_KEY);
        return [];
      }
      
      if (!trimmedStored.startsWith('[') && !trimmedStored.startsWith('{')) {
        await AsyncStorage.removeItem(ORDERS_STORAGE_KEY);
        return [];
      }

      let parsedOrders: any;
      try {
        parsedOrders = JSON.parse(trimmedStored);
      } catch (parseError: any) {
        try {
          await AsyncStorage.removeItem(ORDERS_STORAGE_KEY);
        } catch {}
        return [];
      }
      
      if (!Array.isArray(parsedOrders)) {
        await AsyncStorage.removeItem(ORDERS_STORAGE_KEY);
        return [];
      }
      
      if (parsedOrders.length === 0) {
        return [];
      }

      const validOrders = parsedOrders.filter((order: any) => {
        if (!order || typeof order !== 'object') return false;
        if (!order.id || !order.orderNumber || !order.status) return false;
        return true;
      });
      
      return validOrders.map((order: Order) => ({
        ...order,
        createdAt: new Date(order.createdAt),
        updatedAt: new Date(order.updatedAt),
        pickupDate: order.pickupDate ? new Date(order.pickupDate) : undefined,
        expressDeliveryTime: order.expressDeliveryTime ? new Date(order.expressDeliveryTime) : undefined,
        statusHistory: Array.isArray(order.statusHistory) ? order.statusHistory.map((h) => ({
          ...h,
          timestamp: new Date(h.timestamp),
        })) : [],
      }));
    } catch (error) {
      console.error('[OrderManager] Fatal error loading orders:', error);
      try {
        await AsyncStorage.removeItem(ORDERS_STORAGE_KEY);
      } catch {}
      return [];
    }
  },

  async saveOrders(orders: Order[]): Promise<void> {
    try {
      if (!Array.isArray(orders)) {
        return;
      }
      
      let jsonString: string;
      try {
        jsonString = JSON.stringify(orders, (key, value) => {
          if (value !== value) return null;
          if (value === Infinity || value === -Infinity) return null;
          if (typeof value === 'number' && !isFinite(value)) return null;
          if (value === undefined) return null;
          return value;
        });
      } catch (stringifyError) {
        throw new Error('Failed to convert orders to JSON: ' + String(stringifyError));
      }

      if (!jsonString || jsonString === 'undefined' || jsonString === 'null' || jsonString.trim() === '') {
        throw new Error('Generated invalid JSON string');
      }

      if (jsonString.includes('NaN') || jsonString.includes('undefined')) {
        throw new Error('JSON contains NaN or undefined strings');
      }
      
      try {
        JSON.parse(jsonString);
      } catch (verifyError) {
        throw new Error('Generated unparseable JSON: ' + String(verifyError));
      }
      
      await AsyncStorage.setItem(ORDERS_STORAGE_KEY, jsonString);
      
      this.notifyListeners(orders);
      
      setTimeout(() => {
        this.notifyListeners(orders);
      }, 200);
    } catch (error) {
      console.error('[OrderManager] Error saving orders:', error);
      throw error;
    }
  },

  async addOrder(order: Order): Promise<void> {
    const orders = await this.getAllOrders();
    const updated = [order, ...orders];
    await this.saveOrders(updated);
  },

  async updateOrder(orderId: string, updates: Partial<Order>): Promise<void> {
    const orders = await this.getAllOrders();
    const updated = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, ...updates, updatedAt: new Date() };
      }
      return order;
    });
    await this.saveOrders(updated);
  },

  async updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<void> {
    const orders = await this.getAllOrders();
    const updated = orders.map(order => {
      if (order.id === orderId) {
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
    await this.saveOrders(updated);
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    const orders = await this.getAllOrders();
    return orders.find(order => order.id === orderId) || null;
  },

  async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    const orders = await this.getAllOrders();
    return orders.filter(order => order.status === status);
  },
};
