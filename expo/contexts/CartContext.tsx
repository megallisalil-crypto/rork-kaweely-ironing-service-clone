import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect, useMemo, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartItem, PremiumService } from "@/types/cart";

const CART_STORAGE_KEY = "cart_items";

const EXPRESS_DELIVERY_PERCENTAGE = 0.3;
const EXPRESS_MINIMUM = 100;

const deliveryZones = [
  { name: "Zone 1 - Central Cairo", areas: ["Downtown", "Zamalek", "Garden City", "Dokki"], cost: 30 },
  { name: "Zone 2 - Greater Cairo", areas: ["Maadi", "Heliopolis", "Nasr City", "Mohandessin"], cost: 50 },
  { name: "Zone 3 - New Cairo & 6th October", areas: ["New Cairo", "5th Settlement", "6th October", "Sheikh Zayed"], cost: 70 },
  { name: "Zone 4 - Outer Areas", areas: ["10th of Ramadan", "Shorouk", "Obour", "Other Areas"], cost: 100 },
];

function calculateDeliveryCost(address: string): number {
  if (!address.trim()) return 0;
  
  const lowerAddress = address.toLowerCase();
  
  for (const zone of deliveryZones) {
    for (const area of zone.areas) {
      if (lowerAddress.includes(area.toLowerCase())) {
        return zone.cost;
      }
    }
  }
  
  return deliveryZones[deliveryZones.length - 1].cost;
}

