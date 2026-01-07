import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import { Stack, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Trash2, AlertTriangle, Wrench } from "lucide-react-native";
import Colors from "@/constants/colors";

export default function ClearStorageScreen() {
  const router = useRouter();

  const handleClearStorage = async () => {
    Alert.alert(
      "Clear All Data",
      "This will clear all stored data including orders, loyalty points, and settings. This action cannot be undone. Are you sure?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert(
                "Success",
                "All data has been cleared. Please restart the app.",
                [
                  {
                    text: "OK",
                    onPress: () => router.back(),
                  },
                ]
              );
            } catch (error) {
              console.error("Error clearing storage:", error);
              Alert.alert("Error", "Failed to clear storage. Please try again.");
            }
          },
        },
      ]
    );
  };

  const handleFixCorruptedData = async () => {
    Alert.alert(
      "Fix Corrupted Data",
      "This will scan and fix any corrupted JSON data in storage. This is safe and won't delete valid data.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Fix Now",
          onPress: async () => {
            try {
              console.log("[Fix] Starting corrupted data scan...");
              const allKeys = await AsyncStorage.getAllKeys();
              console.log("[Fix] Found", allKeys.length, "keys");
              
              let fixedCount = 0;
              const keysToFix = [
                "kaweely_orders",
                "kaweely_loyalty",
                "kaweely_profile",
                "kaweely_notified_offers",
                "kaweely_language",
                "cart_items",
                "kaweely_subscription",
                "kaweely_wallet",
                "kaweely_transactions",
                "kaweely_feedbacks",
                "kaweely_auth",
                "kaweely_theme",
                "kaweely_delivery_address",
              ];
              
              for (const key of keysToFix) {
                try {
                  const value = await AsyncStorage.getItem(key);
                  if (!value) continue;
                  
                  const trimmed = value.trim();
                  
                  if (trimmed === 'null' || trimmed === 'undefined' || trimmed === 'NaN' || trimmed === '[object Object]') {
                    console.log("[Fix] Clearing invalid value for", key, "value:", trimmed.substring(0, 50));
                    await AsyncStorage.removeItem(key);
                    fixedCount++;
                    continue;
                  }
                  
                  if (trimmed.includes('NaN') || trimmed.includes('undefined') || trimmed.includes('[object Object]')) {
                    console.log("[Fix] Found NaN/undefined/[object Object] in", key);
                    await AsyncStorage.removeItem(key);
                    fixedCount++;
                    continue;
                  }
                  
                  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
                    try {
                      JSON.parse(trimmed);
                    } catch (e) {
                      console.log("[Fix] Found corrupted JSON in", key);
                      await AsyncStorage.removeItem(key);
                      fixedCount++;
                    }
                  }
                } catch (error) {
                  console.error("[Fix] Error fixing", key, error);
                }
              }
              
              Alert.alert(
                "Fix Complete",
                `Scanned ${keysToFix.length} storage keys and fixed ${fixedCount} corrupted entries. ${fixedCount > 0 ? 'Please restart the app.' : 'No issues found!'}`,
                [
                  {
                    text: "OK",
                    onPress: () => fixedCount > 0 ? router.back() : null,
                  },
                ]
              );
            } catch (error) {
              console.error("Error fixing data:", error);
              Alert.alert("Error", "Failed to fix data. Please try again.");
            }
          },
        },
      ]
    );
  };

  const handleClearSpecificKeys = async () => {
    Alert.alert(
      "Clear Specific Data",
      "This will clear only orders, loyalty, offers, profile, and language data. Are you sure?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              const keysToRemove = [
                "kaweely_orders",
                "kaweely_loyalty",
                "kaweely_profile",
                "kaweely_notified_offers",
                "kaweely_language",
                "cart_items",
              ];
              
              await AsyncStorage.multiRemove(keysToRemove);
              
              Alert.alert(
                "Success",
                "Selected data has been cleared. Please restart the app.",
                [
                  {
                    text: "OK",
                    onPress: () => router.back(),
                  },
                ]
              );
            } catch (error) {
              console.error("Error clearing storage:", error);
              Alert.alert("Error", "Failed to clear storage. Please try again.");
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Clear Storage",
          headerStyle: {
            backgroundColor: Colors.light.background,
          },
        }}
      />

      <View style={styles.content}>
        <View style={styles.warningCard}>
          <AlertTriangle size={48} color={Colors.light.error} />
          <Text style={styles.warningTitle}>Danger Zone</Text>
          <Text style={styles.warningText}>
            Use these options only if you&apos;re experiencing issues with the app or want to reset all data.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fix Options</Text>

          <TouchableOpacity
            style={[styles.actionButton, styles.fixButton]}
            onPress={handleFixCorruptedData}
          >
            <Wrench size={24} color={Colors.light.tint} />
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, styles.fixText]}>Fix Corrupted Data</Text>
              <Text style={styles.actionDescription}>
                Scan and repair damaged storage (Recommended)
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Clear Options</Text>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleClearSpecificKeys}
          >
            <Trash2 size={24} color={Colors.light.error} />
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Clear App Data</Text>
              <Text style={styles.actionDescription}>
                Clear orders, loyalty, profile, and settings
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.dangerButton]}
            onPress={handleClearStorage}
          >
            <Trash2 size={24} color="#FFFFFF" />
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, styles.dangerText]}>
                Clear All Storage
              </Text>
              <Text style={[styles.actionDescription, styles.dangerText]}>
                Remove all data from local storage
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Why clear storage?</Text>
          <Text style={styles.infoText}>
            • Fix app crashes or loading issues{"\n"}
            • Resolve corrupted data problems{"\n"}
            • Reset the app to default state{"\n"}
            • Troubleshoot unexpected behavior
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    padding: 20,
  },
  warningCard: {
    backgroundColor: `${Colors.light.error}10`,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: Colors.light.error,
  },
  warningTitle: {
    fontSize: 24,
    fontWeight: "800" as const,
    color: Colors.light.error,
    marginTop: 16,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  fixButton: {
    backgroundColor: `${Colors.light.tint}10`,
    borderColor: Colors.light.tint,
  },
  dangerButton: {
    backgroundColor: Colors.light.error,
    borderColor: Colors.light.error,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  fixText: {
    color: Colors.light.tint,
  },
  dangerText: {
    color: "#FFFFFF",
  },
  infoCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    color: Colors.light.text,
    lineHeight: 24,
  },
});
