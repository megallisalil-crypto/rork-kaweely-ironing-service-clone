import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Stack, useRouter } from "expo-router";
import { User, Phone, Mail, Car, CreditCard, Power, LogOut } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useDriver } from "@/contexts/DriverContext";
import { useAuth } from "@/contexts/AuthContext";

export default function DriverProfileScreen() {
  const { colors } = useTheme();
  const { driverProfile } = useDriver();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/auth");
          },
        }
      ]
    );
  };

  if (!driverProfile) return null;

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
    header: {
      alignItems: "center",
      paddingVertical: 24,
      marginBottom: 20,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.tint,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    avatarText: {
      fontSize: 36,
      fontWeight: "800" as const,
      color: "#FFFFFF",
    },
    name: {
      fontSize: 24,
      fontWeight: "800" as const,
      color: colors.text,
      marginBottom: 4,
    },
    status: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "600" as const,
    },
    section: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700" as const,
      color: colors.text,
      marginBottom: 16,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    lastRow: {
      borderBottomWidth: 0,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    infoText: {
      flex: 1,
      gap: 2,
    },
    infoLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: "600" as const,
    },
    infoValue: {
      fontSize: 15,
      color: colors.text,
      fontWeight: "600" as const,
    },
    logoutButton: {
      backgroundColor: '#EF4444',
      borderRadius: 14,
      paddingVertical: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      marginTop: 8,
    },
    logoutButtonText: {
      fontSize: 16,
      fontWeight: "700" as const,
      color: "#FFFFFF",
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Profile" }} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {driverProfile.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.name}>{driverProfile.name}</Text>
            <Text style={styles.status}>
              Driver • {driverProfile.completedOrders} orders completed
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            
            <View style={styles.infoRow}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]}>
                <User size={20} color="#6366F1" />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Full Name</Text>
                <Text style={styles.infoValue}>{driverProfile.name}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                <Phone size={20} color="#10B981" />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{driverProfile.phone}</Text>
              </View>
            </View>

            <View style={[styles.infoRow, styles.lastRow]}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                <Mail size={20} color="#F59E0B" />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{driverProfile.email}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vehicle Information</Text>
            
            <View style={styles.infoRow}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
                <Car size={20} color="#8B5CF6" />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Vehicle Type</Text>
                <Text style={styles.infoValue}>{driverProfile.vehicleType}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(236, 72, 153, 0.15)' }]}>
                <CreditCard size={20} color="#EC4899" />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>License Plate</Text>
                <Text style={styles.infoValue}>{driverProfile.vehiclePlate}</Text>
              </View>
            </View>

            <View style={[styles.infoRow, styles.lastRow]}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                <CreditCard size={20} color="#3B82F6" />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>License Number</Text>
                <Text style={styles.infoValue}>{driverProfile.licenseNumber}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <LogOut size={20} color="#FFFFFF" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
