import React, { ReactNode, memo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

interface GlassBackgroundProps {
  children: ReactNode;
}

export const GlassBackground = memo(function GlassBackground({ children }: GlassBackgroundProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          '#000000',
          colors.accent + '15',
          colors.tint + '10',
          '#000000',
          colors.success + '08',
          '#000000',
        ]}
        locations={[0, 0.15, 0.35, 0.5, 0.75, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      />
      
      <View style={styles.orbs}>
        <LinearGradient
          colors={[colors.accent + '40', colors.accent + '00']}
          style={[styles.orb, styles.orb1]}
        />
        <LinearGradient
          colors={[colors.tint + '35', colors.tint + '00']}
          style={[styles.orb, styles.orb2]}
        />
        <LinearGradient
          colors={[colors.success + '30', colors.success + '00']}
          style={[styles.orb, styles.orb3]}
        />
        <LinearGradient
          colors={[colors.warning + '25', colors.warning + '00']}
          style={[styles.orb, styles.orb4]}
        />
      </View>

      <View style={styles.noise} />
      
      <View style={styles.contentWrapper}>
        {children}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    position: 'relative' as const,
  },
  gradientBackground: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  orbs: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden' as const,
  },
  orb: {
    position: 'absolute' as const,
    borderRadius: 9999,
    opacity: 0.6,
  },
  orb1: {
    width: width * 1.2,
    height: width * 1.2,
    top: -width * 0.4,
    right: -width * 0.3,
  },
  orb2: {
    width: width * 0.9,
    height: width * 0.9,
    bottom: height * 0.15,
    left: -width * 0.2,
  },
  orb3: {
    width: width * 0.7,
    height: width * 0.7,
    top: height * 0.3,
    left: width * 0.2,
  },
  orb4: {
    width: width * 0.6,
    height: width * 0.6,
    bottom: -width * 0.1,
    right: width * 0.1,
  },
  noise: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    opacity: 0.5,
  },
  contentWrapper: {
    flex: 1,
    position: 'relative' as const,
    zIndex: 10,
  },
});
