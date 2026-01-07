import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Stack, router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Shield } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AdminProvider, useAdmin } from "@/contexts/AdminContext";

function SetupAdminContent() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { createAdminProfile } = useAdmin();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email");
      return;
    }

    try {
      await createAdminProfile({
        name: name.trim(),
        email: email.trim().toLowerCase(),
      });
      
      console.log('[SetupAdmin] Profile created successfully');
      Alert.alert("Success", "Admin profile created!", [
        {
          text: "OK",
          onPress: () => router.replace("/admin-dashboard"),
        },
      ]);
    } catch (error) {
      console.error('[SetupAdmin] Error creating admin profile:', error);
      Alert.alert("Error", "Failed to create admin profile. Please try again.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <Stack.Screen
        options={{
          title: "Setup Admin Profile",
          headerStyle: { backgroundColor: colors.cardBackground },
          headerTintColor: colors.text,
        }}
      />
      <ScrollView style={styles.scrollView}>
        <LinearGradient
          colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Shield size={48} color="#FFF" />
          <Text style={styles.headerTitle}>Admin Access</Text>
          <Text style={styles.headerSubtitle}>
            Manage orders, drivers, and operations
          </Text>
        </LinearGradient>

        <View style={styles.form}>
          <View style={styles.infoBox}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>
              Admin Capabilities:
            </Text>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              • View all orders and analytics{"\n"}
              • Assign drivers to orders{"\n"}
              • Update order statuses{"\n"}
              • Monitor business metrics
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.cardBackground,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Email</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.cardBackground,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              value={email}
              onChangeText={setEmail}
              placeholder="admin@kaweely.com"
              placeholderTextColor={colors.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: colors.tint }]}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Create Admin Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

export default function SetupAdmin() {
  return (
    <AdminProvider>
      <SetupAdminContent />
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
  header: {
    padding: 32,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFF",
    marginTop: 16,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    marginTop: 8,
    textAlign: "center",
  },
  form: {
    padding: 24,
    gap: 20,
  },
  infoBox: {
    padding: 20,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#3B82F6",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  submitButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
