import { View, Text, StyleSheet, ScrollView, Animated, Dimensions } from "react-native";
import { Stack } from "expo-router";
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { 
  Droplet, 
  Zap, 
  Cloud, 
  TreeDeciduous, 
  Leaf,
  Target,
  TrendingUp,
  Check,
} from "lucide-react-native";
import { useSustainability } from "@/contexts/SustainabilityContext";
import { useRef, useEffect } from "react";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 52) / 2;

export default function EcoImpactScreen() {
  const { metrics, milestones, impactComparisons } = useSustainability();
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim, glowAnim]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000000',
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 20,
      paddingBottom: 40,
    },
    heroCard: {
      borderRadius: 28,
      padding: 24,
      marginBottom: 20,
      overflow: 'hidden' as const,
      position: 'relative' as const,
      borderWidth: 2,
      borderColor: '#1a1a1a',
      backgroundColor: '#0a0a0a',
    },
    heroGradient: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.15,
    },
    heroContent: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      zIndex: 2,
    },
    heroLeft: {
      flex: 1,
    },
    heroTitle: {
      fontSize: 13,
      fontWeight: '700' as const,
      color: '#888888',
      textTransform: 'uppercase' as const,
      letterSpacing: 1.2,
      marginBottom: 6,
    },
    heroScore: {
      fontSize: 48,
      fontWeight: '900' as const,
      color: '#FFFFFF',
      letterSpacing: -2,
      marginBottom: 2,
    },
    heroSubtitle: {
      fontSize: 13,
      color: '#22C55E',
      fontWeight: '700' as const,
      letterSpacing: 0.5,
    },
    heroIconContainer: {
      width: 84,
      height: 84,
      borderRadius: 42,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      position: 'relative' as const,
    },
    heroIconCircle: {
      position: 'absolute' as const,
      width: 84,
      height: 84,
      borderRadius: 42,
      borderWidth: 3,
      borderColor: '#22C55E',
    },
    heroIconInner: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: '#22C55E',
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    metricsGrid: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      gap: 12,
      marginBottom: 20,
    },
    metricCard: {
      width: CARD_WIDTH,
      borderRadius: 20,
      padding: 16,
      backgroundColor: '#0a0a0a',
      borderWidth: 2,
      borderColor: '#1a1a1a',
      overflow: 'hidden' as const,
      position: 'relative' as const,
    },
    metricGradient: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.08,
    },
    metricContent: {
      position: 'relative' as const,
      zIndex: 2,
    },
    metricHeader: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      marginBottom: 12,
    },
    metricIconBg: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    metricTrend: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 2,
    },
    metricTrendText: {
      fontSize: 10,
      fontWeight: '800' as const,
      color: '#22C55E',
    },
    metricValue: {
      fontSize: 32,
      fontWeight: '900' as const,
      color: '#FFFFFF',
      marginBottom: 4,
      letterSpacing: -1,
    },
    metricLabel: {
      fontSize: 11,
      color: '#666666',
      fontWeight: '600' as const,
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: '800' as const,
      color: '#FFFFFF',
      marginBottom: 14,
      letterSpacing: 0.5,
      textTransform: 'uppercase' as const,
    },
    comparisonCard: {
      borderRadius: 18,
      padding: 16,
      marginBottom: 12,
      backgroundColor: '#0a0a0a',
      borderWidth: 2,
      borderColor: '#1a1a1a',
      position: 'relative' as const,
      overflow: 'hidden' as const,
    },
    comparisonGradient: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.08,
    },
    comparisonContent: {
      position: 'relative' as const,
      zIndex: 2,
    },
    comparisonTop: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      marginBottom: 14,
    },
    comparisonLeft: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 10,
      flex: 1,
    },
    comparisonIconBg: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    comparisonTitle: {
      fontSize: 14,
      fontWeight: '800' as const,
      color: '#FFFFFF',
    },
    comparisonBadge: {
      backgroundColor: '#22C55E',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 8,
    },
    comparisonBadgeText: {
      fontSize: 10,
      fontWeight: '900' as const,
      color: '#000000',
      letterSpacing: 0.5,
    },
    comparisonBars: {
      gap: 10,
    },
    comparisonBarRow: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 10,
    },
    comparisonBarLabel: {
      width: 70,
      fontSize: 11,
      color: '#666666',
      fontWeight: '600' as const,
    },
    comparisonBarContainer: {
      flex: 1,
      height: 8,
      backgroundColor: '#1a1a1a',
      borderRadius: 4,
      overflow: 'hidden' as const,
    },
    comparisonBar: {
      height: '100%',
      borderRadius: 4,
    },
    comparisonBarValue: {
      fontSize: 11,
      fontWeight: '800' as const,
      color: '#FFFFFF',
      width: 50,
      textAlign: 'right' as const,
    },
    milestonesContainer: {
      gap: 10,
      marginBottom: 20,
    },
    milestoneCard: {
      borderRadius: 16,
      padding: 14,
      backgroundColor: '#0a0a0a',
      borderWidth: 2,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 12,
      position: 'relative' as const,
      overflow: 'hidden' as const,
    },
    milestoneAchieved: {
      borderColor: '#22C55E',
    },
    milestoneLocked: {
      borderColor: '#1a1a1a',
    },
    milestoneGradient: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.1,
    },
    milestoneContent: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 12,
      flex: 1,
      zIndex: 2,
    },
    milestoneIconBg: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    milestoneIconAchieved: {
      backgroundColor: '#22C55E',
    },
    milestoneIconLocked: {
      backgroundColor: '#1a1a1a',
    },
    milestoneTextContainer: {
      flex: 1,
    },
    milestoneTitle: {
      fontSize: 14,
      fontWeight: '800' as const,
      marginBottom: 2,
    },
    milestoneTitleAchieved: {
      color: '#FFFFFF',
    },
    milestoneTitleLocked: {
      color: '#555555',
    },
    milestoneDesc: {
      fontSize: 11,
      fontWeight: '600' as const,
    },
    milestoneDescAchieved: {
      color: '#888888',
    },
    milestoneDescLocked: {
      color: '#333333',
    },
    milestoneCheck: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: '#22C55E',
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Eco Impact",
          headerStyle: {
            backgroundColor: '#000000',
          },
          headerTintColor: '#FFFFFF',
          headerTransparent: false,
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.heroCard}>
            <ExpoLinearGradient
              colors={['#22C55E', '#10B981']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradient}
            />
            <View style={styles.heroContent}>
              <View style={styles.heroLeft}>
                <Text style={styles.heroTitle}>Eco Score</Text>
                <Text style={styles.heroScore}>{metrics.ecoScore}</Text>
                <Text style={styles.heroSubtitle}>Points Earned</Text>
              </View>
              <Animated.View style={[
                styles.heroIconContainer,
                {
                  transform: [{ 
                    rotate: glowAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg']
                    })
                  }]
                }
              ]}>
                <View style={styles.heroIconCircle} />
                <View style={styles.heroIconInner}>
                  <Leaf size={32} color="#FFFFFF" strokeWidth={3} />
                </View>
              </Animated.View>
            </View>
          </View>

          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <ExpoLinearGradient
                colors={['#3B82F6', '#2563EB']}
                style={styles.metricGradient}
              />
              <View style={styles.metricContent}>
                <View style={styles.metricHeader}>
                  <View style={[styles.metricIconBg, { backgroundColor: '#3B82F6' }]}>
                    <Droplet size={20} color="#FFFFFF" strokeWidth={2.5} />
                  </View>
                  <View style={styles.metricTrend}>
                    <TrendingUp size={12} color="#22C55E" strokeWidth={3} />
                    <Text style={styles.metricTrendText}>+12%</Text>
                  </View>
                </View>
                <Text style={styles.metricValue}>{metrics.waterSavedLiters.toFixed(0)}</Text>
                <Text style={styles.metricLabel}>Liters Saved</Text>
              </View>
            </View>

            <View style={styles.metricCard}>
              <ExpoLinearGradient
                colors={['#F59E0B', '#D97706']}
                style={styles.metricGradient}
              />
              <View style={styles.metricContent}>
                <View style={styles.metricHeader}>
                  <View style={[styles.metricIconBg, { backgroundColor: '#F59E0B' }]}>
                    <Zap size={20} color="#FFFFFF" strokeWidth={2.5} />
                  </View>
                  <View style={styles.metricTrend}>
                    <TrendingUp size={12} color="#22C55E" strokeWidth={3} />
                    <Text style={styles.metricTrendText}>+8%</Text>
                  </View>
                </View>
                <Text style={styles.metricValue}>{metrics.energySavedKwh.toFixed(1)}</Text>
                <Text style={styles.metricLabel}>kWh Saved</Text>
              </View>
            </View>

            <View style={styles.metricCard}>
              <ExpoLinearGradient
                colors={['#10B981', '#059669']}
                style={styles.metricGradient}
              />
              <View style={styles.metricContent}>
                <View style={styles.metricHeader}>
                  <View style={[styles.metricIconBg, { backgroundColor: '#10B981' }]}>
                    <Cloud size={20} color="#FFFFFF" strokeWidth={2.5} />
                  </View>
                  <View style={styles.metricTrend}>
                    <TrendingUp size={12} color="#22C55E" strokeWidth={3} />
                    <Text style={styles.metricTrendText}>+15%</Text>
                  </View>
                </View>
                <Text style={styles.metricValue}>{metrics.co2SavedKg.toFixed(1)}</Text>
                <Text style={styles.metricLabel}>kg CO2 Saved</Text>
              </View>
            </View>

            <View style={styles.metricCard}>
              <ExpoLinearGradient
                colors={['#22C55E', '#16A34A']}
                style={styles.metricGradient}
              />
              <View style={styles.metricContent}>
                <View style={styles.metricHeader}>
                  <View style={[styles.metricIconBg, { backgroundColor: '#22C55E' }]}>
                    <TreeDeciduous size={20} color="#FFFFFF" strokeWidth={2.5} />
                  </View>
                  <View style={styles.metricTrend}>
                    <TrendingUp size={12} color="#22C55E" strokeWidth={3} />
                    <Text style={styles.metricTrendText}>+5%</Text>
                  </View>
                </View>
                <Text style={styles.metricValue}>{metrics.treesPlanted}</Text>
                <Text style={styles.metricLabel}>Trees Planted</Text>
              </View>
            </View>
          </View>



          <Text style={styles.sectionTitle}>Impact Comparison</Text>
          {impactComparisons.map((comparison, index) => {
            const IconComponent = comparison.icon === 'droplet' ? Droplet : 
                                   comparison.icon === 'zap' ? Zap : Cloud;
            const savedPercent = ((comparison.traditional - comparison.saved) / comparison.traditional) * 100;
            const maxValue = Math.max(comparison.saved, comparison.traditional);
            return (
              <View key={index} style={styles.comparisonCard}>
                <ExpoLinearGradient
                  colors={[comparison.color, comparison.color]}
                  style={styles.comparisonGradient}
                />
                <View style={styles.comparisonContent}>
                  <View style={styles.comparisonTop}>
                    <View style={styles.comparisonLeft}>
                      <View style={[styles.comparisonIconBg, { backgroundColor: comparison.color }]}>
                        <IconComponent size={18} color="#FFFFFF" strokeWidth={2.5} />
                      </View>
                      <Text style={styles.comparisonTitle}>{comparison.metric}</Text>
                    </View>
                    <View style={styles.comparisonBadge}>
                      <Text style={styles.comparisonBadgeText}>-{savedPercent.toFixed(0)}%</Text>
                    </View>
                  </View>
                  <View style={styles.comparisonBars}>
                    <View style={styles.comparisonBarRow}>
                      <Text style={styles.comparisonBarLabel}>You</Text>
                      <View style={styles.comparisonBarContainer}>
                        <View style={[styles.comparisonBar, {
                          width: `${(comparison.saved / maxValue) * 100}%`,
                          backgroundColor: '#22C55E'
                        }]} />
                      </View>
                      <Text style={styles.comparisonBarValue}>{comparison.saved.toFixed(1)}</Text>
                    </View>
                    <View style={styles.comparisonBarRow}>
                      <Text style={styles.comparisonBarLabel}>Average</Text>
                      <View style={styles.comparisonBarContainer}>
                        <View style={[styles.comparisonBar, {
                          width: `${(comparison.traditional / maxValue) * 100}%`,
                          backgroundColor: '#666666'
                        }]} />
                      </View>
                      <Text style={styles.comparisonBarValue}>{comparison.traditional.toFixed(1)}</Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}

          <Text style={styles.sectionTitle}>Eco Milestones</Text>
          <View style={styles.milestonesContainer}>
            {milestones.map((milestone) => {
              const IconComponent = milestone.icon === 'droplet' ? Droplet :
                                     milestone.icon === 'droplets' ? Droplet :
                                     milestone.icon === 'zap' ? Zap :
                                     milestone.icon === 'leaf' ? Leaf :
                                     TreeDeciduous;
              return (
                <View 
                  key={milestone.id} 
                  style={[
                    styles.milestoneCard,
                    milestone.achieved ? styles.milestoneAchieved : styles.milestoneLocked
                  ]}
                >
                  <ExpoLinearGradient
                    colors={milestone.achieved ? ['#22C55E', '#10B981'] : ['#1a1a1a', '#1a1a1a']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.milestoneGradient}
                  />
                  <View style={styles.milestoneContent}>
                    <View style={[
                      styles.milestoneIconBg,
                      milestone.achieved ? styles.milestoneIconAchieved : styles.milestoneIconLocked
                    ]}>
                      {milestone.achieved ? (
                        <IconComponent size={22} color="#FFFFFF" strokeWidth={2.5} />
                      ) : (
                        <Target size={22} color="#666666" strokeWidth={2.5} />
                      )}
                    </View>
                    <View style={styles.milestoneTextContainer}>
                      <Text style={[
                        styles.milestoneTitle,
                        milestone.achieved ? styles.milestoneTitleAchieved : styles.milestoneTitleLocked
                      ]}>
                        {milestone.title}
                      </Text>
                      <Text style={[
                        styles.milestoneDesc,
                        milestone.achieved ? styles.milestoneDescAchieved : styles.milestoneDescLocked
                      ]}>
                        {milestone.description}
                      </Text>
                    </View>
                  </View>
                  {milestone.achieved && (
                    <View style={styles.milestoneCheck}>
                      <Check size={14} color="#000000" strokeWidth={3} />
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
