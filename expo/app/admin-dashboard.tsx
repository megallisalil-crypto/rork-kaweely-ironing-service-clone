import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { Stack, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AdminProvider, useAdmin } from "@/contexts/AdminContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  DollarSign,
  LogOut,
  Plus,
  Trash2,
  List,
  Ticket,
  BarChart3,
  Settings,
  FileText,
  Database,
  ShieldCheck,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle2,
  Users2,
  Zap,
  Bell,
  Fingerprint,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

function AdminDashboardContent() {
  const { colors } = useTheme();
  const { format: formatCurrency } = useCurrency();
  const insets = useSafeAreaInsets();
  const { isBiometricAvailable, isBiometricEnabled, disableBiometric } = useAuth();
  const {
    adminProfile,
    metrics,
    revenueStats,
    customerStats,
    serviceStats,
    isLoading,
    createTestOrder,
    clearAllData,
    refreshOrders,
    adminLogs,
  } = useAdmin();

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    console.log('[AdminDashboard] 🔄 Manual refresh triggered');
    setRefreshing(true);
    try {
      await refreshOrders();
      console.log('[AdminDashboard] ✅ Refresh complete');
      Alert.alert('Success', 'Dashboard refreshed successfully!');
    } catch (error) {
      console.error('[AdminDashboard] Refresh error:', error);
      Alert.alert('Error', 'Failed to refresh dashboard');
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  }, [refreshOrders]);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout from admin mode?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("kaweely_admin_profile_v2");
            router.replace("/");
          },
        },
      ]
    );
  };

  const handleCreateTestOrder = () => {
    Alert.alert(
      "Create Test Order",
      "This will create a test order in the system.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Create",
          onPress: async () => {
            try {
              await createTestOrder();
              Alert.alert("Success", "Test order created successfully!");
            } catch {
              Alert.alert("Error", "Failed to create test order");
            }
          },
        },
      ]
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      "⚠️ Clear All Data",
      "This will permanently delete ALL data:\n• Orders\n• Promo Codes\n• Subscriptions\n• Wallet Data\n• Cart Data\n• Admin Logs\n\nThis action CANNOT be undone!",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "I Understand, Delete Everything",
          style: "destructive",
          onPress: async () => {
            try {
              await clearAllData();
              Alert.alert("Success", "All data cleared successfully!");
              router.replace("/setup-admin");
            } catch {
              Alert.alert("Error", "Failed to clear data");
            }
          },
        },
      ]
    );
  };

  if (!adminProfile) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: "Admin Panel", headerShown: true }} />
        <View style={styles.setupContainer}>
          <ShieldCheck size={64} color={colors.tint} />
          <Text style={[styles.setupTitle, { color: colors.text }]}>
            Admin Access Required
          </Text>
          <Text style={[styles.setupText, { color: colors.textSecondary }]}>
            Create your admin profile to access the complete control panel with advanced analytics and management tools.
          </Text>
          <TouchableOpacity
            style={[styles.setupButton, { backgroundColor: colors.tint }]}
            onPress={() => router.push("/setup-admin")}
          >
            <Text style={styles.setupButtonText}>Setup Admin Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.setupButton, { backgroundColor: colors.background, marginTop: 12, borderWidth: 2, borderColor: colors.border }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.setupButtonText, { color: colors.text }]}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const growthDaily = revenueStats.growth.daily;
  const growthWeekly = revenueStats.growth.weekly;
  const growthMonthly = revenueStats.growth.monthly;

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Stack.Screen
        options={{
          title: "Admin Control Panel",
          headerStyle: { backgroundColor: colors.cardBackground },
          headerTintColor: colors.text,
          headerShown: false,
        }}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        refreshControl={
          <RefreshControl 
            refreshing={isLoading || refreshing} 
            tintColor={colors.tint}
            onRefresh={handleRefresh}
          />
        }
      >
        <LinearGradient
          colors={['#1a1a2e', '#16213e', '#0f3460']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + 20 }]}
        >
          <View style={styles.headerContent}>
            <View>
              <View style={styles.headerBadge}>
                <ShieldCheck size={16} color="#FFF" />
                <Text style={styles.headerBadgeText}>ADMIN</Text>
              </View>
              <Text style={styles.headerTitle}>Control Panel</Text>
              <Text style={styles.headerSubtitle}>{adminProfile.name}</Text>
              <Text style={styles.headerRole}>{adminProfile.role.replace('_', ' ').toUpperCase()}</Text>
            </View>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <LogOut size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.quickStats}>
          <View style={[styles.quickStatCard, { backgroundColor: '#10b981' }]}>
            <DollarSign size={24} color="#FFF" />
            <Text style={styles.quickStatValue}>{formatCurrency(revenueStats.today)}</Text>
            <Text style={styles.quickStatLabel}>Today&apos;s Revenue</Text>
            {growthDaily !== 0 && (
              <View style={styles.growthBadge}>
                {growthDaily > 0 ? <TrendingUp size={12} color="#FFF" /> : <TrendingDown size={12} color="#FFF" />}
                <Text style={styles.growthText}>{Math.abs(growthDaily).toFixed(1)}%</Text>
              </View>
            )}
          </View>
          <View style={[styles.quickStatCard, { backgroundColor: '#3b82f6' }]}>
            <Package size={24} color="#FFF" />
            <Text style={styles.quickStatValue}>{metrics.totalOrders}</Text>
            <Text style={styles.quickStatLabel}>Total Orders</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Revenue Analytics</Text>
          <View style={styles.revenueGrid}>
            <View style={[styles.revenueCard, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.revenueLabel, { color: colors.textSecondary }]}>This Week</Text>
              <Text style={[styles.revenueValue, { color: colors.text }]}>
                {formatCurrency(revenueStats.thisWeek)}
              </Text>
              {growthWeekly !== 0 && (
                <View style={[styles.revenueGrowth, { backgroundColor: growthWeekly > 0 ? '#dcfce7' : '#fee2e2' }]}>
                  {growthWeekly > 0 ? (
                    <TrendingUp size={14} color="#16a34a" />
                  ) : (
                    <TrendingDown size={14} color="#dc2626" />
                  )}
                  <Text style={[styles.revenueGrowthText, { color: growthWeekly > 0 ? '#16a34a' : '#dc2626' }]}>
                    {Math.abs(growthWeekly).toFixed(1)}%
                  </Text>
                </View>
              )}
            </View>
            <View style={[styles.revenueCard, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.revenueLabel, { color: colors.textSecondary }]}>This Month</Text>
              <Text style={[styles.revenueValue, { color: colors.text }]}>
                {formatCurrency(revenueStats.thisMonth)}
              </Text>
              {growthMonthly !== 0 && (
                <View style={[styles.revenueGrowth, { backgroundColor: growthMonthly > 0 ? '#dcfce7' : '#fee2e2' }]}>
                  {growthMonthly > 0 ? (
                    <TrendingUp size={14} color="#16a34a" />
                  ) : (
                    <TrendingDown size={14} color="#dc2626" />
                  )}
                  <Text style={[styles.revenueGrowthText, { color: growthMonthly > 0 ? '#16a34a' : '#dc2626' }]}>
                    {Math.abs(growthMonthly).toFixed(1)}%
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Key Metrics</Text>
          <View style={styles.metricsGrid}>
            <View style={[styles.metricCard, { backgroundColor: colors.cardBackground }]}>
              <View style={[styles.metricIcon, { backgroundColor: '#dbeafe' }]}>
                <Users2 size={20} color="#3b82f6" />
              </View>
              <Text style={[styles.metricValue, { color: colors.text }]}>{customerStats.totalCustomers}</Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Customers</Text>
            </View>
            <View style={[styles.metricCard, { backgroundColor: colors.cardBackground }]}>
              <View style={[styles.metricIcon, { backgroundColor: '#fef3c7' }]}>
                <AlertCircle size={20} color="#f59e0b" />
              </View>
              <Text style={[styles.metricValue, { color: colors.text }]}>{metrics.pendingOrders}</Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Pending</Text>
            </View>
            <View style={[styles.metricCard, { backgroundColor: colors.cardBackground }]}>
              <View style={[styles.metricIcon, { backgroundColor: '#dcfce7' }]}>
                <CheckCircle2 size={20} color="#16a34a" />
              </View>
              <Text style={[styles.metricValue, { color: colors.text }]}>{metrics.completedToday}</Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Today</Text>
            </View>
            <View style={[styles.metricCard, { backgroundColor: colors.cardBackground }]}>
              <View style={[styles.metricIcon, { backgroundColor: '#fce7f3' }]}>
                <Zap size={20} color="#ec4899" />
              </View>
              <Text style={[styles.metricValue, { color: colors.text }]}>{serviceStats.expressOrders}</Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Express</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Management Tools</Text>
          <View style={styles.toolsGrid}>
            <TouchableOpacity
              style={[styles.toolCard, { backgroundColor: '#3b82f6' }]}
              onPress={() => router.push('/admin-orders')}
            >
              <List size={24} color="#FFF" />
              <Text style={styles.toolCardText}>All Orders</Text>
              <Text style={styles.toolCardSubtext}>Manage & Track</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toolCard, { backgroundColor: '#8b5cf6' }]}
              onPress={() => router.push('/promo-codes')}
            >
              <Ticket size={24} color="#FFF" />
              <Text style={styles.toolCardText}>Promo Codes</Text>
              <Text style={styles.toolCardSubtext}>Create & Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toolCard, { backgroundColor: '#ec4899' }]}
              onPress={() => router.push('/admin-analytics' as any)}
            >
              <BarChart3 size={24} color="#FFF" />
              <Text style={styles.toolCardText}>Analytics</Text>
              <Text style={styles.toolCardSubtext}>Reports & Insights</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toolCard, { backgroundColor: '#14b8a6' }]}
              onPress={() => router.push('/admin-settings' as any)}
            >
              <Settings size={24} color="#FFF" />
              <Text style={styles.toolCardText}>Settings</Text>
              <Text style={styles.toolCardSubtext}>System Config</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toolCard, { backgroundColor: '#f59e0b' }]}
              onPress={() => router.push('/admin-logs' as any)}
            >
              <Activity size={24} color="#FFF" />
              <Text style={styles.toolCardText}>Activity Logs</Text>
              <Text style={styles.toolCardSubtext}>{adminLogs.length} entries</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toolCard, { backgroundColor: '#6366f1' }]}
              onPress={() => router.push('/admin-customers' as any)}
            >
              <Users size={24} color="#FFF" />
              <Text style={styles.toolCardText}>Customers</Text>
              <Text style={styles.toolCardSubtext}>View All</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.success }]}
              onPress={handleCreateTestOrder}
            >
              <Plus size={20} color="#FFF" />
              <Text style={styles.actionButtonText}>Test Order</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.tint }]}
              onPress={handleRefresh}
            >
              <Activity size={20} color="#FFF" />
              <Text style={styles.actionButtonText}>Refresh Data</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#f59e0b' }]}
              onPress={() => router.push('/admin-reports' as any)}
            >
              <FileText size={20} color="#FFF" />
              <Text style={styles.actionButtonText}>Export Report</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.error }]}
              onPress={handleClearAllData}
            >
              <Trash2 size={20} color="#FFF" />
              <Text style={styles.actionButtonText}>Clear Data</Text>
            </TouchableOpacity>
            {isBiometricAvailable && isBiometricEnabled && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#6366f1' }]}
                onPress={() => {
                  Alert.alert(
                    "Disable Face ID",
                    "This will remove Face ID login for admin access.",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Disable",
                        style: "destructive",
                        onPress: async () => {
                          await disableBiometric();
                          Alert.alert("Success", "Face ID has been disabled");
                        },
                      },
                    ]
                  );
                }}
              >
                <Fingerprint size={20} color="#FFF" />
                <Text style={styles.actionButtonText}>Disable Face ID</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={20} color={colors.textSecondary} />
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>
              Recent Activity
            </Text>
          </View>
          <View style={[styles.activityContainer, { backgroundColor: colors.cardBackground }]}>
            {adminLogs.slice(0, 5).map((log, index) => (
              <View key={log.id} style={[styles.activityItem, { borderBottomColor: colors.border }, index === Math.min(4, adminLogs.length - 1) && { borderBottomWidth: 0 }]}>
                <View style={[styles.activityDot, { backgroundColor: colors.tint }]} />
                <View style={styles.activityContent}>
                  <Text style={[styles.activityAction, { color: colors.text }]}>{log.action.replace(/_/g, ' ')}</Text>
                  <Text style={[styles.activityDescription, { color: colors.textSecondary }]}>
                    {log.description}
                  </Text>
                  <Text style={[styles.activityTime, { color: colors.textTertiary }]}>
                    {new Date(log.timestamp).toLocaleString()}
                  </Text>
                </View>
              </View>
            ))}
            {adminLogs.length === 0 && (
              <View style={styles.emptyActivity}>
                <Bell size={32} color={colors.textTertiary} />
                <Text style={[styles.emptyActivityText, { color: colors.textSecondary }]}>
                  No recent activity
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={[styles.footer, { backgroundColor: colors.cardBackground }]}>
          <Database size={16} color={colors.textTertiary} />
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Admin Panel v2.0 • Kaweely Management System
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

export default function AdminDashboard() {
  return (
    <AdminProvider>
      <AdminDashboardContent />
    </AdminProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  setupContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  setupTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  setupText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  setupButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    width: "100%",
    maxWidth: 300,
  },
  setupButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  header: {
    padding: 24,
    paddingBottom: 32,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
    alignSelf: "flex-start",
  },
  headerBadgeText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 18,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
    marginBottom: 4,
  },
  headerRole: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  quickStats: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  quickStatCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  quickStatValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFF",
  },
  quickStatLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },
  growthBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  growthText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFF",
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  revenueGrid: {
    flexDirection: "row",
    gap: 12,
  },
  revenueCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  revenueLabel: {
    fontSize: 13,
    fontWeight: "500",
  },
  revenueValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  revenueGrowth: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  revenueGrowthText: {
    fontSize: 11,
    fontWeight: "700",
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metricCard: {
    width: "48%",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  toolsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  toolCard: {
    width: "48%",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  toolCardText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
  },
  toolCardSubtext: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionButton: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 14,
    borderRadius: 12,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFF",
  },
  activityContainer: {
    borderRadius: 12,
    padding: 16,
  },
  activityItem: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
    gap: 4,
  },
  activityAction: {
    fontSize: 14,
    fontWeight: "600",
  },
  activityDescription: {
    fontSize: 13,
  },
  activityTime: {
    fontSize: 11,
    marginTop: 2,
  },
  emptyActivity: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 8,
  },
  emptyActivityText: {
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 12,
  },
  footerText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
