import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Platform,
  Alert,
  Easing,
} from "react-native";
import { Stack, router } from "expo-router";
import {
  AlertCircle,
  Zap,
  Clock,
  ShoppingBag,
  ChevronRight,
  ShieldCheck,
  MapPin,
} from "lucide-react-native";
import { useSOS } from "@/contexts/SOSContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import { useAddress } from "@/contexts/AddressContext";
import { useOrders } from "@/contexts/OrderContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useWallet } from "@/contexts/WalletContext";
import { SOSUrgencyLevel } from "@/types/sos";
import * as Haptics from "expo-haptics";

import { LinearGradient } from "expo-linear-gradient";
import VoiceCommandButton from "@/components/VoiceCommandButton";
import VoiceCommandOverlay from "@/components/VoiceCommandOverlay";

export default function SOSScreen() {
  const {
    isSubscriber,
    canRequestSOS,
    createSOSRequest,
    getSOSPricing,
    calculateSOSPrice,
    getEstimatedDeliveryTime,
    linkSOSToOrder,
  } = useSOS();
  const { colors, isDark } = useTheme();
  const { format } = useCurrency();
  const { user } = useAuth();
  const { address, getFullAddress } = useAddress();
  const { addOrder } = useOrders();
  const { t } = useLanguage();
  const { balance, deductPayment } = useWallet();

  const selectedUrgency: SOSUrgencyLevel = "express";
  const [pieces, setPieces] = useState(5);
  const [isProcessing, setIsProcessing] = useState(false);

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        damping: 20,
        stiffness: 90,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous animations
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();
    glowAnimation.start();

    return () => {
      pulseAnimation.stop();
      glowAnimation.stop();
    };
  }, [fadeAnim, glowAnim, pulseAnim, slideAnim]);

  const pricing = getSOSPricing();
  const basePrice = pieces * 15;
  const totalPrice = calculateSOSPrice(basePrice, selectedUrgency);
  const estimatedDelivery = getEstimatedDeliveryTime(selectedUrgency);
  const deliveryMinutes = Math.round(
    (estimatedDelivery.getTime() - new Date().getTime()) / (1000 * 60)
  );

  const handleCreateSOS = async () => {
    if (!canRequestSOS) {
      Alert.alert(
        t.common.error,
        t.sos.activeSOSWarning,
        [{ text: t.common.confirm, style: "cancel" }]
      );
      return;
    }

    if (!address) {
      Alert.alert(
        t.sos.noAddressSet,
        t.sos.setAddressFirst,
        [
          { text: t.common.cancel, style: "cancel" },
          { text: t.profile.address, onPress: () => router.push("/delivery-address") }
        ]
      );
      return;
    }

    if (balance < totalPrice) {
      Alert.alert(
        t.sos.insufficientBalance,
        t.sos.addMoneyFirst,
        [
          { text: t.common.cancel, style: "cancel" },
          { text: t.profile.addMoney, onPress: () => router.push("/add-money") }
        ]
      );
      return;
    }

    const customerName = user?.name || "Guest Customer";
    const phoneNumber = user?.phone || "+20 100 000 0000";
    const deliveryAddress = getFullAddress();

    setIsProcessing(true);

    try {
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      const sosRequest = createSOSRequest(selectedUrgency);
      const multiplier = pricing.expressMultiplier;
      const sosDeliveryTime = getEstimatedDeliveryTime(selectedUrgency);

      await deductPayment(totalPrice, `SOS ${t.sos.title} - ${pieces} ${t.sos.pieces}`);

      const order = await addOrder({
        customerName,
        phoneNumber,
        items: [
          {
            id: "sos-items",
            name: `SOS ${t.sos.emergencyService} (${pieces})`,
            quantity: pieces,
            price: basePrice / pieces,
          },
        ],
        subscription: "none",
        deliveryAddress,
        notes: `${t.sos.title} - ${t.sos.deliveryTime} ${deliveryMinutes} ${t.common.min}`,
        isExpress: true,
        pickupDate: new Date(),
        isSOS: true,
        sosActivatedAt: new Date(),
        sosDeliveryTime: sosDeliveryTime,
        expressDeliveryTime: sosDeliveryTime,
        sosMultiplier: multiplier,
      });

      linkSOSToOrder(sosRequest.id, order.id);
      setIsProcessing(false);

      Alert.alert(
        t.sos.orderReceived,
        `${t.sos.teamOnWay}${order.orderNumber}`,
        [{ text: t.sos.trackOrder, onPress: () => router.push(`/order/${order.id}` as any) }]
      );
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      Alert.alert(t.sos.error, error instanceof Error ? error.message : "An error occurred");
    }
  };

  const primaryColor = isSubscriber ? "#10B981" : "#EF4444";
  const secondaryColor = isSubscriber ? "#059669" : "#DC2626";
  const bgGradient = isSubscriber
    ? (["#ECFDF5", "#D1FAE5", "#A7F3D0"] as const)
    : (["#FEF2F2", "#FEE2E2", "#FECACA"] as const);
    
  // Dark mode adjustments
  const darkBgGradient = isSubscriber 
    ? (["#064E3B", "#065F46", "#047857"] as const)
    : (["#450A0A", "#7F1D1D", "#991B1B"] as const);

  const currentGradient = isDark ? darkBgGradient : bgGradient;

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
        >
          {/* Hero Section */}
          <View style={styles.heroWrapper}>
            <LinearGradient
              colors={currentGradient}
              style={styles.heroBackground}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
            
            <View style={styles.header}>
               <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#1F2937' }]}>{t.sos.title}</Text>
               <View style={styles.statusBadge}>
                 <View style={[styles.statusDot, { backgroundColor: canRequestSOS ? '#10B981' : '#F59E0B' }]} />
                 <Text style={styles.statusText}>{canRequestSOS ? t.sos.serviceAvailable : t.sos.busy}</Text>
               </View>
            </View>

            <View style={[styles.available24Banner, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)' }]}>
              <Clock size={18} color="#10B981" />
              <View style={styles.available24Content}>
                <Text style={[styles.available24Title, { color: isDark ? '#fff' : '#065F46' }]}>{t.sos.available24_7}</Text>
                <Text style={[styles.available24Subtitle, { color: isDark ? '#D1D5DB' : '#059669' }]}>{t.sos.neverSleep}</Text>
              </View>
            </View>

            <View style={styles.heroContent}>
              <Animated.View
                style={[
                  styles.sosButtonContainer,
                  {
                    transform: [{ scale: pulseAnim }],
                  },
                ]}
              >
                <Animated.View
                  style={[
                    styles.pulseRing,
                    {
                      borderColor: primaryColor,
                      opacity: glowAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.3, 0.7],
                      }),
                      transform: [{ scale: glowAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.4],
                      }) }],
                    },
                  ]}
                />
                
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                     if(Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                  }}
                  style={[styles.sosButtonMain, { backgroundColor: primaryColor, shadowColor: primaryColor }]}
                >
                  <LinearGradient
                    colors={[primaryColor, secondaryColor]}
                    style={styles.sosButtonGradient}
                  >
                    <AlertCircle size={48} color="#FFF" strokeWidth={2.5} />
                    <Text style={styles.sosButtonText}>SOS</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              <View style={styles.heroTexts}>
                <Text style={[styles.heroTitle, { color: isDark ? '#fff' : '#111827' }]}>
                  {isSubscriber ? t.sos.vipEmergency : t.sos.emergencyService}
                </Text>
                <Text style={[styles.heroSubtitle, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>
                  {t.sos.description}
                </Text>
              </View>
            </View>
          </View>

          <Animated.View 
            style={[
              styles.contentContainer, 
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }] 
              }
            ]}
          >
            {/* Delivery Estimation Card */}
            <View style={[styles.card, styles.deliveryCard, { backgroundColor: colors.cardBackground, shadowColor: colors.shadowColor }]}>
              <View style={styles.deliveryInfo}>
                 <View style={[styles.iconBox, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                   <Clock size={24} color="#10B981" />
                 </View>
                 <View style={styles.deliveryTexts}>
                   <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>{t.sos.deliveryTime}</Text>
                   <Text style={[styles.cardValue, { color: colors.text }]}>{deliveryMinutes} {t.common.min}</Text>
                 </View>
              </View>
              <View style={styles.dividerVertical} />
              <TouchableOpacity 
                style={styles.deliveryInfo}
                onPress={() => router.push("/delivery-address")}
                activeOpacity={0.7}
              >
                 <View style={[styles.iconBox, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                   <MapPin size={24} color="#3B82F6" />
                 </View>
                 <View style={styles.deliveryTexts}>
                   <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>{t.sos.yourArea}</Text>
                   <Text style={[styles.cardValue, { color: address ? colors.text : '#F59E0B' }]} numberOfLines={1}>
                     {address ? getFullAddress() : t.sos.selectLocation}
                   </Text>
                 </View>
              </TouchableOpacity>
            </View>

            {/* Features Grid */}
            <View style={styles.featuresGrid}>
              <View style={[styles.featureItem, { backgroundColor: colors.cardBackground }]}>
                 <Zap size={24} color="#F59E0B" />
                 <Text style={[styles.featureTitle, { color: colors.text }]}>{t.sos.superFast}</Text>
                 <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>{t.sos.topPriority}</Text>
              </View>
              <View style={[styles.featureItem, { backgroundColor: colors.cardBackground }]}>
                 <ShieldCheck size={24} color="#10B981" />
                 <Text style={[styles.featureTitle, { color: colors.text }]}>{t.sos.comprehensiveGuarantee}</Text>
                 <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>{t.sos.guaranteedQuality}</Text>
              </View>
            </View>

            {/* Pieces Selector */}
            <View style={styles.section}>
              <Text style={[styles.sectionHeader, { color: colors.text }]}>{t.sos.howManyPieces}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.piecesContainer}>
                {[3, 5, 7, 10, 15].map((count) => {
                  const isSelected = pieces === count;
                  return (
                    <TouchableOpacity
                      key={count}
                      onPress={() => {
                        setPieces(count);
                        if (Platform.OS !== "web") Haptics.selectionAsync();
                      }}
                      style={[
                        styles.pieceCard,
                        isSelected && { backgroundColor: primaryColor, borderColor: primaryColor, transform: [{scale: 1.05}] },
                        !isSelected && { backgroundColor: colors.cardBackground, borderColor: colors.border }
                      ]}
                    >
                      <ShoppingBag size={22} color={isSelected ? "#FFF" : colors.textSecondary} />
                      <Text style={[styles.pieceCount, { color: isSelected ? "#FFF" : colors.text }]}>{count}</Text>
                      <Text style={[styles.pieceLabel, { color: isSelected ? "rgba(255,255,255,0.8)" : colors.textSecondary }]}>{t.sos.pieces}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Summary & Action */}
            <View style={[styles.actionCard, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.priceRow}>
                 <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>{t.sos.totalCost}</Text>
                 <View style={styles.priceValueContainer}>
                    <Text style={[styles.priceValue, { color: colors.text }]}>{format(totalPrice)}</Text>
                    {isSubscriber && <View style={styles.discountBadge}><Text style={styles.discountText}>{t.sos.discount} {pricing.subscriberDiscount * 100}%</Text></View>}
                 </View>
              </View>
              
              <Text style={styles.priceNote}>{t.sos.includesDelivery}</Text>

              <TouchableOpacity
                onPress={handleCreateSOS}
                disabled={isProcessing || !canRequestSOS}
                style={[styles.confirmBtn, { backgroundColor: canRequestSOS ? primaryColor : colors.border }]}
              >
                {isProcessing ? (
                  <Text style={styles.confirmBtnText}>{t.sos.requesting}</Text>
                ) : (
                  <>
                    <Text style={styles.confirmBtnText}>{t.sos.requestSOSNow}</Text>
                    <View style={styles.btnIconBubble}>
                      <ChevronRight size={20} color={primaryColor} />
                    </View>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={[styles.benefitsBox, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#DCFCE7' }]}>
              <Clock size={20} color="#10B981" />
              <View style={styles.benefitsTextContainer}>
                <Text style={[styles.benefitsTitle, { color: isDark ? '#fff' : '#065F46' }]}>{t.sos.alwaysHere}</Text>
                <Text style={[styles.benefitsText, { color: isDark ? '#D1D5DB' : '#166534' }]}>{t.sos.dayOrNight}</Text>
              </View>
            </View>

            <View style={{ height: 100 }} /> 
          </Animated.View>
        </ScrollView>
      </View>
      
      <VoiceCommandButton />
      <VoiceCommandOverlay />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  heroWrapper: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
  },
  heroBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    width: '100%',
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  heroContent: {
    alignItems: 'center',
    width: '100%',
  },
  sosButtonContainer: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  pulseRing: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
  },
  sosButtonMain: {
    width: 120,
    height: 120,
    borderRadius: 60,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  sosButtonGradient: {
    flex: 1,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  sosButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 4,
    letterSpacing: 1,
  },
  heroTexts: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  contentContainer: {
    paddingHorizontal: 20,
    marginTop: -20,
  },
  card: {
    borderRadius: 24,
    padding: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 20,
  },
  deliveryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deliveryInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerVertical: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginHorizontal: 10,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deliveryTexts: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  featuresGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  featureItem: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  featureDesc: {
    fontSize: 11,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    marginLeft: 4,
  },
  piecesContainer: {
    gap: 12,
    paddingHorizontal: 4,
    paddingBottom: 10,
  },
  pieceCard: {
    width: 80,
    height: 100,
    borderRadius: 18,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  pieceCount: {
    fontSize: 22,
    fontWeight: '800',
  },
  pieceLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionCard: {
    padding: 24,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  priceValueContainer: {
    alignItems: 'flex-end',
  },
  priceValue: {
    fontSize: 28,
    fontWeight: '900',
  },
  discountBadge: {
    backgroundColor: '#DEF7EC',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  discountText: {
    color: '#03543F',
    fontSize: 10,
    fontWeight: '700',
  },
  priceNote: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 24,
    textAlign: 'right',
  },
  confirmBtn: {
    flexDirection: 'row',
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingLeft: 24,
  },
  confirmBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
  },
  btnIconBubble: {
    width: 44,
    height: 44,
    backgroundColor: '#FFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitsBox: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 20,
  },
  benefitsTextContainer: {
    flex: 1,
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  benefitsText: {
    fontSize: 13,
    fontWeight: '600',
  },
  available24Banner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginHorizontal: 24,
    marginTop: 12,
    gap: 12,
  },
  available24Content: {
    flex: 1,
  },
  available24Title: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  available24Subtitle: {
    fontSize: 12,
    fontWeight: '600',
  },
});
