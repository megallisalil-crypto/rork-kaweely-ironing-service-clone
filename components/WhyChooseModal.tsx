import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { X, Shirt, Clock, MapPin, Sparkles, Award, Shield, ThermometerSun, Zap } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

const { width } = Dimensions.get('window');

interface WhyChooseModalProps {
  visible: boolean;
  onClose: () => void;
}

export function WhyChooseModal({ visible, onClose }: WhyChooseModalProps) {
  const { colors } = useTheme();
  const { t } = useLanguage();

  const ironingBenefits = [
    {
      icon: ThermometerSun,
      title: 'Expert Ironing Only',
      description: 'We specialize exclusively in professional ironing - no washing, no dry cleaning. This focus makes us the best at what we do.',
      color: '#F59E0B',
    },
    {
      icon: Shield,
      title: 'Fabric Safe Guarantee',
      description: 'Our specialists know every fabric type. Your delicate silks, fine linens, and premium cotton are in expert hands.',
      color: colors.success,
    },
    {
      icon: Award,
      title: 'Crisp & Perfect Results',
      description: 'Hospital corners, razor-sharp creases, wrinkle-free perfection. Every garment returns looking brand new.',
      color: colors.tint,
    },
    {
      icon: Zap,
      title: 'Save Your Precious Time',
      description: 'Skip the tedious ironing at home. We pick up, iron professionally, and deliver - you enjoy perfectly pressed clothes.',
      color: '#EF4444',
    },
  ];

  const features = [
    {
      icon: Shirt,
      title: t.home.feature1,
      description: t.home.feature1Desc,
      color: colors.tint,
    },
    {
      icon: Clock,
      title: t.home.feature2,
      description: t.home.feature2Desc,
      color: colors.accent,
    },
    {
      icon: MapPin,
      title: t.home.feature3,
      description: t.home.feature3Desc,
      color: colors.success,
    },
    {
      icon: Sparkles,
      title: t.home.feature4,
      description: t.home.feature4Desc,
      color: "#EC4899",
    },
  ];

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: width - 40,
      maxHeight: '80%',
      backgroundColor: '#1a1a1a',
      borderRadius: 24,
      borderWidth: 2,
      borderColor: colors.success,
      shadowColor: colors.success,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.6,
      shadowRadius: 24,
      elevation: 12,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#2a2a2a',
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '800' as const,
      color: '#F59E0B',
      marginBottom: 12,
      marginTop: 8,
    },
    ironingOnlyBadge: {
      backgroundColor: '#F59E0B20',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#F59E0B',
      alignSelf: 'flex-start' as const,
      marginBottom: 16,
    },
    ironingOnlyText: {
      fontSize: 12,
      fontWeight: '800' as const,
      color: '#F59E0B',
      letterSpacing: 0.5,
    },
    divider: {
      height: 1,
      backgroundColor: '#2a2a2a',
      marginVertical: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '900' as const,
      color: '#FFFFFF',
      flex: 1,
    },
    closeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#2a2a2a',
      alignItems: 'center',
      justifyContent: 'center',
    },
    scrollContent: {
      padding: 20,
    },
    featuresGrid: {
      gap: 12,
    },
    featureCard: {
      backgroundColor: '#0a0a0a',
      borderRadius: 20,
      padding: 18,
      borderWidth: 1,
      borderColor: '#2a2a2a',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      shadowColor: colors.success,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 6,
    },
    featureIconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
    },
    featureContent: {
      flex: 1,
    },
    featureTitle: {
      fontSize: 14,
      fontWeight: '700' as const,
      color: '#FFFFFF',
      marginBottom: 4,
    },
    featureDescription: {
      fontSize: 11,
      color: '#888888',
      lineHeight: 16,
    },
  });

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t.home.whyChooseUs}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <X size={24} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.ironingOnlyBadge}>
              <Text style={styles.ironingOnlyText}>✨ IRONING SPECIALISTS ONLY</Text>
            </View>
            
            <Text style={styles.sectionTitle}>Why Ironing-Only Service?</Text>
            <View style={styles.featuresGrid}>
              {ironingBenefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <View key={`benefit-${index}`} style={styles.featureCard}>
                    <View style={[styles.featureIconContainer, { backgroundColor: `${benefit.color}20` }]}>
                      <IconComponent size={28} color={benefit.color} strokeWidth={2.5} />
                    </View>
                    <View style={styles.featureContent}>
                      <Text style={styles.featureTitle}>{benefit.title}</Text>
                      <Text style={styles.featureDescription}>{benefit.description}</Text>
                    </View>
                  </View>
                );
              })}
            </View>

            <View style={styles.divider} />
            
            <Text style={styles.sectionTitle}>Our Promise</Text>
            <View style={styles.featuresGrid}>
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <View key={`feature-${index}`} style={styles.featureCard}>
                    <View style={[styles.featureIconContainer, { backgroundColor: `${feature.color}20` }]}>
                      <IconComponent size={28} color={feature.color} strokeWidth={2.5} />
                    </View>
                    <View style={styles.featureContent}>
                      <Text style={styles.featureTitle}>{feature.title}</Text>
                      <Text style={styles.featureDescription}>{feature.description}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
