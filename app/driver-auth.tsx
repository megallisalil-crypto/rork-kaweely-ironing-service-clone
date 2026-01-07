import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useState } from "react";
import { Stack, useRouter } from "expo-router";
import { Truck, User, Phone, Mail, Car, CreditCard } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useDriver } from "@/contexts/DriverContext";
import { useAuth } from "@/contexts/AuthContext";

export default function DriverAuthScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  
  const { colors } = useTheme();
  const { createDriverProfile } = useDriver();
  const { updateUserRole } = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!name || !phone) {
      Alert.alert("Error", "Please fill in your name and phone number");
      return;
    }

    if (!vehicleType || !vehiclePlate) {
      Alert.alert("Error", "Please fill in vehicle details");
      return;
    }

    try {
      await createDriverProfile({
        name,
        phone,
        email: email || `${phone}@kaweely.com`,
        vehicleType,
        vehiclePlate,
        licenseNumber: licenseNumber || "N/A",
      });

      await updateUserRole('driver');
      router.replace("/driver-dashboard");
    } catch (error) {
      Alert.alert("Error", "Failed to create driver profile");
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 24,
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.tint,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: "700" as const,
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: "center",
    },
    content: {
      flex: 1,
      padding: 24,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700" as const,
      color: colors.text,
      marginBottom: 12,
    },
    inputGroup: {
      marginBottom: 16,
    },
    inputLabel: {
      fontSize: 13,
      fontWeight: "600" as const,
      color: colors.text,
      marginBottom: 8,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.border,
      paddingHorizontal: 14,
    },
    inputIcon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      paddingVertical: 14,
      fontSize: 15,
      color: colors.text,
      fontWeight: "500" as const,
    },
    submitButton: {
      backgroundColor: colors.tint,
      borderRadius: 14,
      paddingVertical: 18,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      marginTop: 8,
      shadowColor: colors.tint,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    submitButtonText: {
      fontSize: 17,
      fontWeight: "800" as const,
      color: "#FFFFFF",
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: "Driver Registration",
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.tint,
        }} 
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Truck size={40} color="#FFFFFF" strokeWidth={2.5} />
          </View>
          <Text style={styles.title}>Become a Driver</Text>
          <Text style={styles.subtitle}>
            Join our team and start earning with flexible hours
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <View style={styles.inputContainer}>
                <User size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number *</Text>
              <View style={styles.inputContainer}>
                <Phone size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+20 123 456 7890"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email (optional)</Text>
              <View style={styles.inputContainer}>
                <Mail size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your.email@example.com"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vehicle Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Vehicle Type *</Text>
              <View style={styles.inputContainer}>
                <Car size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={vehicleType}
                  onChangeText={setVehicleType}
                  placeholder="e.g., Car, Motorcycle, Van"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>License Plate *</Text>
              <View style={styles.inputContainer}>
                <CreditCard size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={vehiclePlate}
                  onChangeText={setVehiclePlate}
                  placeholder="ABC 1234"
                  placeholderTextColor={colors.textSecondary}
                  autoCapitalize="characters"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>License Number (optional)</Text>
              <View style={styles.inputContainer}>
                <CreditCard size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={licenseNumber}
                  onChangeText={setLicenseNumber}
                  placeholder="DL123456"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Truck size={22} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.submitButtonText}>Start Driving</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
