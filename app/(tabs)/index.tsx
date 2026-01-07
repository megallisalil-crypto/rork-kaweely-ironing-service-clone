import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, Animated, Modal, FlatList, Platform } from "react-native";
import { Stack, useRouter } from "expo-router";
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { Audio } from 'expo-av';
import { Shirt, Clock, Sparkles, CheckCircle2, Gift, Tag, Cake, Moon, Flag, Heart, Calendar as CalendarIcon, ArrowRight, Plus, Zap, X, TrendingUp, Crown, Power, PowerOff, Award } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useOffers } from "@/contexts/OffersContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";


import WhatToWearModal from "@/components/WhatToWearModal";
import { CreateOrderModal } from "@/components/CreateOrderModal";
import { QuickActionsModal } from "@/components/QuickActionsModal";
import { WhyChooseModal } from "@/components/WhyChooseModal";
import { ReminderModal } from "@/components/ReminderModal";
import { SOSModal } from "@/components/SOSModal";
import { ParticleSystem } from "@/components/ParticleSystem";
import { FloatingElements } from "@/components/FloatingElements";
import { AnimatedPressable } from "@/components/AnimatedPressable";
import { PageTransition } from "@/components/PageTransition";
import { CelebrationAnimation } from "@/components/CelebrationAnimation";
import { SOSButton } from "@/components/SOSButton";

import { useRef, useEffect, useState, useMemo } from "react";
import { getHomePlans } from "@/constants/subscriptionPlans";

const { width } = Dimensions.get("window");
const isGlassAvailable = Platform.OS === 'ios' && isLiquidGlassAvailable();

const iconMap: Record<string, typeof Tag> = {
  tag: Tag,
  cake: Cake,
  moon: Moon,
  flag: Flag,
  heart: Heart,
  sparkles: Sparkles,
  calendar: CalendarIcon,
};

