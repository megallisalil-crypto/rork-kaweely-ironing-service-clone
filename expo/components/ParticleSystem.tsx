import React, { useEffect, useRef, memo } from 'react';
import { View, Animated, Dimensions, StyleSheet } from 'react-native';
import { Sparkles } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface Particle {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
  color: string;
  size: number;
  duration: number;
}

interface ParticleSystemProps {
  count?: number;
  colors?: string[];
  minSize?: number;
  maxSize?: number;
}

export const ParticleSystem = memo(function ParticleSystem({ 
  count = 20, 
  colors = ['#14B8A6', '#F59E0B', '#EC4899', '#A855F7', '#3B82F6'],
  minSize = 4,
  maxSize = 12
}: ParticleSystemProps) {
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const particles: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(Math.random() * height),
      opacity: new Animated.Value(Math.random() * 0.5 + 0.2),
      scale: new Animated.Value(Math.random() * 0.5 + 0.5),
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * (maxSize - minSize) + minSize,
      duration: Math.random() * 3000 + 2000,
    }));

    particlesRef.current = particles;

    particles.forEach((particle) => {
      const animateParticle = () => {
        const newX = Math.random() * width;
        const newY = Math.random() * height;
        const newOpacity = Math.random() * 0.5 + 0.2;
        const newScale = Math.random() * 0.5 + 0.5;

        Animated.parallel([
          Animated.timing(particle.x, {
            toValue: newX,
            duration: particle.duration,
            useNativeDriver: true,
          }),
          Animated.timing(particle.y, {
            toValue: newY,
            duration: particle.duration,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(particle.opacity, {
              toValue: newOpacity,
              duration: particle.duration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(particle.opacity, {
              toValue: Math.random() * 0.3 + 0.1,
              duration: particle.duration / 2,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(particle.scale, {
              toValue: newScale,
              duration: particle.duration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(particle.scale, {
              toValue: Math.random() * 0.5 + 0.5,
              duration: particle.duration / 2,
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => animateParticle());
      };

      animateParticle();
    });
  }, [count, colors, minSize, maxSize]);

  return (
    <View style={styles.container} pointerEvents="none">
      {particlesRef.current.map((particle) => (
        <Animated.View
          key={particle.id}
          style={[
            styles.particle,
            {
              width: particle.size,
              height: particle.size,
              borderRadius: particle.size / 2,
              backgroundColor: particle.color,
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
                { scale: particle.scale },
              ],
              opacity: particle.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
});
