import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import { Stack, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AlertTriangle, RefreshCw, Trash2, CheckCircle2 } from "lucide-react-native";
import Colors from "@/constants/colors";
import { useState } from "react";
import { validateAndCleanStorage } from "@/utils/storageCleanup";

export default function FixErrorsScreen() {
  const router = useRouter();
  const [isFixing, setIsFixing] = useState(false);

  const handleQuickFix = async () => {
    setIsFixing(true);
    try {
      console.log("[FixErrors] Starting validation and cleanup...");
      await validateAndCleanStorage();
      
      Alert.alert(
        "Fixed!",
        "Storage has been cleaned. Please restart the app for changes to take effect.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error("[FixErrors] Error during fix:", error);
      Alert.alert("Error", "Failed to fix errors. Please try clearing all storage.");
    } finally {
      setIsFixing(false);
    }
  };

  const handleClearAll = async () => {
    Alert.alert(
      "Clear All Storage?",
      "This will delete ALL app data. This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            setIsFixing(true);
            try {
              await AsyncStorage.clear();
              Alert.alert(
                "Success",
                "All storage cleared. Please restart the app.",
                [
                  {
                    text: "OK",
                    onPress: () => router.back(),
                  },
                ]
              );
            } catch (error) {
              console.error("[FixErrors] Error clearing storage:", error);
              Alert.alert("Error", "Failed to clear storage. Please try again.");
            } finally {
              setIsFixing(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Fix Errors",
          headerStyle: {
            backgroundColor: Colors.light.background,
          },
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.headerCard}>
            <AlertTriangle size={56} color={Colors.light.error} strokeWidth={2} />
            <Text style={styles.headerTitle}>Error Recovery</Text>
            <Text style={styles.headerText}>
              If you&apos;re experiencing errors like &ldquo;JSON Parse error&rdquo; or &ldquo;source.uri&rdquo; errors, use these tools to fix them.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Fixes</Text>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleQuickFix}
              disabled={isFixing}
              activeOpacity={0.8}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${Colors.light.success}20` }]}>
                <RefreshCw size={28} color={Colors.light.success} strokeWidth={2.5} />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Auto-Fix Corrupted Data</Text>
                <Text style={styles.actionDescription}>
                  Automatically detect and remove corrupted storage items
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, styles.dangerCard]}
              onPress={handleClearAll}
              disabled={isFixing}
              activeOpacity={0.8}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${Colors.light.error}20` }]}>
                <Trash2 size={28} color={Colors.light.error} strokeWidth={2.5} />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Clear All Storage</Text>
                <Text style={styles.actionDescription}>
                  Delete all app data and start fresh
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.infoCard}>
            <CheckCircle2 size={24} color={Colors.light.tint} strokeWidth={2.5} />
            <Text style={styles.infoTitle}>Common Error Solutions</Text>
            <Text style={styles.infoText}>
              • <Text style={styles.bold}>JSON Parse error:</Text> Corrupted data in storage - use Auto-Fix{"\n"}
              • <Text style={styles.bold}>source.uri error:</Text> Invalid image URL - usually fixed automatically{"\n"}
              • <Text style={styles.bold}>App crashes:</Text> Try clearing all storage{"\n"}
              • <Text style={styles.bold}>Still having issues?</Text> Restart the app after fixing
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  headerCard: {
    alignItems: "center",
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 20,
    padding: 32,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900" as const,
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 12,
  },
  headerText: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800" as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: "row",
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    gap: 16,
    borderWidth: 2,
    borderColor: Colors.light.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  dangerCard: {
    borderColor: Colors.light.error,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  actionContent: {
    flex: 1,
    justifyContent: "center",
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: "800" as const,
    color: Colors.light.text,
    marginBottom: 6,
  },
  actionDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: `${Colors.light.tint}10`,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: Colors.light.tint,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "800" as const,
    color: Colors.light.text,
    marginTop: 12,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    color: Colors.light.text,
    lineHeight: 26,
  },
  bold: {
    fontWeight: "700" as const,
    color: Colors.light.tint,
  },
});
