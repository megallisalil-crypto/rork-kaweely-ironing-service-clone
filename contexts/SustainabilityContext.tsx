import { useState, useEffect, useMemo, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useOrders } from "./OrderContext";
import { 
  SustainabilityMetrics, 
  Donation, 
  DonationItem, 
  EcoMilestone,
  ImpactComparison 
} from "@/types/sustainability";

const SUSTAINABILITY_STORAGE_KEY = "kaweely_sustainability";
const DONATIONS_STORAGE_KEY = "kaweely_donations";

const WATER_SAVED_PER_ITEM = 5;
const ENERGY_SAVED_PER_ITEM = 0.4;
const CO2_SAVED_PER_ITEM = 0.15;
const ECO_POINTS_PER_ITEM = 8;

export const [SustainabilityProvider, useSustainability] = createContextHook(() => {
  const { orders } = useOrders();
  const [metrics, setMetrics] = useState<SustainabilityMetrics>({
    waterSavedLiters: 0,
    energySavedKwh: 0,
    co2SavedKg: 0,
    itemsIroned: 0,
    ecoScore: 0,
    treesPlanted: 0,
    lastUpdated: new Date(),
  });
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    calculateMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders]);

  const loadData = async () => {
    try {
      const [sustainabilityData, donationsData] = await Promise.all([
        AsyncStorage.getItem(SUSTAINABILITY_STORAGE_KEY),
        AsyncStorage.getItem(DONATIONS_STORAGE_KEY),
      ]);

      if (sustainabilityData) {
        const parsed = JSON.parse(sustainabilityData);
        setMetrics({
          ...parsed,
          lastUpdated: new Date(parsed.lastUpdated),
        });
      }

      if (donationsData) {
        const parsed = JSON.parse(donationsData);
        setDonations(parsed.map((d: any) => ({
          ...d,
          createdAt: new Date(d.createdAt),
          scheduledDate: d.scheduledDate ? new Date(d.scheduledDate) : undefined,
        })));
      }
    } catch (error) {
      console.error("[Sustainability] Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMetrics = useCallback(() => {
    const totalItems = orders.reduce((sum, order) => {
      return sum + order.items.reduce((itemSum: number, item) => itemSum + item.quantity, 0);
    }, 0);

    const newMetrics: SustainabilityMetrics = {
      waterSavedLiters: totalItems * WATER_SAVED_PER_ITEM,
      energySavedKwh: totalItems * ENERGY_SAVED_PER_ITEM,
      co2SavedKg: totalItems * CO2_SAVED_PER_ITEM,
      itemsIroned: totalItems,
      ecoScore: totalItems * ECO_POINTS_PER_ITEM,
      treesPlanted: Math.floor((totalItems * ECO_POINTS_PER_ITEM) / 500),
      lastUpdated: new Date(),
    };

    setMetrics(newMetrics);
    saveMetrics(newMetrics);
  }, [orders]);

  const saveMetrics = async (metricsData: SustainabilityMetrics) => {
    try {
      await AsyncStorage.setItem(SUSTAINABILITY_STORAGE_KEY, JSON.stringify(metricsData));
    } catch (error) {
      console.error("[Sustainability] Error saving metrics:", error);
    }
  };

  const saveDonations = async (donationsData: Donation[]) => {
    try {
      await AsyncStorage.setItem(DONATIONS_STORAGE_KEY, JSON.stringify(donationsData));
    } catch (error) {
      console.error("[Sustainability] Error saving donations:", error);
    }
  };

  const createDonation = useCallback((items: DonationItem[], scheduledDate?: Date) => {
    const newDonation: Donation = {
      id: `donation-${Date.now()}`,
      items,
      totalItems: items.length,
      estimatedValue: items.reduce((sum, item) => sum + item.estimatedValue, 0),
      status: scheduledDate ? 'scheduled' : 'pending',
      scheduledDate,
      createdAt: new Date(),
    };

    const updatedDonations = [...donations, newDonation];
    setDonations(updatedDonations);
    saveDonations(updatedDonations);

    return newDonation;
  }, [donations]);

  const updateDonationStatus = useCallback((donationId: string, status: Donation['status']) => {
    const updatedDonations = donations.map(d => 
      d.id === donationId ? { ...d, status } : d
    );
    setDonations(updatedDonations);
    saveDonations(updatedDonations);
  }, [donations]);

  const milestones = useMemo((): EcoMilestone[] => {
    const allMilestones: EcoMilestone[] = [
      {
        id: 'eco-starter',
        title: 'Eco Starter',
        description: 'Save 100L of water',
        icon: 'droplet',
        threshold: 100,
        achieved: metrics.waterSavedLiters >= 100,
        achievedAt: metrics.waterSavedLiters >= 100 ? new Date() : undefined,
      },
      {
        id: 'water-warrior',
        title: 'Water Warrior',
        description: 'Save 500L of water',
        icon: 'droplets',
        threshold: 500,
        achieved: metrics.waterSavedLiters >= 500,
        achievedAt: metrics.waterSavedLiters >= 500 ? new Date() : undefined,
      },
      {
        id: 'energy-saver',
        title: 'Energy Saver',
        description: 'Save 50 kWh of energy',
        icon: 'zap',
        threshold: 50,
        achieved: metrics.energySavedKwh >= 50,
        achievedAt: metrics.energySavedKwh >= 50 ? new Date() : undefined,
      },
      {
        id: 'carbon-crusher',
        title: 'Carbon Crusher',
        description: 'Reduce 20kg of CO2',
        icon: 'leaf',
        threshold: 20,
        achieved: metrics.co2SavedKg >= 20,
        achievedAt: metrics.co2SavedKg >= 20 ? new Date() : undefined,
      },
      {
        id: 'tree-planter',
        title: 'Tree Planter',
        description: 'Plant your first tree',
        icon: 'tree-deciduous',
        threshold: 1,
        achieved: metrics.treesPlanted >= 1,
        achievedAt: metrics.treesPlanted >= 1 ? new Date() : undefined,
      },
    ];

    return allMilestones;
  }, [metrics]);

  const impactComparisons = useMemo((): ImpactComparison[] => {
    return [
      {
        metric: 'Water Usage',
        saved: metrics.waterSavedLiters,
        traditional: metrics.waterSavedLiters * 2.5,
        unit: 'liters',
        icon: 'droplet',
        color: '#3B82F6',
      },
      {
        metric: 'Energy Consumption',
        saved: metrics.energySavedKwh,
        traditional: metrics.energySavedKwh * 3,
        unit: 'kWh',
        icon: 'zap',
        color: '#F59E0B',
      },
      {
        metric: 'Carbon Footprint',
        saved: metrics.co2SavedKg,
        traditional: metrics.co2SavedKg * 2.8,
        unit: 'kg CO2',
        icon: 'cloud',
        color: '#10B981',
      },
    ];
  }, [metrics]);

  return useMemo(() => ({
    metrics,
    donations,
    milestones,
    impactComparisons,
    isLoading,
    createDonation,
    updateDonationStatus,
  }), [
    metrics,
    donations,
    milestones,
    impactComparisons,
    isLoading,
    createDonation,
    updateDonationStatus,
  ]);
});
