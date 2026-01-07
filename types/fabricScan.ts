export type FabricType = 'cotton' | 'silk' | 'wool' | 'polyester' | 'linen' | 'denim' | 'leather' | 'synthetic' | 'delicate' | 'unknown';

export type StainType = 'coffee' | 'wine' | 'oil' | 'blood' | 'ink' | 'grass' | 'food' | 'makeup' | 'mud' | 'sweat' | 'unknown';

export type FabricAnalysis = {
  id: string;
  imageUri: string;
  detectedFabric: FabricType;
  detectedStains: StainType[];
  confidence: number;
  careInstructions: string[];
  washingTips: string[];
  emergencyTips?: string[];
  recommendedServices: string[];
  timestamp: Date;
};

export type VoiceCommand = {
  id: string;
  command: string;
  action: 'createOrder' | 'trackOrder' | 'viewRewards' | 'schedulePickup' | 'contactSupport' | 'viewProfile' | 'unknown';
  parameters?: Record<string, any>;
  timestamp: Date;
};