export default function HomeScreen() {
  const router = useRouter();

  const { activeOffers } = useOffers();
  const { t } = useLanguage();
  const { colors } = useTheme();
  const { format } = useCurrency();

  const subscriptionPlans = useMemo(() => getHomePlans(), []);
  const subscriptionCards = useMemo(() => subscriptionPlans.map((plan, index) => ({
    id: plan.id,
    title: plan.title,
    price: format(plan.finalPrice),
    badge: plan.badge || '',
    gradient: plan.gradient,
    iconBg: plan.iconBg,
    iconIndex: index,
    features: plan.features,
  })), [format, subscriptionPlans]);
  const logoUrl = "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/8nlam6zuq1umfi1sxbk5q";
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowOpacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const buttonGlowAnim = useRef(new Animated.Value(0)).current;
  const ironButtonScaleAnim = useRef(new Animated.Value(1)).current;
  const ironButtonGlowAnim = useRef(new Animated.Value(0)).current;
  const ironButtonRippleAnim = useRef(new Animated.Value(0)).current;
  const ironFloatAnim = useRef(new Animated.Value(0)).current;
  const ironRotateAnim = useRef(new Animated.Value(0)).current;
  const steamOpacityAnim = useRef(new Animated.Value(0)).current;
  const [currentBorderColors, setCurrentBorderColors] = useState([colors.accent, colors.tint, '#10B981', colors.accent]);
  const subscriptionCardScroll = useRef<FlatList>(null);
  const [activeSubscriptionCard, setActiveSubscriptionCard] = useState(0);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showWhyChoose, setShowWhyChoose] = useState(false);
  const [showSubscriptionPanel, setShowSubscriptionPanel] = useState(false);
  const [showWhatToWear, setShowWhatToWear] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const { isAppActive, toggleAppActive } = useTheme();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastIcon, setToastIcon] = useState<'on' | 'off'>('on');
  const toastOpacityAnim = useRef(new Animated.Value(0)).current;
  const toastTranslateYAnim = useRef(new Animated.Value(-50)).current;
  const toastScaleAnim = useRef(new Animated.Value(0.8)).current;
  const [toggleOnSound, setToggleOnSound] = useState<Audio.Sound | null>(null);
  const [toggleOffSound, setToggleOffSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadTimeout = setTimeout(() => {
      if (isMounted) {
        console.log('[Home] Audio loading timeout reached - continuing without sounds');
      }
    }, 3000);

    async function loadSounds() {
      try {
        console.log('[Home] Loading toggle sounds...');
        
        if (Platform.OS !== 'web') {
          await Promise.race([
            Audio.setAudioModeAsync({
              playsInSilentModeIOS: true,
              staysActiveInBackground: false,
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Audio mode timeout')), 2000))
          ]);
        }

        const onSoundPromise = Audio.Sound.createAsync(
          { uri: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3' },
          { shouldPlay: false }
        );

        const offSoundPromise = Audio.Sound.createAsync(
          { uri: 'https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3' },
          { shouldPlay: false }
        );

        const results = await Promise.allSettled([
          Promise.race([onSoundPromise, new Promise((_, reject) => setTimeout(() => reject(new Error('Sound timeout')), 2000))]),
          Promise.race([offSoundPromise, new Promise((_, reject) => setTimeout(() => reject(new Error('Sound timeout')), 2000))])
        ]);

        if (isMounted) {
          if (results[0].status === 'fulfilled') {
            setToggleOnSound((results[0].value as any).sound);
          }
          if (results[1].status === 'fulfilled') {
            setToggleOffSound((results[1].value as any).sound);
          }
          console.log('[Home] Toggle sounds loaded successfully');
        }
      } catch (error) {
        console.error('[Home] Error loading sounds:', error);
      } finally {
        clearTimeout(loadTimeout);
      }
    }

    loadSounds();

    return () => {
      isMounted = false;
      clearTimeout(loadTimeout);
      if (toggleOnSound) {
        console.log('[Home] Unloading toggle on sound');
        toggleOnSound.unloadAsync().catch(() => {});
      }
      if (toggleOffSound) {
        console.log('[Home] Unloading toggle off sound');
        toggleOffSound.unloadAsync().catch(() => {});
      }
    };
  }, [toggleOnSound, toggleOffSound]);


  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.12,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacityAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacityAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonGlowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(buttonGlowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(ironFloatAnim, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(ironFloatAnim, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(ironRotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(ironRotateAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(steamOpacityAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(steamOpacityAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(ironButtonGlowAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(ironButtonGlowAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scaleAnim, glowOpacityAnim, rotateAnim, buttonGlowAnim, ironFloatAnim, ironRotateAnim, steamOpacityAnim, ironButtonGlowAnim, pulseAnim]);

  useEffect(() => {
    const colorCycle = setInterval(() => {
      setCurrentBorderColors(prev => [
        prev[1], prev[2], prev[3], prev[0]
      ]);
    }, 2000);
    return () => clearInterval(colorCycle);
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    backgroundImage: {
      flex: 1,
      backgroundColor: '#FAFAFA',
    },
    backgroundOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'transparent',
    },
    scrollView: {
      flex: 1,
    },
    heroContainer: {
      width: width,
      paddingTop: 32,
      paddingBottom: 24,
      backgroundColor: 'transparent',
      position: 'relative' as const,
      overflow: 'visible' as const,
    },
    heroBackdrop: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.8,
    },
    heroGradient: {
      alignItems: "center",
      paddingHorizontal: 20,
    },
    logoContainer: {
      width: 110,
      height: 110,
      marginBottom: 20,
      borderRadius: 55,
      position: 'relative' as const,
      shadowColor: '#14B8A6',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 8,
    },
    logoOuterRing: {
      position: 'absolute' as const,
      width: 110,
      height: 110,
      borderRadius: 55,
      borderWidth: 3,
      borderColor: 'transparent',
    },
    logoGlassLayer: {
      position: 'absolute' as const,
      width: 110,
      height: 110,
      borderRadius: 55,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderWidth: 1,
      borderColor: 'rgba(20, 184, 166, 0.15)',
      overflow: 'hidden' as const,
    },
    logoGlassShine: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      height: '40%',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      borderTopLeftRadius: 55,
      borderTopRightRadius: 55,
    },
    logoInnerGlow: {
      position: 'absolute' as const,
      width: 110,
      height: 110,
      borderRadius: 55,
      top: 0,
      left: 0,
    },
    logoContentWrapper: {
      position: 'absolute' as const,
      width: 104,
      height: 104,
      borderRadius: 52,
      top: 3,
      left: 3,
      backgroundColor: 'rgba(255, 255, 255, 1)',
      backdropFilter: 'blur(20px)' as any,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      overflow: 'hidden' as const,
      borderWidth: 0,
      borderColor: 'transparent',
    },
    logoGradientOverlay: {
      position: 'absolute' as const,
      width: '100%',
      height: '100%',
      opacity: 0.3,
    },
    logo: {
      width: 75,
      height: 75,
      zIndex: 2,
    },
    logoSparkle: {
      position: 'absolute' as const,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
    },
    heroTitle: {
      fontSize: 20,
      fontWeight: "800" as const,
      color: '#0F172A',
      marginBottom: 4,
      letterSpacing: 0.3,
      textShadowColor: 'transparent',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 0,
    },
    kaweelyButtonContainer: {
      marginTop: 0,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      paddingRight: 68,
    },
    kaweelyButton: {
      paddingHorizontal: 36,
      paddingVertical: 12,
      borderRadius: 24,
      backgroundColor: '#FFFFFF',
      borderWidth: 2.5,
      borderColor: '#EF4444',
      shadowColor: '#EF4444',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 6,
      position: 'relative' as const,
      overflow: 'hidden' as const,
    },
    kaweelyButtonActive: {
      backgroundColor: '#FFFFFF',
      borderColor: '#14B8A6',
      shadowColor: '#14B8A6',
      shadowOpacity: 0.2,
    },
    kaweelyButtonGlow: {
      position: 'absolute' as const,
      top: -50,
      left: -50,
      right: -50,
      bottom: -50,
      backgroundColor: '#EF4444',
      borderRadius: 100,
    },
    kaweelyButtonGlowActive: {
      backgroundColor: '#10B981',
    },
    kaweelyButtonText: {
      fontSize: 26,
      fontWeight: '900' as const,
      color: '#EF4444',
      letterSpacing: 1,
      textTransform: 'capitalize' as const,
      textShadowColor: 'transparent',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 0,
      zIndex: 2,
    },
    kaweelyButtonTextActive: {
      color: '#14B8A6',
      textShadowColor: 'transparent',
      textShadowRadius: 0,
    },
    heroSubtitle: {
      fontSize: 15,
      color: '#64748B',
      fontWeight: "600" as const,
      textAlign: "center",
      lineHeight: 22,
      paddingHorizontal: 32,
      marginTop: 2,
      textShadowColor: 'transparent',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 0,
    },
    heroDivider: {
      width: 60,
      height: 4,
      backgroundColor: '#14B8A6',
      borderRadius: 2,
      marginVertical: 12,
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    heroTagline: {
      fontSize: 13,
      color: '#0F172A',
      fontWeight: "700" as const,
      textAlign: "center",
      letterSpacing: 1.2,
      textTransform: 'uppercase' as const,
      textShadowColor: 'transparent',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 0,
    },
    ironContainer: {
      position: 'absolute' as const,
      top: 80,
      right: -20,
      width: 140,
      height: 140,
      zIndex: 1,
    },
    ironButtonContainer: {
      position: 'absolute' as const,
      top: '58%',
      left: '28%',
      width: 44,
      height: 44,
      borderRadius: 22,
      zIndex: 3,
    },
    ironButton: {
      width: '100%',
      height: '100%',
      borderRadius: 22,
      backgroundColor: '#FFFFFF',
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      borderWidth: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 10,
      overflow: 'hidden' as const,
    },
    ironButtonActive: {
      backgroundColor: '#14B8A6',
      borderColor: '#0D9488',
      shadowColor: '#14B8A6',
      shadowOpacity: 0.7,
    },
    ironButtonInactive: {
      backgroundColor: '#F3F4F6',
      borderColor: '#D1D5DB',
      shadowColor: '#000',
      shadowOpacity: 0.3,
    },
    ironButtonGlow: {
      position: 'absolute' as const,
      top: -20,
      left: -20,
      right: -20,
      bottom: -20,
      borderRadius: 50,
    },
    ironButtonRipple: {
      position: 'absolute' as const,
      width: '100%',
      height: '100%',
      borderRadius: 22,
      borderWidth: 2,
    },
    ironWrapper: {
      position: 'relative' as const,
      width: '100%',
      height: '100%',
      shadowColor: '#14B8A6',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.4,
      shadowRadius: 20,
      elevation: 12,
    },
    ironImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain' as const,
    },
    ironGlow: {
      position: 'absolute' as const,
      top: '25%',
      left: '25%',
      width: '50%',
      height: '50%',
      borderRadius: 100,
      backgroundColor: '#14B8A6',
    },
    steamParticle: {
      position: 'absolute' as const,
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: 'rgba(20, 184, 166, 0.4)',
    },
    content: {
      padding: 16,
    },
    section: {
      marginBottom: 16,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    sectionHeaderLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    sectionIconBg: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#FFFFFF',
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 0,
      borderColor: 'transparent',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 5,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: "800" as const,
      color: '#0F172A',
      textShadowColor: 'transparent',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 0,
      letterSpacing: 0.3,
    },
    offersSection: {
      marginBottom: 16,
    },
    offersScroll: {
      marginHorizontal: -20,
      paddingHorizontal: 20,
    },
    offerCard: {
      width: 300,
      borderRadius: 24,
      padding: 20,
      marginRight: 16,
      overflow: 'hidden' as const,
      borderWidth: isGlassAvailable ? 0 : 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      backgroundColor: isGlassAvailable ? 'transparent' : 'rgba(26, 26, 26, 0.8)',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.5,
      shadowRadius: 20,
      elevation: 15,
    },
    offerCardGlass: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 24,
    },
    offerCardContent: {
      position: 'relative' as const,
      zIndex: 2,
    },
    offerHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    offerIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: "rgba(255, 255, 255, 0.25)",
      justifyContent: "center",
      alignItems: "center",
    },
    offerBadge: {
      backgroundColor: "#FFFFFF",
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    offerBadgeText: {
      fontSize: 12,
      fontWeight: "800" as const,
      color: '#1a1a1a',
    },
    offerTitle: {
      fontSize: 18,
      fontWeight: "800" as const,
      color: "#FFFFFF",
      marginBottom: 8,
    },
    offerDescription: {
      fontSize: 12,
      color: "rgba(255, 255, 255, 0.95)",
      lineHeight: 17,
      marginBottom: 10,
    },
    offerFooter: {
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: "rgba(255, 255, 255, 0.3)",
    },
    offerValidity: {
      fontSize: 10,
      color: "rgba(255, 255, 255, 0.9)",
      fontWeight: "600" as const,
    },
    createOrderButton: {
      backgroundColor: '#FFFFFF',
      borderRadius: 24,
      marginBottom: 16,
      overflow: 'hidden' as const,
      position: 'relative' as const,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 6,
      borderWidth: 2,
      borderColor: 'rgba(20, 184, 166, 0.12)',
    },
    createOrderButtonGlass: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 28,
    },
    createOrderButtonGlowOld: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#10B981',
      opacity: isGlassAvailable ? 0.2 : 0.1,
    },
    createOrderButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 22,
      paddingHorizontal: 20,
      gap: 16,
    },
    createOrderIconWrapper: {
      position: 'relative' as const,
    },
    createOrderIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#14B8A6',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#14B8A6',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 6,
    },
    createOrderIconBadge: {
      position: 'absolute' as const,
      top: -3,
      right: -3,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: '#EF4444',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2.5,
      borderColor: '#FFFFFF',
    },
    createOrderTextWrapper: {
      flex: 1,
    },
    createOrderTitle: {
      fontSize: 18,
      fontWeight: '800' as const,
      color: '#0F172A',
      marginBottom: 4,
      letterSpacing: 0.3,
    },
    createOrderSubtitle: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: '#64748B',
      letterSpacing: 0.1,
    },
    quickActionsButton: {
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      marginBottom: 14,
      overflow: 'hidden' as const,
      position: 'relative' as const,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
      borderWidth: 1.5,
      borderColor: 'rgba(251, 146, 60, 0.15)',
    },
    whyChooseButton: {
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      marginBottom: 20,
      overflow: 'hidden' as const,
      position: 'relative' as const,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
      borderWidth: 1.5,
      borderColor: 'rgba(168, 85, 247, 0.15)',
    },
    subscribeQuickButton: {
      borderRadius: 24,
      marginBottom: 16,
      overflow: 'hidden' as const,
      shadowColor: '#10B981',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 20,
      elevation: 12,
      borderWidth: 3,
      borderColor: 'rgba(16, 185, 129, 0.3)',
    },
    subscribeQuickButtonGradient: {
      width: '100%',
    },
    subscribeQuickButtonContent: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingVertical: 20,
      paddingHorizontal: 20,
    },
    subscribeQuickIconWrapper: {
      position: 'relative' as const,
      marginRight: 16,
    },
    subscribeQuickIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#FFFFFF',
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    subscribeQuickIconBadge: {
      position: 'absolute' as const,
      top: -4,
      right: -4,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: '#FFFFFF',
      borderWidth: 2,
      borderColor: '#FFFFFF',
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      shadowColor: '#10B981',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.6,
      shadowRadius: 8,
      elevation: 6,
    },
    subscribeQuickTextWrapper: {
      flex: 1,
    },
    subscribeQuickTitle: {
      fontSize: 17,
      fontWeight: '800' as const,
      color: '#FFFFFF',
      marginBottom: 4,
      letterSpacing: 0.3,
    },
    subscribeQuickSubtitle: {
      fontSize: 13,
      fontWeight: '600' as const,
      color: 'rgba(255, 255, 255, 0.9)',
      letterSpacing: 0.2,
    },
    viewAllText: {
      fontSize: 14,
      fontWeight: '700' as const,
      color: '#14B8A6',
    },
    subscriptionCarouselSection: {
      marginBottom: 24,
    },
    subscriptionCard: {
      width: width - 40,
      marginHorizontal: 20,
      borderRadius: 32,
      overflow: 'hidden' as const,
      borderWidth: isGlassAvailable ? 2 : 0,
      borderColor: 'rgba(255, 255, 255, 0.15)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 18 },
      shadowOpacity: 0.6,
      shadowRadius: 30,
      elevation: 20,
    },
    subscriptionCardGlass: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 32,
    },
    subscriptionCardGradient: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    subscriptionCardContent: {
      padding: 24,
    },
    subscriptionCardHeader: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      marginBottom: 20,
    },
    subscriptionCardIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    subscriptionCardBadge: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    subscriptionCardBadgeText: {
      fontSize: 10,
      fontWeight: '900' as const,
      color: '#000000',
      letterSpacing: 0.5,
    },
    subscriptionCardTitle: {
      fontSize: 28,
      fontWeight: '900' as const,
      color: '#FFFFFF',
      marginBottom: 6,
      letterSpacing: -0.5,
    },
    subscriptionCardPrice: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: 'rgba(255, 255, 255, 0.9)',
      marginBottom: 24,
    },
    subscriptionCardFeatures: {
      gap: 10,
      marginBottom: 24,
    },
    subscriptionCardFeature: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 10,
    },
    subscriptionCardFeatureText: {
      fontSize: 13,
      fontWeight: '600' as const,
      color: 'rgba(255, 255, 255, 0.95)',
      flex: 1,
      flexWrap: 'wrap' as const,
    },
    subscriptionCardButton: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      gap: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingVertical: 14,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: 'rgba(255, 255, 255, 0.4)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 6,
    },
    subscriptionCardButtonText: {
      fontSize: 15,
      fontWeight: '800' as const,
      color: '#FFFFFF',
      letterSpacing: 0.3,
    },
    subscriptionCardIndicators: {
      flexDirection: 'row' as const,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      gap: 8,
      marginTop: 20,
    },
    subscriptionCardIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#2a2a2a',
    },
    subscriptionCardIndicatorActive: {
      width: 24,
      backgroundColor: colors.accent,
    },
    subscriptionPanelOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      justifyContent: 'flex-end',
    },
    subscriptionPanelContent: {
      backgroundColor: '#000000',
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      paddingTop: 24,
      paddingBottom: 40,
      paddingHorizontal: 24,
      borderTopWidth: 3,
      borderLeftWidth: 3,
      borderRightWidth: 3,
      borderColor: colors.accent,
      maxHeight: '85%',
    },
    subscriptionPanelHeader: {
      alignItems: 'center',
      marginBottom: 24,
      paddingBottom: 20,
      borderBottomWidth: 2,
      borderBottomColor: `${colors.accent}30`,
    },
    subscriptionPanelDragIndicator: {
      width: 50,
      height: 5,
      backgroundColor: `${colors.accent}60`,
      borderRadius: 3,
      marginBottom: 20,
    },
    subscriptionPanelIconContainer: {
      width: 90,
      height: 90,
      borderRadius: 45,
      backgroundColor: `${colors.accent}20`,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      borderWidth: 3,
      borderColor: colors.accent,
      shadowColor: colors.accent,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.6,
      shadowRadius: 20,
      elevation: 10,
    },
    subscriptionPanelTitle: {
      fontSize: 24,
      fontWeight: '900' as const,
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: 8,
      letterSpacing: 0.5,
    },
    subscriptionPanelSubtitle: {
      fontSize: 14,
      color: '#888888',
      textAlign: 'center',
      lineHeight: 20,
      fontWeight: '600' as const,
    },
    subscriptionPanelBody: {
      gap: 16,
    },
    subscriptionFeatureCard: {
      backgroundColor: '#1a1a1a',
      borderRadius: 16,
      padding: 18,
      borderWidth: 2,
      borderColor: `${colors.accent}30`,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },
    subscriptionFeatureIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: `${colors.accent}15`,
      alignItems: 'center',
      justifyContent: 'center',
    },
    subscriptionFeatureContent: {
      flex: 1,
    },
    subscriptionFeatureTitle: {
      fontSize: 15,
      fontWeight: '800' as const,
      color: '#FFFFFF',
      marginBottom: 4,
    },
    subscriptionFeatureDesc: {
      fontSize: 12,
      color: '#888888',
      lineHeight: 17,
      fontWeight: '600' as const,
    },
    subscriptionPanelButton: {
      backgroundColor: colors.accent,
      borderRadius: 16,
      paddingVertical: 18,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      marginTop: 24,
      shadowColor: colors.accent,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.6,
      shadowRadius: 16,
      elevation: 10,
    },
    subscriptionPanelButtonText: {
      fontSize: 17,
      fontWeight: '900' as const,
      color: '#000000',
      letterSpacing: 0.5,
    },
    subscriptionPanelCloseButton: {
      position: 'absolute' as const,
      top: 24,
      right: 24,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: `${colors.error}20`,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: colors.error,
    },
    toastContainer: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      elevation: 100,
      pointerEvents: 'none' as const,
    },
    toast: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      backgroundColor: isGlassAvailable ? 'transparent' : '#1a1a1a',
      paddingVertical: 18,
      paddingHorizontal: 26,
      borderRadius: 24,
      borderWidth: isGlassAvailable ? 2 : 3,
      overflow: 'hidden' as const,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.6,
      shadowRadius: 24,
      elevation: 20,
    },
    toastGlass: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 24,
    },
    toastOn: {
      borderColor: colors.accent,
      backgroundColor: `${colors.accent}20`,
    },
    toastOff: {
      borderColor: '#666666',
      backgroundColor: '#2a2a2a',
    },
    toastIconWrapper: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    toastIconWrapperOn: {
      backgroundColor: colors.accent,
    },
    toastIconWrapperOff: {
      backgroundColor: '#555555',
    },
    toastText: {
      flex: 1,
      fontSize: 18,
      fontWeight: '900' as const,
      letterSpacing: 0.5,
    },
    toastTextOn: {
      color: colors.accent,
    },
    toastTextOff: {
      color: '#999999',
    },

  });

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: t.home.title,
          headerStyle: {
            backgroundColor: '#FAFAFA',
          },
          headerTintColor: '#0F172A',
          headerTransparent: false,
        }}
      />
      
      <ParticleSystem count={8} />
      <FloatingElements count={3} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.heroContainer}>
          <ExpoLinearGradient
            colors={['rgba(20, 184, 166, 0.05)', 'rgba(251, 146, 60, 0.04)', 'rgba(168, 85, 247, 0.03)']}
            style={styles.heroBackdrop}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <Animated.View style={[
            styles.ironContainer,
            {
              transform: [
                { 
                  translateY: ironFloatAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -15]
                  })
                },
                { 
                  rotate: ironRotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['-3deg', '3deg']
                  })
                }
              ]
            }
          ]}>
            <View style={styles.ironWrapper}>
              <Animated.View style={[
                styles.ironGlow,
                {
                  opacity: steamOpacityAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.2, 0.6]
                  }),
                  transform: [{
                    scale: steamOpacityAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1.3]
                    })
                  }]
                }
              ]} />
              <Image
                source={{ uri: 'https://r2-pub.rork.com/generated-images/015a7bbb-8762-4a72-9d6a-504d1f58c799.png' }}
                style={styles.ironImage}
              />
              <Animated.View style={[
                styles.steamParticle,
                {
                  bottom: '45%',
                  left: '35%',
                  opacity: steamOpacityAnim,
                  transform: [{
                    translateY: steamOpacityAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -20]
                    })
                  }]
                }
              ]} />
              <Animated.View style={[
                styles.steamParticle,
                {
                  bottom: '48%',
                  left: '42%',
                  opacity: steamOpacityAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 1]
                  }),
                  transform: [{
                    translateY: steamOpacityAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -25]
                    })
                  }]
                }
              ]} />
              <Animated.View style={[
                styles.steamParticle,
                {
                  bottom: '46%',
                  left: '50%',
                  opacity: steamOpacityAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.2, 0.8]
                  }),
                  transform: [{
                    translateY: steamOpacityAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -18]
                    })
                  }]
                }
              ]} />

              <View style={styles.ironButtonContainer}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPressIn={() => {
                    Animated.spring(ironButtonScaleAnim, {
                      toValue: 0.88,
                      useNativeDriver: true,
                      friction: 4,
                      tension: 100,
                    }).start();
                  }}
                  onPressOut={() => {
                    Animated.spring(ironButtonScaleAnim, {
                      toValue: 1,
                      useNativeDriver: true,
                      friction: 4,
                      tension: 100,
                    }).start();
                  }}
                  onPress={async () => {
                    ironButtonRippleAnim.setValue(0);
                    Animated.timing(ironButtonRippleAnim, {
                      toValue: 1,
                      duration: 600,
                      useNativeDriver: true,
                    }).start();

                    toggleAppActive();
                    const newState = !isAppActive;
                    
                    try {
                      if (newState) {
                        if (toggleOnSound) {
                          await toggleOnSound.replayAsync();
                          console.log('[Home] Played toggle ON sound');
                        }
                      } else {
                        if (toggleOffSound) {
                          await toggleOffSound.replayAsync();
                          console.log('[Home] Played toggle OFF sound');
                        }
                      }
                    } catch (error) {
                      console.error('[Home] Error playing sound:', error);
                    }
                    
                    if (!newState) {
                      setToastMessage('Kaweely is now OFF!');
                      setToastIcon('off');
                      setToastVisible(true);
                      
                      Animated.parallel([
                        Animated.spring(toastOpacityAnim, {
                          toValue: 1,
                          useNativeDriver: true,
                          friction: 7,
                          tension: 40,
                        }),
                        Animated.spring(toastTranslateYAnim, {
                          toValue: 0,
                          useNativeDriver: true,
                          friction: 7,
                          tension: 40,
                        }),
                        Animated.spring(toastScaleAnim, {
                          toValue: 1,
                          useNativeDriver: true,
                          friction: 7,
                          tension: 40,
                        }),
                      ]).start();
                      
                      setTimeout(() => {
                        Animated.parallel([
                          Animated.timing(toastOpacityAnim, {
                            toValue: 0,
                            duration: 300,
                            useNativeDriver: true,
                          }),
                          Animated.timing(toastTranslateYAnim, {
                            toValue: -50,
                            duration: 300,
                            useNativeDriver: true,
                          }),
                          Animated.timing(toastScaleAnim, {
                            toValue: 0.8,
                            duration: 300,
                            useNativeDriver: true,
                          }),
                        ]).start(() => {
                          setToastVisible(false);
                          toastTranslateYAnim.setValue(-50);
                          toastScaleAnim.setValue(0.8);
                        });
                      }, 2500);
                    }
                    
                    console.log(`[Home] Kaweely ${newState ? 'activated' : 'deactivated'}`);
                  }}
                >
                  <Animated.View style={[
                    styles.ironButton,
                    isAppActive ? styles.ironButtonActive : styles.ironButtonInactive,
                    {
                      transform: [{ scale: ironButtonScaleAnim }],
                    }
                  ]}>
                    <Animated.View style={[
                      styles.ironButtonGlow,
                      {
                        backgroundColor: isAppActive ? '#10B981' : '#9CA3AF',
                        opacity: ironButtonGlowAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: isAppActive ? [0.3, 0.6] : [0.1, 0.2]
                        }),
                      }
                    ]} />
                    
                    <Animated.View style={[
                      styles.ironButtonRipple,
                      {
                        borderColor: isAppActive ? '#10B981' : '#9CA3AF',
                        opacity: ironButtonRippleAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 0]
                        }),
                        transform: [{
                          scale: ironButtonRippleAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 2.5]
                          })
                        }]
                      }
                    ]} />
                    
                    {isAppActive ? (
                      <Power size={22} color="#FFFFFF" strokeWidth={3} />
                    ) : (
                      <PowerOff size={22} color="#6B7280" strokeWidth={3} />
                    )}
                  </Animated.View>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>

          <View style={styles.heroGradient}>
            <Animated.View style={[
              styles.logoContainer,
              {
                transform: [{ scale: scaleAnim }],
              }
            ]}>
              <Animated.View style={[
                styles.logoOuterRing,
                {
                  borderColor: currentBorderColors[0],
                  opacity: glowOpacityAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.6, 1]
                  })
                }
              ]} />
              
              <Animated.View style={[
                styles.logoInnerGlow,
                {
                  backgroundColor: currentBorderColors[0],
                  opacity: glowOpacityAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.15, 0.4]
                  }),
                  transform: [{
                    rotate: rotateAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg']
                    })
                  }]
                }
              ]} />
              
              <View style={styles.logoGlassLayer}>
                <View style={styles.logoGlassShine} />
              </View>
              
              <View style={styles.logoContentWrapper}>
                <ExpoLinearGradient
                  colors={[
                    'rgba(255, 255, 255, 0.05)',
                    'rgba(20, 184, 166, 0.02)',
                    'rgba(255, 255, 255, 0.05)'
                  ]}
                  style={styles.logoGradientOverlay}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                
                {logoUrl && logoUrl.trim().length > 0 && logoUrl.startsWith('http') ? (
                  <Image
                    source={{ uri: logoUrl }}
                    style={styles.logo}
                    resizeMode="contain"
                    onError={(error) => console.log('[Home] Logo image error:', error.nativeEvent?.error || 'Unknown error')}
                  />
                ) : (
                  <Shirt size={48} color="#14B8A6" strokeWidth={2.5} />
                )}
                
                <Animated.View style={[
                  styles.logoSparkle,
                  {
                    top: 15,
                    right: 20,
                    opacity: glowOpacityAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.2, 0.7]
                    }),
                    transform: [{
                      scale: glowOpacityAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1]
                      })
                    }]
                  }
                ]} />
                
                <Animated.View style={[
                  styles.logoSparkle,
                  {
                    bottom: 25,
                    left: 15,
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    opacity: glowOpacityAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 0.8]
                    }),
                    transform: [{
                      scale: glowOpacityAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0.6]
                      })
                    }]
                  }
                ]} />
              </View>
            </Animated.View>
            
            <View style={styles.kaweelyButtonContainer}>
              <SOSButton 
                compact 
                onPress={() => router.push('/(tabs)/sos')} 
              />

              <Animated.View style={[
                styles.kaweelyButton,
                isAppActive && styles.kaweelyButtonActive,
              ]}>
                <Animated.View style={[
                  styles.kaweelyButtonGlow,
                  isAppActive && styles.kaweelyButtonGlowActive,
                  {
                    opacity: buttonGlowAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.1, 0.3]
                    }),
                    transform: [{
                      scale: buttonGlowAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1.2]
                      })
                    }]
                  }
                ]} />
                <Animated.Text style={[
                  styles.kaweelyButtonText,
                  isAppActive && styles.kaweelyButtonTextActive,
                ]}>
                  {"Kaweely"}
                </Animated.Text>
              </Animated.View>
            </View>
            
            <Text style={styles.heroSubtitle}>{t.home.subtitle}</Text>
            <View style={styles.heroDivider} />
            <Text style={styles.heroTagline}>{t.home.tagline}</Text>
          </View>
        </View>



        {isAppActive && <PageTransition type="slideUp" delay={100}>
        <View style={styles.content}>
          {activeOffers.length > 0 && (
            <View style={styles.offersSection}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionHeaderLeft}>
                  <View style={styles.sectionIconBg}>
                    <Sparkles size={20} color={colors.accent} />
                  </View>
                  <Text style={styles.sectionTitle}>Special Offers</Text>
                </View>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.offersScroll}>
                {activeOffers.map((offer) => {
                  const IconComponent = iconMap[offer.icon] || Tag;
                  return (
                    <View
                      key={offer.id}
                      style={[
                        styles.offerCard,
                        !isGlassAvailable && { backgroundColor: offer.backgroundColor || colors.tint },
                      ]}
                    >
                      {isGlassAvailable && <GlassView style={styles.offerCardGlass} glassEffectStyle="clear" tintColor={offer.backgroundColor || colors.tint} />}
                      <View style={styles.offerCardContent}>
                      <View style={styles.offerHeader}>
                        <View style={styles.offerIconContainer}>
                          <IconComponent size={28} color="#FFFFFF" strokeWidth={2.5} />
                        </View>
                        <View style={styles.offerBadge}>
                          <Text style={styles.offerBadgeText}>{offer.discountPercentage}% OFF</Text>
                        </View>
                      </View>
                      <Text style={styles.offerTitle}>{offer.title}</Text>
                      <Text style={styles.offerDescription}>{offer.description}</Text>
                      <View style={styles.offerFooter}>
                        <Text style={styles.offerValidity}>
                          Until {offer.validUntil.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </Text>
                      </View>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          )}

          <AnimatedPressable
            style={styles.createOrderButton}
            onPress={() => setShowCreateOrder(true)}
            hapticType="medium"
          >
            <View style={styles.createOrderButtonContent}>
              <View style={styles.createOrderIconWrapper}>
                <View style={styles.createOrderIcon}>
                  <Shirt size={26} color="#FFFFFF" strokeWidth={2.5} />
                </View>
                <View style={styles.createOrderIconBadge}>
                  <Plus size={13} color="#FFFFFF" strokeWidth={3.5} />
                </View>
              </View>
              <View style={styles.createOrderTextWrapper}>
                <Text style={styles.createOrderTitle}>Create Your Order</Text>
                <Text style={styles.createOrderSubtitle}>Tap to select garments & services</Text>
              </View>
              <ArrowRight size={20} color="#14B8A6" strokeWidth={2.5} />
            </View>
          </AnimatedPressable>

          <AnimatedPressable
            style={styles.subscribeQuickButton}
            onPress={() => router.push('/(tabs)/subscribe')}
            hapticType="medium"
          >
            <ExpoLinearGradient
              colors={['#10B981', '#059669', '#047857']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.subscribeQuickButtonGradient}
            >
              <View style={styles.subscribeQuickButtonContent}>
                <View style={styles.subscribeQuickIconWrapper}>
                  <View style={styles.subscribeQuickIcon}>
                    <Crown size={28} color="#10B981" strokeWidth={2.5} />
                  </View>
                  <View style={styles.subscribeQuickIconBadge}>
                    <Sparkles size={14} color="#10B981" strokeWidth={3} fill="#10B981" />
                  </View>
                </View>
                <View style={styles.subscribeQuickTextWrapper}>
                  <Text style={styles.subscribeQuickTitle}>Start Saving Time Today!</Text>
                  <Text style={styles.subscribeQuickSubtitle}>Choose your perfect subscription plan</Text>
                </View>
                <Zap size={22} color="#FFFFFF" strokeWidth={2.5} fill="#FFFFFF" />
              </View>
            </ExpoLinearGradient>
          </AnimatedPressable>

          <AnimatedPressable
            style={styles.quickActionsButton}
            onPress={() => setShowQuickActions(true)}
            hapticType="medium"
          >
            <View style={styles.createOrderButtonContent}>
              <View style={styles.createOrderIconWrapper}>
                <View style={[styles.createOrderIcon, { backgroundColor: '#FB923C' }]}>
                  <Zap size={26} color="#FFFFFF" strokeWidth={2.5} />
                </View>
                <View style={[styles.createOrderIconBadge, { backgroundColor: '#FBBF24', borderColor: '#FFFFFF' }]}>
                  <Sparkles size={13} color="#FFFFFF" strokeWidth={3.5} />
                </View>
              </View>
              <View style={styles.createOrderTextWrapper}>
                <Text style={styles.createOrderTitle}>Quick Actions</Text>
                <Text style={styles.createOrderSubtitle}>Rewards, Store, Support & More</Text>
              </View>
              <ArrowRight size={20} color="#FB923C" strokeWidth={2.5} />
            </View>
          </AnimatedPressable>

          <AnimatedPressable
            style={styles.whyChooseButton}
            onPress={() => setShowWhyChoose(true)}
            hapticType="medium"
          >
            <View style={styles.createOrderButtonContent}>
              <View style={styles.createOrderIconWrapper}>
                <View style={[styles.createOrderIcon, { backgroundColor: '#A855F7' }]}>
                  <Award size={26} color="#FFFFFF" strokeWidth={2.5} />
                </View>
              </View>
              <View style={styles.createOrderTextWrapper}>
                <Text style={styles.createOrderTitle}>Why Choose Kaweely?</Text>
                <Text style={styles.createOrderSubtitle}>Discover our premium features</Text>
              </View>
              <ArrowRight size={20} color="#A855F7" strokeWidth={2.5} />
            </View>
          </AnimatedPressable>

          <View style={styles.subscriptionCarouselSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderLeft}>
                <View style={styles.sectionIconBg}>
                  <Crown size={20} color={colors.accent} />
                </View>
                <Text style={styles.sectionTitle}>Premium Plans</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/(tabs)/subscribe')} activeOpacity={0.7}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              ref={subscriptionCardScroll}
              data={subscriptionCards}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToAlignment="center"
              decelerationRate="fast"
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: new Animated.Value(0) } } }],
                { useNativeDriver: false }
              )}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / (width - 40));
                setActiveSubscriptionCard(index);
              }}
              renderItem={({ item }) => {
                const IconComponent = item.iconIndex === 0 ? Shirt : item.iconIndex === 1 ? TrendingUp : Crown;
                return (
                  <TouchableOpacity
                    style={styles.subscriptionCard}
                    activeOpacity={0.9}
                    onPress={() => router.push('/(tabs)/subscribe')}
                  >
                    {isGlassAvailable && <GlassView style={styles.subscriptionCardGlass} glassEffectStyle="regular" />}
                    <ExpoLinearGradient
                      colors={item.gradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.subscriptionCardGradient}
                    />
                    <View style={styles.subscriptionCardContent}>
                      <View style={styles.subscriptionCardHeader}>
                        <View style={[styles.subscriptionCardIcon, { backgroundColor: item.iconBg }]}>
                          <IconComponent size={28} color="#FFFFFF" strokeWidth={2.5} />
                        </View>
                        <View style={styles.subscriptionCardBadge}>
                          <Text style={styles.subscriptionCardBadgeText}>{item.badge}</Text>
                        </View>
                      </View>
                      <Text style={styles.subscriptionCardTitle}>{item.title}</Text>
                      <Text style={styles.subscriptionCardPrice}>{item.price}</Text>
                      <View style={styles.subscriptionCardFeatures}>
                        {item.features.map((feature: string, idx: number) => (
                          <View key={idx} style={styles.subscriptionCardFeature}>
                            <CheckCircle2 size={14} color="#FFFFFF" strokeWidth={2.5} />
                            <Text style={styles.subscriptionCardFeatureText}>{feature}</Text>
                          </View>
                        ))}
                      </View>
                      <TouchableOpacity
                        style={styles.subscriptionCardButton}
                        onPress={() => router.push('/(tabs)/subscribe')}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.subscriptionCardButtonText}>Subscribe Now</Text>
                        <ArrowRight size={16} color="#FFFFFF" strokeWidth={2.5} />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(item) => item.id}
            />
            <View style={styles.subscriptionCardIndicators}>
              {subscriptionCards.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.subscriptionCardIndicator,
                    activeSubscriptionCard === index && styles.subscriptionCardIndicatorActive
                  ]}
                />
              ))}
            </View>
          </View>
        </View>
        </PageTransition>}
      </ScrollView>

      <CreateOrderModal
        visible={showCreateOrder}
        onClose={() => setShowCreateOrder(false)}
      />

      <QuickActionsModal
        visible={showQuickActions}
        onClose={() => setShowQuickActions(false)}
        onActionPress={(action) => {
          setShowQuickActions(false);
          if (action === 'rewards') router.push('/rewards');
          else if (action === 'referrals') router.push('/referrals');
          else if (action === 'store') router.push('/store');
          else if (action === 'tracking') router.push('/(tabs)/tracking');
          else if (action === 'whatToWear') setShowWhatToWear(true);
          else if (action === 'ecoImpact') router.push('/eco-impact');
          else if (action === 'donateClothes') router.push('/donate-clothes');
          else if (action === 'reminders') setShowReminders(true);
          else if (action === 'fabricScan') router.push('/fabric-scan');
          else if (action === 'wardrobe') {
            router.push('/wardrobe');
          }
          else if (action === 'challenges') {
            router.push('/challenges');
          }
        }}
      />

      <WhatToWearModal
        visible={showWhatToWear}
        onClose={() => setShowWhatToWear(false)}
      />

      <WhyChooseModal
        visible={showWhyChoose}
        onClose={() => setShowWhyChoose(false)}
      />

      <ReminderModal
        visible={showReminders}
        onClose={() => setShowReminders(false)}
      />

      <SOSModal
        visible={showSOSModal}
        onClose={() => setShowSOSModal(false)}
        onSuccess={() => {
          console.log('[Home] SOS order created successfully');
          setShowCelebration(true);
        }}
      />

      <CelebrationAnimation
        visible={showCelebration}
        onComplete={() => setShowCelebration(false)}
        type="confetti"
        intensity="high"
      />

      {toastVisible && (
        <Animated.View 
          style={[
            styles.toastContainer,
            {
              opacity: toastOpacityAnim,
              transform: [
                { translateY: toastTranslateYAnim },
                { scale: toastScaleAnim }
              ]
            }
          ]}
        >
          <View style={[
            styles.toast,
            toastIcon === 'on' ? styles.toastOn : styles.toastOff
          ]}>
            {isGlassAvailable && <GlassView style={styles.toastGlass} glassEffectStyle="clear" tintColor={toastIcon === 'on' ? colors.accent : '#555555'} />}
            <View style={[
              styles.toastIconWrapper,
              toastIcon === 'on' ? styles.toastIconWrapperOn : styles.toastIconWrapperOff
            ]}>
              {toastIcon === 'on' ? (
                <Power size={24} color="#FFFFFF" strokeWidth={3} />
              ) : (
                <PowerOff size={24} color="#FFFFFF" strokeWidth={3} />
              )}
            </View>
            <Text style={[
              styles.toastText,
              toastIcon === 'on' ? styles.toastTextOn : styles.toastTextOff
            ]}>
              {toastMessage}
            </Text>
            <View style={[
              styles.toastIconWrapper,
              toastIcon === 'on' ? styles.toastIconWrapperOn : styles.toastIconWrapperOff,
              { width: 36, height: 36, borderRadius: 18 }
            ]}>
              {toastIcon === 'on' ? (
                <Sparkles size={18} color="#FFFFFF" strokeWidth={3} />
              ) : (
                <Moon size={18} color="#FFFFFF" strokeWidth={3} />
              )}
            </View>
          </View>
        </Animated.View>
      )}

      <Modal
        visible={showSubscriptionPanel}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSubscriptionPanel(false)}
      >
        <View style={styles.subscriptionPanelOverlay}>
          <TouchableOpacity 
            style={{ flex: 1 }} 
            activeOpacity={1} 
            onPress={() => setShowSubscriptionPanel(false)}
          />
          <View style={styles.subscriptionPanelContent}>
            <TouchableOpacity
              style={styles.subscriptionPanelCloseButton}
              onPress={() => setShowSubscriptionPanel(false)}
              activeOpacity={0.8}
            >
              <X size={20} color={colors.error} strokeWidth={2.5} />
            </TouchableOpacity>

            <View style={styles.subscriptionPanelHeader}>
              <View style={styles.subscriptionPanelDragIndicator} />
              <View style={styles.subscriptionPanelIconContainer}>
                <Sparkles size={42} color={colors.accent} strokeWidth={2.5} />
              </View>
              <Text style={styles.subscriptionPanelTitle}>Premium Garment Care</Text>
              <Text style={styles.subscriptionPanelSubtitle}>
                Elevate your wardrobe with Kaweely&apos;s subscription plans
              </Text>
            </View>

            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.subscriptionPanelBody}
            >
              <View style={styles.subscriptionFeatureCard}>
                <View style={styles.subscriptionFeatureIcon}>
                  <Shirt size={24} color={colors.accent} strokeWidth={2.5} />
                </View>
                <View style={styles.subscriptionFeatureContent}>
                  <Text style={styles.subscriptionFeatureTitle}>Professional Care</Text>
                  <Text style={styles.subscriptionFeatureDesc}>
                    Expert handling of your finest garments with premium quality
                  </Text>
                </View>
              </View>

              <View style={styles.subscriptionFeatureCard}>
                <View style={styles.subscriptionFeatureIcon}>
                  <Tag size={24} color={colors.warning} strokeWidth={2.5} />
                </View>
                <View style={styles.subscriptionFeatureContent}>
                  <Text style={styles.subscriptionFeatureTitle}>Exclusive Discounts</Text>
                  <Text style={styles.subscriptionFeatureDesc}>
                    Save up to 25% with annual plans and special promotions
                  </Text>
                </View>
              </View>

              <View style={styles.subscriptionFeatureCard}>
                <View style={styles.subscriptionFeatureIcon}>
                  <Clock size={24} color={colors.tint} strokeWidth={2.5} />
                </View>
                <View style={styles.subscriptionFeatureContent}>
                  <Text style={styles.subscriptionFeatureTitle}>Priority Service</Text>
                  <Text style={styles.subscriptionFeatureDesc}>
                    Fast-track processing and priority scheduling for subscribers
                  </Text>
                </View>
              </View>

              <View style={styles.subscriptionFeatureCard}>
                <View style={styles.subscriptionFeatureIcon}>
                  <Gift size={24} color={colors.success} strokeWidth={2.5} />
                </View>
                <View style={styles.subscriptionFeatureContent}>
                  <Text style={styles.subscriptionFeatureTitle}>Loyalty Rewards</Text>
                  <Text style={styles.subscriptionFeatureDesc}>
                    Earn points with every order and unlock exclusive benefits
                  </Text>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.subscriptionPanelButton}
                onPress={() => {
                  setShowSubscriptionPanel(false);
                  router.push("/(tabs)/subscribe");
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.subscriptionPanelButtonText}>View All Plans</Text>
                <ArrowRight size={22} color="#000000" strokeWidth={2.5} />
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
