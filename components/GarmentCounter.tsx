import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { memo, useMemo } from "react";
import { Plus, Minus } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

type GarmentCounterProps = {
  name: string;
  count: number;
  price: number;
  icon?: string;
  onIncrement: () => void;
  onDecrement: () => void;
};

export const GarmentCounter = memo(function GarmentCounter({
  name,
  count,
  price,
  onIncrement,
  onDecrement,
}: GarmentCounterProps) {
  const { colors } = useTheme();
  
  const formattedPrice = useMemo(() => `${price.toFixed(0)} EGP`, [price]);

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: '#0a0a0a',
      borderRadius: 12,
      padding: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: '#2a2a2a',
      gap: 10,
    },
    infoSection: {
      flex: 1,
      minWidth: 0,
      paddingRight: 8,
    },
    name: {
      fontSize: 11,
      fontWeight: "700" as const,
      color: '#FFFFFF',
      marginBottom: 3,
      flexWrap: 'wrap' as const,
    },
    price: {
      fontSize: 9,
      color: '#888888',
      fontWeight: "600" as const,
    },
    counterSection: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      flexShrink: 0,
    },
    button: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.tint,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.tint,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 2,
    },
    buttonDisabled: {
      backgroundColor: '#444444',
      shadowOpacity: 0,
    },
    countContainer: {
      minWidth: 24,
      alignItems: "center",
    },
    count: {
      fontSize: 13,
      fontWeight: "800" as const,
      color: '#FFFFFF',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.infoSection}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
        <Text style={styles.price}>{formattedPrice}</Text>
      </View>

      <View style={styles.counterSection}>
        <TouchableOpacity
          style={[styles.button, count === 0 && styles.buttonDisabled]}
          onPress={onDecrement}
          disabled={count === 0}
          activeOpacity={0.7}
        >
          <Minus size={14} color={count === 0 ? "#888888" : "#FFFFFF"} strokeWidth={2.5} />
        </TouchableOpacity>

        <View style={styles.countContainer}>
          <Text style={styles.count}>{count}</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={onIncrement}
          activeOpacity={0.7}
        >
          <Plus size={14} color="#FFFFFF" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </View>
  );
});
