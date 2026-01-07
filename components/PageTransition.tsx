import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

interface PageTransitionProps {
  children: React.ReactNode;
  type?: 'fade' | 'slide' | 'scale' | 'slideUp';
  delay?: number;
}

export function PageTransition({ 
  children, 
  type = 'fade',
  delay = 0
}: PageTransitionProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    const animations: Animated.CompositeAnimation[] = [];

    switch (type) {
      case 'fade':
        animations.push(
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            delay,
            useNativeDriver: true,
          })
        );
        break;
      case 'slide':
        animations.push(
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 400,
              delay,
              useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
              toValue: 0,
              friction: 8,
              tension: 50,
              delay,
              useNativeDriver: true,
            }),
          ])
        );
        break;
      case 'slideUp':
        slideAnim.setValue(100);
        animations.push(
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 400,
              delay,
              useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
              toValue: 0,
              friction: 8,
              tension: 50,
              delay,
              useNativeDriver: true,
            }),
          ])
        );
        break;
      case 'scale':
        animations.push(
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 400,
              delay,
              useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
              toValue: 1,
              friction: 7,
              tension: 40,
              delay,
              useNativeDriver: true,
            }),
          ])
        );
        break;
    }

    Animated.parallel(animations).start();
  }, [type, delay]);

  const getAnimatedStyle = () => {
    switch (type) {
      case 'slide':
        return {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
        };
      case 'slideUp':
        return {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        };
      case 'scale':
        return {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        };
      default:
        return {
          opacity: fadeAnim,
        };
    }
  };

  return (
    <Animated.View style={[styles.container, getAnimatedStyle()]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
