import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from "react-native";
import { Stack, router } from "expo-router";
import { AdminProvider, useAdmin } from "@/contexts/AdminContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Search, Filter, X, ChevronRight } from "lucide-react-native";
import { StatusBadge } from "@/components/StatusBadge";
import { OrderStatus } from "@/types/order";

function AdminOrdersContent() {
  const { colors } = useTheme();
  const { format } = useCurrency();
  const { orders, isLoading, refreshOrders } = useAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(query) ||
          order.customerName.toLowerCase().includes(query) ||
          order.phoneNumber?.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    return filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [orders, searchQuery, statusFilter]);

  const allStatuses: (OrderStatus | "all")[] = [
    "all",
    "pending",
    "pickup_scheduled",
    "pickup_in_progress",
    "processing",
    "ready",
    "delivery_in_progress",
    "completed",
    "cancelled",
  ];

  const getStatusLabel = (status: OrderStatus | "all") => {
    if (status === "all") return "All Orders";
    const labels: Record<OrderStatus, string> = {
      pending: "Pending",
      pickup_scheduled: "Pickup Scheduled",
      pickup_in_progress: "Picking Up",
      processing: "Processing",
      ready: "Ready",
      delivery_in_progress: "Out for Delivery",
      completed: "Completed",
      cancelled: "Cancelled",
    };
    return labels[status];
  };

  const getStatusCount = (status: OrderStatus | "all") => {
    if (status === "all") return orders.length;
    return orders.filter((o) => o.status === status).length;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: "All Orders",
          headerStyle: { backgroundColor: colors.cardBackground },
          headerTintColor: colors.text,
        }}
      />

      <View style={[styles.searchContainer, { backgroundColor: colors.cardBackground }]}>
        <View style={[styles.searchBar, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search orders, customers, phone..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.filterButton,
            { backgroundColor: showFilters ? colors.tint : colors.background, borderColor: colors.border },
          ]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color={showFilters ? "#FFF" : colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersContent}
        >
          {allStatuses.map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterChip,
                {
                  backgroundColor: statusFilter === status ? colors.tint : colors.cardBackground,
                  borderColor: statusFilter === status ? colors.tint : colors.border,
                },
              ]}
              onPress={() => setStatusFilter(status)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  {
                    color: statusFilter === status ? "#FFF" : colors.text,
                  },
                ]}
              >
                {getStatusLabel(status)} ({getStatusCount(status)})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <View style={[styles.resultsHeader, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.resultsText, { color: colors.textSecondary }]}>
          {filteredOrders.length} {filteredOrders.length === 1 ? "order" : "orders"} found
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshOrders}
            tintColor={colors.tint}
          />
        }
      >
        <View style={styles.content}>
          {filteredOrders.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.cardBackground }]}>
              <Search size={48} color={colors.textTertiary} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No orders found
              </Text>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {searchQuery ? "Try different search terms" : "No orders match the selected filters"}
              </Text>
            </View>
          ) : (
            filteredOrders.map((order) => (
              <TouchableOpacity
                key={order.id}
                style={[styles.orderCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
                onPress={() => router.push(`/order/${order.id}`)}
                activeOpacity={0.7}
              >
                <View style={styles.orderHeader}>
                  <Text style={[styles.orderNumber, { color: colors.text }]}>
                    {order.orderNumber}
                  </Text>
                  <StatusBadge status={order.status} />
                </View>

                <View style={styles.orderInfo}>
                  <Text style={[styles.customerName, { color: colors.text }]}>
                    {order.customerName}
                  </Text>
                  {order.phoneNumber && (
                    <Text style={[styles.phoneNumber, { color: colors.textSecondary }]}>
                      {order.phoneNumber}
                    </Text>
                  )}
                </View>

                <View style={styles.orderMeta}>
                  <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                    {order.items.length} {order.items.length === 1 ? "item" : "items"}
                  </Text>
                  <Text style={[styles.metaText, { color: colors.textSecondary }]}>•</Text>
                  <Text style={[styles.orderPrice, { color: colors.tint }]}>
                    {format(order.totalPrice)}
                  </Text>
                </View>

                <View style={styles.orderFooter}>
                  <Text style={[styles.dateText, { color: colors.textTertiary }]}>
                    {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  <ChevronRight size={20} color={colors.textTertiary} />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

export default function AdminOrders() {
  return (
    <AdminProvider>
      <AdminOrdersContent />
    </AdminProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    alignItems: "center",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  filtersScroll: {
    maxHeight: 60,
  },
  filtersContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "700" as const,
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsText: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  orderCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    gap: 12,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: "800" as const,
  },
  orderInfo: {
    gap: 4,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
  phoneNumber: {
    fontSize: 14,
    fontWeight: "500" as const,
  },
  orderMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    fontWeight: "500" as const,
  },
  orderPrice: {
    fontSize: 16,
    fontWeight: "700" as const,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  dateText: {
    fontSize: 12,
    fontWeight: "500" as const,
  },
  emptyState: {
    padding: 48,
    borderRadius: 16,
    alignItems: "center",
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    marginTop: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },
});
