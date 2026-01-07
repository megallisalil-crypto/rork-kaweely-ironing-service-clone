export type GarmentCondition = 'excellent' | 'good' | 'fair' | 'worn' | 'damaged';

export type GarmentStatus = 'in_closet' | 'in_service' | 'ready_pickup' | 'needs_cleaning' | 'donated';

export type GarmentCategory = 'shirts' | 'pants' | 'dresses' | 'suits' | 'outerwear' | 'activewear' | 'formal' | 'casual' | 'accessories';

export type WardrobeItem = {
  id: string;
  name: string;
  category: GarmentCategory;
  imageUri?: string;
  color: string;
  brand?: string;
  purchaseDate?: Date;
  condition: GarmentCondition;
  status: GarmentStatus;
  timesWorn: number;
  timesCleaned: number;
  lastCleaned?: Date;
  estimatedValue: number;
  careHistory: {
    date: Date;
    type: 'wash' | 'iron' | 'dry_clean' | 'repair';
    orderId?: string;
    notes?: string;
  }[];
  tags?: string[];
  isFavorite: boolean;
  createdAt: Date;
};

export type OutfitSuggestion = {
  id: string;
  occasion: string;
  weather: string;
  items: WardrobeItem[];
  confidence: number;
  reason: string;
};
