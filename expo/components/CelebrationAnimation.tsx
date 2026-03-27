import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions, StyleSheet, Modal } from 'react-native';
import { Sparkles, Star, Award, Gift, Trophy, Crown } from 'lucide-react-native';
import { hapticFeedback } from '@/utils/haptics';

const { width, height } = Dimensions.get('window');

interface ConfettiPiece {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  rotate: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
  color: string;
}

interface CelebrationAnimationProps {
  visible: boolean;
  onComplete?: () => void;
  type?: 'confetti' | 'stars' | 'sparkles';
  intensity?: 'low' | 'medium' | 'high';
}

export function CelebrationAnimation({ 
  visible, 
  onComplete,
  type = 'confetti',
  intensity = 'high'
}: CelebrationAnimationProps) {
  const confettiRef = useRef<ConfettiPiece[]>([]);
  const centralIconScale = useRef(new Animated.Value(0)).current;
  const centralIconRotate = useRef(new Animated.Value(0)).current;
  const centralIconOpacity = useRef(new Animated.Value(0)).current;
  const burstAnim = useRef(new Animated.Value(0)).current;

  const confettiCount = intensity === 'high' ? 80 : intensity === 'medium' ? 50 : 30;
  const colors = ['#14B8A6', '#F59E0B', '#EC4899', '#A855F7', '#3B82F6', '#10B981', '#F43F5E', '#FBBF24'];

  const icons = [Sparkles, Star, Award, Gift, Trophy, Crown];
  const CentralIcon = icons[Math.floor(Math.random() * icons.length)];

  useEffect(() => {
    if (!visible) return;

    hapticFeedback.celebration();

    const confetti: ConfettiPiece[] = Array.from({ length: confettiCount }, (_, i) => ({
      id: i,
      x: new Animated.Value(width / 2),
      y: new Animated.Value(height / 2),
      rotate: new Animated.Value(0),
      opacity: new Animated.Value(1),
      scale: new Animated.Value(1),
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    confettiRef.current = confetti;

    Animated.sequence([
      Animated.parallel([
        Animated.spring(centralIconScale, {
          toValue: 1.5,
          tension: 50,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(centralIconOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(centralIconScale, {
          toValue: 1,
          tension: 100,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(burstAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    Animated.loop(
      Animated.timing(centralIconRotate, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    confetti.forEach((piece, index) => {
      const angle = (Math.PI * 2 * index) / confetti.length;
      const distance = 150 + Math.random() * 300;
      const targetX = width / 2 + Math.cos(angle) * distance;
      const targetY = height / 2 + Math.sin(angle) * distance + Math.random() * 200;

      Animated.parallel([
        Animated.timing(piece.x, {
          toValue: targetX,
          duration: 800 + Math.random() * 400,
          useNativeDriver: true,
        }),
        Animated.timing(piece.y, {
          toValue: targetY,
          duration: 800 + Math.random() * 400,
          useNativeDriver: true,
        }),
        Animated.timing(piece.rotate, {
          toValue: Math.random() * 4 - 2,
          duration: 800 + Math.random() * 400,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(piece.opacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(piece.opacity, {
            toValue: 0,
            duration: 600,
            delay: 400,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(piece.scale, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(piece.scale, {
            toValue: 0.5,
            duration: 600,
            delay: 400,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    });

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(centralIconOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(centralIconScale, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (onComplete) onComplete();
      });
    }, 2000);
  }, [visible, confettiCount]);

  if (!visible) return null;

  const rotation = centralIconRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.container} pointerEvents="none">
        {confettiRef.current.map((piece) => {
          const rotate = piece.rotate.interpolate({
            inputRange: [-2, 2],
            outputRange: ['-720deg', '720deg'],
          });

          return (
            <Animated.View
              key={piece.id}
              style={[
                styles.confetti,
                {
                  backgroundColor: piece.color,
                  transform: [
                    { translateX: piece.x },
                    { translateY: piece.y },
                    { rotate },
                    { scale: piece.scale },
                  ],
                  opacity: piece.opacity,
                },
              ]}
            />
          );
        })}
        
        <Animated.View
          style={[
            styles.centralIcon,
            {
              transform: [
                { scale: centralIconScale },
                { rotate: rotation },
              ],
              opacity: centralIconOpacity,
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <CentralIcon size={60} color="#FFFFFF" strokeWidth={2.5} />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  confetti: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  centralIcon: {
    position: 'absolute',
    top: height / 2 - 80,
    left: width / 2 - 80,
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#14B8A6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#14B8A6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
    elevation: 20,
  },
});
