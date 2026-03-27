export type PremiumServiceType = {
  id: string;
  name: string;
  nameAr: string;
  nameFr: string;
  nameEs: string;
  nameDe: string;
  nameIt: string;
  nameTr: string;
  nameRu: string;
  nameZh: string;
  nameHi: string;
  description: string;
  descriptionAr: string;
  descriptionFr: string;
  descriptionEs: string;
  descriptionDe: string;
  descriptionIt: string;
  descriptionTr: string;
  descriptionRu: string;
  descriptionZh: string;
  descriptionHi: string;
  price: number;
  icon: string;
  color: string;
  badge?: string;
};

export const PREMIUM_SERVICES: PremiumServiceType[] = [
  {
    id: 'express-delivery',
    name: 'Express Delivery',
    nameAr: 'التوصيل السريع',
    nameFr: 'Livraison Express',
    nameEs: 'Entrega Express',
    nameDe: 'Express-Lieferung',
    nameIt: 'Consegna Express',
    nameTr: 'Ekspres Teslimat',
    nameRu: 'Экспресс Доставка',
    nameZh: '快递',
    nameHi: 'एक्सप्रेस डिलीवरी',
    description: 'Get your order delivered in just 120 minutes',
    descriptionAr: 'احصل على طلبك خلال 120 دقيقة فقط',
    descriptionFr: 'Recevez votre commande en seulement 120 minutes',
    descriptionEs: 'Recibe tu pedido en solo 120 minutos',
    descriptionDe: 'Erhalten Sie Ihre Bestellung in nur 120 Minuten',
    descriptionIt: 'Ricevi il tuo ordine in soli 120 minuti',
    descriptionTr: 'Siparişinizi sadece 120 dakikada alın',
    descriptionRu: 'Получите заказ всего за 120 минут',
    descriptionZh: '仅需120分钟即可收到订单',
    descriptionHi: 'केवल 120 मिनट में अपना ऑर्डर प्राप्त करें',
    price: 50,
    icon: 'zap',
    color: '#F59E0B',
  },
  {
    id: 'perfume',
    name: 'Premium Perfume',
    nameAr: 'عطر فاخر',
    nameFr: 'Parfum Premium',
    nameEs: 'Perfume Premium',
    nameDe: 'Premium-Parfüm',
    nameIt: 'Profumo Premium',
    nameTr: 'Premium Parfüm',
    nameRu: 'Премиум Парфюм',
    nameZh: '高级香水',
    nameHi: 'प्रीमियम इत्र',
    description: 'Long-lasting luxury fragrance on your garments',
    descriptionAr: 'رائحة فاخرة تدوم طويلاً على ملابسك',
    descriptionFr: 'Parfum de luxe longue durée sur vos vêtements',
    descriptionEs: 'Fragancia de lujo duradera en tus prendas',
    descriptionDe: 'Langanhaltender Luxusduft auf Ihrer Kleidung',
    descriptionIt: 'Fragranza di lusso a lunga durata sui tuoi capi',
    descriptionTr: 'Giysilerinizde uzun süre kalıcı lüks koku',
    descriptionRu: 'Долговечный роскошный аромат на вашей одежде',
    descriptionZh: '您的衣物上持久的奢华香味',
    descriptionHi: 'आपके कपड़ों पर लंबे समय तक चलने वाली लक्जरी खुशबू',
    price: 30,
    icon: 'sparkles',
    color: '#EC4899',
  },
  {
    id: 'stain-protection',
    name: 'Stain Protection',
    nameAr: 'الحماية من البقع',
    nameFr: 'Protection Anti-Taches',
    nameEs: 'Protección contra Manchas',
    nameDe: 'Fleckenschutz',
    nameIt: 'Protezione dalle Macchie',
    nameTr: 'Leke Koruması',
    nameRu: 'Защита от Пятен',
    nameZh: '防污保护',
    nameHi: 'दाग संरक्षण',
    description: 'Advanced fabric treatment to repel stains and spills',
    descriptionAr: 'معالجة متقدمة للأقمشة لصد البقع والسوائل',
    descriptionFr: 'Traitement avancé du tissu pour repousser les taches',
    descriptionEs: 'Tratamiento avanzado de tela para repeler manchas',
    descriptionDe: 'Fortgeschrittene Stoffbehandlung gegen Flecken',
    descriptionIt: 'Trattamento avanzato del tessuto per respingere le macchie',
    descriptionTr: 'Lekeleri ve dökülmeleri iten gelişmiş kumaş işlemi',
    descriptionRu: 'Продвинутая обработка ткани для отталкивания пятен',
    descriptionZh: '先进的织物处理以驱除污渍',
    descriptionHi: 'दाग और रिसाव को दूर करने के लिए उन्नत कपड़े का उपचार',
    price: 25,
    icon: 'shield',
    color: '#10B981',
  },
  {
    id: 'vip',
    name: 'VIP Package',
    nameAr: 'باقة VIP',
    nameFr: 'Package VIP',
    nameEs: 'Paquete VIP',
    nameDe: 'VIP-Paket',
    nameIt: 'Pacchetto VIP',
    nameTr: 'VIP Paket',
    nameRu: 'VIP Пакет',
    nameZh: 'VIP套餐',
    nameHi: 'VIP पैकेज',
    description: 'All premium services + priority handling + premium packaging',
    descriptionAr: 'جميع الخدمات المميزة + معالجة أولوية + تغليف فاخر',
    descriptionFr: 'Tous les services premium + traitement prioritaire + emballage premium',
    descriptionEs: 'Todos los servicios premium + manejo prioritario + empaque premium',
    descriptionDe: 'Alle Premium-Services + bevorzugte Bearbeitung + Premium-Verpackung',
    descriptionIt: 'Tutti i servizi premium + gestione prioritaria + confezione premium',
    descriptionTr: 'Tüm premium hizmetler + öncelikli işlem + premium ambalaj',
    descriptionRu: 'Все премиум услуги + приоритетная обработка + премиум упаковка',
    descriptionZh: '所有高级服务 + 优先处理 + 高级包装',
    descriptionHi: 'सभी प्रीमियम सेवाएं + प्राथमिकता संचालन + प्रीमियम पैकेजिंग',
    price: 120,
    icon: 'crown',
    color: '#8B5CF6',
    badge: 'BEST VALUE',
  },
];
