import createContextHook from "@nkzw/create-context-hook";
import { useState, useCallback, useMemo } from "react";
import { FabricAnalysis, FabricType, StainType } from "@/types/fabricScan";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "fabricScans";

export const [FabricScanProvider, useFabricScan] = createContextHook(() => {
  const [scans, setScans] = useState<FabricAnalysis[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const loadScans = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const formatted = parsed.map((scan: any) => ({
          ...scan,
          timestamp: new Date(scan.timestamp),
        }));
        setScans(formatted);
      }
    } catch (error) {
      console.error("[FabricScan] Error loading scans:", error);
    }
  }, []);

  const saveScans = useCallback(async (updatedScans: FabricAnalysis[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedScans));
    } catch (error) {
      console.error("[FabricScan] Error saving scans:", error);
    }
  }, []);

  const analyzeImage = useCallback(async (imageUri: string): Promise<FabricAnalysis> => {
    setIsAnalyzing(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));

    const fabricTypes: FabricType[] = ['cotton', 'silk', 'wool', 'polyester', 'linen', 'denim'];
    const stainTypes: StainType[] = ['coffee', 'wine', 'oil', 'ink', 'grass'];
    
    const detectedFabric = fabricTypes[Math.floor(Math.random() * fabricTypes.length)];
    const detectedStains: StainType[] = Math.random() > 0.5 
      ? [stainTypes[Math.floor(Math.random() * stainTypes.length)]]
      : [];

    const fabricCareMap: Record<FabricType, { wash: string[], tips: string[], services: string[] }> = {
      cotton: {
        wash: ['Wash in warm water (40°C)', 'Tumble dry on medium', 'Iron on high heat if needed'],
        tips: ['Separate colors from whites', 'Pre-treat stains before washing', 'Shrinkage possible on first wash'],
        services: ['Standard Wash & Iron', 'Express Service Available']
      },
      silk: {
        wash: ['Hand wash in cold water', 'Use silk-specific detergent', 'Air dry flat, away from sunlight'],
        tips: ['Never wring or twist', 'Iron on lowest setting while damp', 'Consider professional dry cleaning'],
        services: ['Delicate Hand Wash', 'Professional Silk Care', 'Premium Pressing']
      },
      wool: {
        wash: ['Hand wash in cold water', 'Use wool-safe detergent', 'Lay flat to dry'],
        tips: ['Avoid hot water to prevent shrinking', 'Never hang wool items when wet', 'Store with moth protection'],
        services: ['Professional Wool Care', 'Moth Protection Treatment']
      },
      polyester: {
        wash: ['Machine wash warm', 'Tumble dry low heat', 'Iron on low if needed'],
        tips: ['Highly stain-resistant', 'Quick-drying fabric', 'Avoid high heat'],
        services: ['Standard Wash & Fold', 'Express 2-Hour Service']
      },
      linen: {
        wash: ['Machine wash warm or hot', 'Line dry or tumble dry low', 'Iron while slightly damp'],
        tips: ['Wrinkles are natural for linen', 'Gets softer with each wash', 'High absorbency'],
        services: ['Premium Linen Care', 'Professional Pressing']
      },
      denim: {
        wash: ['Wash inside out in cold water', 'Hang dry or tumble low', 'Minimal ironing needed'],
        tips: ['Wash less frequently to preserve color', 'Spot clean when possible', 'Dark jeans may bleed'],
        services: ['Denim Care Specialist', 'Color Restoration']
      },
      leather: {
        wash: ['Professional cleaning only', 'Never machine wash', 'Condition regularly'],
        tips: ['Wipe with damp cloth for spots', 'Keep away from heat and moisture', 'Use leather conditioner monthly'],
        services: ['Expert Leather Care', 'Conditioning Treatment']
      },
      synthetic: {
        wash: ['Machine wash cold', 'Tumble dry low', 'Steam instead of ironing'],
        tips: ['Quick-drying material', 'Wrinkle-resistant', 'Easy care'],
        services: ['Standard Care', 'Steam Press']
      },
      delicate: {
        wash: ['Hand wash cold or delicate cycle', 'Air dry flat', 'Steam only, no iron'],
        tips: ['Use mesh laundry bag', 'Extra gentle handling', 'Professional care recommended'],
        services: ['Delicate Garment Care', 'Hand Wash Service']
      },
      unknown: {
        wash: ['Check care label', 'Start with cold water', 'Air dry to be safe'],
        tips: ['Test small area first', 'Consider professional cleaning', 'Avoid harsh chemicals'],
        services: ['Professional Assessment', 'Custom Care Plan']
      }
    };

    const stainCareMap: Record<StainType, string[]> = {
      coffee: ['Blot immediately, don\'t rub', 'Rinse with cold water from back', 'Apply liquid detergent', 'Wash in warmest water safe for fabric'],
      wine: ['Blot excess liquid', 'Apply salt or baking soda', 'Rinse with cold water', 'Use wine stain remover or white vinegar'],
      oil: ['Sprinkle cornstarch or baby powder', 'Let sit for 15 minutes', 'Brush off and apply dish soap', 'Wash in hot water if fabric allows'],
      blood: ['Use COLD water only', 'Soak in cold salt water', 'Apply hydrogen peroxide to stain', 'Wash in cold water'],
      ink: ['Dab with rubbing alcohol', 'Blot with clean cloth', 'Apply laundry stain remover', 'Wash as directed'],
      grass: ['Pre-treat with enzyme cleaner', 'Rub with liquid detergent', 'Let sit 15 minutes', 'Wash in warmest safe water'],
      food: ['Scrape off excess', 'Pre-treat with stain remover', 'Let sit 10 minutes', 'Wash normally'],
      makeup: ['Use makeup remover or dish soap', 'Blot gently', 'Rinse thoroughly', 'Wash as usual'],
      mud: ['Let dry completely first', 'Brush off dried mud', 'Pre-treat remaining stain', 'Wash normally'],
      sweat: ['Pre-soak in white vinegar solution', 'Apply baking soda paste', 'Wash in warm water', 'Sun-dry to bleach naturally'],
      unknown: ['Test cleaning method on hidden area', 'Start with cold water', 'Use mild detergent', 'Consider professional help']
    };

    const fabricGuide = fabricCareMap[detectedFabric] || fabricCareMap.unknown;
    
    let emergencyTips: string[] | undefined;
    if (detectedStains.length > 0) {
      emergencyTips = stainCareMap[detectedStains[0]];
    }

    const analysis: FabricAnalysis = {
      id: Date.now().toString(),
      imageUri,
      detectedFabric,
      detectedStains,
      confidence: 0.75 + Math.random() * 0.2,
      careInstructions: fabricGuide.wash,
      washingTips: fabricGuide.tips,
      emergencyTips,
      recommendedServices: fabricGuide.services,
      timestamp: new Date(),
    };

    const updated = [analysis, ...scans];
    setScans(updated);
    saveScans(updated);
    setIsAnalyzing(false);

    return analysis;
  }, [scans, saveScans]);

  const deleteScan = useCallback((scanId: string) => {
    const updated = scans.filter(scan => scan.id !== scanId);
    setScans(updated);
    saveScans(updated);
  }, [scans, saveScans]);

  return useMemo(
    () => ({
      scans,
      isAnalyzing,
      analyzeImage,
      deleteScan,
      loadScans,
    }),
    [scans, isAnalyzing, analyzeImage, deleteScan, loadScans]
  );
});
