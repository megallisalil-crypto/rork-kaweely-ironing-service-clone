import { useRef, useEffect, useState } from "react";
import { View, Text, StyleSheet, Animated, TouchableOpacity, Platform } from "react-native";
import { AlertCircle, Zap, Phone, Clock, Shield, Heart } from "lucide-react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useSOS } from "@/contexts/SOSContext";
import * as Haptics from "expo-haptics";

interface SOSButtonProps {
  onPress: () => void;
  compact?: boolean;
}

export function SOSButton({ onPress, compact = false }: SOSButtonProps) {
  const { activeSOSCount, isSubscriber } = useSOS();
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const ring1Anim = useRef(new Animated.Value(0)).current;
  const ring2Anim = useRef(new Animated.Value(0)).current;
  const ring3Anim = useRef(new Animated.Value(0)).current;
  const ring4Anim = useRef(new Animated.Value(0)).current;
  const heartbeatAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const particle1Anim = useRef(new Animated.Value(0)).current;
  const particle2Anim = useRef(new Animated.Value(0)).current;
  const particle3Anim = useRef(new Animated.Value(0)).current;
  const particle4Anim = useRef(new Animated.Value(0)).current;
  const particle5Anim = useRef(new Animated.Value(0)).current;
  const particle6Anim = useRef(new Animated.Value(0)).current;
  const electricAnim = useRef(new Animated.Value(0)).current;
  const auroraAnim = useRef(new Animated.Value(0)).current;
  const textGlowAnim = useRef(new Animated.Value(0)).current;
  const badgeScaleAnim = useRef(new Animated.Value(1)).current;
  const shineAnim = useRef(new Animated.Value(0)).current;
  const emergencyFlashAnim = useRef(new Animated.Value(0)).current;
  const [pressCount, setPressCount] = useState(0);

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );

    const heartbeatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(heartbeatAnim, {
          toValue: 1.15,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(heartbeatAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(heartbeatAnim, {
          toValue: 1.1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(heartbeatAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );

    const createRingAnimation = (anim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const createParticleAnimation = (anim: Animated.Value, duration: number) => {
      return Animated.loop(
        Animated.timing(anim, {
          toValue: 1,
          duration: duration,
          useNativeDriver: true,
        })
      );
    };

    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    );

    const electricAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(electricAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(electricAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(electricAnim, {
          toValue: 0.8,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(electricAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    const auroraAnimation = Animated.loop(
      Animated.timing(auroraAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    );

    const textGlowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(textGlowAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(textGlowAnim, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    const badgeAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(badgeScaleAnim, {
          toValue: 1.2,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(badgeScaleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );

    const shineAnimation = Animated.loop(
      Animated.timing(shineAnim, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: true,
      })
    );

    const emergencyFlashAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(emergencyFlashAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(emergencyFlashAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();
    glowAnimation.start();
    heartbeatAnimation.start();
    rotateAnimation.start();
    electricAnimation.start();
    auroraAnimation.start();
    textGlowAnimation.start();
    badgeAnimation.start();
    shineAnimation.start();
    emergencyFlashAnimation.start();
    
    createRingAnimation(ring1Anim, 0).start();
    createRingAnimation(ring2Anim, 500).start();
    createRingAnimation(ring3Anim, 1000).start();
    createRingAnimation(ring4Anim, 1500).start();
    
    createParticleAnimation(particle1Anim, 3000).start();
    createParticleAnimation(particle2Anim, 2500).start();
    createParticleAnimation(particle3Anim, 3500).start();
    createParticleAnimation(particle4Anim, 2800).start();
    createParticleAnimation(particle5Anim, 3200).start();
    createParticleAnimation(particle6Anim, 2700).start();

    return () => {
      pulseAnimation.stop();
      glowAnimation.stop();
      heartbeatAnimation.stop();
      rotateAnimation.stop();
      electricAnimation.stop();
      auroraAnimation.stop();
      textGlowAnimation.stop();
      badgeAnimation.stop();
      shineAnimation.stop();
      emergencyFlashAnimation.stop();
    };
  }, [pulseAnim, glowAnim, heartbeatAnim, rotateAnim, electricAnim, auroraAnim, textGlowAnim, badgeScaleAnim, shineAnim, emergencyFlashAnim, ring1Anim, ring2Anim, ring3Anim, ring4Anim, particle1Anim, particle2Anim, particle3Anim, particle4Anim, particle5Anim, particle6Anim]);

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    setPressCount(pressCount + 1);
    onPress();
  };

  const isActive = activeSOSCount > 0;
  const ringSize = compact ? 90 : 130;

  const createRingStyle = (anim: Animated.Value, baseSize: number) => ({
    position: 'absolute' as const,
    width: baseSize,
    height: baseSize,
    borderRadius: baseSize / 2,
    borderWidth: 2,
    borderColor: '#EF4444',
    transform: [
      {
        scale: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 2.5],
        }),
      },
    ],
    opacity: anim.interpolate({
      inputRange: [0, 0.3, 1],
      outputRange: [0.8, 0.4, 0],
    }),
  });

  const createParticleStyle = (anim: Animated.Value, angle: number, distance: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      position: 'absolute' as const,
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#FBBF24',
      transform: [
        {
          translateX: anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, Math.cos(rad) * distance],
          }),
        },
        {
          translateY: anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, Math.sin(rad) * distance],
          }),
        },
        {
          scale: anim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 1.5, 0],
          }),
        },
      ],
      opacity: anim.interpolate({
        inputRange: [0, 0.2, 0.8, 1],
        outputRange: [0, 1, 1, 0],
      }),
    };
  };

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Animated.View style={[createRingStyle(ring1Anim, ringSize), { top: -19, left: -19 }]} />
        <Animated.View style={[createRingStyle(ring2Anim, ringSize), { top: -19, left: -19 }]} />
        
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.8}
          style={styles.compactTouchable}
        >
          <Animated.View
            style={[
              styles.compactGlow,
              {
                opacity: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.4, 0.9],
                }),
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
          
          <Animated.View
            style={[
              styles.compactButton,
              {
                transform: [{ scale: heartbeatAnim }],
              },
            ]}
          >
            <LinearGradient
              colors={['#FF6B6B', '#EF4444', '#DC2626']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.compactGradient}
            >
              <AlertCircle size={26} color="#FFF" strokeWidth={2.5} />
            </LinearGradient>
          </Animated.View>
          
          <Animated.View
            style={[
              styles.compactElectric,
              {
                opacity: electricAnim,
              },
            ]}
          />
        </TouchableOpacity>
        
        {isSubscriber && (
          <Animated.View 
            style={[
              styles.compactBadge,
              { transform: [{ scale: badgeScaleAnim }] }
            ]}
          >
            <Zap size={10} color="#FFF" fill="#FFF" />
          </Animated.View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.auroraContainer,
          {
            transform: [
              {
                rotate: auroraAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['transparent', 'rgba(239, 68, 68, 0.3)', 'rgba(251, 191, 36, 0.2)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.auroraGradient}
        />
      </Animated.View>

      <Animated.View style={[createRingStyle(ring1Anim, ringSize), styles.ringPosition]} />
      <Animated.View style={[createRingStyle(ring2Anim, ringSize), styles.ringPosition]} />
      <Animated.View style={[createRingStyle(ring3Anim, ringSize), styles.ringPosition]} />
      <Animated.View style={[createRingStyle(ring4Anim, ringSize), styles.ringPosition]} />

      <Animated.View style={[createParticleStyle(particle1Anim, 0, 80), styles.particleCenter]} />
      <Animated.View style={[createParticleStyle(particle2Anim, 60, 75), styles.particleCenter]} />
      <Animated.View style={[createParticleStyle(particle3Anim, 120, 85), styles.particleCenter]} />
      <Animated.View style={[createParticleStyle(particle4Anim, 180, 70), styles.particleCenter]} />
      <Animated.View style={[createParticleStyle(particle5Anim, 240, 90), styles.particleCenter]} />
      <Animated.View style={[createParticleStyle(particle6Anim, 300, 75), styles.particleCenter]} />

      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.85}
        style={styles.touchable}
      >
        <Animated.View
          style={[
            styles.outerGlow,
            {
              opacity: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0.8],
              }),
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(239, 68, 68, 0.6)', 'rgba(220, 38, 38, 0.4)', 'rgba(185, 28, 28, 0.2)']}
            style={styles.outerGlowGradient}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.middleRing,
            {
              transform: [
                { scale: pulseAnim },
                {
                  rotate: rotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '-360deg'],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={['#FF6B6B', '#EF4444', '#DC2626', '#B91C1C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.middleRingGradient}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.mainButton,
            {
              transform: [{ scale: heartbeatAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={['#FF7878', '#EF4444', '#DC2626']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.mainButtonGradient}
          >
            <Animated.View
              style={[
                styles.shineEffect,
                {
                  transform: [
                    {
                      translateX: shineAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-100, 100],
                      }),
                    },
                  ],
                  opacity: 0.4,
                },
              ]}
            />
            
            <View style={styles.innerCircle}>
              <Animated.View
                style={{
                  opacity: emergencyFlashAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                }}
              >
                <AlertCircle size={36} color="#FFF" strokeWidth={2.5} />
              </Animated.View>
            </View>

            <Animated.View
              style={[
                styles.electricOverlay,
                {
                  opacity: electricAnim,
                },
              ]}
            />
          </LinearGradient>
        </Animated.View>

        {isSubscriber && (
          <Animated.View 
            style={[
              styles.subscriberBadge,
              { transform: [{ scale: badgeScaleAnim }] }
            ]}
          >
            <LinearGradient
              colors={['#FBBF24', '#F59E0B']}
              style={styles.subscriberBadgeGradient}
            >
              <Zap size={14} color="#FFF" fill="#FFF" />
            </LinearGradient>
          </Animated.View>
        )}

        {isActive && (
          <Animated.View 
            style={[
              styles.activeBadge,
              { 
                opacity: emergencyFlashAnim,
                transform: [{ scale: badgeScaleAnim }]
              }
            ]}
          >
            <Text style={styles.activeBadgeText}>{activeSOSCount}</Text>
          </Animated.View>
        )}
      </TouchableOpacity>

      <View style={styles.labelContainer}>
        <View style={styles.sosLabelRow}>
          <Animated.Text
            style={[
              styles.sosLabel,
              {
                opacity: textGlowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ]}
          >
            SOS
          </Animated.Text>
          <View style={styles.emergencyDot} />
        </View>
        
        <View style={styles.availabilityBadge}>
          <LinearGradient
            colors={['rgba(16, 185, 129, 0.9)', 'rgba(5, 150, 105, 0.9)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.availabilityGradient}
          >
            <Clock size={10} color="#FFF" strokeWidth={3} />
            <Text style={styles.availabilityText}>24/7</Text>
            <View style={styles.liveDot} />
          </LinearGradient>
        </View>

        <Text style={styles.tagline}>Instant Emergency Care</Text>
        
        <View style={styles.featuresRow}>
          <View style={styles.featureChip}>
            <Phone size={10} color="#EF4444" strokeWidth={2.5} />
            <Text style={styles.featureText}>Priority</Text>
          </View>
          <View style={styles.featureChip}>
            <Shield size={10} color="#EF4444" strokeWidth={2.5} />
            <Text style={styles.featureText}>Secure</Text>
          </View>
          <View style={styles.featureChip}>
            <Heart size={10} color="#EF4444" strokeWidth={2.5} />
            <Text style={styles.featureText}>Care</Text>
          </View>
        </View>

        {isSubscriber && (
          <View style={styles.discountContainer}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.discountGradient}
            >
              <Text style={styles.discountText}>VIP -30% OFF</Text>
              <Zap size={12} color="#FFF" fill="#FFF" />
            </LinearGradient>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 20,
  },
  compactContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 52,
    height: 52,
  },
  compactTouchable: {
    position: 'relative',
    width: 52,
    height: 52,
  },
  compactGlow: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#EF4444',
    top: -9,
    left: -9,
  },
  compactButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  compactGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 26,
  },
  compactElectric: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFF',
    borderRadius: 26,
  },
  compactBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FBBF24',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    shadowColor: '#FBBF24',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 4,
  },
  auroraContainer: {
    position: 'absolute',
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  auroraGradient: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  ringPosition: {
    top: '50%',
    left: '50%',
    marginTop: -65,
    marginLeft: -65,
  },
  particleCenter: {
    top: '50%',
    left: '50%',
    marginTop: -3,
    marginLeft: -3,
  },
  touchable: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
  },
  outerGlowGradient: {
    flex: 1,
    borderRadius: 60,
  },
  middleRing: {
    position: 'absolute',
    width: 95,
    height: 95,
    borderRadius: 47.5,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  middleRingGradient: {
    flex: 1,
    borderRadius: 45,
    opacity: 0.3,
  },
  mainButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
  },
  mainButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 40,
    overflow: 'hidden',
  },
  shineEffect: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{ skewX: '-20deg' }],
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  electricOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 40,
  },
  subscriberBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#FBBF24',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  subscriberBadgeGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeBadge: {
    position: 'absolute',
    top: -8,
    left: -8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 4,
  },
  activeBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFF',
  },
  labelContainer: {
    marginTop: 16,
    alignItems: 'center',
    gap: 6,
  },
  sosLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sosLabel: {
    fontSize: 28,
    fontWeight: '900',
    color: '#EF4444',
    letterSpacing: 4,
    textShadowColor: 'rgba(239, 68, 68, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  emergencyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  availabilityBadge: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  availabilityGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  availabilityText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFF',
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  tagline: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 4,
  },
  featuresRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  featureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  featureText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#EF4444',
  },
  discountContainer: {
    marginTop: 10,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  discountGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 0.5,
  },
});
