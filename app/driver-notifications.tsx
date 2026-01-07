import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Stack } from "expo-router";
import { Bell, DollarSign, Star, Package, Info } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useDriver } from "@/contexts/DriverContext";

export default function DriverNotificationsScreen() {
  const { colors } = useTheme();
  const { notifications, markNotificationAsRead } = useDriver();

  const getIcon = (type: string) => {
    switch (type) {
      case 'new_order': return <Package size={20} color="#3B82F6" />;
      case 'payment': return <DollarSign size={20} color="#10B981" />;
      case 'rating': return <Star size={20} color="#F59E0B" />;
      default: return <Info size={20} color="#6B7280" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'new_order': return 'rgba(59, 130, 246, 0.15)';
      case 'payment': return 'rgba(16, 185, 129, 0.15)';
      case 'rating': return 'rgba(245, 158, 11, 0.15)';
      default: return 'rgba(107, 114, 128, 0.15)';
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 20,
    },
    notificationCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 14,
      padding: 16,
      marginBottom: 12,
      flexDirection: "row",
      gap: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    unread: {
      borderLeftWidth: 4,
      borderLeftColor: colors.tint,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    content2: {
      flex: 1,
    },
    title: {
      fontSize: 15,
      fontWeight: "700" as const,
      color: colors.text,
      marginBottom: 4,
    },
    message: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    time: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: 64,
    },
    emptyText: {
      fontSize: 15,
      color: colors.textSecondary,
      marginTop: 12,
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Notifications" }} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {notifications.length === 0 ? (
            <View style={styles.emptyState}>
              <Bell size={48} color={colors.textSecondary} />
              <Text style={styles.emptyText}>No notifications</Text>
            </View>
          ) : (
            notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={[styles.notificationCard, !notification.read && styles.unread]}
                onPress={() => markNotificationAsRead(notification.id)}
              >
                <View style={[styles.iconContainer, { backgroundColor: getIconBg(notification.type) }]}>
                  {getIcon(notification.type)}
                </View>
                <View style={styles.content2}>
                  <Text style={styles.title}>{notification.title}</Text>
                  <Text style={styles.message}>{notification.message}</Text>
                  <Text style={styles.time}>
                    {notification.createdAt.toLocaleString()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
