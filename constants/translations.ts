import { LanguageCode } from '@/types/language';

export type Translation = {
  tabs: {
    home: string;
    orders: string;
    tracking: string;
    subscribe: string;
    profile: string;
    myPlan: string;
  };
  home: {
    title: string;
    subtitle: string;
    tagline: string;
    newOrder: string;
    priceCalculator: string;
    howItWorks: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    whyChooseUs: string;
    feature1: string;
    feature1Desc: string;
    feature2: string;
    feature2Desc: string;
    feature3: string;
    feature3Desc: string;
    feature4: string;
    feature4Desc: string;
    specialOffers: string;
    quickActions: string;
    quickOrderCalculator: string;
    selectItems: string;
    calculateCost: string;
    addGarments: string;
    useSubscriptionPlan: string;
    piecesAvailable: string;
    noItemsSelected: string;
    tapToAddGarments: string;
    premiumServices: string;
    expressDelivery: string;
    premiumPerfume: string;
    vipPackaging: string;
    deliveryLocation: string;
    enterArea: string;
    costBreakdown: string;
    subtotal: string;
    items: string;
    express: string;
    perfume: string;
    vipPack: string;
    delivery: string;
    total: string;
    goToCart: string;
    addToCart: string;
    yourGarments: string;
    item: string;
    rewards: string;
    referrals: string;
    store: string;
    liveSupport: string;
    whatToWear: string;
    readyForPremium: string;
    subscribeNow: string;
    viewPlans: string;
    expressDescription: string;
    minRequired: string;
  };
  orders: {
    title: string;
    all: string;
    pending: string;
    inProgress: string;
    completed: string;
    noOrders: string;
    viewDetails: string;
    pickup: string;
    ready: string;
    processing: string;
    filters: string;
    tapToShow: string;
    tapToHide: string;
    ordersCount: string;
    orderFound: string;
    ordersFound: string;
    noOrdersMessage: string;
    tryDifferentFilter: string;
    noOrdersYet: string;
    createFirstOrder: string;
  };
  profile: {
    title: string;
    clientInfo: string;
    edit: string;
    save: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    address: string;
    birthday: string;
    birthdayHint: string;
    wallet: string;
    currentBalance: string;
    addMoney: string;
    send: string;
    recentTransactions: string;
    language: string;
    settings: string;
    notifications: string;
    darkMode: string;
    privacyPolicy: string;
    termsOfService: string;
    logout: string;
    selectLanguage: string;
    selectYourLanguage: string;
    male: string;
    female: string;
    gender: string;
    tapToChange: string;
    sendGiftCard: string;
    noTransactions: string;
    avatarSettings: string;
    takePhoto: string;
    chooseFromLibrary: string;
    removePhoto: string;
  };
  subscribe: {
    title: string;
    chooseYourPlan: string;
    perWeek: string;
    perMonth: string;
    mostPopular: string;
    delivery: string;
    discount: string;
    finalPrice: string;
    subscribe: string;
    features: string;
    savings: string;
    bestValue: string;
    premium: string;
    pieces: string;
    pickupsPerWeek: string;
    standardIroning: string;
    premiumIroning: string;
    prioritySupport: string;
    premiumSteaming: string;
    dedicatedSupport: string;
    freeStainRemoval: string;
    premiumService: string;
    vipSupport: string;
    freeAlterations: string;
    qualityGuarantee: string;
    subscribeNow: string;
    weekly: string;
    monthly: string;
    quarterly: string;
    biannual: string;
    yearly: string;
    week: string;
    days: string;
  };
  tracking: {
    title: string;
    trackOrder: string;
    orderId: string;
    status: string;
    noActiveOrders: string;
    trackingInfo: string;
    orderJourney: string;
    scheduled: string;
    pickup: string;
    processing: string;
    ready: string;
    inDelivery: string;
    completed: string;
    pickupScheduled: string;
    pickingUp: string;
    ironing: string;
    readyForDelivery: string;
    delivering: string;
    delivered: string;
    estimatedDelivery: string;
    contactSupport: string;
    callUs: string;
    playGame: string;
    enjoyGame: string;
    minutesRemaining: string;
  };
  newOrder: {
    title: string;
    selectGarments: string;
    deliveryDays: string;
    deliveryAddress: string;
    paymentMethod: string;
    submit: string;
  };
  cart: {
    title: string;
    yourCart: string;
    itemsInCart: string;
    emptyCart: string;
    startShopping: string;
    cartSummary: string;
    useSubscription: string;
    expressDelivery: string;
    deliveryCost: string;
    discount: string;
    total: string;
    checkout: string;
    cartEmpty: string;
    addItemsFirst: string;
    noActiveSubscription: string;
    insufficientPieces: string;
    insufficientBalance: string;
    addMoneyFirst: string;
    confirmPayment: string;
    confirmDeduction: string;
    payNow: string;
    payFromWallet: string;
    deductFromSubscription: string;
    orderPlaced: string;
    orderSuccess: string;
    continueShopping: string;
    viewOrders: string;
  };
  sos: {
    title: string;
    emergencyService: string;
    vipEmergency: string;
    serviceAvailable: string;
    busy: string;
    description: string;
    deliveryTime: string;
    yourArea: string;
    selectLocation: string;
    superFast: string;
    topPriority: string;
    comprehensiveGuarantee: string;
    guaranteedQuality: string;
    expressService: string;
    howManyPieces: string;
    pieces: string;
    totalCost: string;
    discount: string;
    includesDelivery: string;
    requestSOSNow: string;
    requesting: string;
    activeSOSWarning: string;
    orderReceived: string;
    teamOnWay: string;
    orderNumber: string;
    trackOrder: string;
    error: string;
    insufficientBalance: string;
    addMoneyFirst: string;
    noAddressSet: string;
    setAddressFirst: string;
    available24_7: string;
    alwaysHere: string;
    neverSleep: string;
    dayOrNight: string;
  };
  common: {
    cancel: string;
    confirm: string;
    back: string;
    next: string;
    done: string;
    loading: string;
    error: string;
    success: string;
    egp: string;
    min: string;
    required: string;
    optional: string;
  };
};

