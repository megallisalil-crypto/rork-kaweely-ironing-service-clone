import { CurrencyCode } from '@/types/currency';

export type DeliveryZone = {
  name: string;
  areas: string[];
  costEGP: number;
};

// Default delivery zones configuration - can be customized per region
export const DEFAULT_DELIVERY_ZONES: DeliveryZone[] = [
  { 
    name: "Zone 1 - City Center", 
    areas: ["Downtown", "Central", "City Center", "Historic District"], 
    costEGP: 30 
  },
  { 
    name: "Zone 2 - Metropolitan Area", 
    areas: ["Suburban", "Metro", "Inner City", "Uptown"], 
    costEGP: 50 
  },
  { 
    name: "Zone 3 - Extended Area", 
    areas: ["Outskirts", "New Development", "Extended Area", "Satellite City"], 
    costEGP: 70 
  },
  { 
    name: "Zone 4 - Remote Areas", 
    areas: ["Remote", "Far Area", "Outer Region", "Other Areas"], 
    costEGP: 100 
  },
];

// Region-specific delivery zones
export const REGIONAL_DELIVERY_ZONES: Record<string, DeliveryZone[]> = {
  // Egypt - Cairo
  'EG-CAI': [
    { name: "Zone 1 - Central Cairo", areas: ["Downtown", "Zamalek", "Garden City", "Dokki"], costEGP: 30 },
    { name: "Zone 2 - Greater Cairo", areas: ["Maadi", "Heliopolis", "Nasr City", "Mohandessin"], costEGP: 50 },
    { name: "Zone 3 - New Cairo & 6th October", areas: ["New Cairo", "5th Settlement", "6th October", "Sheikh Zayed"], costEGP: 70 },
    { name: "Zone 4 - Outer Areas", areas: ["10th of Ramadan", "Shorouk", "Obour", "Other Areas"], costEGP: 100 },
  ],
  
  // UAE - Dubai
  'AE-DUB': [
    { name: "Zone 1 - Downtown Dubai", areas: ["Downtown", "Dubai Marina", "Business Bay", "JBR"], costEGP: 30 },
    { name: "Zone 2 - Extended Dubai", areas: ["Jumeirah", "Deira", "Bur Dubai", "Al Barsha"], costEGP: 50 },
    { name: "Zone 3 - Outer Dubai", areas: ["Dubai Silicon Oasis", "Dubai Sports City", "JVC", "Motor City"], costEGP: 70 },
    { name: "Zone 4 - Remote Areas", areas: ["Al Awir", "Jebel Ali", "Other Areas"], costEGP: 100 },
  ],
  
  // Saudi Arabia - Riyadh
  'SA-RUH': [
    { name: "Zone 1 - Central Riyadh", areas: ["Olaya", "Al Malaz", "Al Murabba", "Downtown"], costEGP: 30 },
    { name: "Zone 2 - Greater Riyadh", areas: ["Al Naseem", "Al Nakheel", "Al Wurud", "Granada"], costEGP: 50 },
    { name: "Zone 3 - Extended Riyadh", areas: ["Al Khaleej", "Hittin", "Al Suwaidi", "Al Yasmin"], costEGP: 70 },
    { name: "Zone 4 - Outer Areas", areas: ["Diriyah", "Al Uraija", "Other Areas"], costEGP: 100 },
  ],
  
  // Turkey - Istanbul
  'TR-IST': [
    { name: "Zone 1 - Central Istanbul", areas: ["Beyoğlu", "Beşiktaş", "Şişli", "Fatih"], costEGP: 30 },
    { name: "Zone 2 - Greater Istanbul", areas: ["Kadıköy", "Üsküdar", "Bakırköy", "Sarıyer"], costEGP: 50 },
    { name: "Zone 3 - Extended Istanbul", areas: ["Ataşehir", "Maltepe", "Pendik", "Kartal"], costEGP: 70 },
    { name: "Zone 4 - Outer Areas", areas: ["Silivri", "Çatalca", "Other Areas"], costEGP: 100 },
  ],
};

export function getDeliveryZones(regionCode?: string): DeliveryZone[] {
  if (regionCode && REGIONAL_DELIVERY_ZONES[regionCode]) {
    return REGIONAL_DELIVERY_ZONES[regionCode];
  }
  return DEFAULT_DELIVERY_ZONES;
}

export function calculateDeliveryCost(
  address: string, 
  deliveryZones: DeliveryZone[] = DEFAULT_DELIVERY_ZONES,
  currency: CurrencyCode = 'EGP'
): number {
  if (!address.trim()) return 0;
  
  const lowerAddress = address.toLowerCase();
  
  for (const zone of deliveryZones) {
    for (const area of zone.areas) {
      if (lowerAddress.includes(area.toLowerCase())) {
        return zone.costEGP;
      }
    }
  }
  
  return deliveryZones[deliveryZones.length - 1].costEGP;
}
