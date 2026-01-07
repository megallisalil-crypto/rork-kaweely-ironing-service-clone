import { View, Text, StyleSheet } from "react-native";
import { OrderStatus } from "@/types/order";
import { useTheme } from "@/contexts/ThemeContext";

type StatusBadgeProps = {
  status: OrderStatus;
  size?: "small" | "medium";
};

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pending",
  pickup_scheduled: "Pickup Scheduled",
  pickup_in_progress: "Pickup in Progress",
  processing: "Processing",
  ready: "Ready",
  delivery_in_progress: "Out for Delivery",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusIcons: Record<OrderStatus, string> = {
  pending: "⏳",
  pickup_scheduled: "📅",
  pickup_in_progress: "🚗",
  processing: "⚙️",
  ready: "✨",
  delivery_in_progress: "🚚",
  completed: "✅",
  cancelled: "❌",
};

export function StatusBadge({ status, size = "medium" }: StatusBadgeProps) {
  const { colors } = useTheme();
  
  return (
    <View
      style={[
        styles.badge,
        { 
          backgroundColor: colors[status],
          borderColor: `${colors[status]}40`,
        },
        size === "small" && styles.badgeSmall,
      ]}
    >
      <Text style={[styles.badgeEmoji, size === "small" && styles.badgeEmojiSmall]}>
        {statusIcons[status]}
      </Text>
      <Text
        style={[
          styles.badgeText,
          size === "small" && styles.badgeTextSmall,
        ]}
      >
        {statusLabels[status]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  badgeSmall: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  badgeEmoji: {
    fontSize: 14,
  },
  badgeEmojiSmall: {
    fontSize: 11,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800" as const,
    letterSpacing: 0.4,
  },
  badgeTextSmall: {
    fontSize: 11,
    letterSpacing: 0.3,
  },
});