const englishTranslation: Translation = {

    tabs: { home: 'Home', orders: 'Orders', tracking: 'Tracking', subscribe: 'Subscribe', profile: 'Profile', myPlan: 'My Plan' },
    home: {
      title: 'Professional Ironing Service', subtitle: 'Premium quality, delivered to your door', tagline: 'Kaweely - Making Life Easier',
      newOrder: 'New Order', priceCalculator: 'Price Calculator', howItWorks: 'How It Works',
      step1Title: 'Place Order', step1Desc: 'Tell us what you need ironed', step2Title: 'We Pick Up', step2Desc: 'We collect from your location',
      step3Title: 'Get Delivered', step3Desc: 'Perfectly ironed clothes delivered', whyChooseUs: 'Why Choose Kaweely?',
      feature1: 'Professional Quality', feature1Desc: 'Expert ironing with attention to detail', feature2: 'Fast Delivery', feature2Desc: 'Quick turnaround time',
      feature3: 'Affordable Prices', feature3Desc: 'Best value for your money', feature4: '24/7 Support', feature4Desc: 'Always here to help',
      specialOffers: 'Special Offers', quickActions: 'Quick Actions', quickOrderCalculator: 'Quick Order & Calculator',
      selectItems: 'Select Items', calculateCost: 'Calculate Cost', addGarments: 'Add Garments', useSubscriptionPlan: 'Use Subscription Plan',
      piecesAvailable: 'pieces available', noItemsSelected: 'No items selected', tapToAddGarments: 'Tap the button above to browse garments',
      premiumServices: 'Premium Services', expressDelivery: 'Express Delivery', premiumPerfume: 'Premium Perfume', vipPackaging: 'VIP Kaweely Packaging',
      deliveryLocation: 'Delivery Location', enterArea: 'Enter area (e.g., Maadi, Zamalek)', costBreakdown: 'Cost Breakdown',
      subtotal: 'Subtotal', items: 'items', express: 'Express', perfume: 'Perfume', vipPack: 'VIP Packaging',
      delivery: 'Delivery', total: 'Total', goToCart: 'Go to Cart', addToCart: 'Add to Cart', yourGarments: 'Your Garments', item: 'item',
      rewards: 'Rewards', referrals: 'Referrals', store: 'Store', liveSupport: 'Live Support', whatToWear: 'What to Wear',
      readyForPremium: 'Ready for Premium Garment Care?', subscribeNow: 'Subscribe now and experience the Kaweely difference',
      viewPlans: 'View Plans', expressDescription: '120 min delivery', minRequired: 'Min EGP required'
    },
    orders: {
      title: 'My Orders', all: 'All', pending: 'Pending', inProgress: 'In Progress', completed: 'Completed', noOrders: 'No orders found',
      viewDetails: 'View Details', pickup: 'Pickup', ready: 'Ready', processing: 'Processing', filters: 'Filters', tapToShow: 'Tap to show',
      tapToHide: 'Tap to hide', ordersCount: 'ORDERS', orderFound: 'order found', ordersFound: 'orders found',
      noOrdersMessage: 'You haven\'t placed any orders yet.\nStart by creating your first order!',
      tryDifferentFilter: 'No orders at the moment.\nTry selecting a different filter.',
      noOrdersYet: 'No orders yet', createFirstOrder: 'Start by creating your first order!'
    },
    profile: {
      title: 'Profile', clientInfo: 'Client Information', edit: 'Edit', save: 'Save',  fullName: 'Full Name', phoneNumber: 'Phone Number',
      email: 'Email', address: 'Address', birthday: 'Birthday', birthdayHint: 'Enter your birthday to receive special offers',
      wallet: 'Wallet', currentBalance: 'Current Balance', addMoney: 'Add Money', send: 'Send', recentTransactions: 'Recent Transactions',
      language: 'Language', settings: 'Settings', notifications: 'Push Notifications', darkMode: 'Dark Mode', privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service', logout: 'Log Out', selectLanguage: 'Select Language', selectYourLanguage: 'Select Your Language',
      male: 'Male', female: 'Female', gender: 'Gender', tapToChange: 'Tap to change', sendGiftCard: 'Send Gift Card',
      noTransactions: 'No recent transactions', avatarSettings: 'Avatar Settings', takePhoto: 'Take Photo',
      chooseFromLibrary: 'Choose from Library', removePhoto: 'Remove Photo'
    },
    subscribe: {
      title: 'Subscription Plans', chooseYourPlan: 'Choose Your Plan', perWeek: 'per week', perMonth: 'per month',
      mostPopular: 'Most Popular', delivery: 'Delivery', discount: 'Discount', finalPrice: 'Final Price', subscribe: 'Subscribe Now',
      features: 'Features', savings: 'Savings', bestValue: 'BEST VALUE', premium: 'PREMIUM', pieces: 'garment pieces',
      pickupsPerWeek: 'pickups/week', standardIroning: 'Standard ironing', premiumIroning: 'Premium ironing',
      prioritySupport: 'Priority support', premiumSteaming: 'Premium ironing & steaming', dedicatedSupport: 'Dedicated support',
      freeStainRemoval: 'Free stain removal', premiumService: 'Premium service', vipSupport: 'VIP support',
      freeAlterations: 'Free alterations', qualityGuarantee: 'Quality guarantee', subscribeNow: 'Subscribe Now',
      weekly: 'Weekly', monthly: '1 Month', quarterly: '3 Months', biannual: '6 Months', yearly: 'Year', week: 'Week', days: 'Days'
    },
    tracking: {
      title: 'Track Order', trackOrder: 'Track Your Order', orderId: 'Order ID', status: 'Status',
      noActiveOrders: 'No active orders to track', trackingInfo: 'Select an active order to see tracking information',
      orderJourney: 'Order Journey', scheduled: 'Scheduled', pickup: 'Pickup', processing: 'Processing',
      ready: 'Ready', inDelivery: 'In Delivery', completed: 'Completed', pickupScheduled: 'Pickup Scheduled',
      pickingUp: 'We\'re picking up your garments', ironing: 'We\'re ironing your garments', readyForDelivery: 'Ready for delivery',
      delivering: 'On the way to you', delivered: 'Delivered successfully', estimatedDelivery: 'Estimated Delivery',
      contactSupport: 'Contact Support', callUs: 'Call Us', playGame: 'Play a Game', enjoyGame: 'Enjoy while you wait',
      minutesRemaining: 'minutes remaining'
    },
    newOrder: {
      title: 'New Order', selectGarments: 'Select Garments', deliveryDays: 'Delivery Days', deliveryAddress: 'Delivery Address',
      paymentMethod: 'Payment Method', submit: 'Submit Order'
    },
    cart: {
      title: 'Cart', yourCart: 'Your Cart', itemsInCart: 'Items in Cart', emptyCart: 'Empty Cart', startShopping: 'Start Shopping',
      cartSummary: 'Cart Summary', useSubscription: 'Use Subscription Pieces', expressDelivery: 'Express Delivery',
      deliveryCost: 'Delivery Cost', discount: 'Discount', total: 'Total', checkout: 'Checkout', cartEmpty: 'Cart Empty',
      addItemsFirst: 'Please add items to your cart before checkout.', noActiveSubscription: 'No Active Subscription',
      insufficientPieces: 'Insufficient Pieces', insufficientBalance: 'Insufficient Balance', addMoneyFirst: 'Please add money to your wallet first.',
      confirmPayment: 'Confirm Payment', confirmDeduction: 'Confirm Deduction', payNow: 'Pay Now', payFromWallet: 'Pay from wallet?',
      deductFromSubscription: 'Deduct from subscription?', orderPlaced: 'Order Placed', orderSuccess: 'Your order has been placed successfully!',
      continueShopping: 'Continue Shopping', viewOrders: 'View Orders'
    },
    sos: {
      title: 'Emergency SOS',
      emergencyService: 'Emergency Ironing Service',
      vipEmergency: 'VIP Emergency Service',
      serviceAvailable: 'Service Available',
      busy: 'Busy',
      description: 'We reach you wherever you are, perfectly ironed clothes in 60 minutes',
      deliveryTime: 'Expected Arrival Time',
      yourArea: 'Your Area',
      selectLocation: 'Select Location',
      superFast: 'Super Fast',
      topPriority: 'Top Priority',
      comprehensiveGuarantee: 'Comprehensive Guarantee',
      guaranteedQuality: 'Guaranteed Quality',
      expressService: 'Express Service',
      howManyPieces: 'How many pieces do you need?',
      pieces: 'pieces',
      totalCost: 'Total Cost',
      discount: 'Discount',
      includesDelivery: 'Includes express delivery and emergency service',
      requestSOSNow: 'Request SOS Now',
      requesting: 'Requesting...',
      activeSOSWarning: 'You already have active SOS requests. Please wait for them to complete.',
      orderReceived: 'Order Received! 🚀',
      teamOnWay: 'Emergency team is on the way to you.\nOrder number: ',
      orderNumber: 'Order Number',
      trackOrder: 'Track Order',
      error: 'Error',
      insufficientBalance: 'Insufficient Balance',
      addMoneyFirst: 'Please add money to your wallet first.',
      noAddressSet: 'No Address Set',
      setAddressFirst: 'Please set your delivery address first.',
      available24_7: '24/7 Available',
      alwaysHere: 'Always Here for You',
      neverSleep: '☀️ We Never Sleep, So Your Wardrobe is Always Ready 🌙',
      dayOrNight: 'Day or Night, Rain or Shine - We\'re Here',
    },
    common: { cancel: 'Cancel', confirm: 'Confirm', back: 'Back', next: 'Next', done: 'Done', loading: 'Loading...', error: 'Error', success: 'Success', egp: 'EGP', min: 'min', required: 'required', optional: 'optional' },
};

