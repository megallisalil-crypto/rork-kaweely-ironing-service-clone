import React, { useRef } from 'react';
import { Animated, PanResponder, View, Dimensions, StyleProp, ViewStyle } from 'react-native';
import { hapticFeedback } from '@/utils/haptics';

const { width } = Dimensions.get('window');

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  style?: StyleProp<ViewStyle>;
  swipeThreshold?: number;
}

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  style,
  swipeThreshold = 100,
}: SwipeableCardProps) {
  const pan = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        hapticFeedback.selection();
        Animated.spring(scale, {
          toValue: 0.98,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderMove: (_, gesture) => {
        pan.setValue({ x: gesture.dx, y: gesture.dy });
        
        const distance = Math.sqrt(gesture.dx ** 2 + gesture.dy ** 2);
        const newOpacity = Math.max(0.5, 1 - distance / 300);
        opacity.setValue(newOpacity);
      },
      onPanResponderRelease: (_, gesture) => {
        const absX = Math.abs(gesture.dx);
        const absY = Math.abs(gesture.dy);

        if (absX > swipeThreshold || absY > swipeThreshold) {
          let direction: 'left' | 'right' | 'up' | 'down' | null = null;

          if (absX > absY) {
            direction = gesture.dx > 0 ? 'right' : 'left';
          } else {
            direction = gesture.dy > 0 ? 'down' : 'up';
          }

          const toValue = { x: 0, y: 0 };
          switch (direction) {
            case 'left':
              toValue.x = -width;
              hapticFeedback.medium();
              break;
            case 'right':
              toValue.x = width;
              hapticFeedback.medium();
              break;
            case 'up':
              toValue.y = -width;
              hapticFeedback.medium();
              break;
            case 'down':
              toValue.y = width;
              hapticFeedback.medium();
              break;
          }

          Animated.parallel([
            Animated.timing(pan, {
              toValue,
              duration: 250,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 250,
              useNativeDriver: true,
            }),
          ]).start(() => {
            switch (direction) {
              case 'left':
                if (onSwipeLeft) onSwipeLeft();
                break;
              case 'right':
                if (onSwipeRight) onSwipeRight();
                break;
              case 'up':
                if (onSwipeUp) onSwipeUp();
                break;
              case 'down':
                if (onSwipeDown) onSwipeDown();
                break;
            }
            resetCard();
          });
        } else {
          resetCard();
        }
      },
    })
  ).current;

  const resetCard = () => {
    Animated.parallel([
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const rotate = pan.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-15deg', '0deg', '15deg'],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { rotate },
            { scale },
          ],
          opacity,
        },
      ]}
      {...panResponder.panHandlers}
    >
      {children}
    </Animated.View>
  );
}
