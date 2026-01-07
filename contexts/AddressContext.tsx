import { useState, useEffect, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";

const ADDRESS_STORAGE_KEY = "kaweely_delivery_address";

export type DeliveryAddress = {
  type: "home" | "office" | "other";
  street: string;
  building: string;
  floor: string;
  apartment: string;
  landmark: string;
  contactName: string;
  contactPhone: string;
  fullAddress?: string;
  latitude?: number;
  longitude?: number;
};

export const [AddressProvider, useAddress] = createContextHook(() => {
  const [address, setAddress] = useState<DeliveryAddress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAddress();
  }, []);

  const loadAddress = async () => {
    const timeoutId = setTimeout(() => {
      console.warn('Address loading timeout, using default');
      setIsLoading(false);
    }, 1500);

    try {
      const stored = await Promise.race([
        AsyncStorage.getItem(ADDRESS_STORAGE_KEY),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 1000))
      ]);
      
      if (stored && typeof stored === 'string' && stored.trim().length > 0) {
        const trimmedStored = stored.trim();
        
        if (trimmedStored === '[object Object]' || trimmedStored === 'undefined' || trimmedStored === 'null') {
          console.warn("Invalid stored address value, clearing:", trimmedStored);
          AsyncStorage.removeItem(ADDRESS_STORAGE_KEY).catch(console.error);
          return;
        }
        
        if (!trimmedStored.startsWith('{') && !trimmedStored.startsWith('[')) {
          console.warn("Stored address value is not valid JSON, clearing:", trimmedStored.substring(0, 50));
          AsyncStorage.removeItem(ADDRESS_STORAGE_KEY).catch(console.error);
          return;
        }
        
        try {
          const addressData: DeliveryAddress = JSON.parse(trimmedStored);
          if (addressData && typeof addressData === 'object') {
            setAddress(addressData);
            console.log("Address loaded successfully");
          } else {
            console.warn("Parsed address is not an object, clearing");
            AsyncStorage.removeItem(ADDRESS_STORAGE_KEY).catch(console.error);
          }
        } catch (parseError) {
          console.error("Error parsing address:", parseError);
          console.log("Problematic data:", trimmedStored.substring(0, 100));
          AsyncStorage.removeItem(ADDRESS_STORAGE_KEY).catch(console.error);
        }
      }
    } catch (error) {
      console.error("Error loading address:", error);
      AsyncStorage.removeItem(ADDRESS_STORAGE_KEY).catch(console.error);
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  const saveAddress = useCallback(async (newAddress: DeliveryAddress) => {
    try {
      const jsonString = JSON.stringify(newAddress);
      if (!jsonString || jsonString === 'undefined' || jsonString === 'null') {
        console.error('Invalid JSON string generated for address');
        return;
      }
      await AsyncStorage.setItem(ADDRESS_STORAGE_KEY, jsonString);
      setAddress(newAddress);
      console.log("Address saved successfully");
    } catch (error) {
      console.error("Error saving address:", error);
    }
  }, []);

  const updateAddress = useCallback(async (updates: Partial<DeliveryAddress>) => {
    const updatedAddress = address ? { ...address, ...updates } : updates as DeliveryAddress;
    await saveAddress(updatedAddress);
  }, [address, saveAddress]);

  const clearAddress = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(ADDRESS_STORAGE_KEY);
      setAddress(null);
      console.log("Address cleared");
    } catch (error) {
      console.error("Error clearing address:", error);
    }
  }, []);

  const getFullAddress = useCallback(() => {
    if (!address) return "";
    
    const parts = [
      address.street,
      address.building && `Building ${address.building}`,
      address.floor && `Floor ${address.floor}`,
      address.apartment && `Apt ${address.apartment}`,
      address.landmark && `Near ${address.landmark}`,
    ].filter(Boolean);
    
    return parts.join(", ");
  }, [address]);

  return useMemo(() => ({
    address,
    isLoading,
    saveAddress,
    updateAddress,
    clearAddress,
    getFullAddress,
  }), [address, isLoading, saveAddress, updateAddress, clearAddress, getFullAddress]);
});