export const translations: Record<LanguageCode, Translation> = {
  en: englishTranslation,
  ar: {
    tabs: { home: 'الرئيسية', orders: 'الطلبات', tracking: 'التتبع', subscribe: 'الاشتراك', profile: 'الملف الشخصي', myPlan: 'خطتي' },
    home: {
      title: 'خدمة الكي الاحترافية', subtitle: 'جودة عالية، توصيل إلى باب منزلك', tagline: 'كويلي - حياتك أسهل',
      newOrder: 'طلب جديد', priceCalculator: 'حاسبة الأسعار', howItWorks: 'كيف يعمل',
      step1Title: 'قدم الطلب', step1Desc: 'أخبرنا بما تحتاج كيه', step2Title: 'نستلم الملابس', step2Desc: 'نجمع من موقعك',
      step3Title: 'التوصيل', step3Desc: 'ملابس مكوية بشكل مثالي', whyChooseUs: 'لماذا تختار كويلي؟',
      feature1: 'جودة احترافية', feature1Desc: 'كي خبير مع الاهتمام بالتفاصيل', feature2: 'توصيل سريع', feature2Desc: 'وقت تسليم سريع',
      feature3: 'أسعار معقولة', feature3Desc: 'أفضل قيمة لأموالك', feature4: 'دعم 24/7', feature4Desc: 'دائما هنا للمساعدة',
      specialOffers: 'عروض خاصة', quickActions: 'إجراءات سريعة', quickOrderCalculator: 'طلب سريع وحاسبة',
      selectItems: 'اختر العناصر', calculateCost: 'احسب التكلفة', addGarments: 'إضافة ملابس', useSubscriptionPlan: 'استخدم خطة الاشتراك',
      piecesAvailable: 'قطعة متاحة', noItemsSelected: 'لم يتم اختيار عناصر', tapToAddGarments: 'اضغط على الزر أعلاه لتصفح الملابس',
      premiumServices: 'خدمات متميزة', expressDelivery: 'توصيل سريع', premiumPerfume: 'عطر متميز', vipPackaging: 'تغليف كويلي VIP',
      deliveryLocation: 'موقع التوصيل', enterArea: 'أدخل المنطقة (مثل المعادي، الزمالك)', costBreakdown: 'تفصيل التكلفة',
      subtotal: 'المجموع الفرعي', items: 'عناصر', express: 'سريع', perfume: 'عطر', vipPack: 'تغليف VIP',
      delivery: 'التوصيل', total: 'المجموع', goToCart: 'اذهب إلى السلة', addToCart: 'أضف إلى السلة', yourGarments: 'ملابسك', item: 'عنصر',
      rewards: 'المكافآت', referrals: 'الإحالات', store: 'المتجر', liveSupport: 'دعم مباشر', whatToWear: 'ماذا ترتدي',
      readyForPremium: 'جاهز للعناية الممتازة بالملابس؟', subscribeNow: 'اشترك الآن واختبر فرق كويلي',
      viewPlans: 'عرض الخطط', expressDescription: 'توصيل 120 دقيقة', minRequired: 'الحد الأدنى جنيه مطلوب'
    },
    orders: {
      title: 'طلباتي', all: 'الكل', pending: 'قيد الانتظار', inProgress: 'قيد التنفيذ', completed: 'مكتمل', noOrders: 'لا توجد طلبات',
      viewDetails: 'عرض التفاصيل', pickup: 'الاستلام', ready: 'جاهز', processing: 'قيد المعالجة', filters: 'التصفيات', tapToShow: 'اضغط للإظهار',
      tapToHide: 'اضغط للإخفاء', ordersCount: 'الطلبات', orderFound: 'طلب موجود', ordersFound: 'طلبات موجودة',
      noOrdersMessage: 'لم تقم بتقديم أي طلبات بعد.\nابدأ بإنشاء طلبك الأول!',
      tryDifferentFilter: 'لا توجد طلبات في الوقت الحالي.\nجرب تحديد فلتر مختلف.',
      noOrdersYet: 'لا توجد طلبات بعد', createFirstOrder: 'ابدأ بإنشاء طلبك الأول!'
    },
    profile: {
      title: 'الملف الشخصي', clientInfo: 'معلومات العميل', edit: 'تعديل', save: 'حفظ', fullName: 'الاسم الكامل', phoneNumber: 'رقم الهاتف',
      email: 'البريد الإلكتروني', address: 'العنوان', birthday: 'تاريخ الميلاد', birthdayHint: 'أدخل تاريخ ميلادك لتلقي عروض خاصة',
      wallet: 'المحفظة', currentBalance: 'الرصيد الحالي', addMoney: 'إضافة مال', send: 'إرسال', recentTransactions: 'المعاملات الأخيرة',
      language: 'اللغة', settings: 'الإعدادات', notifications: 'الإشعارات', darkMode: 'الوضع الداكن', privacyPolicy: 'سياسة الخصوصية',
      termsOfService: 'شروط الخدمة', logout: 'تسجيل الخروج', selectLanguage: 'اختر اللغة', selectYourLanguage: 'اختر لغتك',
      male: 'ذكر', female: 'أنثى', gender: 'الجنس', tapToChange: 'اضغط للتغيير', sendGiftCard: 'إرسال بطاقة هدية',
      noTransactions: 'لا توجد معاملات حديثة', avatarSettings: 'إعدادات الصورة الشخصية', takePhoto: 'التقط صورة',
      chooseFromLibrary: 'اختر من المكتبة', removePhoto: 'إزالة الصورة'
    },
    subscribe: {
      title: 'خطط الاشتراك', chooseYourPlan: 'اختر خطتك', perWeek: 'في الأسبوع', perMonth: 'في الشهر',
      mostPopular: 'الأكثر شعبية', delivery: 'التوصيل', discount: 'الخصم', finalPrice: 'السعر النهائي', subscribe: 'اشترك الآن',
      features: 'المميزات', savings: 'التوفير', bestValue: 'أفضل قيمة', premium: 'بريميوم', pieces: 'قطعة ملابس',
      pickupsPerWeek: 'استلام/أسبوع', standardIroning: 'كي قياسي', premiumIroning: 'كي متميز',
      prioritySupport: 'دعم أولوية', premiumSteaming: 'كي وبخار متميز', dedicatedSupport: 'دعم مخصص',
      freeStainRemoval: 'إزالة البقع مجانًا', premiumService: 'خدمة متميزة', vipSupport: 'دعم VIP',
      freeAlterations: 'تعديلات مجانية', qualityGuarantee: 'ضمان الجودة', subscribeNow: 'اشترك الآن',
      weekly: 'أسبوعي', monthly: '1 شهر', quarterly: '3 أشهر', biannual: '6 أشهر', yearly: 'سنة', week: 'أسبوع', days: 'أيام'
    },
    tracking: {
      title: 'تتبع الطلب', trackOrder: 'تتبع طلبك', orderId: 'رقم الطلب', status: 'الحالة',
      noActiveOrders: 'لا توجد طلبات نشطة للتتبع', trackingInfo: 'حدد طلبًا نشطًا لمشاهدة معلومات التتبع',
      orderJourney: 'رحلة الطلب', scheduled: 'مجدول', pickup: 'الاستلام', processing: 'قيد المعالجة',
      ready: 'جاهز', inDelivery: 'قيد التوصيل', completed: 'مكتمل', pickupScheduled: 'الاستلام مجدول',
      pickingUp: 'نستلم ملابسك', ironing: 'نكوي ملابسك', readyForDelivery: 'جاهز للتوصيل',
      delivering: 'في الطريق إليك', delivered: 'تم التوصيل بنجاح', estimatedDelivery: 'التوصيل المقدر',
      contactSupport: 'الاتصال بالدعم', callUs: 'اتصل بنا', playGame: 'العب لعبة', enjoyGame: 'استمتع أثناء الانتظار',
      minutesRemaining: 'دقيقة متبقية'
    },
    newOrder: {
      title: 'طلب جديد', selectGarments: 'اختر الملابس', deliveryDays: 'أيام التوصيل', deliveryAddress: 'عنوان التوصيل',
      paymentMethod: 'طريقة الدفع', submit: 'إرسال الطلب'
    },
    cart: {
      title: 'السلة', yourCart: 'سلتك', itemsInCart: 'العناصر في السلة', emptyCart: 'سلة فارغة', startShopping: 'ابدأ التسوق',
      cartSummary: 'ملخص السلة', useSubscription: 'استخدم قطع الاشتراك', expressDelivery: 'توصيل سريع',
      deliveryCost: 'تكلفة التوصيل', discount: 'الخصم', total: 'المجموع', checkout: 'الدفع', cartEmpty: 'السلة فارغة',
      addItemsFirst: 'يرجى إضافة عناصر إلى سلتك قبل الدفع.', noActiveSubscription: 'لا يوجد اشتراك نشط',
      insufficientPieces: 'قطع غير كافية', insufficientBalance: 'رصيد غير كافٍ', addMoneyFirst: 'يرجى إضافة أموال إلى محفظتك أولاً.',
      confirmPayment: 'تأكيد الدفع', confirmDeduction: 'تأكيد الخصم', payNow: 'ادفع الآن', payFromWallet: 'الدفع من المحفظة؟',
      deductFromSubscription: 'خصم من الاشتراك؟', orderPlaced: 'تم تقديم الطلب', orderSuccess: 'تم تقديم طلبك بنجاح!',
      continueShopping: 'مواصلة التسوق', viewOrders: 'عرض الطلبات'
    },
    sos: {
      title: 'SOS الطوارئ',
      emergencyService: 'خدمة الكي الطارئة',
      vipEmergency: 'خدمة VIP للطوارئ',
      serviceAvailable: 'خدمة متاحة',
      busy: 'مشغول',
      description: 'نصلك أينما كنت، ملابسك مكوية بشكل مثالي في 60 دقيقة',
      deliveryTime: 'وقت الوصول المتوقع',
      yourArea: 'منطقتك',
      selectLocation: 'حدد الموقع',
      superFast: 'سرعة فائقة',
      topPriority: 'أولوية قصوى',
      comprehensiveGuarantee: 'ضمان شامل',
      guaranteedQuality: 'جودة مضمونة',
      expressService: 'خدمة سريعة',
      howManyPieces: 'كم قطعة تحتاج؟',
      pieces: 'قطع',
      totalCost: 'التكلفة الإجمالية',
      discount: 'خصم',
      includesDelivery: 'شامل التوصيل السريع والخدمة الطارئة',
      requestSOSNow: 'أطلب SOS الآن',
      requesting: 'جاري الطلب...',
      activeSOSWarning: 'لديك طلبات SOS نشطة بالفعل. يرجى انتظار اكتمالها.',
      orderReceived: 'تم استلام الطلب! 🚀',
      teamOnWay: 'فريق الطوارئ في طريقه إليك.\nرقم الطلب: ',
      orderNumber: 'رقم الطلب',
      trackOrder: 'متابعة الطلب',
      error: 'خطأ',
      insufficientBalance: 'رصيد غير كافٍ',
      addMoneyFirst: 'يرجى إضافة أموال إلى محفظتك أولاً.',
      noAddressSet: 'لم يتم تعيين العنوان',
      setAddressFirst: 'يرجى تعيين عنوان التوصيل أولاً.',
      available24_7: 'متاح 24/7',
      alwaysHere: 'دائماً معك',
      neverSleep: '☀️ لا ننام أبداً، خزانتك دائماً جاهزة 🌙',
      dayOrNight: 'ليلاً أو نهاراً، في المطر أو الشمس - نحن هنا',
    },
    common: { cancel: 'إلغاء', confirm: 'تأكيد', back: 'رجوع', next: 'التالي', done: 'تم', loading: 'جاري التحميل...', error: 'خطأ', success: 'نجاح', egp: 'جنيه', min: 'دقيقة', required: 'مطلوب', optional: 'اختياري' },
  },
  fr: {
    tabs: { home: 'Accueil', orders: 'Commandes', tracking: 'Suivi', subscribe: "S'abonner", profile: 'Profil', myPlan: 'Mon Plan' },
    home: {
      title: 'Service de Repassage Professionnel', subtitle: 'Qualité premium, livré à votre porte', tagline: 'Kaweely - Rendons la Vie Plus Facile',
      newOrder: 'Nouvelle Commande', priceCalculator: 'Calculateur de Prix', howItWorks: 'Comment ça marche',
      step1Title: 'Passer Commande', step1Desc: 'Dites-nous ce qui doit être repassé', step2Title: 'Nous Récupérons', step2Desc: 'Nous collectons depuis votre emplacement',
      step3Title: 'Livraison', step3Desc: 'Vêtements parfaitement repassés livrés', whyChooseUs: 'Pourquoi Choisir Kaweely?',
      feature1: 'Qualité Professionnelle', feature1Desc: 'Repassage expert avec attention aux détails', feature2: 'Livraison Rapide', feature2Desc: 'Délai de traitement rapide',
      feature3: 'Prix Abordables', feature3Desc: 'Meilleur rapport qualité-prix', feature4: 'Support 24/7', feature4Desc: 'Toujours là pour vous aider',
      specialOffers: 'Offres Spéciales', quickActions: 'Actions Rapides', quickOrderCalculator: 'Commande Rapide & Calculateur',
      selectItems: 'Sélectionner Articles', calculateCost: 'Calculer Coût', addGarments: 'Ajouter Vêtements', useSubscriptionPlan: 'Utiliser Plan Abonnement',
      piecesAvailable: 'pièces disponibles', noItemsSelected: 'Aucun article sélectionné', tapToAddGarments: 'Appuyez sur le bouton ci-dessus pour parcourir',
      premiumServices: 'Services Premium', expressDelivery: 'Livraison Express', premiumPerfume: 'Parfum Premium', vipPackaging: 'Emballage VIP Kaweely',
      deliveryLocation: 'Lieu de Livraison', enterArea: 'Entrer zone (ex: Downtown, Zamalek)', costBreakdown: 'Détail Coût',
      subtotal: 'Sous-total', items: 'articles', express: 'Express', perfume: 'Parfum', vipPack: 'Emballage VIP',
      delivery: 'Livraison', total: 'Total', goToCart: 'Aller au Panier', addToCart: 'Ajouter au Panier', yourGarments: 'Vos Vêtements', item: 'article',
      rewards: 'Récompenses', referrals: 'Parrainages', store: 'Boutique', liveSupport: 'Support Live', whatToWear: 'Quoi Porter',
      readyForPremium: 'Prêt pour les Soins Premium?', subscribeNow: 'Abonnez-vous et découvrez Kaweely',
      viewPlans: 'Voir Plans', expressDescription: 'Livraison 120 min', minRequired: 'Min EGP requis'
    },
    orders: {
      title: 'Mes Commandes', all: 'Tout', pending: 'En Attente', inProgress: 'En Cours', completed: 'Terminé', noOrders: 'Aucune commande trouvée',
      viewDetails: 'Voir Détails', pickup: 'Collecte', ready: 'Prêt', processing: 'Traitement', filters: 'Filtres', tapToShow: 'Appuyer pour afficher',
      tapToHide: 'Appuyer pour masquer', ordersCount: 'COMMANDES', orderFound: 'commande trouvée', ordersFound: 'commandes trouvées',
      noOrdersMessage: 'Vous n\'avez pas encore passé de commandes.\nCommencez par créer votre première commande!',
      tryDifferentFilter: 'Aucune commande pour le moment.\nEssayez de sélectionner un filtre différent.',
      noOrdersYet: 'Pas encore de commandes', createFirstOrder: 'Commencez par créer votre première commande!'
    },
    profile: {
      title: 'Profil', clientInfo: 'Informations Client', edit: 'Modifier', save: 'Enregistrer', fullName: 'Nom Complet', phoneNumber: 'Numéro de Téléphone',
      email: 'Email', address: 'Adresse', birthday: 'Date de Naissance', birthdayHint: 'Entrez votre date de naissance pour recevoir des offres spéciales',
      wallet: 'Portefeuille', currentBalance: 'Solde Actuel', addMoney: 'Ajouter Argent', send: 'Envoyer', recentTransactions: 'Transactions Récentes',
      language: 'Langue', settings: 'Paramètres', notifications: 'Notifications', darkMode: 'Mode Sombre', privacyPolicy: 'Politique de Confidentialité',
      termsOfService: 'Conditions de Service', logout: 'Se Déconnecter', selectLanguage: 'Sélectionner Langue', selectYourLanguage: 'Sélectionnez Votre Langue',
      male: 'Homme', female: 'Femme', gender: 'Genre', tapToChange: 'Appuyer pour changer', sendGiftCard: 'Envoyer Carte Cadeau',
      noTransactions: 'Aucune transaction récente', avatarSettings: 'Paramètres Avatar', takePhoto: 'Prendre Photo',
      chooseFromLibrary: 'Choisir Bibliothèque', removePhoto: 'Supprimer Photo'
    },
    subscribe: {
      title: 'Plans Abonnement', chooseYourPlan: 'Choisissez Votre Plan', perWeek: 'par semaine', perMonth: 'par mois',
      mostPopular: 'Plus Populaire', delivery: 'Livraison', discount: 'Réduction', finalPrice: 'Prix Final', subscribe: 'S\'abonner Maintenant',
      features: 'Caractéristiques', savings: 'Économies', bestValue: 'MEILLEURE VALEUR', premium: 'PREMIUM', pieces: 'pièces vêtements',
      pickupsPerWeek: 'collectes/semaine', standardIroning: 'Repassage standard', premiumIroning: 'Repassage premium',
      prioritySupport: 'Support prioritaire', premiumSteaming: 'Repassage & vapeur premium', dedicatedSupport: 'Support dédié',
      freeStainRemoval: 'Détachage gratuit', premiumService: 'Service premium', vipSupport: 'Support VIP',
      freeAlterations: 'Retouches gratuites', qualityGuarantee: 'Garantie qualité', subscribeNow: 'S\'abonner Maintenant',
      weekly: 'Hebdomadaire', monthly: '1 Mois', quarterly: '3 Mois', biannual: '6 Mois', yearly: 'Année', week: 'Semaine', days: 'Jours'
    },
    tracking: {
      title: 'Suivre Commande', trackOrder: 'Suivez Votre Commande', orderId: 'ID Commande', status: 'Statut',
      noActiveOrders: 'Aucune commande active à suivre', trackingInfo: 'Sélectionnez une commande active pour voir les informations',
      orderJourney: 'Parcours Commande', scheduled: 'Programmé', pickup: 'Collecte', processing: 'Traitement',
      ready: 'Prêt', inDelivery: 'En Livraison', completed: 'Terminé', pickupScheduled: 'Collecte Programmée',
      pickingUp: 'Nous collectons vos vêtements', ironing: 'Nous repassons vos vêtements', readyForDelivery: 'Prêt pour livraison',
      delivering: 'En route vers vous', delivered: 'Livré avec succès', estimatedDelivery: 'Livraison Estimée',
      contactSupport: 'Contacter Support', callUs: 'Appelez-Nous', playGame: 'Jouer Jeu', enjoyGame: 'Profitez en attendant',
      minutesRemaining: 'minutes restantes'
    },
    newOrder: {
      title: 'Nouvelle Commande', selectGarments: 'Sélectionner Vêtements', deliveryDays: 'Jours Livraison', deliveryAddress: 'Adresse Livraison',
      paymentMethod: 'Méthode Paiement', submit: 'Soumettre Commande'
    },
    cart: {
      title: 'Panier', yourCart: 'Votre Panier', itemsInCart: 'Articles dans Panier', emptyCart: 'Panier Vide', startShopping: 'Commencer Achats',
      cartSummary: 'Résumé Panier', useSubscription: 'Utiliser Pièces Abonnement', expressDelivery: 'Livraison Express',
      deliveryCost: 'Coût Livraison', discount: 'Réduction', total: 'Total', checkout: 'Commander', cartEmpty: 'Panier Vide',
      addItemsFirst: 'Veuillez ajouter des articles avant de commander.', noActiveSubscription: 'Pas Abonnement Actif',
      insufficientPieces: 'Pièces Insuffisantes', insufficientBalance: 'Solde Insuffisant', addMoneyFirst: 'Veuillez ajouter de l\'argent d\'abord.',
      confirmPayment: 'Confirmer Paiement', confirmDeduction: 'Confirmer Déduction', payNow: 'Payer Maintenant', payFromWallet: 'Payer du portefeuille?',
      deductFromSubscription: 'Déduire de l\'abonnement?', orderPlaced: 'Commande Passée', orderSuccess: 'Votre commande a été passée avec succès!',
      continueShopping: 'Continuer Achats', viewOrders: 'Voir Commandes'
    },
    sos: englishTranslation.sos,
    common: { cancel: 'Annuler', confirm: 'Confirmer', back: 'Retour', next: 'Suivant', done: 'Terminé', loading: 'Chargement...', error: 'Erreur', success: 'Succès', egp: 'EGP', min: 'min', required: 'requis', optional: 'optionnel' },
  },
  es: {
    tabs: { home: 'Inicio', orders: 'Pedidos', tracking: 'Seguimiento', subscribe: 'Suscribirse', profile: 'Perfil', myPlan: 'Mi Plan' },
    home: {
      title: 'Servicio Profesional de Planchado', subtitle: 'Calidad premium, entregado a tu puerta', tagline: 'Kaweely - Haciendo la Vida más Fácil',
      newOrder: 'Nuevo Pedido', priceCalculator: 'Calculadora de Precios', howItWorks: 'Cómo Funciona',
      step1Title: 'Hacer Pedido', step1Desc: 'Dinos qué necesitas planchar', step2Title: 'Recogemos', step2Desc: 'Recogemos desde tu ubicación',
      step3Title: 'Entrega', step3Desc: 'Ropa perfectamente planchada entregada', whyChooseUs: '¿Por qué elegir Kaweely?',
      feature1: 'Calidad Profesional', feature1Desc: 'Planchado experto con atención al detalle', feature2: 'Entrega Rápida', feature2Desc: 'Tiempo de entrega rápido',
      feature3: 'Precios Asequibles', feature3Desc: 'La mejor relación calidad-precio', feature4: 'Soporte 24/7', feature4Desc: 'Siempre aquí para ayudar',
      specialOffers: 'Ofertas Especiales', quickActions: 'Acciones Rápidas', quickOrderCalculator: 'Pedido Rápido y Calculadora',
      selectItems: 'Seleccionar Artículos', calculateCost: 'Calcular Costo', addGarments: 'Agregar Prendas', useSubscriptionPlan: 'Usar Plan de Suscripción',
      piecesAvailable: 'piezas disponibles', noItemsSelected: 'No hay artículos seleccionados', tapToAddGarments: 'Toca el botón para explorar prendas',
      premiumServices: 'Servicios Premium', expressDelivery: 'Entrega Express', premiumPerfume: 'Perfume Premium', vipPackaging: 'Embalaje VIP Kaweely',
      deliveryLocation: 'Ubicación de Entrega', enterArea: 'Ingresar área (ej: Downtown)', costBreakdown: 'Desglose de Costos',
      subtotal: 'Subtotal', items: 'artículos', express: 'Express', perfume: 'Perfume', vipPack: 'Embalaje VIP',
      delivery: 'Entrega', total: 'Total', goToCart: 'Ir al Carrito', addToCart: 'Agregar al Carrito', yourGarments: 'Tus Prendas', item: 'artículo',
      rewards: 'Recompensas', referrals: 'Referencias', store: 'Tienda', liveSupport: 'Soporte en Vivo', whatToWear: 'Qué Vestir',
      readyForPremium: '¿Listo para Cuidado Premium?', subscribeNow: 'Suscríbete y experimenta Kaweely',
      viewPlans: 'Ver Planes', expressDescription: 'Entrega en 120 min', minRequired: 'Mín requerido'
    },
    orders: {
      title: 'Mis Pedidos', all: 'Todos', pending: 'Pendiente', inProgress: 'En Progreso', completed: 'Completado', noOrders: 'No se encontraron pedidos',
      viewDetails: 'Ver Detalles', pickup: 'Recogida', ready: 'Listo', processing: 'Procesando', filters: 'Filtros', tapToShow: 'Toca para mostrar',
      tapToHide: 'Toca para ocultar', ordersCount: 'PEDIDOS', orderFound: 'pedido encontrado', ordersFound: 'pedidos encontrados',
      noOrdersMessage: 'Aún no has realizado ningún pedido.\n¡Comienza creando tu primer pedido!',
      tryDifferentFilter: 'No hay pedidos en este momento.\nIntenta seleccionar un filtro diferente.',
      noOrdersYet: 'Aún no hay pedidos', createFirstOrder: '¡Comienza creando tu primer pedido!'
    },
    profile: {
      title: 'Perfil', clientInfo: 'Información del Cliente', edit: 'Editar', save: 'Guardar', fullName: 'Nombre Completo', phoneNumber: 'Número de Teléfono',
      email: 'Email', address: 'Dirección', birthday: 'Cumpleaños', birthdayHint: 'Ingresa tu cumpleaños para recibir ofertas especiales',
      wallet: 'Billetera', currentBalance: 'Saldo Actual', addMoney: 'Agregar Dinero', send: 'Enviar', recentTransactions: 'Transacciones Recientes',
      language: 'Idioma', settings: 'Configuración', notifications: 'Notificaciones', darkMode: 'Modo Oscuro', privacyPolicy: 'Política de Privacidad',
      termsOfService: 'Términos de Servicio', logout: 'Cerrar Sesión', selectLanguage: 'Seleccionar Idioma', selectYourLanguage: 'Selecciona Tu Idioma',
      male: 'Masculino', female: 'Femenino', gender: 'Género', tapToChange: 'Toca para cambiar', sendGiftCard: 'Enviar Tarjeta de Regalo',
      noTransactions: 'No hay transacciones recientes', avatarSettings: 'Configuración de Avatar', takePhoto: 'Tomar Foto',
      chooseFromLibrary: 'Elegir de la Biblioteca', removePhoto: 'Eliminar Foto'
    },
    subscribe: {
      title: 'Planes de Suscripción', chooseYourPlan: 'Elige Tu Plan', perWeek: 'por semana', perMonth: 'por mes',
      mostPopular: 'Más Popular', delivery: 'Entrega', discount: 'Descuento', finalPrice: 'Precio Final', subscribe: 'Suscribirse Ahora',
      features: 'Características', savings: 'Ahorro', bestValue: 'MEJOR VALOR', premium: 'PREMIUM', pieces: 'prendas',
      pickupsPerWeek: 'recogidas/semana', standardIroning: 'Planchado estándar', premiumIroning: 'Planchado premium',
      prioritySupport: 'Soporte prioritario', premiumSteaming: 'Planchado y vaporizado premium', dedicatedSupport: 'Soporte dedicado',
      freeStainRemoval: 'Eliminación de manchas gratis', premiumService: 'Servicio premium', vipSupport: 'Soporte VIP',
      freeAlterations: 'Alteraciones gratis', qualityGuarantee: 'Garantía de calidad', subscribeNow: 'Suscribirse Ahora',
      weekly: 'Semanal', monthly: '1 Mes', quarterly: '3 Meses', biannual: '6 Meses', yearly: 'Año', week: 'Semana', days: 'Días'
    },
    tracking: {
      title: 'Rastrear Pedido', trackOrder: 'Rastrea Tu Pedido', orderId: 'ID del Pedido', status: 'Estado',
      noActiveOrders: 'No hay pedidos activos para rastrear', trackingInfo: 'Selecciona un pedido activo para ver la información',
      orderJourney: 'Viaje del Pedido', scheduled: 'Programado', pickup: 'Recogida', processing: 'Procesando',
      ready: 'Listo', inDelivery: 'En Entrega', completed: 'Completado', pickupScheduled: 'Recogida Programada',
      pickingUp: 'Recogiendo tus prendas', ironing: 'Planchando tus prendas', readyForDelivery: 'Listo para entrega',
      delivering: 'En camino hacia ti', delivered: 'Entregado exitosamente', estimatedDelivery: 'Entrega Estimada',
      contactSupport: 'Contactar Soporte', callUs: 'Llámanos', playGame: 'Jugar', enjoyGame: 'Disfruta mientras esperas',
      minutesRemaining: 'minutos restantes'
    },
    newOrder: {
      title: 'Nuevo Pedido', selectGarments: 'Seleccionar Prendas', deliveryDays: 'Días de Entrega', deliveryAddress: 'Dirección de Entrega',
      paymentMethod: 'Método de Pago', submit: 'Enviar Pedido'
    },
    cart: {
      title: 'Carrito', yourCart: 'Tu Carrito', itemsInCart: 'Artículos en el Carrito', emptyCart: 'Carrito Vacío', startShopping: 'Comenzar a Comprar',
      cartSummary: 'Resumen del Carrito', useSubscription: 'Usar Piezas de Suscripción', expressDelivery: 'Entrega Express',
      deliveryCost: 'Costo de Entrega', discount: 'Descuento', total: 'Total', checkout: 'Pagar', cartEmpty: 'Carrito Vacío',
      addItemsFirst: 'Por favor agrega artículos antes de pagar.', noActiveSubscription: 'Sin Suscripción Activa',
      insufficientPieces: 'Piezas Insuficientes', insufficientBalance: 'Saldo Insuficiente', addMoneyFirst: 'Por favor agrega dinero primero.',
      confirmPayment: 'Confirmar Pago', confirmDeduction: 'Confirmar Deducción', payNow: 'Pagar Ahora', payFromWallet: '¿Pagar desde billetera?',
      deductFromSubscription: '¿Deducir de suscripción?', orderPlaced: 'Pedido Realizado', orderSuccess: '¡Tu pedido se realizó exitosamente!',
      continueShopping: 'Continuar Comprando', viewOrders: 'Ver Pedidos'
    },
    sos: englishTranslation.sos,
    common: { cancel: 'Cancelar', confirm: 'Confirmar', back: 'Atrás', next: 'Siguiente', done: 'Hecho', loading: 'Cargando...', error: 'Error', success: 'Éxito', egp: 'EGP', min: 'min', required: 'requerido', optional: 'opcional' },
  },
  de: {
    tabs: { home: 'Startseite', orders: 'Bestellungen', tracking: 'Verfolgung', subscribe: 'Abonnieren', profile: 'Profil', myPlan: 'Mein Plan' },
    home: {
      title: 'Professioneller Bügelservice', subtitle: 'Premium-Qualität, direkt vor Ihre Tür', tagline: 'Kaweely - Das Leben Leichter Machen',
      newOrder: 'Neue Bestellung', priceCalculator: 'Preisrechner', howItWorks: 'Wie es funktioniert',
      step1Title: 'Bestellung Aufgeben', step1Desc: 'Sagen Sie uns, was gebügelt werden muss', step2Title: 'Wir Holen Ab', step2Desc: 'Wir holen von Ihrem Standort ab',
      step3Title: 'Lieferung', step3Desc: 'Perfekt gebügelte Kleidung geliefert', whyChooseUs: 'Warum Kaweely wählen?',
      feature1: 'Professionelle Qualität', feature1Desc: 'Fachkundiges Bügeln mit Liebe zum Detail', feature2: 'Schnelle Lieferung', feature2Desc: 'Schnelle Bearbeitungszeit',
      feature3: 'Erschwingliche Preise', feature3Desc: 'Bestes Preis-Leistungs-Verhältnis', feature4: '24/7 Support', feature4Desc: 'Immer für Sie da',
      specialOffers: 'Sonderangebote', quickActions: 'Schnellaktionen', quickOrderCalculator: 'Schnellbestellung & Rechner',
      selectItems: 'Artikel auswählen', calculateCost: 'Kosten berechnen', addGarments: 'Kleidung hinzufügen', useSubscriptionPlan: 'Abo-Plan verwenden',
      piecesAvailable: 'Stücke verfügbar', noItemsSelected: 'Keine Artikel ausgewählt', tapToAddGarments: 'Tippen Sie auf die Schaltfläche, um Kleidung zu durchsuchen',
      premiumServices: 'Premium-Services', expressDelivery: 'Express-Lieferung', premiumPerfume: 'Premium-Parfüm', vipPackaging: 'VIP Kaweely Verpackung',
      deliveryLocation: 'Lieferort', enterArea: 'Gebiet eingeben (z.B.: Innenstadt)', costBreakdown: 'Kostenaufschlüsselung',
      subtotal: 'Zwischensumme', items: 'Artikel', express: 'Express', perfume: 'Parfüm', vipPack: 'VIP-Verpackung',
      delivery: 'Lieferung', total: 'Gesamt', goToCart: 'Zum Warenkorb', addToCart: 'In den Warenkorb', yourGarments: 'Ihre Kleidung', item: 'Artikel',
      rewards: 'Belohnungen', referrals: 'Empfehlungen', store: 'Shop', liveSupport: 'Live-Support', whatToWear: 'Was anziehen',
      readyForPremium: 'Bereit für Premium-Pflege?', subscribeNow: 'Abonnieren und Kaweely erleben',
      viewPlans: 'Pläne anzeigen', expressDescription: 'Lieferung in 120 Min', minRequired: 'Min erforderlich'
    },
    orders: {
      title: 'Meine Bestellungen', all: 'Alle', pending: 'Ausstehend', inProgress: 'In Bearbeitung', completed: 'Abgeschlossen', noOrders: 'Keine Bestellungen gefunden',
      viewDetails: 'Details anzeigen', pickup: 'Abholung', ready: 'Bereit', processing: 'Bearbeitung', filters: 'Filter', tapToShow: 'Tippen zum Anzeigen',
      tapToHide: 'Tippen zum Ausblenden', ordersCount: 'BESTELLUNGEN', orderFound: 'Bestellung gefunden', ordersFound: 'Bestellungen gefunden',
      noOrdersMessage: 'Sie haben noch keine Bestellungen aufgegeben.\nBeginnen Sie mit Ihrer ersten Bestellung!',
      tryDifferentFilter: 'Momentan keine Bestellungen.\nVersuchen Sie einen anderen Filter.',
      noOrdersYet: 'Noch keine Bestellungen', createFirstOrder: 'Beginnen Sie mit Ihrer ersten Bestellung!'
    },
    profile: {
      title: 'Profil', clientInfo: 'Kundeninformationen', edit: 'Bearbeiten', save: 'Speichern', fullName: 'Vollständiger Name', phoneNumber: 'Telefonnummer',
      email: 'E-Mail', address: 'Adresse', birthday: 'Geburtstag', birthdayHint: 'Geben Sie Ihren Geburtstag ein für Sonderangebote',
      wallet: 'Geldbörse', currentBalance: 'Aktuelles Guthaben', addMoney: 'Geld hinzufügen', send: 'Senden', recentTransactions: 'Letzte Transaktionen',
      language: 'Sprache', settings: 'Einstellungen', notifications: 'Benachrichtigungen', darkMode: 'Dunkelmodus', privacyPolicy: 'Datenschutz',
      termsOfService: 'Nutzungsbedingungen', logout: 'Abmelden', selectLanguage: 'Sprache auswählen', selectYourLanguage: 'Wählen Sie Ihre Sprache',
      male: 'Männlich', female: 'Weiblich', gender: 'Geschlecht', tapToChange: 'Tippen zum Ändern', sendGiftCard: 'Geschenkkarte senden',
      noTransactions: 'Keine letzten Transaktionen', avatarSettings: 'Avatar-Einstellungen', takePhoto: 'Foto aufnehmen',
      chooseFromLibrary: 'Aus Bibliothek wählen', removePhoto: 'Foto entfernen'
    },
    subscribe: {
      title: 'Abo-Pläne', chooseYourPlan: 'Wählen Sie Ihren Plan', perWeek: 'pro Woche', perMonth: 'pro Monat',
      mostPopular: 'Beliebteste', delivery: 'Lieferung', discount: 'Rabatt', finalPrice: 'Endpreis', subscribe: 'Jetzt Abonnieren',
      features: 'Funktionen', savings: 'Ersparnisse', bestValue: 'BESTER WERT', premium: 'PREMIUM', pieces: 'Kleidungsstücke',
      pickupsPerWeek: 'Abholungen/Woche', standardIroning: 'Standard-Bügeln', premiumIroning: 'Premium-Bügeln',
      prioritySupport: 'Prioritäts-Support', premiumSteaming: 'Premium-Bügeln & Dämpfen', dedicatedSupport: 'Dedizierter Support',
      freeStainRemoval: 'Kostenlose Fleckenentfernung', premiumService: 'Premium-Service', vipSupport: 'VIP-Support',
      freeAlterations: 'Kostenlose Änderungen', qualityGuarantee: 'Qualitätsgarantie', subscribeNow: 'Jetzt Abonnieren',
      weekly: 'Wöchentlich', monthly: '1 Monat', quarterly: '3 Monate', biannual: '6 Monate', yearly: 'Jahr', week: 'Woche', days: 'Tage'
    },
    tracking: {
      title: 'Bestellung Verfolgen', trackOrder: 'Verfolgen Sie Ihre Bestellung', orderId: 'Bestellnummer', status: 'Status',
      noActiveOrders: 'Keine aktiven Bestellungen zum Verfolgen', trackingInfo: 'Wählen Sie eine aktive Bestellung',
      orderJourney: 'Bestellweg', scheduled: 'Geplant', pickup: 'Abholung', processing: 'Bearbeitung',
      ready: 'Bereit', inDelivery: 'In Lieferung', completed: 'Abgeschlossen', pickupScheduled: 'Abholung Geplant',
      pickingUp: 'Wir holen Ihre Kleidung ab', ironing: 'Wir bügeln Ihre Kleidung', readyForDelivery: 'Bereit zur Lieferung',
      delivering: 'Auf dem Weg zu Ihnen', delivered: 'Erfolgreich geliefert', estimatedDelivery: 'Geschätzte Lieferung',
      contactSupport: 'Support kontaktieren', callUs: 'Rufen Sie uns an', playGame: 'Spiel spielen', enjoyGame: 'Genießen Sie während des Wartens',
      minutesRemaining: 'Minuten verbleibend'
    },
    newOrder: {
      title: 'Neue Bestellung', selectGarments: 'Kleidung auswählen', deliveryDays: 'Liefertage', deliveryAddress: 'Lieferadresse',
      paymentMethod: 'Zahlungsmethode', submit: 'Bestellung abschicken'
    },
    cart: {
      title: 'Warenkorb', yourCart: 'Ihr Warenkorb', itemsInCart: 'Artikel im Warenkorb', emptyCart: 'Warenkorb leeren', startShopping: 'Einkaufen beginnen',
      cartSummary: 'Warenkorb-Zusammenfassung', useSubscription: 'Abo-Stücke verwenden', expressDelivery: 'Express-Lieferung',
      deliveryCost: 'Lieferkosten', discount: 'Rabatt', total: 'Gesamt', checkout: 'Zur Kasse', cartEmpty: 'Warenkorb Leer',
      addItemsFirst: 'Bitte fügen Sie zuerst Artikel hinzu.', noActiveSubscription: 'Kein Aktives Abo',
      insufficientPieces: 'Unzureichende Stücke', insufficientBalance: 'Unzureichendes Guthaben', addMoneyFirst: 'Bitte fügen Sie zuerst Geld hinzu.',
      confirmPayment: 'Zahlung bestätigen', confirmDeduction: 'Abzug bestätigen', payNow: 'Jetzt bezahlen', payFromWallet: 'Von Geldbörse bezahlen?',
      deductFromSubscription: 'Vom Abo abziehen?', orderPlaced: 'Bestellung aufgegeben', orderSuccess: 'Ihre Bestellung wurde erfolgreich aufgegeben!',
      continueShopping: 'Weiter einkaufen', viewOrders: 'Bestellungen anzeigen'
    },
    sos: englishTranslation.sos,
    common: { cancel: 'Abbrechen', confirm: 'Bestätigen', back: 'Zurück', next: 'Weiter', done: 'Fertig', loading: 'Wird geladen...', error: 'Fehler', success: 'Erfolg', egp: 'EGP', min: 'min', required: 'erforderlich', optional: 'optional' },
  },
  it: {
    tabs: { home: 'Home', orders: 'Ordini', tracking: 'Tracciamento', subscribe: 'Abbonati', profile: 'Profilo', myPlan: 'Il Mio Piano' },
    home: {
      title: 'Servizio Stiratura Professionale', subtitle: 'Qualità premium, consegnata a casa tua', tagline: 'Kaweely - Rendere la Vita più Facile',
      newOrder: 'Nuovo Ordine', priceCalculator: 'Calcolatore Prezzi', howItWorks: 'Come Funziona',
      step1Title: 'Effettua Ordine', step1Desc: 'Dicci cosa deve essere stirato', step2Title: 'Ritiriamo', step2Desc: 'Ritiriamo dalla tua posizione',
      step3Title: 'Consegna', step3Desc: 'Vestiti perfettamente stirati consegnati', whyChooseUs: 'Perché Scegliere Kaweely?',
      feature1: 'Qualità Professionale', feature1Desc: 'Stiratura esperta con attenzione ai dettagli', feature2: 'Consegna Rapida', feature2Desc: 'Tempi di consegna rapidi',
      feature3: 'Prezzi Accessibili', feature3Desc: 'Miglior rapporto qualità-prezzo', feature4: 'Supporto 24/7', feature4Desc: 'Sempre qui per aiutare',
      specialOffers: 'Offerte Speciali', quickActions: 'Azioni Rapide', quickOrderCalculator: 'Ordine Rapido e Calcolatore',
      selectItems: 'Seleziona Articoli', calculateCost: 'Calcola Costo', addGarments: 'Aggiungi Capi', useSubscriptionPlan: 'Usa Piano Abbonamento',
      piecesAvailable: 'pezzi disponibili', noItemsSelected: 'Nessun articolo selezionato', tapToAddGarments: 'Tocca il pulsante per sfogliare i capi',
      premiumServices: 'Servizi Premium', expressDelivery: 'Consegna Express', premiumPerfume: 'Profumo Premium', vipPackaging: 'Confezione VIP Kaweely',
      deliveryLocation: 'Luogo di Consegna', enterArea: 'Inserisci area (es: Centro)', costBreakdown: 'Dettaglio Costi',
      subtotal: 'Subtotale', items: 'articoli', express: 'Express', perfume: 'Profumo', vipPack: 'Confezione VIP',
      delivery: 'Consegna', total: 'Totale', goToCart: 'Vai al Carrello', addToCart: 'Aggiungi al Carrello', yourGarments: 'I Tuoi Capi', item: 'articolo',
      rewards: 'Premi', referrals: 'Referenze', store: 'Negozio', liveSupport: 'Supporto Live', whatToWear: 'Cosa Indossare',
      readyForPremium: 'Pronto per la Cura Premium?', subscribeNow: 'Abbonati e prova Kaweely',
      viewPlans: 'Vedi Piani', expressDescription: 'Consegna in 120 min', minRequired: 'Min richiesto'
    },
    orders: {
      title: 'I Miei Ordini', all: 'Tutti', pending: 'In Attesa', inProgress: 'In Corso', completed: 'Completato', noOrders: 'Nessun ordine trovato',
      viewDetails: 'Vedi Dettagli', pickup: 'Ritiro', ready: 'Pronto', processing: 'In Elaborazione', filters: 'Filtri', tapToShow: 'Tocca per mostrare',
      tapToHide: 'Tocca per nascondere', ordersCount: 'ORDINI', orderFound: 'ordine trovato', ordersFound: 'ordini trovati',
      noOrdersMessage: 'Non hai ancora effettuato ordini.\nInizia creando il tuo primo ordine!',
      tryDifferentFilter: 'Nessun ordine al momento.\nProva a selezionare un filtro diverso.',
      noOrdersYet: 'Nessun ordine ancora', createFirstOrder: 'Inizia creando il tuo primo ordine!'
    },
    profile: {
      title: 'Profilo', clientInfo: 'Informazioni Cliente', edit: 'Modifica', save: 'Salva', fullName: 'Nome Completo', phoneNumber: 'Numero di Telefono',
      email: 'Email', address: 'Indirizzo', birthday: 'Compleanno', birthdayHint: 'Inserisci il tuo compleanno per ricevere offerte speciali',
      wallet: 'Portafoglio', currentBalance: 'Saldo Attuale', addMoney: 'Aggiungi Denaro', send: 'Invia', recentTransactions: 'Transazioni Recenti',
      language: 'Lingua', settings: 'Impostazioni', notifications: 'Notifiche', darkMode: 'Modalità Scura', privacyPolicy: 'Privacy',
      termsOfService: 'Termini di Servizio', logout: 'Disconnetti', selectLanguage: 'Seleziona Lingua', selectYourLanguage: 'Seleziona la Tua Lingua',
      male: 'Maschio', female: 'Femmina', gender: 'Genere', tapToChange: 'Tocca per cambiare', sendGiftCard: 'Invia Carta Regalo',
      noTransactions: 'Nessuna transazione recente', avatarSettings: 'Impostazioni Avatar', takePhoto: 'Scatta Foto',
      chooseFromLibrary: 'Scegli dalla Libreria', removePhoto: 'Rimuovi Foto'
    },
    subscribe: {
      title: 'Piani Abbonamento', chooseYourPlan: 'Scegli il Tuo Piano', perWeek: 'a settimana', perMonth: 'al mese',
      mostPopular: 'Più Popolare', delivery: 'Consegna', discount: 'Sconto', finalPrice: 'Prezzo Finale', subscribe: 'Abbonati Ora',
      features: 'Caratteristiche', savings: 'Risparmi', bestValue: 'MIGLIOR VALORE', premium: 'PREMIUM', pieces: 'capi',
      pickupsPerWeek: 'ritiri/settimana', standardIroning: 'Stiratura standard', premiumIroning: 'Stiratura premium',
      prioritySupport: 'Supporto prioritario', premiumSteaming: 'Stiratura e vaporizzazione premium', dedicatedSupport: 'Supporto dedicato',
      freeStainRemoval: 'Rimozione macchie gratis', premiumService: 'Servizio premium', vipSupport: 'Supporto VIP',
      freeAlterations: 'Modifiche gratis', qualityGuarantee: 'Garanzia qualità', subscribeNow: 'Abbonati Ora',
      weekly: 'Settimanale', monthly: '1 Mese', quarterly: '3 Mesi', biannual: '6 Mesi', yearly: 'Anno', week: 'Settimana', days: 'Giorni'
    },
    tracking: {
      title: 'Traccia Ordine', trackOrder: 'Traccia il Tuo Ordine', orderId: 'ID Ordine', status: 'Stato',
      noActiveOrders: 'Nessun ordine attivo da tracciare', trackingInfo: 'Seleziona un ordine attivo per vedere le informazioni',
      orderJourney: 'Viaggio Ordine', scheduled: 'Programmato', pickup: 'Ritiro', processing: 'In Elaborazione',
      ready: 'Pronto', inDelivery: 'In Consegna', completed: 'Completato', pickupScheduled: 'Ritiro Programmato',
      pickingUp: 'Stiamo ritirando i tuoi capi', ironing: 'Stiamo stirando i tuoi capi', readyForDelivery: 'Pronto per la consegna',
      delivering: 'In viaggio verso di te', delivered: 'Consegnato con successo', estimatedDelivery: 'Consegna Stimata',
      contactSupport: 'Contatta Supporto', callUs: 'Chiamaci', playGame: 'Gioca', enjoyGame: 'Goditi mentre aspetti',
      minutesRemaining: 'minuti rimanenti'
    },
    newOrder: {
      title: 'Nuovo Ordine', selectGarments: 'Seleziona Capi', deliveryDays: 'Giorni di Consegna', deliveryAddress: 'Indirizzo di Consegna',
      paymentMethod: 'Metodo di Pagamento', submit: 'Invia Ordine'
    },
    cart: {
      title: 'Carrello', yourCart: 'Il Tuo Carrello', itemsInCart: 'Articoli nel Carrello', emptyCart: 'Carrello Vuoto', startShopping: 'Inizia a Fare Acquisti',
      cartSummary: 'Riepilogo Carrello', useSubscription: 'Usa Pezzi Abbonamento', expressDelivery: 'Consegna Express',
      deliveryCost: 'Costo Consegna', discount: 'Sconto', total: 'Totale', checkout: 'Procedi', cartEmpty: 'Carrello Vuoto',
      addItemsFirst: 'Aggiungi articoli prima di procedere.', noActiveSubscription: 'Nessun Abbonamento Attivo',
      insufficientPieces: 'Pezzi Insufficienti', insufficientBalance: 'Saldo Insufficiente', addMoneyFirst: 'Aggiungi denaro prima.',
      confirmPayment: 'Conferma Pagamento', confirmDeduction: 'Conferma Deduzione', payNow: 'Paga Ora', payFromWallet: 'Pagare dal portafoglio?',
      deductFromSubscription: 'Dedurre dall\'abbonamento?', orderPlaced: 'Ordine Effettuato', orderSuccess: 'Il tuo ordine è stato effettuato con successo!',
      continueShopping: 'Continua Acquisti', viewOrders: 'Vedi Ordini'
    },
    sos: englishTranslation.sos,
    common: { cancel: 'Annulla', confirm: 'Conferma', back: 'Indietro', next: 'Avanti', done: 'Fatto', loading: 'Caricamento...', error: 'Errore', success: 'Successo', egp: 'EGP', min: 'min', required: 'richiesto', optional: 'opzionale' },
  },
  tr: {
    tabs: { home: 'Ana Sayfa', orders: 'Siparişler', tracking: 'Takip', subscribe: 'Abone Ol', profile: 'Profil', myPlan: 'Planım' },
    home: {
      title: 'Profesyonel Ütü Hizmeti', subtitle: 'Premium kalite, kapınıza teslim', tagline: 'Kaweely - Hayatı Kolaylaştırıyoruz',
      newOrder: 'Yeni Sipariş', priceCalculator: 'Fiyat Hesaplayıcı', howItWorks: 'Nasıl Çalışır',
      step1Title: 'Sipariş Ver', step1Desc: 'Ne ütülenmesi gerektiğini söyleyin', step2Title: 'Toplarız', step2Desc: 'Konumunuzdan alırız',
      step3Title: 'Teslimat', step3Desc: 'Mükemmel ütülenmiş kıyafetler teslim edilir', whyChooseUs: 'Neden Kaweely?',
      feature1: 'Profesyonel Kalite', feature1Desc: 'Detaylara dikkat ederek uzman ütüleme', feature2: 'Hızlı Teslimat', feature2Desc: 'Hızlı teslim süresi',
      feature3: 'Uygun Fiyatlar', feature3Desc: 'Paranızın karşılığını en iyi şekilde alın', feature4: '7/24 Destek', feature4Desc: 'Her zaman yardıma hazırız',
      specialOffers: 'Özel Teklifler', quickActions: 'Hızlı İşlemler', quickOrderCalculator: 'Hızlı Sipariş ve Hesaplayıcı',
      selectItems: 'Ürün Seç', calculateCost: 'Maliyet Hesapla', addGarments: 'Kıyafet Ekle', useSubscriptionPlan: 'Abonelik Planını Kullan',
      piecesAvailable: 'parça mevcut', noItemsSelected: 'Seçili ürün yok', tapToAddGarments: 'Kıyafetlere göz atmak için düğmeye dokunun',
      premiumServices: 'Premium Hizmetler', expressDelivery: 'Ekspres Teslimat', premiumPerfume: 'Premium Parfüm', vipPackaging: 'VIP Kaweely Ambalaj',
      deliveryLocation: 'Teslimat Konumu', enterArea: 'Bölge girin (örn: Merkez)', costBreakdown: 'Maliyet Dökümü',
      subtotal: 'Ara Toplam', items: 'ürünler', express: 'Ekspres', perfume: 'Parfüm', vipPack: 'VIP Ambalaj',
      delivery: 'Teslimat', total: 'Toplam', goToCart: 'Sepete Git', addToCart: 'Sepete Ekle', yourGarments: 'Kıyafetleriniz', item: 'ürün',
      rewards: 'Ödüller', referrals: 'Referanslar', store: 'Mağaza', liveSupport: 'Canlı Destek', whatToWear: 'Ne Giyilir',
      readyForPremium: 'Premium Bakım İçin Hazır mısınız?', subscribeNow: 'Abone olun ve Kaweely\u2019yi deneyimleyin',
      viewPlans: 'Planları Görüntüle', expressDescription: '120 dk teslimat', minRequired: 'Min gerekli'
    },
    orders: {
      title: 'Siparişlerim', all: 'Tümü', pending: 'Beklemede', inProgress: 'İşlemde', completed: 'Tamamlandı', noOrders: 'Sipariş bulunamadı',
      viewDetails: 'Detayları Gör', pickup: 'Teslim Alma', ready: 'Hazır', processing: 'İşleniyor', filters: 'Filtreler', tapToShow: 'Göstermek için dokunun',
      tapToHide: 'Gizlemek için dokunun', ordersCount: 'SİPARİŞLER', orderFound: 'sipariş bulundu', ordersFound: 'sipariş bulundu',
      noOrdersMessage: 'Henüz sipariş vermediniz.\nİlk siparişinizi oluşturarak başlayın!',
      tryDifferentFilter: 'Şu anda sipariş yok.\nFarklı bir filtre seçmeyi deneyin.',
      noOrdersYet: 'Henüz sipariş yok', createFirstOrder: 'İlk siparişinizi oluşturarak başlayın!'
    },
    profile: {
      title: 'Profil', clientInfo: 'Müşteri Bilgileri', edit: 'Düzenle', save: 'Kaydet', fullName: 'Tam Ad', phoneNumber: 'Telefon Numarası',
      email: 'E-posta', address: 'Adres', birthday: 'Doğum Günü', birthdayHint: 'Özel teklifler almak için doğum gününüzü girin',
      wallet: 'Cüzdan', currentBalance: 'Mevcut Bakiye', addMoney: 'Para Ekle', send: 'Gönder', recentTransactions: 'Son İşlemler',
      language: 'Dil', settings: 'Ayarlar', notifications: 'Bildirimler', darkMode: 'Karanlık Mod', privacyPolicy: 'Gizlilik Politikası',
      termsOfService: 'Hizmet Şartları', logout: 'Çıkış Yap', selectLanguage: 'Dil Seç', selectYourLanguage: 'Dilinizi Seçin',
      male: 'Erkek', female: 'Kadın', gender: 'Cinsiyet', tapToChange: 'Değiştirmek için dokunun', sendGiftCard: 'Hediye Kartı Gönder',
      noTransactions: 'Son işlem yok', avatarSettings: 'Avatar Ayarları', takePhoto: 'Fotoğraf Çek',
      chooseFromLibrary: 'Kütüphaneden Seç', removePhoto: 'Fotoğrafı Kaldır'
    },
    subscribe: {
      title: 'Abonelik Planları', chooseYourPlan: 'Planınızı Seçin', perWeek: 'haftalık', perMonth: 'aylık',
      mostPopular: 'En Popüler', delivery: 'Teslimat', discount: 'İndirim', finalPrice: 'Son Fiyat', subscribe: 'Şimdi Abone Ol',
      features: 'Özellikler', savings: 'Tasarruf', bestValue: 'EN İYİ DEĞER', premium: 'PREMIUM', pieces: 'kıyafet parçası',
      pickupsPerWeek: 'teslim alma/hafta', standardIroning: 'Standart ütüleme', premiumIroning: 'Premium ütüleme',
      prioritySupport: 'Öncelikli destek', premiumSteaming: 'Premium ütüleme ve buharlama', dedicatedSupport: 'Özel destek',
      freeStainRemoval: 'Ücretsiz leke çıkarma', premiumService: 'Premium hizmet', vipSupport: 'VIP destek',
      freeAlterations: 'Ücretsiz tadilat', qualityGuarantee: 'Kalite garantisi', subscribeNow: 'Şimdi Abone Ol',
      weekly: 'Haftalık', monthly: '1 Ay', quarterly: '3 Ay', biannual: '6 Ay', yearly: 'Yıl', week: 'Hafta', days: 'Gün'
    },
    tracking: {
      title: 'Sipariş Takibi', trackOrder: 'Siparişinizi Takip Edin', orderId: 'Sipariş ID', status: 'Durum',
      noActiveOrders: 'Takip edilecek aktif sipariş yok', trackingInfo: 'Bilgileri görmek için aktif sipariş seçin',
      orderJourney: 'Sipariş Yolculuğu', scheduled: 'Planlandı', pickup: 'Teslim Alma', processing: 'İşleniyor',
      ready: 'Hazır', inDelivery: 'Teslimatta', completed: 'Tamamlandı', pickupScheduled: 'Teslim Alma Planlandı',
      pickingUp: 'Kıyafetlerinizi alıyoruz', ironing: 'Kıyafetlerinizi ütülüyoruz', readyForDelivery: 'Teslimata hazır',
      delivering: 'Size doğru yolda', delivered: 'Başarıyla teslim edildi', estimatedDelivery: 'Tahmini Teslimat',
      contactSupport: 'Desteğe Başvur', callUs: 'Bizi Arayın', playGame: 'Oyun Oyna', enjoyGame: 'Beklerken keyfini çıkarın',
      minutesRemaining: 'dakika kaldı'
    },
    newOrder: {
      title: 'Yeni Sipariş', selectGarments: 'Kıyafet Seç', deliveryDays: 'Teslimat Günleri', deliveryAddress: 'Teslimat Adresi',
      paymentMethod: 'Ödeme Yöntemi', submit: 'Siparişi Gönder'
    },
    cart: {
      title: 'Sepet', yourCart: 'Sepetiniz', itemsInCart: 'Sepetteki Ürünler', emptyCart: 'Sepeti Boşalt', startShopping: 'Alışverişe Başla',
      cartSummary: 'Sepet Özeti', useSubscription: 'Abonelik Parçalarını Kullan', expressDelivery: 'Ekspres Teslimat',
      deliveryCost: 'Teslimat Maliyeti', discount: 'İndirim', total: 'Toplam', checkout: 'Ödeme', cartEmpty: 'Sepet Boş',
      addItemsFirst: 'Lütfen önce ürün ekleyin.', noActiveSubscription: 'Aktif Abonelik Yok',
      insufficientPieces: 'Yetersiz Parça', insufficientBalance: 'Yetersiz Bakiye', addMoneyFirst: 'Lütfen önce para ekleyin.',
      confirmPayment: 'Ödemeyi Onayla', confirmDeduction: 'Kesinti Onayla', payNow: 'Şimdi Öde', payFromWallet: 'Cüzdandan öde?',
      deductFromSubscription: 'Abonelikten düş?', orderPlaced: 'Sipariş Verildi', orderSuccess: 'Siparişiniz başarıyla verildi!',
      continueShopping: 'Alışverişe Devam Et', viewOrders: 'Siparişleri Görüntüle'
    },
    sos: englishTranslation.sos,
    common: { cancel: 'İptal', confirm: 'Onayla', back: 'Geri', next: 'İleri', done: 'Bitti', loading: 'Yükleniyor...', error: 'Hata', success: 'Başarılı', egp: 'EGP', min: 'dk', required: 'gerekli', optional: 'opsiyonel' },
  },
  ru: {
    tabs: { home: 'Главная', orders: 'Заказы', tracking: 'Отслеживание', subscribe: 'Подписка', profile: 'Профиль', myPlan: 'Мой План' },
    home: {
      title: 'Профессиональная Глажка', subtitle: 'Премиум качество с доставкой на дом', tagline: 'Kaweely - Делаем Жизнь Проще',
      newOrder: 'Новый Заказ', priceCalculator: 'Калькулятор Цен', howItWorks: 'Как Это Работает',
      step1Title: 'Оформить Заказ', step1Desc: 'Скажите нам, что нужно погладить', step2Title: 'Мы Заберем', step2Desc: 'Заберем с вашего адреса',
      step3Title: 'Доставка', step3Desc: 'Идеально выглаженная одежда доставлена', whyChooseUs: 'Почему Kaweely?',
      feature1: 'Профессиональное Качество', feature1Desc: 'Экспертная глажка с вниманием к деталям', feature2: 'Быстрая Доставка', feature2Desc: 'Быстрые сроки выполнения',
      feature3: 'Доступные Цены', feature3Desc: 'Лучшее соотношение цены и качества', feature4: 'Поддержка 24/7', feature4Desc: 'Всегда готовы помочь',
      specialOffers: 'Специальные Предложения', quickActions: 'Быстрые Действия', quickOrderCalculator: 'Быстрый Заказ и Калькулятор',
      selectItems: 'Выбрать Товары', calculateCost: 'Рассчитать Стоимость', addGarments: 'Добавить Одежду', useSubscriptionPlan: 'Использовать План Подписки',
      piecesAvailable: 'доступно вещей', noItemsSelected: 'Нет выбранных товаров', tapToAddGarments: 'Нажмите кнопку, чтобы просмотреть одежду',
      premiumServices: 'Премиум Услуги', expressDelivery: 'Экспресс Доставка', premiumPerfume: 'Премиум Парфюм', vipPackaging: 'VIP Упаковка Kaweely',
      deliveryLocation: 'Место Доставки', enterArea: 'Введите район (напр: Центр)', costBreakdown: 'Детализация Расходов',
      subtotal: 'Промежуточный итог', items: 'товары', express: 'Экспресс', perfume: 'Парфюм', vipPack: 'VIP Упаковка',
      delivery: 'Доставка', total: 'Итого', goToCart: 'Перейти в Корзину', addToCart: 'Добавить в Корзину', yourGarments: 'Ваша Одежда', item: 'товар',
      rewards: 'Награды', referrals: 'Рекомендации', store: 'Магазин', liveSupport: 'Живая Поддержка', whatToWear: 'Что Надеть',
      readyForPremium: 'Готовы к Премиум Уходу?', subscribeNow: 'Подпишитесь и испытайте Kaweely',
      viewPlans: 'Посмотреть Планы', expressDescription: 'Доставка за 120 мин', minRequired: 'Мин требуется'
    },
    orders: {
      title: 'Мои Заказы', all: 'Все', pending: 'В Ожидании', inProgress: 'В Процессе', completed: 'Завершено', noOrders: 'Заказы не найдены',
      viewDetails: 'Посмотреть Детали', pickup: 'Забор', ready: 'Готово', processing: 'Обработка', filters: 'Фильтры', tapToShow: 'Нажмите, чтобы показать',
      tapToHide: 'Нажмите, чтобы скрыть', ordersCount: 'ЗАКАЗЫ', orderFound: 'заказ найден', ordersFound: 'заказов найдено',
      noOrdersMessage: 'Вы еще не сделали заказы.\nНачните с создания первого заказа!',
      tryDifferentFilter: 'Сейчас нет заказов.\nПопробуйте выбрать другой фильтр.',
      noOrdersYet: 'Пока нет заказов', createFirstOrder: 'Начните с создания первого заказа!'
    },
    profile: {
      title: 'Профиль', clientInfo: 'Информация о Клиенте', edit: 'Редактировать', save: 'Сохранить', fullName: 'Полное Имя', phoneNumber: 'Номер Телефона',
      email: 'Email', address: 'Адрес', birthday: 'День Рождения', birthdayHint: 'Введите дату рождения для получения специальных предложений',
      wallet: 'Кошелек', currentBalance: 'Текущий Баланс', addMoney: 'Добавить Деньги', send: 'Отправить', recentTransactions: 'Последние Транзакции',
      language: 'Язык', settings: 'Настройки', notifications: 'Уведомления', darkMode: 'Темный Режим', privacyPolicy: 'Политика Конфиденциальности',
      termsOfService: 'Условия Использования', logout: 'Выйти', selectLanguage: 'Выбрать Язык', selectYourLanguage: 'Выберите Ваш Язык',
      male: 'Мужчина', female: 'Женщина', gender: 'Пол', tapToChange: 'Нажмите, чтобы изменить', sendGiftCard: 'Отправить Подарочную Карту',
      noTransactions: 'Нет недавних транзакций', avatarSettings: 'Настройки Аватара', takePhoto: 'Сделать Фото',
      chooseFromLibrary: 'Выбрать из Библиотеки', removePhoto: 'Удалить Фото'
    },
    subscribe: {
      title: 'Планы Подписки', chooseYourPlan: 'Выберите Ваш План', perWeek: 'в неделю', perMonth: 'в месяц',
      mostPopular: 'Самый Популярный', delivery: 'Доставка', discount: 'Скидка', finalPrice: 'Финальная Цена', subscribe: 'Подписаться Сейчас',
      features: 'Функции', savings: 'Экономия', bestValue: 'ЛУЧШАЯ ЦЕНА', premium: 'ПРЕМИУМ', pieces: 'вещей',
      pickupsPerWeek: 'заборов/неделя', standardIroning: 'Стандартная глажка', premiumIroning: 'Премиум глажка',
      prioritySupport: 'Приоритетная поддержка', premiumSteaming: 'Премиум глажка и отпаривание', dedicatedSupport: 'Выделенная поддержка',
      freeStainRemoval: 'Бесплатное удаление пятен', premiumService: 'Премиум сервис', vipSupport: 'VIP поддержка',
      freeAlterations: 'Бесплатные изменения', qualityGuarantee: 'Гарантия качества', subscribeNow: 'Подписаться Сейчас',
      weekly: 'Еженедельно', monthly: '1 Месяц', quarterly: '3 Месяца', biannual: '6 Месяцев', yearly: 'Год', week: 'Неделя', days: 'Дни'
    },
    tracking: {
      title: 'Отследить Заказ', trackOrder: 'Отследите Ваш Заказ', orderId: 'ID Заказа', status: 'Статус',
      noActiveOrders: 'Нет активных заказов для отслеживания', trackingInfo: 'Выберите активный заказ для просмотра информации',
      orderJourney: 'Путь Заказа', scheduled: 'Запланировано', pickup: 'Забор', processing: 'Обработка',
      ready: 'Готово', inDelivery: 'В Доставке', completed: 'Завершено', pickupScheduled: 'Забор Запланирован',
      pickingUp: 'Забираем вашу одежду', ironing: 'Гладим вашу одежду', readyForDelivery: 'Готово к доставке',
      delivering: 'На пути к вам', delivered: 'Успешно доставлено', estimatedDelivery: 'Ожидаемая Доставка',
      contactSupport: 'Связаться с Поддержкой', callUs: 'Позвоните Нам', playGame: 'Играть', enjoyGame: 'Наслаждайтесь ожиданием',
      minutesRemaining: 'минут осталось'
    },
    newOrder: {
      title: 'Новый Заказ', selectGarments: 'Выбрать Одежду', deliveryDays: 'Дни Доставки', deliveryAddress: 'Адрес Доставки',
      paymentMethod: 'Способ Оплаты', submit: 'Отправить Заказ'
    },
    cart: {
      title: 'Корзина', yourCart: 'Ваша Корзина', itemsInCart: 'Товары в Корзине', emptyCart: 'Очистить Корзину', startShopping: 'Начать Покупки',
      cartSummary: 'Сводка Корзины', useSubscription: 'Использовать Подписку', expressDelivery: 'Экспресс Доставка',
      deliveryCost: 'Стоимость Доставки', discount: 'Скидка', total: 'Итого', checkout: 'Оформить', cartEmpty: 'Корзина Пуста',
      addItemsFirst: 'Пожалуйста, добавьте товары перед оформлением.', noActiveSubscription: 'Нет Активной Подписки',
      insufficientPieces: 'Недостаточно Вещей', insufficientBalance: 'Недостаточно Средств', addMoneyFirst: 'Пожалуйста, сначала добавьте деньги.',
      confirmPayment: 'Подтвердить Платеж', confirmDeduction: 'Подтвердить Списание', payNow: 'Оплатить Сейчас', payFromWallet: 'Оплатить из кошелька?',
      deductFromSubscription: 'Списать с подписки?', orderPlaced: 'Заказ Размещен', orderSuccess: 'Ваш заказ успешно размещен!',
      continueShopping: 'Продолжить Покупки', viewOrders: 'Посмотреть Заказы'
    },
    sos: englishTranslation.sos,
    common: { cancel: 'Отмена', confirm: 'Подтвердить', back: 'Назад', next: 'Далее', done: 'Готово', loading: 'Загрузка...', error: 'Ошибка', success: 'Успех', egp: 'EGP', min: 'мин', required: 'обязательно', optional: 'опционально' },
  },
  zh: englishTranslation,
  hi: englishTranslation,
};
