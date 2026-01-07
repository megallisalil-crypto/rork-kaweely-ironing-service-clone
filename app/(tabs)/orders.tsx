import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Animated } from "react-native";
import { Stack } from "expo-router";
import { useState, useMemo } from "react";
import { useOrders } from "@/contexts/OrderContext";
import { OrderCard } from "@/components/OrderCard";
import { OrderStatus } from "@/types/order";
import { Package2, Sparkles, ChevronDown, SlidersHorizontal } from "lucide-react-native";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function OrdersScreen() {
  const ordersContext = useOrders();
  const { t } = useLanguage();
  const { colors } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState<OrderStatus | "all">("all");
  const [showFilters, setShowFilters] = useState(false);
  const filterAnimation = useState(new Animated.Value(0))[0];
  const logoUrl = "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/8nlam6zuq1umfi1sxbk5q";
  const luxuryBackgroundUrl = "https://r2-pub.rork.com/generated-images/537a97c4-0cca-48ec-9e75-62568cf7a3ca.png";
  
  const orders = useMemo(() => ordersContext?.orders || [], [ordersContext?.orders]);
  const isLoading = ordersContext?.isLoading || false;

  const filters: { label: string; value: OrderStatus | "all"; color?: string }[] = [
    { label: t.orders.all, value: "all", color: colors.tint },
    { label: t.orders.pending, value: "pending", color: colors.accent },
    { label: "Pickup", value: "pickup_in_progress", color: "#EC4899" },
    { label: t.orders.inProgress, value: "processing", color: colors.tint },
    { label: "Ready", value: "ready", color: colors.success },
    { label: "Delivery", value: "delivery_in_progress", color: "#8B5CF6" },
    { label: t.orders.completed, value: "completed", color: colors.success },
  ];

  const filteredOrders = useMemo(
    () => {
      if (!ordersContext || !Array.isArray(orders)) return [];
      return selectedFilter === "all"
        ? orders
        : orders.filter((order) => order.status === selectedFilter);
    },
    [ordersContext, orders, selectedFilter]
  );

  const orderCounts = useMemo(() => {
    const counts: Record<string, number> = { all: ordersContext && Array.isArray(orders) ? orders.length : 0 };
    if (ordersContext && Array.isArray(orders)) {
      orders.forEach((order) => {
        counts[order.status] = (counts[order.status] || 0) + 1;
      });
    }
    return counts;
  }, [ordersContext, orders]);

  const toggleFilters = () => {
    const toValue = showFilters ? 0 : 1;
    setShowFilters(!showFilters);
    Animated.spring(filterAnimation, {
      toValue,
      useNativeDriver: false,
      tension: 40,
      friction: 8,
    }).start();
  };

  const filterHeight = filterAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 80],
  });

  const filterOpacity = filterAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const chevronRotation = filterAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#1A1412',
    },
    woodBackground: {
      flex: 1,
      backgroundColor: '#F5F1ED',
      position: 'relative' as const,
    },
    luxuryBackgroundImage: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.85,
    },
    overlayGradient: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255,255,255,0.15)',
    },
    cabinetInnerShadow: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      height: 120,
      backgroundColor: 'transparent',
    },
    shadowGradientTop: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      height: 80,
      backgroundColor: 'rgba(0,0,0,0.35)',
    },
    shadowGradientSides: {
      position: 'absolute' as const,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    shadowLeft: {
      position: 'absolute' as const,
      left: 0,
      top: 0,
      bottom: 0,
      width: 20,
      backgroundColor: 'rgba(0,0,0,0.2)',
    },
    shadowRight: {
      position: 'absolute' as const,
      right: 0,
      top: 0,
      bottom: 0,
      width: 20,
      backgroundColor: 'rgba(0,0,0,0.2)',
    },
    cabinetFrame: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      height: 8,
      backgroundColor: '#5A4536',
      borderBottomWidth: 3,
      borderBottomColor: '#6B5444',
    },
    frameHighlight: {
      position: 'absolute' as const,
      top: 1,
      left: 20,
      right: 20,
      height: 2,
      backgroundColor: '#7A6552',
      opacity: 0.6,
    },
    cabinetSideLeft: {
      position: 'absolute' as const,
      left: 0,
      top: 0,
      bottom: 0,
      width: 8,
      backgroundColor: '#4A3A2E',
      borderRightWidth: 2,
      borderRightColor: '#5A4536',
    },
    cabinetSideRight: {
      position: 'absolute' as const,
      right: 0,
      top: 0,
      bottom: 0,
      width: 8,
      backgroundColor: '#4A3A2E',
      borderLeftWidth: 2,
      borderLeftColor: '#5A4536',
    },
    woodTextureLines: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    hangingRod: {
      height: 16,
      backgroundColor: '#C9AD8A',
      borderRadius: 8,
      marginTop: 16,
      marginHorizontal: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.7,
      shadowRadius: 8,
      elevation: 10,
      borderTopWidth: 2,
      borderTopColor: '#E5D3B3',
      borderBottomWidth: 3,
      borderBottomColor: '#9A7F5F',
      position: 'relative' as const,
    },
    rodReflection: {
      position: 'absolute' as const,
      top: 3,
      left: 6,
      right: 6,
      height: 3,
      backgroundColor: '#F5E5C5',
      borderRadius: 2,
      opacity: 0.6,
    },
    rodBracketLeft: {
      position: 'absolute' as const,
      left: 16,
      top: 10,
      width: 10,
      height: 22,
      backgroundColor: '#A8896B',
      borderRadius: 3,
      borderWidth: 1,
      borderColor: '#8A6E4F',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 3,
      elevation: 4,
    },
    rodBracketRight: {
      position: 'absolute' as const,
      right: 16,
      top: 10,
      width: 10,
      height: 22,
      backgroundColor: '#A8896B',
      borderRadius: 3,
      borderWidth: 1,
      borderColor: '#8A6E4F',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 3,
      elevation: 4,
    },
    bracketScrew: {
      position: 'absolute' as const,
      top: 4,
      left: 2,
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: '#5A4536',
      borderWidth: 1,
      borderColor: '#4A3A2E',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
    },
    loadingText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: "600" as const,
    },
    header: {
      backgroundColor: colors.cardBackground,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    headerTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    filterToggleButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: colors.background,
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: colors.border,
      shadowColor: colors.tint,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    filterToggleIcon: {
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    filterToggleTextContainer: {
      flexDirection: "column",
      gap: 2,
    },
    filterToggleTitle: {
      fontSize: 12,
      fontWeight: "700" as const,
      color: colors.text,
    },
    filterToggleSubtitle: {
      fontSize: 9,
      fontWeight: "500" as const,
      color: colors.textSecondary,
    },
    headerTitle: {
      fontSize: 16,
      fontWeight: "800" as const,
      color: colors.text,
    },
    headerSubtitle: {
      fontSize: 12,
      fontWeight: "500" as const,
      color: colors.textSecondary,
      marginTop: 2,
    },
    totalBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: `${colors.tint}15`,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: `${colors.tint}30`,
      shadowColor: colors.tint,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 2,
    },
    totalBadgeIcon: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.tint,
      alignItems: "center",
      justifyContent: "center",
    },
    totalBadgeText: {
      color: colors.tint,
      fontSize: 13,
      fontWeight: "800" as const,
    },
    totalBadgeLabel: {
      color: colors.tint,
      fontSize: 9,
      fontWeight: "600" as const,
      opacity: 0.7,
    },
    filterContainer: {
      overflow: "hidden",
    },
    filterInnerContainer: {
      flexGrow: 0,
    },
    filterContent: {
      paddingHorizontal: 14,
      paddingBottom: 12,
      gap: 6,
    },
    filterButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 30,
      backgroundColor: `${colors.tint}08`,
      borderWidth: 2,
      borderColor: `${colors.border}80`,
      gap: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    filterButtonActive: {
      borderWidth: 0,
      shadowOpacity: 0.4,
      shadowRadius: 10,
      transform: [{ scale: 1.03 }],
      elevation: 5,
    },
    filterButtonText: {
      fontSize: 13,
      fontWeight: "700" as const,
      color: colors.text,
    },
    filterButtonTextActive: {
      color: "#FFFFFF",
    },
    countBadge: {
      backgroundColor: colors.border,
      minWidth: 22,
      height: 22,
      borderRadius: 11,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 6,
    },
    countBadgeActive: {
      backgroundColor: "rgba(255, 255, 255, 0.3)",
    },
    countBadgeText: {
      color: colors.textSecondary,
      fontSize: 11,
      fontWeight: "900" as const,
    },
    countBadgeTextActive: {
      color: "#FFFFFF",
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    ordersContainer: {
      padding: 10,
      paddingTop: 0,
    },
    cabinetContent: {
      paddingHorizontal: 8,
      paddingTop: 6,
    },
    resultsHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 16,
      paddingHorizontal: 4,
    },
    resultsText: {
      fontSize: 13,
      color: '#8B7355',
      fontWeight: "700" as const,
      letterSpacing: 0.5,
      textShadowColor: 'rgba(255,255,255,0.8)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
      paddingVertical: 80,
    },
    emptyIconContainer: {
      width: 110,
      height: 110,
      borderRadius: 55,
      backgroundColor: colors.cardBackground,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
      borderWidth: 2,
      borderColor: colors.border,
      position: "relative" as const,
    },
    emptyLogo: {
      width: 70,
      height: 70,
      position: "absolute" as const,
      top: 10,
      left: 10,
      opacity: 0.1,
    },
    emptyStateTitle: {
      fontSize: 20,
      fontWeight: "800" as const,
      color: colors.text,
      marginBottom: 10,
      textAlign: "center",
    },
    emptyStateText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 20,
      fontWeight: "500" as const,
    },
  });

  if (!ordersContext || isLoading) {
    return (
      <View style={styles.container}>
        <Stack.Screen 
          options={{ 
            title: t.orders.title,
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.text,
          }} 
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
          <Text style={styles.loadingText}>{t.common.loading}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: t.orders.title,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
        }} 
      />

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.filterToggleButton}
            onPress={toggleFilters}
            activeOpacity={0.7}
          >
            <View style={[styles.filterToggleIcon, { backgroundColor: `${colors.tint}15` }]}>
              <SlidersHorizontal size={14} color={colors.tint} strokeWidth={2.5} />
            </View>
            <View style={styles.filterToggleTextContainer}>
              <Text style={styles.filterToggleTitle}>Filters</Text>
              <Text style={styles.filterToggleSubtitle}>Tap to {showFilters ? 'hide' : 'show'}</Text>
            </View>
            <Animated.View style={{ transform: [{ rotate: chevronRotation }] }}>
              <ChevronDown size={18} color={colors.textSecondary} strokeWidth={2.5} />
            </Animated.View>
          </TouchableOpacity>
          
          <View style={styles.totalBadge}>
            <View style={styles.totalBadgeIcon}>
              <Package2 size={10} color={colors.background} strokeWidth={3} />
            </View>
            <View>
              <Text style={styles.totalBadgeText}>{orders.length}</Text>
              <Text style={styles.totalBadgeLabel}>ORDERS</Text>
            </View>
          </View>
        </View>
        
        <Animated.View style={[styles.filterContainer, { height: filterHeight }]}>
          <Animated.View style={{ opacity: filterOpacity }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterInnerContainer}
              contentContainerStyle={styles.filterContent}
            >
              {filters.map((filter) => {
                const count = orderCounts[filter.value] || 0;
                const isActive = selectedFilter === filter.value;
                
                return (
                  <TouchableOpacity
                    key={filter.value}
                    style={[
                      styles.filterButton,
                      isActive && styles.filterButtonActive,
                      isActive && { backgroundColor: filter.color || colors.tint },
                    ]}
                    onPress={() => setSelectedFilter(filter.value)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        isActive && styles.filterButtonTextActive,
                      ]}
                    >
                      {filter.label}
                    </Text>
                    {count > 0 && (
                      <View style={[styles.countBadge, isActive && styles.countBadgeActive]}>
                        <Text style={[styles.countBadgeText, isActive && styles.countBadgeTextActive]}>
                          {count}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Animated.View>
        </Animated.View>
      </View>

      <View style={styles.woodBackground}>
        <Image
          source={{ uri: luxuryBackgroundUrl }}
          style={styles.luxuryBackgroundImage}
          resizeMode="cover"
        />
        <View style={styles.overlayGradient} />
        
        <View style={styles.hangingRod}>
          <View style={styles.rodReflection} />
        </View>
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {filteredOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              {logoUrl && logoUrl.trim().length > 0 && logoUrl.startsWith('http') && (
                <Image
                  source={{ uri: logoUrl }}
                  style={styles.emptyLogo}
                  resizeMode="contain"
                  onError={(error) => console.log('[Orders] Empty logo error:', error.nativeEvent?.error || 'Unknown error')}
                />
              )}
              <Package2 size={64} color={colors.textSecondary} strokeWidth={1.5} />
            </View>
            <Text style={styles.emptyStateTitle}>{t.orders.noOrders}</Text>
            <Text style={styles.emptyStateText}>
              {selectedFilter === "all" 
                ? "You haven't placed any orders yet.\nStart by creating your first order!"
                : `No ${filters.find(f => f.value === selectedFilter)?.label.toLowerCase()} orders at the moment.\nTry selecting a different filter.`
              }
            </Text>
          </View>
          ) : (
            <View style={styles.cabinetContent}>
              <View style={styles.resultsHeader}>
                <Sparkles size={18} color="#D4B896" strokeWidth={2.5} />
                <Text style={styles.resultsText}>
                  {filteredOrders.length} freshly ironed {filteredOrders.length === 1 ? 'order' : 'orders'}
                </Text>
              </View>
              <View style={styles.ordersContainer}>
                {filteredOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
