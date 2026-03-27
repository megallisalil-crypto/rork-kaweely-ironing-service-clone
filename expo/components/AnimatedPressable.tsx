import React, { useRef } from 'react';
import { TouchableOpacity, Animated, StyleProp, ViewStyle, TouchableOpacityProps } from 'react-native';
import { hapticFeedback } from '@/utils/haptics';

interface AnimatedPressableProps extends TouchableOpacityProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  hapticType?: 'light' | 'medium' | 'heavy' | 'selection';
  scaleValue?: number;
  onPress?: () => void;
}

export function AnimatedPressable({
  children,
  style,
  hapticType = 'light',
  scaleValue = 0.96,
  onPress,
  ...props
}: AnimatedPressableProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: scaleValue,
      useNativeDriver: true,
      friction: 3,
      tension: 100,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
      tension: 100,
    }).start();
  };

  const handlePress = async () => {
    await hapticFeedback[hapticType]();
    if (onPress) onPress();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      {...props}
    >
      <Animated.View style={[style, { transform: [{ scale: scaleAnim }] }]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}
