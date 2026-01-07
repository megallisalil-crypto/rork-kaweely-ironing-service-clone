import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
  Platform,
  Alert,
} from "react-native";
import { X, Clock, Zap, CheckCircle2, Flame, ShoppingBag } from "lucide-react-native";
import { useSOS } from "@/contexts/SOSContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import { useAddress } from "@/contexts/AddressContext";
import { useOrders } from "@/contexts/OrderContext";
import { SOSUrgencyLevel } from "@/types/sos";
import * as Haptics from "expo-haptics";


interface SOSModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function SOSModal({ visible, onClose, onSuccess }: SOSModalProps) {
  const {
    isSubscriber,
    canRequestSOS,
    createSOSRequest,
    getSOSPricing,
    calculateSOSPrice,
    getEstimatedDeliveryTime,
    linkSOSToOrder,
  } = useSOS();
  const { colors } = useTheme();
  const { format } = useCurrency();
  const { user } = useAuth();
  const { address, getFullAddress } = useAddress();
  const { addOrder } = useOrders();

  const selectedUrgency: SOSUrgencyLevel = "express";
  const [pieces, setPieces] = useState(5);
  const [isProcessing, setIsProcessing] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      slideAnim.setValue(300);
    }
  }, [visible, scaleAnim, slideAnim]);

  const pricing = getSOSPricing();
  const basePrice = pieces * 15;
  const totalPrice = calculateSOSPrice(basePrice, selectedUrgency);
  const estimatedDelivery = getEstimatedDeliveryTime(selectedUrgency);
  const deliveryMinutes = Math.round((estimatedDelivery.getTime() - new Date().getTime()) / (1000 * 60));



  const handleCreateSOS = async () => {
    if (!canRequestSOS) {
      Alert.alert(
        "تحذير",
        "لديك بالفعل طلبين SOS نشطين. لا يمكنك طلب المزيد.",
        [{ text: "حسناً" }]
      );
      return;
    }

    if (!user?.name || !user?.phone) {
      Alert.alert(
        "خطأ",
        "يرجى تسجيل الدخول أولاً لإنشاء طلب SOS",
        [{ text: "حسناً" }]
      );
      return;
    }

    if (!address) {
      Alert.alert(
        "خطأ",
        "يرجى إضافة عنوان التوصيل أولاً",
        [{ text: "حسناً" }]
      );
      return;
    }

    setIsProcessing(true);

    try {
      if (Platform.OS !== 'web') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      const sosRequest = createSOSRequest(selectedUrgency);

      const order = await addOrder({
        customerName: user.name,
        phoneNumber: user.phone,
        items: [
          {
            id: "sos-items",
            name: `قطع طوارئ SOS (${pieces})`,
            quantity: pieces,
            price: basePrice / pieces,
          },
        ],
        subscription: "none",
        deliveryAddress: getFullAddress(),
        notes: `طلب SOS سريع - التوصيل خلال ${deliveryMinutes} دقيقة`,
        isExpress: true,
        pickupDate: new Date(),
      });

      linkSOSToOrder(sosRequest.id, order.id);

      setIsProcessing(false);
      onSuccess();
      onClose();

      Alert.alert(
        "نجح! 🎉",
        `تم إنشاء طلب SOS بنجاح!\nرقم الطلب: ${order.orderNumber}\nسيصل خلال: ${deliveryMinutes} دقيقة`,
        [{ text: "رائع!" }]
      );
    } catch (error) {
      setIsProcessing(false);
      console.error("[SOSModal] Error creating SOS:", error);
      Alert.alert(
        "خطأ",
        "حدث خطأ أثناء إنشاء طلب SOS. يرجى المحاولة مرة أخرى.",
        [{ text: "حسناً" }]
      );
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
            },
          ]}
        >
          <View style={[styles.header, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.headerTop}>
              <View>
                <Text style={[styles.title, { color: colors.text }]}>طوارئ كي SOS</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  خدمة كي سريعة للمواقف الطارئة
                </Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {isSubscriber && (
              <View style={styles.subscriberBanner}>
                <Zap size={16} color="#FFF" fill="#FFF" />
                <Text style={styles.subscriberText}>
                  خصم المشتركين: {pricing.subscriberDiscount * 100}%
                </Text>
              </View>
            )}
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.expressServiceCard}>
              <View style={[styles.expressHeader, { backgroundColor: "#EF4444" }]}>
                <View style={styles.expressIconWrapper}>
                  <Zap size={32} color="#FFF" fill="#FFF" />
                </View>
                <View style={styles.expressHeaderText}>
                  <Text style={styles.expressTitle}>خدمة SOS السريعة</Text>
                  <Text style={styles.expressSubtitle}>توصيل خلال 60 دقيقة</Text>
                </View>
              </View>
              
              <View style={[styles.expressFeatures, { backgroundColor: colors.cardBackground }]}>
                <View style={styles.featureRow}>
                  <Clock size={20} color="#EF4444" />
                  <Text style={[styles.featureText, { color: colors.text }]}>توصيل سريع في أقل من ساعة</Text>
                </View>
                <View style={styles.featureRow}>
                  <Flame size={20} color="#EF4444" />
                  <Text style={[styles.featureText, { color: colors.text }]}>أولوية قصوى في المعالجة</Text>
                </View>
                <View style={styles.featureRow}>
                  <CheckCircle2 size={20} color="#10B981" />
                  <Text style={[styles.featureText, { color: colors.text }]}>ضمان الجودة والسرعة</Text>
                </View>
              </View>
            </View>

            <View style={styles.piecesSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                عدد القطع
              </Text>
              
              <View style={styles.piecesSelector}>
                {[3, 5, 7, 10].map((count) => (
                  <TouchableOpacity
                    key={count}
                    onPress={() => {
                      setPieces(count);
                      if (Platform.OS !== 'web') {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }
                    }}
                    style={[
                      styles.pieceButton,
                      {
                        backgroundColor: pieces === count ? colors.accent : colors.cardBackground,
                        borderColor: pieces === count ? colors.accent : colors.border,
                      },
                    ]}
                  >
                    <ShoppingBag
                      size={20}
                      color={pieces === count ? "#FFF" : colors.text}
                    />
                    <Text
                      style={[
                        styles.pieceText,
                        { color: pieces === count ? "#FFF" : colors.text },
                      ]}
                    >
                      {count}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={[styles.summaryCard, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.summaryTitle, { color: colors.text }]}>ملخص الطلب</Text>
              
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                  السعر الأساسي
                </Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  {format(basePrice)}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                  رسوم الخدمة السريعة
                </Text>
                <Text style={[styles.summaryValue, { color: "#EF4444" }]}>
                  ×{pricing.expressMultiplier}
                </Text>
              </View>

              {isSubscriber && (
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: "#10B981" }]}>
                    خصم المشترك
                  </Text>
                  <Text style={[styles.summaryValue, { color: "#10B981" }]}>
                    -{pricing.subscriberDiscount * 100}%
                  </Text>
                </View>
              )}

              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              <View style={styles.summaryRow}>
                <Text style={[styles.totalLabel, { color: colors.text }]}>
                  الإجمالي
                </Text>
                <Text style={[styles.totalValue, { color: colors.accent }]}>
                  {format(totalPrice)}
                </Text>
              </View>

              <View style={[styles.deliveryInfo, { backgroundColor: colors.background }]}>
                <Clock size={16} color={colors.accent} />
                <Text style={[styles.deliveryText, { color: colors.text }]}>
                  التوصيل خلال {deliveryMinutes} دقيقة
                </Text>
              </View>
            </View>

            <View style={[styles.benefitsBox, { backgroundColor: "#DCFCE7" }]}>
              <CheckCircle2 size={20} color="#10B981" />
              <Text style={styles.benefitsText}>
                خدمة مثالية للمناسبات الطارئة والمواعيد المهمة. نضمن لك أفضل خدمة في وقت قياسي.
              </Text>
            </View>
          </ScrollView>

          <View style={[styles.footer, { backgroundColor: colors.cardBackground }]}>
            <TouchableOpacity
              onPress={handleCreateSOS}
              disabled={isProcessing || !canRequestSOS}
              style={[
                styles.confirmButton,
                {
                  backgroundColor:
                    isProcessing || !canRequestSOS ? "#666" : "#EF4444",
                  opacity: isProcessing || !canRequestSOS ? 0.5 : 1,
                },
              ]}
            >
              <Text style={styles.confirmButtonText}>
                {isProcessing ? "جاري الإنشاء..." : "تأكيد طلب SOS"}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    width: "90%",
    maxWidth: 500,
    maxHeight: "85%",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(100,100,100,0.2)",
  },
  subscriberBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10B981",
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    gap: 8,
  },
  subscriberText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFF",
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  expressServiceCard: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  expressHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 16,
  },
  expressIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  expressHeaderText: {
    flex: 1,
  },
  expressTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFF",
  },
  expressSubtitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 4,
  },
  expressFeatures: {
    padding: 20,
    gap: 16,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  piecesSection: {
    marginBottom: 24,
  },
  piecesSelector: {
    flexDirection: "row",
    gap: 12,
  },
  pieceButton: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
  },
  pieceText: {
    fontSize: 16,
    fontWeight: "700",
  },
  summaryCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "700",
  },
  totalValue: {
    fontSize: 24,
    fontWeight: "900",
  },
  deliveryInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    gap: 8,
  },
  deliveryText: {
    fontSize: 14,
    fontWeight: "600",
  },
  benefitsBox: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 20,
  },
  benefitsText: {
    flex: 1,
    fontSize: 13,
    color: "#166534",
    fontWeight: "600",
  },
  footer: {
    padding: 20,
    paddingTop: 16,
  },
  confirmButton: {
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
  },
});
