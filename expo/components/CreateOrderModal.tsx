import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { X, Shirt, Plus, MapPin, CheckCircle2, Zap, Sparkles, Gift, Clock, Package, ArrowRight, FileText, Map } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { useCart } from "@/contexts/CartContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useAddress } from "@/contexts/AddressContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { GarmentCounter } from "@/components/GarmentCounter";
import { PerfumeSelectionModal } from "@/components/PerfumeSelectionModal";
import { PerfumeType } from "@/constants/perfumes";
import { GarmentSelectorModal } from "@/components/GarmentSelectorModal";
import { GarmentType } from "@/constants/garmentTypes";
import { MapAddressPickerModal, MapPickedAddress } from "@/components/MapAddressPickerModal";

type CreateOrderModalProps = {
  visible: boolean;
  onClose: () => void;
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.92;

const subscriptionDiscounts = {
  none: 0,
  week: 5,
  month: 10,
  "3months": 15,
  "6months": 20,
  year: 25,
};

const deliveryZones = [
  { name: "Zone 1 - Central Cairo", areas: ["Downtown", "Zamalek", "Garden City", "Dokki"], cost: 30 },
  { name: "Zone 2 - Greater Cairo", areas: ["Maadi", "Heliopolis", "Nasr City", "Mohandessin"], cost: 50 },
  { name: "Zone 3 - New Cairo & 6th October", areas: ["New Cairo", "5th Settlement", "6th October", "Sheikh Zayed"], cost: 70 },
  { name: "Zone 4 - Outer Areas", areas: ["10th of Ramadan", "Shorouk", "Obour", "Other Areas"], cost: 100 },
];

function calculateDeliveryCost(address: string): number {
  if (!address.trim()) return 0;
  
  const lowerAddress = address.toLowerCase();
  
  for (const zone of deliveryZones) {
    for (const area of zone.areas) {
      if (lowerAddress.includes(area.toLowerCase())) {
        return zone.cost;
      }
    }
  }
  
  return deliveryZones[deliveryZones.length - 1].cost;
}

export function CreateOrderModal({ visible, onClose }: CreateOrderModalProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const { addToCart, setPremiumServicesFromSelection, setIsExpressDelivery: setCartExpressDelivery, setDeliveryAddress: setCartDeliveryAddress, setSpecialInstructions: setCartSpecialInstructions } = useCart();
  const { subscription } = useSubscription();
  const { getFullAddress, saveAddress } = useAddress();
  const { format } = useCurrency();
  
  const slideAnim = useRef(new Animated.Value(MODAL_HEIGHT)).current;
  const [selectedGarments, setSelectedGarments] = useState<any[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [isExpress, setIsExpress] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [specialInstructions, setSpecialInstructions] = useState<string>("");
  const [addPerfume, setAddPerfume] = useState(false);
  const [selectedPerfume, setSelectedPerfume] = useState<PerfumeType | null>(null);
  const [showPerfumeSelector, setShowPerfumeSelector] = useState(false);
  const [addVIPPackaging, setAddVIPPackaging] = useState(false);
  const [useSubscriptionPieces, setUseSubscriptionPieces] = useState(false);
  const [showGarmentSelector, setShowGarmentSelector] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState<boolean>(false);


  useEffect(() => {
    if (visible) {
      const fullAddress = getFullAddress();
      if (fullAddress && fullAddress.trim().length > 0) {
        setDeliveryAddress(fullAddress);
      }
      
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: MODAL_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim, getFullAddress]);



  const handleIncrement = useCallback((id: string) => {
    setCounts((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }, []);

  const handleDecrement = useCallback((id: string) => {
    setCounts((prev) => {
      const newCount = Math.max(0, (prev[id] || 0) - 1);
      if (newCount === 0) {
        const { [id]: _, ...rest } = prev;
        setSelectedGarments(prevGarments => prevGarments.filter(g => g.id !== id));
        return rest;
      }
      return { ...prev, [id]: newCount };
    });
  }, []);

  const subtotal = useMemo(() => selectedGarments.reduce((sum, garment) => {
    const count = counts[garment.id] || 0;
    return sum + garment.price * count;
  }, 0), [selectedGarments, counts]);

  const EXPRESS_MINIMUM = 100;
  const canUseExpress = useMemo(() => subtotal >= EXPRESS_MINIMUM, [subtotal]);
  
  useEffect(() => {
    if (!canUseExpress && isExpress) {
      setIsExpress(false);
    }
  }, [canUseExpress, isExpress]);
  
  const expressCharge = useMemo(() => (isExpress && canUseExpress) ? subtotal * 0.3 : 0, [isExpress, canUseExpress, subtotal]);
  const perfumeCharge = useMemo(() => addPerfume ? 30 : 0, [addPerfume]);
  const vipPackagingCharge = useMemo(() => addVIPPackaging ? 50 : 0, [addVIPPackaging]);
  

  
  const currentSubscription = subscription?.planType || "none";
  const discount = useMemo(() => subtotal * (subscriptionDiscounts[currentSubscription as keyof typeof subscriptionDiscounts] / 100), [subtotal, currentSubscription]);
  const deliveryCostCalc = useMemo(() => calculateDeliveryCost(deliveryAddress), [deliveryAddress]);
  const total = useMemo(() => subtotal + expressCharge + perfumeCharge + vipPackagingCharge + deliveryCostCalc - discount, [subtotal, expressCharge, perfumeCharge, vipPackagingCharge, deliveryCostCalc, discount]);
  const totalItems = useMemo(() => Object.values(counts).reduce((sum, count) => sum + count, 0), [counts]);

  const handleClose = () => {
    onClose();
  };

  const handleMapPicked = useCallback(
    (picked: MapPickedAddress) => {
      console.log("[CreateOrderModal] Map picked:", picked);
      setDeliveryAddress(picked.formattedAddress);
    },
    [setDeliveryAddress]
  );

  const handleProceed = async () => {
    if (selectedGarments.length === 0) {
      Alert.alert("No Items", "Please add garments to continue");
      return;
    }
    
    if (deliveryAddress && deliveryAddress.trim().length > 0) {
      await saveAddress({
        type: "home",
        street: deliveryAddress,
        building: "",
        floor: "",
        apartment: "",
        landmark: "",
        contactName: "",
        contactPhone: "",
        fullAddress: deliveryAddress,
      });
      console.log("[CreateOrderModal] Address saved to context:", deliveryAddress);
    }
    
    console.log("[CreateOrderModal] Adding garments to cart:", selectedGarments.length);
    selectedGarments.forEach((garment) => {
      const count = counts[garment.id] || 0;
      for (let i = 0; i < count; i++) {
        addToCart({
          id: garment.id,
          name: garment.name,
          price: garment.price,
          image: garment.icon,
          type: 'service',
        });
      }
    });
    
    setPremiumServicesFromSelection(addPerfume, addVIPPackaging);
    setCartExpressDelivery(isExpress && canUseExpress);
    setCartDeliveryAddress(deliveryAddress);
    setCartSpecialInstructions(specialInstructions);
    
    onClose();
    router.push("/cart");
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      justifyContent: "flex-end",
    },
    overlayTouchable: {
      flex: 1,
    },
    modalContainer: {
      height: MODAL_HEIGHT,
      backgroundColor: '#000000',
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      paddingBottom: 20,
      borderTopWidth: 3,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: colors.tint,
    },
    handleBar: {
      width: 50,
      height: 5,
      backgroundColor: colors.tint,
      borderRadius: 3,
      alignSelf: "center",
      marginTop: 12,
      marginBottom: 8,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#2a2a2a',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    },
    headerIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: `${colors.tint}30`,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: colors.tint,
    },
    title: {
      fontSize: 22,
      fontWeight: "900" as const,
      color: '#FFFFFF',
      flex: 1,
    },
    closeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#1a1a1a',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#2a2a2a',
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 20,
    },
    subscriptionBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: `${colors.warning}20`,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
      marginBottom: 20,
      alignSelf: 'flex-start',
      borderWidth: 1,
      borderColor: `${colors.warning}40`,
    },
    subscriptionBadgeText: {
      fontSize: 11,
      fontWeight: '800' as const,
      color: colors.warning,
    },
    sectionDividerTitle: {
      fontSize: 13,
      fontWeight: '800' as const,
      color: colors.accent,
      marginBottom: 12,
      letterSpacing: 0.5,
    },
    addGarmentButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: colors.tint,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 12,
      marginBottom: 16,
      shadowColor: colors.tint,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 6,
    },
    addGarmentButtonText: {
      fontSize: 14,
      fontWeight: '800' as const,
      color: '#FFFFFF',
    },
    garmentsScrollView: {
      maxHeight: 240,
      marginBottom: 20,
    },
    garmentsListContainer: {
      gap: 8,
    },
    emptyStateCard: {
      alignItems: 'center',
      paddingVertical: 40,
      borderWidth: 2,
      borderColor: '#2a2a2a',
      borderRadius: 16,
      borderStyle: 'dashed' as const,
      backgroundColor: '#0a0a0a',
      marginBottom: 20,
    },
    emptyStateTitle: {
      fontSize: 15,
      fontWeight: '700' as const,
      color: '#FFFFFF',
      marginTop: 12,
      marginBottom: 4,
    },
    emptyStateDesc: {
      fontSize: 11,
      color: '#666666',
      textAlign: 'center',
    },
    subscriptionToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#0a0a0a',
      padding: 14,
      borderRadius: 14,
      marginBottom: 16,
      borderWidth: 2,
      borderColor: '#2a2a2a',
    },
    subscriptionToggleActive: {
      backgroundColor: `${colors.tint}15`,
      borderColor: colors.tint,
      shadowColor: colors.tint,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    subscriptionToggleLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    },
    subscriptionToggleIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: `${colors.tint}20`,
      justifyContent: 'center',
      alignItems: 'center',
    },
    subscriptionToggleIconActive: {
      backgroundColor: colors.tint,
    },
    subscriptionToggleText: {
      fontSize: 13,
      fontWeight: '800' as const,
      color: '#FFFFFF',
    },
    subscriptionToggleTextActive: {
      color: colors.tint,
    },
    subscriptionToggleSubtext: {
      fontSize: 10,
      fontWeight: '600' as const,
      color: '#888888',
      marginTop: 2,
    },
    subscriptionToggleCheckbox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#444444',
      backgroundColor: '#0a0a0a',
      justifyContent: 'center',
      alignItems: 'center',
    },
    subscriptionToggleCheckboxActive: {
      backgroundColor: colors.tint,
      borderColor: colors.tint,
    },
    subscriptionToggleCheckmark: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '900' as const,
    },
    servicesSection: {
      gap: 10,
      marginBottom: 20,
    },
    serviceToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 14,
      backgroundColor: '#0a0a0a',
      borderRadius: 14,
      borderWidth: 2,
      borderColor: '#2a2a2a',
    },
    serviceToggleActive: {
      backgroundColor: '#1a1a1a',
      borderColor: '#3a3a3a',
      shadowColor: '#FFFFFF',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    serviceToggleDisabled: {
      opacity: 0.5,
    },
    serviceIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#1a1a1a',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    serviceLabel: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flex: 1,
    },
    serviceLabelText: {
      flex: 1,
    },
    serviceText: {
      fontSize: 13,
      fontWeight: '800' as const,
      color: '#FFFFFF',
      marginBottom: 3,
    },
    servicePrice: {
      fontSize: 11,
      fontWeight: '600' as const,
      color: '#888888',
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: '#444444',
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxActive: {
      backgroundColor: colors.warning,
      borderColor: colors.warning,
    },
    expressTimeBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      backgroundColor: colors.warning,
      paddingHorizontal: 6,
      paddingVertical: 3,
      borderRadius: 8,
      shadowColor: colors.warning,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 3,
    },
    expressTimeBadgeText: {
      fontSize: 9,
      fontWeight: '900' as const,
      color: '#000000',
      letterSpacing: 0.3,
    },
    addressInput: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      backgroundColor: '#1a1a1a',
      borderRadius: 20,
      borderWidth: 3,
      borderColor: colors.accent,
      paddingHorizontal: 20,
      paddingVertical: 20,
      marginBottom: 28,
      shadowColor: colors.accent,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 10,
    },
    addressIconWrapper: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: `${colors.accent}20`,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.accent,
    },
    addressTextWrapper: {
      flex: 1,
      gap: 6,
    },
    mapButton: {
      height: 44,
      paddingHorizontal: 14,
      borderRadius: 14,
      backgroundColor: "rgba(255,255,255,0.10)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.16)",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    mapButtonText: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "900" as const,
      letterSpacing: 0.3,
    },
    addressLabel: {
      fontSize: 12,
      fontWeight: '700' as const,
      color: colors.accent,
      letterSpacing: 0.5,
    },
    addressTextInput: {
      fontSize: 15,
      fontWeight: '600' as const,
      color: '#FFFFFF',
      padding: 0,
      margin: 0,
    },
    costSummary: {
      backgroundColor: '#0a0a0a',
      borderRadius: 14,
      padding: 16,
      borderWidth: 2,
      borderColor: colors.accent,
      gap: 8,
      shadowColor: colors.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
      marginBottom: 16,
    },
    costSummaryTitle: {
      fontSize: 14,
      fontWeight: '800' as const,
      color: colors.accent,
      marginBottom: 8,
      letterSpacing: 0.5,
    },
    costRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    costLabel: {
      fontSize: 12,
      color: '#888888',
      fontWeight: '600' as const,
    },
    costValue: {
      fontSize: 13,
      fontWeight: '700' as const,
      color: '#FFFFFF',
    },
    costValuePositive: {
      color: colors.warning,
    },
    costValueNegative: {
      color: colors.success,
    },
    costDivider: {
      height: 1,
      backgroundColor: '#2a2a2a',
      marginVertical: 4,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    totalLabel: {
      fontSize: 14,
      fontWeight: '800' as const,
      color: '#FFFFFF',
    },
    totalValue: {
      fontSize: 20,
      fontWeight: '900' as const,
      color: colors.accent,
    },
    proceedButton: {
      backgroundColor: colors.accent,
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 10,
      shadowColor: colors.accent,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 8,
    },
    proceedButtonDisabled: {
      backgroundColor: '#444444',
      opacity: 0.5,
    },
    proceedButtonText: {
      fontSize: 16,
      fontWeight: '900' as const,
      color: '#000000',
      letterSpacing: 0.5,
    },
    instructionsBox: {
      backgroundColor: '#0a0a0a',
      borderRadius: 16,
      borderWidth: 2,
      borderColor: '#2a2a2a',
      padding: 16,
      marginBottom: 24,
      shadowColor: colors.warning,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    instructionsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 12,
    },
    instructionsIconWrapper: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: `${colors.warning}20`,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: colors.warning,
    },
    instructionsLabel: {
      fontSize: 13,
      fontWeight: '700' as const,
      color: colors.warning,
      letterSpacing: 0.3,
    },
    instructionsInput: {
      backgroundColor: '#1a1a1a',
      borderRadius: 12,
      padding: 14,
      fontSize: 14,
      fontWeight: '600' as const,
      color: '#FFFFFF',
      minHeight: 80,
      borderWidth: 1.5,
      borderColor: '#2a2a2a',
      textAlignVertical: 'top',
    },
    characterCount: {
      fontSize: 11,
      fontWeight: '600' as const,
      color: '#666666',
      textAlign: 'right',
      marginTop: 6,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={handleClose}
        />

        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.handleBar} />

          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIcon}>
                <Shirt size={24} color={colors.tint} strokeWidth={2.5} />
              </View>
              <Text style={styles.title}>Create Your Order</Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={22} color={'#FFFFFF'} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              <Text style={styles.sectionDividerTitle}>DELIVERY LOCATION</Text>
              <View style={styles.addressInput}>
                <View style={styles.addressIconWrapper}>
                  <MapPin size={22} color={colors.accent} strokeWidth={2.5} />
                </View>
                <View style={styles.addressTextWrapper}>
                  <Text style={styles.addressLabel}>Where should we deliver?</Text>
                  <TextInput
                    style={styles.addressTextInput}
                    placeholder="Enter area (e.g., Maadi, Zamalek, New Cairo)"
                    placeholderTextColor="#666666"
                    value={deliveryAddress}
                    onChangeText={setDeliveryAddress}
                    testID="createOrder.deliveryAddressInput"
                  />
                </View>

                <TouchableOpacity
                  style={styles.mapButton}
                  onPress={() => setShowMapPicker(true)}
                  activeOpacity={0.8}
                  testID="createOrder.openMap"
                >
                  <Map size={18} color="#FFFFFF" strokeWidth={2.6} />
                  <Text style={styles.mapButtonText}>Map</Text>
                </TouchableOpacity>
              </View>

              <MapAddressPickerModal
                visible={showMapPicker}
                onClose={() => setShowMapPicker(false)}
                onPick={handleMapPicked}
                accentColor={colors.accent}
              />
              
              {subscription && subscription.planType !== "none" && subscription.isActive && (
                <View style={styles.subscriptionBadge}>
                  <Sparkles size={12} color={colors.warning} />
                  <Text style={styles.subscriptionBadgeText}>
                    {subscription.planTitle} • {subscriptionDiscounts[subscription.planType as keyof typeof subscriptionDiscounts]}% OFF
                  </Text>
                </View>
              )}
              
              <Text style={styles.sectionDividerTitle}>SELECT ITEMS</Text>
              
              <TouchableOpacity
                style={styles.addGarmentButton}
                onPress={() => setShowGarmentSelector(true)}
                activeOpacity={0.8}
              >
                <Plus size={20} color="#FFFFFF" strokeWidth={3} />
                <Text style={styles.addGarmentButtonText}>Browse Garments</Text>
              </TouchableOpacity>
              
              {subscription && subscription.planType !== "none" && subscription.remainingPieces > 0 && (
                <TouchableOpacity
                  style={[
                    styles.subscriptionToggle,
                    useSubscriptionPieces && styles.subscriptionToggleActive,
                  ]}
                  onPress={() => setUseSubscriptionPieces(!useSubscriptionPieces)}
                  activeOpacity={0.8}
                >
                  <View style={styles.subscriptionToggleLeft}>
                    <View style={[
                      styles.subscriptionToggleIcon,
                      useSubscriptionPieces && styles.subscriptionToggleIconActive,
                    ]}>
                      <Package 
                        size={20} 
                        color={useSubscriptionPieces ? "#FFFFFF" : colors.tint} 
                        strokeWidth={2.5}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[
                        styles.subscriptionToggleText,
                        useSubscriptionPieces && styles.subscriptionToggleTextActive,
                      ]}>
                        Use Subscription Plan
                      </Text>
                      <Text style={styles.subscriptionToggleSubtext}>
                        {subscription.remainingPieces} pieces available • {subscription.planTitle}
                      </Text>
                    </View>
                  </View>
                  <View style={[
                    styles.subscriptionToggleCheckbox,
                    useSubscriptionPieces && styles.subscriptionToggleCheckboxActive,
                  ]}>
                    {useSubscriptionPieces && (
                      <Text style={styles.subscriptionToggleCheckmark}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              )}
              
              {selectedGarments.length === 0 ? (
                <View style={styles.emptyStateCard}>
                  <Shirt size={48} color="#444444" strokeWidth={2} />
                  <Text style={styles.emptyStateTitle}>No items selected</Text>
                  <Text style={styles.emptyStateDesc}>Tap the button above to browse garments</Text>
                </View>
              ) : (
                <ScrollView 
                  style={styles.garmentsScrollView}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.garmentsListContainer}>
                    {selectedGarments.map((garment) => (
                      <GarmentCounter
                        key={garment.id}
                        name={garment.name}
                        count={counts[garment.id] || 0}
                        price={garment.price}
                        onIncrement={() => handleIncrement(garment.id)}
                        onDecrement={() => handleDecrement(garment.id)}
                      />
                    ))}
                  </View>
                </ScrollView>
              )}
              
              <Text style={styles.sectionDividerTitle}>SPECIAL INSTRUCTIONS</Text>
              <View style={styles.instructionsBox}>
                <View style={styles.instructionsHeader}>
                  <View style={styles.instructionsIconWrapper}>
                    <FileText size={20} color={colors.warning} strokeWidth={2.5} />
                  </View>
                  <Text style={styles.instructionsLabel}>Any special requests?</Text>
                </View>
                <TextInput
                  style={styles.instructionsInput}
                  placeholder="e.g., Extra starch, delicate fabric care, fold not hang, etc..."
                  placeholderTextColor="#666666"
                  value={specialInstructions}
                  onChangeText={setSpecialInstructions}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  maxLength={200}
                />
                {specialInstructions.length > 0 && (
                  <Text style={styles.characterCount}>
                    {specialInstructions.length}/200 characters
                  </Text>
                )}
              </View>
              
              <Text style={styles.sectionDividerTitle}>PREMIUM SERVICES</Text>
              
              <View style={styles.servicesSection}>
                <TouchableOpacity
                  style={[
                    styles.serviceToggle, 
                    isExpress && styles.serviceToggleActive,
                    !canUseExpress && styles.serviceToggleDisabled
                  ]}
                  onPress={() => {
                    if (!canUseExpress) {
                      Alert.alert(
                        "Express Delivery Unavailable",
                        `Express delivery is only available for orders over ${format(EXPRESS_MINIMUM)}. Your current order is ${format(subtotal)}.`
                      );
                      return;
                    }
                    setIsExpress(!isExpress);
                  }}
                  activeOpacity={0.8}
                >
                  <View style={styles.serviceLabel}>
                    <View style={[styles.serviceIconContainer, isExpress && { backgroundColor: `${colors.warning}20` }]}>
                      <Zap
                        size={20}
                        color={isExpress ? colors.warning : "#888888"}
                        fill={isExpress ? colors.warning : "transparent"}
                      />
                    </View>
                    <View style={styles.serviceLabelText}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={[styles.serviceText, isExpress && { color: colors.warning }]}>
                          Express Delivery
                        </Text>
                        <View style={styles.expressTimeBadge}>
                          <Clock size={10} color="#000000" strokeWidth={3} />
                          <Text style={styles.expressTimeBadgeText}>120 min</Text>
                        </View>
                      </View>
                      <Text style={styles.servicePrice}>
                        {canUseExpress 
                          ? '+30% of subtotal' 
                          : `Min ${format(EXPRESS_MINIMUM)} required`}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.checkbox, isExpress && styles.checkboxActive]}>
                    {isExpress && <CheckCircle2 size={14} color="#000000" strokeWidth={3} />}
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.serviceToggle, addPerfume && styles.serviceToggleActive]}
                  onPress={() => {
                    if (!addPerfume) {
                      setShowPerfumeSelector(true);
                    } else {
                      setAddPerfume(false);
                      setSelectedPerfume(null);
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <View style={styles.serviceLabel}>
                    <View style={[styles.serviceIconContainer, addPerfume && { backgroundColor: '#EC489920' }]}>
                      <Sparkles
                        size={20}
                        color={addPerfume ? '#EC4899' : "#888888"}
                        fill={addPerfume ? '#EC4899' : "transparent"}
                      />
                    </View>
                    <View style={styles.serviceLabelText}>
                      <Text style={[styles.serviceText, addPerfume && { color: '#EC4899' }]}>
                        Premium Perfume
                      </Text>
                      <Text style={styles.servicePrice}>
                        {selectedPerfume ? selectedPerfume.name : `+${format(30)}`}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.checkbox, addPerfume && { backgroundColor: '#EC4899', borderColor: '#EC4899' }]}>
                    {addPerfume && <CheckCircle2 size={14} color="#000000" strokeWidth={3} />}
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.serviceToggle, addVIPPackaging && styles.serviceToggleActive]}
                  onPress={() => setAddVIPPackaging(!addVIPPackaging)}
                  activeOpacity={0.8}
                >
                  <View style={styles.serviceLabel}>
                    <View style={[styles.serviceIconContainer, addVIPPackaging && { backgroundColor: '#8B5CF620' }]}>
                      <Gift
                        size={20}
                        color={addVIPPackaging ? '#8B5CF6' : "#888888"}
                        fill={addVIPPackaging ? '#8B5CF6' : "transparent"}
                      />
                    </View>
                    <View style={styles.serviceLabelText}>
                      <Text style={[styles.serviceText, addVIPPackaging && { color: '#8B5CF6' }]}>
                        VIP Kaweely Packaging
                      </Text>
                      <Text style={styles.servicePrice}>+{format(50)}</Text>
                    </View>
                  </View>
                  <View style={[styles.checkbox, addVIPPackaging && { backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' }]}>
                    {addVIPPackaging && <CheckCircle2 size={14} color="#000000" strokeWidth={3} />}
                  </View>
                </TouchableOpacity>
              </View>
              

              <View style={styles.costSummary}>
                <Text style={styles.costSummaryTitle}>Cost Breakdown</Text>
                
                <View style={styles.costRow}>
                  <Text style={styles.costLabel}>Subtotal ({totalItems} items)</Text>
                  <Text style={styles.costValue}>{format(subtotal)}</Text>
                </View>
                
                {isExpress && (
                  <View style={styles.costRow}>
                    <Text style={styles.costLabel}>Express Delivery (30%)</Text>
                    <Text style={[styles.costValue, styles.costValuePositive]}>+{format(expressCharge)}</Text>
                  </View>
                )}
                
                {addPerfume && (
                  <View style={styles.costRow}>
                    <Text style={styles.costLabel}>Perfume</Text>
                    <Text style={[styles.costValue, styles.costValuePositive]}>+{format(perfumeCharge)}</Text>
                  </View>
                )}
                
                {addVIPPackaging && (
                  <View style={styles.costRow}>
                    <Text style={styles.costLabel}>VIP Packaging</Text>
                    <Text style={[styles.costValue, styles.costValuePositive]}>+{format(vipPackagingCharge)}</Text>
                  </View>
                )}
                
                {deliveryCostCalc > 0 && (
                  <View style={styles.costRow}>
                    <Text style={styles.costLabel}>Delivery</Text>
                    <Text style={[styles.costValue, styles.costValuePositive]}>+{format(deliveryCostCalc)}</Text>
                  </View>
                )}
                
                {discount > 0 && (
                  <View style={styles.costRow}>
                    <Text style={styles.costLabel}>Subscription Discount</Text>
                    <Text style={[styles.costValue, styles.costValueNegative]}>-{format(discount)}</Text>
                  </View>
                )}
                
                <View style={styles.costDivider} />
                
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>{format(total)}</Text>
                </View>
              </View>
              
              <TouchableOpacity
                style={[styles.proceedButton, selectedGarments.length === 0 && styles.proceedButtonDisabled]}
                onPress={handleProceed}
                activeOpacity={0.8}
                disabled={selectedGarments.length === 0}
              >
                <Text style={styles.proceedButtonText}>
                  Proceed to Cart {totalItems > 0 ? `(${totalItems} items • ${format(total)})` : ''}
                </Text>
                <ArrowRight size={20} color="#000000" strokeWidth={3} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </View>


      <PerfumeSelectionModal
        visible={showPerfumeSelector}
        onClose={() => setShowPerfumeSelector(false)}
        onSelect={(perfume) => {
          setSelectedPerfume(perfume);
          setAddPerfume(true);
        }}
        selectedPerfumeId={selectedPerfume?.id}
      />

      <GarmentSelectorModal
        visible={showGarmentSelector}
        onClose={() => setShowGarmentSelector(false)}
        onSelect={(garment: GarmentType, quantity = 1) => {
          console.log("[CreateOrderModal] Garment selected:", garment.name, "Quantity:", quantity);
          
          const existingIndex = selectedGarments.findIndex(g => g.id === garment.id);
          
          if (existingIndex >= 0) {
            setCounts(prev => ({
              ...prev,
              [garment.id]: (prev[garment.id] || 0) + quantity,
            }));
          } else {
            setSelectedGarments(prev => [...prev, garment]);
            setCounts(prev => ({
              ...prev,
              [garment.id]: quantity,
            }));
          }
        }}
      />
    </Modal>
  );
}
