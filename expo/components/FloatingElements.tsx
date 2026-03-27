import React, { useEffect, useRef, memo } from 'react';
import { View, Animated, Dimensions, StyleSheet } from 'react-native';
import { Sparkles, Shirt, Droplet, Wind } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface FloatingElement {
  id: number;
  translateY: Animated.Value;
  translateX: Animated.Value;
  rotate: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
  icon: typeof Sparkles;
  color: string;
  size: number;
}

interface FloatingElementsProps {
  count?: number;
}

export const FloatingElements = memo(function FloatingElements({ count = 8 }: FloatingElementsProps) {
  const elementsRef = useRef<FloatingElement[]>([]);

  const icons = [Sparkles, Shirt, Droplet, Wind];
  const colors = ['#14B8A6', '#F59E0B', '#3B82F6', '#EC4899'];

  useEffect(() => {
    const elements: FloatingElement[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      translateY: new Animated.Value(height + 100),
      translateX: new Animated.Value(Math.random() * width),
      rotate: new Animated.Value(0),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0.5),
      icon: icons[Math.floor(Math.random() * icons.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 16 + 20,
    }));

    elementsRef.current = elements;

    elements.forEach((element, index) => {
      setTimeout(() => {
        const animateElement = () => {
          element.translateY.setValue(height + 100);
          element.translateX.setValue(Math.random() * width);
          element.opacity.setValue(0);
          element.scale.setValue(0.5);

          Animated.parallel([
            Animated.timing(element.translateY, {
              toValue: -100,
              duration: 8000 + Math.random() * 4000,
              useNativeDriver: true,
            }),
            Animated.timing(element.translateX, {
              toValue: Math.random() * width,
              duration: 8000 + Math.random() * 4000,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(element.opacity, {
                toValue: 0.3 + Math.random() * 0.3,
                duration: 1000,
                useNativeDriver: true,
              }),
              Animated.timing(element.opacity, {
                toValue: 0,
                duration: 1000,
                delay: 6000,
                useNativeDriver: true,
              }),
            ]),
            Animated.loop(
              Animated.timing(element.rotate, {
                toValue: 1,
                duration: 4000,
                useNativeDriver: true,
              })
            ),
            Animated.sequence([
              Animated.timing(element.scale, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
              }),
              Animated.timing(element.scale, {
                toValue: 0.7,
                duration: 1000,
                delay: 6000,
                useNativeDriver: true,
              }),
            ]),
          ]).start(() => {
            setTimeout(animateElement, Math.random() * 2000);
          });
        };

        animateElement();
      }, index * 800);
    });
  }, [count, colors, icons]);

  return (
    <View style={styles.container} pointerEvents="none">
      {elementsRef.current.map((element) => {
        const IconComponent = element.icon;
        const rotation = element.rotate.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        });

        return (
          <Animated.View
            key={element.id}
            style={[
              styles.element,
              {
                transform: [
                  { translateX: element.translateX },
                  { translateY: element.translateY },
                  { rotate: rotation },
                  { scale: element.scale },
                ],
                opacity: element.opacity,
              },
            ]}
          >
            <IconComponent size={element.size} color={element.color} strokeWidth={2} />
          </Animated.View>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  element: {
    position: 'absolute',
  },
});