export const [CartProvider, useCart] = createContextHook(() => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isExpressDelivery, setIsExpressDelivery] = useState<boolean>(false);
  const [isSubscriptionUsed, setIsSubscriptionUsed] = useState<boolean>(false);
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [specialInstructions, setSpecialInstructions] = useState<string>("");
  const [premiumServices, setPremiumServices] = useState<PremiumService[]>([
    { id: 'perfume', name: 'Premium Perfume', price: 30, enabled: false },
    { id: 'vip', name: 'VIP Packaging', price: 50, enabled: false },
  ]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const stored = await Promise.race([
        AsyncStorage.getItem(CART_STORAGE_KEY),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 1000))
      ]);
      
      console.log("[CartContext] Loading cart from storage");
      
      if (!stored || stored === 'null' || stored === 'undefined' || stored.trim() === '' || stored === 'NaN' || stored === '[object Object]') {
        console.log("[CartContext] No cart data found or invalid value, starting with empty cart");
        AsyncStorage.removeItem(CART_STORAGE_KEY).catch(console.error);
        return;
      }
      
      const trimmedStored = stored.trim();
      
      if (!trimmedStored || trimmedStored === '[object Object]' || (!trimmedStored.startsWith('[') && !trimmedStored.startsWith('{'))) {
        console.warn("[CartContext] Stored value is not valid JSON, clearing:", trimmedStored.substring(0, 50));
        AsyncStorage.removeItem(CART_STORAGE_KEY).catch(console.error);
        return;
      }
      
      if (trimmedStored.includes('NaN') || trimmedStored.includes('undefined')) {
        console.warn("[CartContext] Stored value contains invalid values, clearing");
        AsyncStorage.removeItem(CART_STORAGE_KEY).catch(console.error);
        return;
      }
      
      try {
        const parsedItems = JSON.parse(trimmedStored);
        if (Array.isArray(parsedItems)) {
          console.log("[CartContext] Successfully loaded", parsedItems.length, "items");
          setItems(parsedItems);
        } else {
          console.warn("[CartContext] Cart data is not an array, clearing");
          AsyncStorage.removeItem(CART_STORAGE_KEY).catch(console.error);
        }
      } catch (parseError) {
        console.error("[CartContext] JSON Parse error:", parseError);
        AsyncStorage.removeItem(CART_STORAGE_KEY).catch(console.error);
      }
    } catch (error) {
      console.error("[CartContext] Failed to load cart, clearing:", error);
      AsyncStorage.removeItem(CART_STORAGE_KEY).catch(console.error);
      setItems([]);
    }
  };

  const saveCart = useCallback(async () => {
    try {
      if (!Array.isArray(items)) {
        console.warn("[CartContext] Invalid items, not saving");
        return;
      }
      
      const jsonString = JSON.stringify(items, (key, value) => {
        if (value !== value) return null;
        if (value === Infinity || value === -Infinity) return null;
        if (typeof value === 'number' && !isFinite(value)) return null;
        return value;
      });
      
      if (!jsonString || jsonString === 'undefined' || jsonString === 'null' || jsonString === 'NaN' || jsonString.includes('NaN')) {
        console.error('[CartContext] Invalid JSON string generated, not saving');
        return;
      }
      
      console.log("[CartContext] Saving cart:", items.length, "items");
      await AsyncStorage.setItem(CART_STORAGE_KEY, jsonString);
    } catch (error) {
      console.error("[CartContext] Failed to save cart:", error);
    }
  }, [items]);

  useEffect(() => {
    saveCart();
  }, [saveCart]);

  const addToCart = useCallback((item: Omit<CartItem, "quantity">) => {
    console.log("[CartContext] Adding item to cart:", item.name, "type:", item.type);
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id && i.type === item.type);
      if (existingItem) {
        console.log("[CartContext] Item exists, increasing quantity");
        return prevItems.map((i) =>
          i.id === item.id && i.type === item.type ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      console.log("[CartContext] Adding new item to cart");
      const itemType = item.type || 'product';
      return [...prevItems, { ...item, type: itemType, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
    setIsExpressDelivery(false);
    setIsSubscriptionUsed(false);
    setSpecialInstructions("");
    setPremiumServices([
      { id: 'perfume', name: 'Premium Perfume', price: 30, enabled: false },
      { id: 'vip', name: 'VIP Packaging', price: 50, enabled: false },
    ]);
  }, []);

  const togglePremiumService = useCallback((serviceId: string) => {
    setPremiumServices(prev => 
      prev.map(service => 
        service.id === serviceId 
          ? { ...service, enabled: !service.enabled }
          : service
      )
    );
  }, []);

  const setPremiumServicesFromSelection = useCallback((perfume: boolean, vip: boolean) => {
    setPremiumServices([
      { id: 'perfume', name: 'Premium Perfume', price: 30, enabled: perfume },
      { id: 'vip', name: 'VIP Packaging', price: 50, enabled: vip },
    ]);
  }, []);

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  
  const totalPrice = useMemo(() => items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  ), [items]);

  const premiumServicesTotal = useMemo(() => premiumServices.reduce(
    (sum, service) => sum + (service.enabled ? service.price : 0),
    0
  ), [premiumServices]);

  const canUseExpress = useMemo(() => totalPrice >= EXPRESS_MINIMUM, [totalPrice]);
  
  const expressCharge = useMemo(() => 
    isExpressDelivery && canUseExpress ? totalPrice * EXPRESS_DELIVERY_PERCENTAGE : 0,
    [isExpressDelivery, canUseExpress, totalPrice]
  );
  
  const baseDeliveryCost = useMemo(() => calculateDeliveryCost(deliveryAddress), [deliveryAddress]);
  
  const actualDeliveryCost = useMemo(() => 
    isExpressDelivery && canUseExpress ? 0 : baseDeliveryCost,
    [isExpressDelivery, canUseExpress, baseDeliveryCost]
  );
  
  const deliveryCost = useMemo(() => expressCharge + actualDeliveryCost, [expressCharge, actualDeliveryCost]);

  return useMemo(() => ({
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    deliveryCost,
    isExpressDelivery,
    setIsExpressDelivery,
    expressCharge,
    actualDeliveryCost,
    baseDeliveryCost,
    canUseExpress,
    expressMinimum: EXPRESS_MINIMUM,
    deliveryAddress,
    setDeliveryAddress,
    isSubscriptionUsed,
    setIsSubscriptionUsed,
    specialInstructions,
    setSpecialInstructions,
    premiumServices,
    togglePremiumService,
    setPremiumServicesFromSelection,
    premiumServicesTotal,
  }), [
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    deliveryCost,
    isExpressDelivery,
    expressCharge,
    actualDeliveryCost,
    baseDeliveryCost,
    canUseExpress,
    deliveryAddress,
    isSubscriptionUsed,
    specialInstructions,
    premiumServices,
    togglePremiumService,
    setPremiumServicesFromSelection,
    premiumServicesTotal,
  ]);
});
