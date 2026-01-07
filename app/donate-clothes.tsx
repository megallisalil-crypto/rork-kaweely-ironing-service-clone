import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Animated } from "react-native";
import { Stack, useRouter } from "expo-router";
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { Heart, CheckCircle2, Minus, Plus, Users, Home, Baby, Smile, Sparkles } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useSustainability } from "@/contexts/SustainabilityContext";
import { DonationItem } from "@/types/sustainability";
import { useState, useRef, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const impactMessages = [
  { count: 1, message: "You're helping 1 person feel confident" },
  { count: 5, message: "5 families will smile because of you" },
  { count: 10, message: "You're changing 10 lives with kindness" },
  { count: 20, message: "20 people will have warm clothes" },
  { count: 30, message: "Your generosity touches 30 hearts" },
  { count: 50, message: "50 lives transformed by your compassion" },
];

export default function DonateClothesScreen() {
  const { colors } = useTheme();
  const { createDonation } = useSustainability();
  const router = useRouter();

  const [itemCount, setItemCount] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const heartPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(heartPulse, {
          toValue: 1.15,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(heartPulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [heartPulse]);

  const handleIncrement = () => {
    const newCount = itemCount + 1;
    setItemCount(newCount);
    animateCounter();
    console.log('[DonateClothes] Items increased to:', newCount);
  };

  const handleDecrement = () => {
    if (itemCount > 0) {
      const newCount = itemCount - 1;
      setItemCount(newCount);
      animateCounter();
      console.log('[DonateClothes] Items decreased to:', newCount);
    }
  };

  const animateCounter = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getImpactMessage = () => {
    for (let i = impactMessages.length - 1; i >= 0; i--) {
      if (itemCount >= impactMessages[i].count) {
        return impactMessages[i].message;
      }
    }
    return "Every piece makes a difference";
  };

  const handleCreateDonation = () => {
    if (itemCount === 0) {
      Alert.alert('No Items', 'Please select at least one item to donate');
      return;
    }

    const donationItems: DonationItem[] = Array.from({ length: itemCount }, (_, index) => ({
      id: `item-${Date.now()}-${index}`,
      name: `Donated Item ${index + 1}`,
      category: 'other' as const,
      condition: 'good' as const,
      estimatedValue: 0,
    }));

    console.log('[DonateClothes] Creating donation with', itemCount, 'items');
    createDonation(donationItems);
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setItemCount(0);
    router.back();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#0F172A',
    },
    backgroundGradient: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 20,
      paddingBottom: 40,
    },
    headerCard: {
      backgroundColor: 'transparent',
      borderRadius: 32,
      padding: 32,
      marginBottom: 32,
      alignItems: 'center' as const,
      overflow: 'hidden' as const,
    },
    headerCardBackground: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.15,
    },
    iconContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: 'transparent',
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginBottom: 20,
    },
    iconGlow: {
      position: 'absolute' as const,
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.warning,
      opacity: 0.2,
    },
    headerTitle: {
      fontSize: 32,
      fontWeight: '900' as const,
      color: '#FFFFFF',
      textAlign: 'center' as const,
      marginBottom: 12,
      letterSpacing: 0.8,
    },
    headerSubtitle: {
      fontSize: 16,
      color: '#CBD5E1',
      textAlign: 'center' as const,
      lineHeight: 24,
      fontWeight: '600' as const,
      marginBottom: 8,
    },
    impactText: {
      fontSize: 14,
      color: colors.warning,
      textAlign: 'center' as const,
      lineHeight: 20,
      fontWeight: '800' as const,
      marginTop: 8,
      letterSpacing: 0.5,
    },
    counterCard: {
      backgroundColor: '#1E293B',
      borderRadius: 32,
      padding: 40,
      marginBottom: 24,
      alignItems: 'center' as const,
      borderWidth: 3,
      borderColor: colors.warning,
      shadowColor: colors.warning,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.4,
      shadowRadius: 24,
      elevation: 12,
    },
    counterLabel: {
      fontSize: 16,
      fontWeight: '800' as const,
      color: '#94A3B8',
      marginBottom: 20,
      letterSpacing: 1,
      textTransform: 'uppercase' as const,
    },
    counterRow: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 24,
      marginBottom: 24,
    },
    counterButton: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      borderWidth: 3,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
    counterButtonMinus: {
      backgroundColor: '#DC2626',
      borderColor: '#991B1B',
      shadowColor: '#DC2626',
    },
    counterButtonPlus: {
      backgroundColor: colors.success,
      borderColor: '#15803D',
      shadowColor: colors.success,
    },
    counterButtonDisabled: {
      backgroundColor: '#334155',
      borderColor: '#1E293B',
      shadowColor: '#000',
      opacity: 0.4,
    },
    counterValue: {
      fontSize: 72,
      fontWeight: '900' as const,
      color: '#FFFFFF',
      textAlign: 'center' as const,
      minWidth: 140,
      letterSpacing: 2,
    },
    counterImpactMessage: {
      fontSize: 15,
      color: colors.warning,
      textAlign: 'center' as const,
      fontWeight: '700' as const,
      lineHeight: 22,
    },
    beneficiariesSection: {
      marginBottom: 24,
    },
    beneficiariesTitle: {
      fontSize: 18,
      fontWeight: '900' as const,
      color: '#FFFFFF',
      marginBottom: 20,
      textAlign: 'center' as const,
      letterSpacing: 0.5,
    },
    beneficiariesGrid: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      gap: 12,
      justifyContent: 'center' as const,
    },
    beneficiaryCard: {
      backgroundColor: '#1E293B',
      borderRadius: 20,
      padding: 20,
      alignItems: 'center' as const,
      width: '47%',
      borderWidth: 2,
      borderColor: '#334155',
    },
    beneficiaryIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: `${colors.warning}20`,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginBottom: 12,
    },
    beneficiaryLabel: {
      fontSize: 14,
      fontWeight: '800' as const,
      color: '#FFFFFF',
      textAlign: 'center' as const,
      marginBottom: 4,
    },
    beneficiaryDescription: {
      fontSize: 11,
      color: '#94A3B8',
      textAlign: 'center' as const,
      fontWeight: '600' as const,
      lineHeight: 16,
    },
    submitButton: {
      borderRadius: 24,
      paddingVertical: 20,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      gap: 12,
      shadowColor: colors.success,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.6,
      shadowRadius: 24,
      elevation: 12,
      overflow: 'hidden' as const,
    },
    submitButtonGradient: {
      width: '100%',
      paddingVertical: 20,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      gap: 12,
    },
    submitButtonText: {
      fontSize: 18,
      fontWeight: '900' as const,
      color: '#FFFFFF',
      letterSpacing: 0.8,
    },
    submitButtonDisabled: {
      shadowColor: '#000',
      shadowOpacity: 0.1,
    },
    infoCard: {
      backgroundColor: '#1E293B',
      borderRadius: 20,
      padding: 20,
      marginBottom: 24,
      borderWidth: 2,
      borderColor: `${colors.warning}40`,
    },
    infoRow: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 12,
      marginBottom: 12,
    },
    infoRowLast: {
      marginBottom: 0,
    },
    infoIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: `${colors.warning}20`,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    infoText: {
      flex: 1,
      fontSize: 14,
      color: '#CBD5E1',
      fontWeight: '600' as const,
      lineHeight: 20,
    },
    successOverlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.98)',
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      padding: 24,
      zIndex: 1000,
    },
    successContent: {
      backgroundColor: '#1E293B',
      borderRadius: 32,
      padding: 32,
      width: '100%',
      maxWidth: 400,
      alignItems: 'center' as const,
      borderWidth: 3,
      borderColor: colors.success,
      shadowColor: colors.success,
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.6,
      shadowRadius: 32,
      elevation: 16,
    },
    successIconContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.success,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginBottom: 24,
      shadowColor: colors.success,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 10,
    },
    successTitle: {
      fontSize: 28,
      fontWeight: '900' as const,
      color: '#FFFFFF',
      textAlign: 'center' as const,
      marginBottom: 16,
      letterSpacing: 0.5,
    },
    successMessage: {
      fontSize: 15,
      color: '#94A3B8',
      textAlign: 'center' as const,
      lineHeight: 22,
      marginBottom: 28,
      fontWeight: '600' as const,
    },
    successStepsTitle: {
      fontSize: 18,
      fontWeight: '800' as const,
      color: '#FFFFFF',
      marginBottom: 16,
      alignSelf: 'flex-start' as const,
    },
    successStep: {
      flexDirection: 'row' as const,
      alignItems: 'flex-start' as const,
      marginBottom: 16,
      alignSelf: 'stretch' as const,
    },
    successStepNumber: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.success,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginRight: 12,
    },
    successStepNumberText: {
      fontSize: 15,
      fontWeight: '900' as const,
      color: '#FFFFFF',
    },
    successStepText: {
      fontSize: 14,
      color: '#CBD5E1',
      flex: 1,
      lineHeight: 20,
      fontWeight: '600' as const,
      paddingTop: 6,
    },
    successButton: {
      backgroundColor: colors.success,
      borderRadius: 20,
      paddingVertical: 18,
      paddingHorizontal: 48,
      marginTop: 24,
      shadowColor: colors.success,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.6,
      shadowRadius: 16,
      elevation: 10,
    },
    successButtonText: {
      fontSize: 17,
      fontWeight: '900' as const,
      color: '#FFFFFF',
      letterSpacing: 0.5,
    },

  });

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Donate Clothes",
          headerStyle: {
            backgroundColor: '#0F172A',
          },
          headerTintColor: '#FFFFFF',
          headerTransparent: false,
        }}
      />

      <ExpoLinearGradient
        colors={['#0F172A', '#1E293B', '#0F172A']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      <SafeAreaView style={styles.scrollView} edges={['bottom']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.headerCard}>
              <ExpoLinearGradient
                colors={[`${colors.warning}30`, `${colors.warning}10`, 'transparent']}
                style={styles.headerCardBackground}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View style={styles.iconGlow} />
              <Animated.View style={[styles.iconContainer, { transform: [{ scale: heartPulse }] }]}>
                <Heart size={56} color={colors.warning} strokeWidth={2.5} fill={colors.warning} />
              </Animated.View>
              <Text style={styles.headerTitle}>Share the Warmth</Text>
              <Text style={styles.headerSubtitle}>
                Your clothes will bring joy to families in need
              </Text>
              <Text style={styles.impactText}>✨ Making a difference, one piece at a time ✨</Text>
            </View>

            <View style={styles.counterCard}>
              <Text style={styles.counterLabel}>How many items?</Text>
              <View style={styles.counterRow}>
                <TouchableOpacity
                  style={[
                    styles.counterButton,
                    styles.counterButtonMinus,
                    itemCount === 0 && styles.counterButtonDisabled
                  ]}
                  onPress={handleDecrement}
                  disabled={itemCount === 0}
                  activeOpacity={0.7}
                >
                  <Minus size={32} color="#FFFFFF" strokeWidth={3} />
                </TouchableOpacity>
                <Animated.Text style={[styles.counterValue, { transform: [{ scale: scaleAnim }] }]}>
                  {itemCount}
                </Animated.Text>
                <TouchableOpacity
                  style={[styles.counterButton, styles.counterButtonPlus]}
                  onPress={handleIncrement}
                  activeOpacity={0.7}
                >
                  <Plus size={32} color="#FFFFFF" strokeWidth={3} />
                </TouchableOpacity>
              </View>
              {itemCount > 0 && (
                <Text style={styles.counterImpactMessage}>{getImpactMessage()}</Text>
              )}
            </View>

            <View style={styles.beneficiariesSection}>
              <Text style={styles.beneficiariesTitle}>Who Will Benefit?</Text>
              <View style={styles.beneficiariesGrid}>
                <View style={styles.beneficiaryCard}>
                  <View style={styles.beneficiaryIcon}>
                    <Users size={28} color={colors.warning} strokeWidth={2.5} />
                  </View>
                  <Text style={styles.beneficiaryLabel}>Families</Text>
                  <Text style={styles.beneficiaryDescription}>Parents & children seeking dignity</Text>
                </View>
                <View style={styles.beneficiaryCard}>
                  <View style={styles.beneficiaryIcon}>
                    <Home size={28} color={colors.warning} strokeWidth={2.5} />
                  </View>
                  <Text style={styles.beneficiaryLabel}>Communities</Text>
                  <Text style={styles.beneficiaryDescription}>Local shelters & charities</Text>
                </View>
                <View style={styles.beneficiaryCard}>
                  <View style={styles.beneficiaryIcon}>
                    <Baby size={28} color={colors.warning} strokeWidth={2.5} />
                  </View>
                  <Text style={styles.beneficiaryLabel}>Children</Text>
                  <Text style={styles.beneficiaryDescription}>Kids needing warm clothing</Text>
                </View>
                <View style={styles.beneficiaryCard}>
                  <View style={styles.beneficiaryIcon}>
                    <Smile size={28} color={colors.warning} strokeWidth={2.5} />
                  </View>
                  <Text style={styles.beneficiaryLabel}>Individuals</Text>
                  <Text style={styles.beneficiaryDescription}>People starting fresh</Text>
                </View>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Sparkles size={20} color={colors.warning} strokeWidth={2.5} />
                </View>
                <Text style={styles.infoText}>We&apos;ll collect during your next ironing pickup</Text>
              </View>
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <CheckCircle2 size={20} color={colors.warning} strokeWidth={2.5} />
                </View>
                <Text style={styles.infoText}>All items are sorted and quality-checked</Text>
              </View>
              <View style={[styles.infoRow, styles.infoRowLast]}>
                <View style={styles.infoIcon}>
                  <Heart size={20} color={colors.warning} strokeWidth={2.5} fill={colors.warning} />
                </View>
                <Text style={styles.infoText}>Donated to verified local charities & families</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, itemCount === 0 && styles.submitButtonDisabled]}
              onPress={handleCreateDonation}
              activeOpacity={0.85}
              disabled={itemCount === 0}
            >
              <ExpoLinearGradient
                colors={itemCount > 0 ? ['#22C55E', '#16A34A', '#15803D'] : ['#334155', '#334155']}
                style={styles.submitButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Heart size={24} color="#FFFFFF" strokeWidth={2.5} fill="#FFFFFF" />
                <Text style={styles.submitButtonText}>
                  {itemCount === 0 ? 'Select Items to Donate' : `Donate ${itemCount} ${itemCount === 1 ? 'Item' : 'Items'}`}
                </Text>
              </ExpoLinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      {showSuccessModal && (
        <View style={styles.successOverlay}>
          <View style={styles.successContent}>
            <View style={styles.successIconContainer}>
              <CheckCircle2 size={56} color="#FFFFFF" strokeWidth={3} />
            </View>
            <Text style={styles.successTitle}>Donation Scheduled!</Text>
            <Text style={styles.successMessage}>
              Your kindness will touch the lives of people in need. Thank you for making the world a better place!
            </Text>
            <Text style={styles.successStepsTitle}>What happens next:</Text>
            <View style={styles.successStep}>
              <View style={styles.successStepNumber}>
                <Text style={styles.successStepNumberText}>1</Text>
              </View>
              <Text style={styles.successStepText}>We&apos;ll collect your items during your next service</Text>
            </View>
            <View style={styles.successStep}>
              <View style={styles.successStepNumber}>
                <Text style={styles.successStepNumberText}>2</Text>
              </View>
              <Text style={styles.successStepText}>Items are carefully sorted and quality-checked</Text>
            </View>
            <View style={styles.successStep}>
              <View style={styles.successStepNumber}>
                <Text style={styles.successStepNumberText}>3</Text>
              </View>
              <Text style={styles.successStepText}>Distributed to verified charities & families in need</Text>
            </View>
            <TouchableOpacity
              style={styles.successButton}
              onPress={handleSuccessClose}
              activeOpacity={0.85}
            >
              <Text style={styles.successButtonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
