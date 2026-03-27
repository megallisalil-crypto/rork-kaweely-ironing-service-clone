export type PerfumeType = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

export const PERFUMES: PerfumeType[] = [
  {
    id: 'sun-kissed-cotton',
    name: 'Sun-Kissed Cotton',
    description: 'Crisp & Clean',
    icon: '☀️',
  },
  {
    id: 'cashmere-comfort',
    name: 'Cashmere Comfort',
    description: 'Warm & Cozy',
    icon: '🧸',
  },
  {
    id: 'zen-garden',
    name: 'Zen Garden',
    description: 'Calming & Spa-Like',
    icon: '🌿',
  },
  {
    id: 'blossom-rain',
    name: 'Blossom & Rain',
    description: 'Uplifting & Floral',
    icon: '🌺',
  },
  {
    id: 'oud',
    name: 'Oud',
    description: 'Rich & Luxurious',
    icon: '🏺',
  },
];
