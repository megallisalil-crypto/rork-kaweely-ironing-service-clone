export interface SustainabilityMetrics {
  waterSavedLiters: number;
  energySavedKwh: number;
  co2SavedKg: number;
  itemsIroned: number;
  ecoScore: number;
  treesPlanted: number;
  lastUpdated: Date;
}

export interface DonationItem {
  id: string;
  name: string;
  category: 'shirt' | 'pants' | 'dress' | 'jacket' | 'other';
  condition: 'excellent' | 'good' | 'fair';
  estimatedValue: number;
  imageUrl?: string;
}

export interface Donation {
  id: string;
  items: DonationItem[];
  totalItems: number;
  estimatedValue: number;
  status: 'pending' | 'scheduled' | 'picked-up' | 'donated';
  scheduledDate?: Date;
  createdAt: Date;
}

export interface EcoMilestone {
  id: string;
  title: string;
  description: string;
  icon: string;
  threshold: number;
  achieved: boolean;
  achievedAt?: Date;
}

export interface ImpactComparison {
  metric: string;
  saved: number;
  traditional: number;
  unit: string;
  icon: string;
  color: string;
}
