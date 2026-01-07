import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Award, Gift, ShoppingBag, MapPin, MessageCircle, Leaf, Sparkles, Heart, Bell, Camera, Shirt, Trophy } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useLoyalty } from '@/contexts/LoyaltyContext';
import { useRef, useEffect } from 'react';
import { AnimatedPressable } from '@/components/AnimatedPressable';

const { width } = Dimensions.get('window');

type QuickAction = 'rewards' | 'referrals' | 'store' | 'tracking' | 'support' | 'whatToWear' | 'ecoImpact' | 'donateClothes' | 'reminders' | 'fabricScan' | 'wardrobe' | 'challenges';

interface QuickActionsModalProps {
  visible: boolean;
  onClose: () => void;
  onActionPress: (action: QuickAction) => void;
}

export function QuickActionsModal({ visible, onClose, onActionPress }: QuickActionsModalProps) {
  const { colors } = useTheme();
  const { loyalty } = useLoyalty();
  const quickActionGlowAnim = useRef(new Animated.Value(0)).current;
  const quickActionPulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(quickActionGlowAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(quickActionGlowAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(quickActionPulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(quickActionPulseAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [quickActionGlowAnim, quickActionPulseAnim]);

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.92)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: '#0a0a0a',
      borderTopLeftRadius: 36,
      borderTopRightRadius: 36,
      maxHeight: '85%',
      shadowColor: colors.tint,
      shadowOffset: { width: 0, height: -12 },
      shadowOpacity: 0.4,
      shadowRadius: 32,
      elevation: 25,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 28,
      paddingTop: 28,
      paddingBottom: 24,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '900' as const,
      color: '#FFFFFF',
      letterSpacing: 0.8,
    },
    closeButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#1f1f1f',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: '#333333',
    },
    scrollContent: {
      padding: 24,
    },
    quickActionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 14,
    },
    quickActionCard: {
      borderRadius: 26,
      width: (width - 62) / 2,
      aspectRatio: 1,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative' as const,
      overflow: 'hidden' as const,
      borderWidth: 0,
    },
    quickActionGlow: {
      position: 'absolute' as const,
      top: -30,
      left: -30,
      right: -30,
      bottom: -30,
      opacity: 0.15,
    },
    quickActionIconWrapper: {
      position: 'relative' as const,
      marginBottom: 14,
    },
    quickActionIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 6,
    },
    quickActionPulse: {
      position: 'absolute' as const,
      width: 64,
      height: 64,
      borderRadius: 32,
      borderWidth: 2.5,
    },
    quickActionText: {
      fontSize: 14,
      fontWeight: '700' as const,
      color: '#FFFFFF',
      textAlign: 'center',
      letterSpacing: 0.3,
    },
    quickActionSubtext: {
      fontSize: 10,
      fontWeight: '500' as const,
      color: 'rgba(255, 255, 255, 0.5)',
      textAlign: 'center',
      marginTop: 2,
    },
    pointsBadge: {
      position: 'absolute' as const,
      top: 12,
      right: 12,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 12,
      shadowColor: '#FFD700',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.6,
      shadowRadius: 6,
      elevation: 5,
    },
    pointsBadgeText: {
      fontSize: 11,
      fontWeight: '900' as const,
      color: '#000000',
    },
  });

  const actions = [
    {
      id: 'rewards' as QuickAction,
      title: 'Rewards',
      icon: Award,
      gradientColors: ['#FFD700', '#FFA500'] as const,
      iconColor: '#FFFFFF' as const,
      glowColor: '#FFD700' as const,
      showPoints: true,
    },
    {
      id: 'referrals' as QuickAction,
      title: 'Referrals',
      icon: Gift,
      gradientColors: ['#FF1493', '#FF69B4'] as const,
      iconColor: '#FFFFFF' as const,
      glowColor: '#FF1493' as const,
      showPoints: false,
    },
    {
      id: 'store' as QuickAction,
      title: 'Store',
      icon: ShoppingBag,
      gradientColors: ['#9333EA', '#C084FC'] as const,
      iconColor: '#FFFFFF' as const,
      glowColor: '#9333EA' as const,
      showPoints: false,
    },
    {
      id: 'tracking' as QuickAction,
      title: 'Tracking',
      icon: MapPin,
      gradientColors: ['#3B82F6', '#60A5FA'] as const,
      iconColor: '#FFFFFF' as const,
      glowColor: '#3B82F6' as const,
      showPoints: false,
    },

    {
      id: 'whatToWear' as QuickAction,
      title: 'What to Wear',
      icon: Sparkles,
      gradientColors: ['#EC4899', '#F472B6'] as const,
      iconColor: '#FFFFFF' as const,
      glowColor: '#EC4899' as const,
      showPoints: false,
    },
    {
      id: 'ecoImpact' as QuickAction,
      title: 'Eco Impact',
      icon: Leaf,
      gradientColors: ['#10B981', '#34D399'] as const,
      iconColor: '#FFFFFF' as const,
      glowColor: '#10B981' as const,
      showPoints: false,
    },
    {
      id: 'donateClothes' as QuickAction,
      title: 'Donate Clothes',
      subtext: 'Help Others',
      icon: Heart,
      gradientColors: ['#F59E0B', '#FB923C'] as const,
      iconColor: '#FFFFFF' as const,
      glowColor: '#F59E0B' as const,
      showPoints: false,
    },
    {
      id: 'reminders' as QuickAction,
      title: 'Reminders',
      subtext: 'Never Miss',
      icon: Bell,
      gradientColors: ['#FF6B35', '#FF8C42'] as const,
      iconColor: '#FFFFFF' as const,
      glowColor: '#FF6B35' as const,
      showPoints: false,
    },
    {
      id: 'fabricScan' as QuickAction,
      title: 'AI Fabric Scan',
      subtext: 'Smart Care',
      icon: Camera,
      gradientColors: ['#14B8A6', '#0D9488'] as const,
      iconColor: '#FFFFFF' as const,
      glowColor: '#14B8A6' as const,
      showPoints: false,
    },
    {
      id: 'wardrobe' as QuickAction,
      title: 'My Wardrobe',
      subtext: 'Manage Items',
      icon: Shirt,
      gradientColors: ['#8B5CF6', '#A78BFA'] as const,
      iconColor: '#FFFFFF' as const,
      glowColor: '#8B5CF6' as const,
      showPoints: false,
    },
    {
      id: 'challenges' as QuickAction,
      title: 'Challenges',
      subtext: 'Compete & Win',
      icon: Trophy,
      gradientColors: ['#EF4444', '#F87171'] as const,
      iconColor: '#FFFFFF' as const,
      glowColor: '#EF4444' as const,
      showPoints: false,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Quick Actions</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <X size={20} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.quickActionsGrid}>
              {actions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <AnimatedPressable
                    key={action.id}
                    style={styles.quickActionCard}
                    onPress={() => onActionPress(action.id)}
                    hapticType="medium"
                    scaleValue={0.92}
                  >
                    <LinearGradient
                      colors={['rgba(0, 0, 0, 0.4)', 'rgba(0, 0, 0, 0.7)']}
                      style={StyleSheet.absoluteFillObject}
                    />
                    <Animated.View
                      style={[
                        styles.quickActionGlow,
                        {
                          backgroundColor: action.glowColor,
                          opacity: quickActionGlowAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.15, 0.35],
                          }),
                        },
                      ]}
                    />
                    <View style={styles.quickActionIconWrapper}>
                      <LinearGradient
                        colors={action.gradientColors}
                        style={styles.quickActionIcon}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <IconComponent size={30} color={action.iconColor} strokeWidth={2.5} />
                      </LinearGradient>
                      <Animated.View
                        style={[
                          styles.quickActionPulse,
                          {
                            borderColor: action.gradientColors[0],
                            opacity: quickActionPulseAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.7, 0],
                            }),
                            transform: [
                              {
                                scale: quickActionPulseAnim.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [1, 1.4],
                                }),
                              },
                            ],
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.quickActionText}>
                      {action.title}
                    </Text>
                    {action.subtext && (
                      <Text style={styles.quickActionSubtext}>
                        {action.subtext}
                      </Text>
                    )}
                    {action.showPoints && loyalty.points > 0 && (
                      <LinearGradient
                        colors={['#FFD700', '#FFA500']}
                        style={styles.pointsBadge}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Text style={styles.pointsBadgeText}>{loyalty.points}</Text>
                      </LinearGradient>
                    )}
                  </AnimatedPressable>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
