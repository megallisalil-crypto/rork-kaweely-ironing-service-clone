import { Animated, Easing } from 'react-native';

export const createPageTransition = (animatedValue: Animated.Value, toValue: number, duration = 300) => {
  return Animated.spring(animatedValue, {
    toValue,
    useNativeDriver: true,
    friction: 8,
    tension: 50,
  });
};

export const createFadeTransition = (animatedValue: Animated.Value, toValue: number, duration = 300) => {
  return Animated.timing(animatedValue, {
    toValue,
    duration,
    useNativeDriver: true,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });
};

export const createSlideTransition = (animatedValue: Animated.Value, toValue: number, duration = 400) => {
  return Animated.spring(animatedValue, {
    toValue,
    useNativeDriver: true,
    friction: 9,
    tension: 60,
    velocity: 2,
  });
};

export const createScaleTransition = (animatedValue: Animated.Value, toValue: number, duration = 300) => {
  return Animated.spring(animatedValue, {
    toValue,
    useNativeDriver: true,
    friction: 7,
    tension: 40,
  });
};

export const createBounceTransition = (animatedValue: Animated.Value, toValue: number) => {
  return Animated.spring(animatedValue, {
    toValue,
    useNativeDriver: true,
    friction: 5,
    tension: 80,
    velocity: 3,
  });
};
