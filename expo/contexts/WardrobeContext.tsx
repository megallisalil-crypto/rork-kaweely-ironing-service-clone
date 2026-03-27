import createContextHook from "@nkzw/create-context-hook";
import { useState, useCallback, useMemo, useEffect } from "react";
import { WardrobeItem, OutfitSuggestion, GarmentStatus } from "@/types/wardrobe";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "wardrobe";

export const [WardrobeProvider, useWardrobe] = createContextHook(() => {
  const [items, setItems] = useState<WardrobeItem[]>([]);

  useEffect(() => {
    loadWardrobe();
  }, []);

  const loadWardrobe = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const formatted = parsed.map((item: any) => ({
          ...item,
          purchaseDate: item.purchaseDate ? new Date(item.purchaseDate) : undefined,
          lastCleaned: item.lastCleaned ? new Date(item.lastCleaned) : undefined,
          createdAt: new Date(item.createdAt),
          careHistory: item.careHistory.map((h: any) => ({
            ...h,
            date: new Date(h.date),
          })),
        }));
        setItems(formatted);
      }
    } catch (error) {
      console.error("[Wardrobe] Error loading items:", error);
    }
  }, []);

  const saveWardrobe = useCallback(async (updatedItems: WardrobeItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
    } catch (error) {
      console.error("[Wardrobe] Error saving items:", error);
    }
  }, []);

  const addItem = useCallback((item: Omit<WardrobeItem, 'id' | 'createdAt' | 'timesWorn' | 'timesCleaned' | 'careHistory'>) => {
    const newItem: WardrobeItem = {
      ...item,
      id: Date.now().toString(),
      timesWorn: 0,
      timesCleaned: 0,
      careHistory: [],
      createdAt: new Date(),
    };
    const updated = [...items, newItem];
    setItems(updated);
    saveWardrobe(updated);
    return newItem;
  }, [items, saveWardrobe]);

  const updateItem = useCallback((itemId: string, updates: Partial<WardrobeItem>) => {
    const updated = items.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    );
    setItems(updated);
    saveWardrobe(updated);
  }, [items, saveWardrobe]);

  const deleteItem = useCallback((itemId: string) => {
    const updated = items.filter(item => item.id !== itemId);
    setItems(updated);
    saveWardrobe(updated);
  }, [items, saveWardrobe]);

  const addCareRecord = useCallback((itemId: string, type: 'wash' | 'iron' | 'dry_clean' | 'repair', orderId?: string, notes?: string) => {
    const updated = items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          timesCleaned: type === 'repair' ? item.timesCleaned : item.timesCleaned + 1,
          lastCleaned: new Date(),
          status: 'in_closet' as GarmentStatus,
          careHistory: [
            ...item.careHistory,
            {
              date: new Date(),
              type,
              orderId,
              notes,
            }
          ],
        };
      }
      return item;
    });
    setItems(updated);
    saveWardrobe(updated);
  }, [items, saveWardrobe]);

  const getOutfitSuggestions = useCallback((occasion: string, weather: string): OutfitSuggestion[] => {
    const availableItems = items.filter(item => item.status === 'in_closet');
    
    const suggestions: OutfitSuggestion[] = [];
    
    if (occasion === 'work' || occasion === 'business') {
      const shirt = availableItems.find(i => i.category === 'shirts' && (i.tags?.includes('formal') || i.tags?.includes('business')));
      const pants = availableItems.find(i => i.category === 'pants' && (i.tags?.includes('formal') || i.tags?.includes('business')));
      
      if (shirt && pants) {
        suggestions.push({
          id: '1',
          occasion,
          weather,
          items: [shirt, pants],
          confidence: 0.85,
          reason: 'Professional look perfect for work environments',
        });
      }
    }
    
    if (occasion === 'casual' || occasion === 'weekend') {
      const casual = availableItems.filter(i => 
        i.category === 'casual' || i.tags?.includes('casual')
      ).slice(0, 2);
      
      if (casual.length >= 2) {
        suggestions.push({
          id: '2',
          occasion,
          weather,
          items: casual,
          confidence: 0.78,
          reason: 'Comfortable and stylish for casual outings',
        });
      }
    }
    
    if (weather === 'cold' || weather === 'rainy') {
      const outerwear = availableItems.filter(i => i.category === 'outerwear');
      if (outerwear.length > 0) {
        suggestions.push({
          id: '3',
          occasion: 'any',
          weather,
          items: outerwear,
          confidence: 0.92,
          reason: 'Perfect for cold weather protection',
        });
      }
    }

    return suggestions;
  }, [items]);

  const getItemsByStatus = useCallback((status: GarmentStatus) => {
    return items.filter(item => item.status === status);
  }, [items]);

  const getNeedsCleaning = useCallback(() => {
    return items.filter(item => item.status === 'needs_cleaning');
  }, [items]);

  const favorites = useMemo(() => 
    items.filter(item => item.isFavorite),
    [items]
  );

  const stats = useMemo(() => ({
    total: items.length,
    inCloset: items.filter(i => i.status === 'in_closet').length,
    inService: items.filter(i => i.status === 'in_service').length,
    needsCleaning: items.filter(i => i.status === 'needs_cleaning').length,
    totalValue: items.reduce((sum, i) => sum + i.estimatedValue, 0),
  }), [items]);

  return useMemo(
    () => ({
      items,
      favorites,
      stats,
      addItem,
      updateItem,
      deleteItem,
      addCareRecord,
      getOutfitSuggestions,
      getItemsByStatus,
      getNeedsCleaning,
      loadWardrobe,
    }),
    [items, favorites, stats, addItem, updateItem, deleteItem, addCareRecord, getOutfitSuggestions, getItemsByStatus, getNeedsCleaning, loadWardrobe]
  );
});
