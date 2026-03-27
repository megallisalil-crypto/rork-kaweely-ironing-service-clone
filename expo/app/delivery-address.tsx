import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { MapPin, Home, Building2, User, Phone, Map } from "lucide-react-native";
import { MapAddressPickerModal, MapPickedAddress } from "@/components/MapAddressPickerModal";
import Colors from "@/constants/colors";
import { useState, useEffect } from "react";
import { useAddress } from "@/contexts/AddressContext";

type AddressType = "home" | "office" | "other";

export default function DeliveryAddressScreen() {
  const router = useRouter();
  const { address: savedAddress, saveAddress } = useAddress();
  const { plan, days, time, promo } = useLocalSearchParams<{
    plan: string;
    days: string;
    time: string;
    promo?: string;
  }>();

  const [addressType, setAddressType] = useState<AddressType>("home");
  const [streetAddress, setStreetAddress] = useState<string>("");
  const [building, setBuilding] = useState<string>("");
  const [floor, setFloor] = useState<string>("");
  const [apartment, setApartment] = useState<string>("");
  const [landmark, setLandmark] = useState<string>("");
  const [contactName, setContactName] = useState<string>("");
  const [contactPhone, setContactPhone] = useState<string>("");
  const [showMapPicker, setShowMapPicker] = useState<boolean>(false);
  const [pickedCoords, setPickedCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if (savedAddress) {
      setAddressType(savedAddress.type || "home");
      setStreetAddress(savedAddress.street || savedAddress.fullAddress || "");
      setBuilding(savedAddress.building || "");
      setFloor(savedAddress.floor || "");
      setApartment(savedAddress.apartment || "");
      setLandmark(savedAddress.landmark || "");
      setContactName(savedAddress.contactName || "");
      setContactPhone(savedAddress.contactPhone || "");
    }
  }, [savedAddress]);

  const handleMapPicked = (picked: MapPickedAddress) => {
    console.log("[DeliveryAddress] Map picked:", picked);
    setStreetAddress(picked.formattedAddress);
    setPickedCoords({ latitude: picked.latitude, longitude: picked.longitude });
  };

  const handleContinue = async () => {
    if (!streetAddress.trim()) {
      Alert.alert("Missing Information", "Please enter your street address");
      return;
    }

    if (!contactName.trim()) {
      Alert.alert("Missing Information", "Please enter contact name");
      return;
    }

    if (!contactPhone.trim()) {
      Alert.alert("Missing Information", "Please enter contact phone number");
      return;
    }

    const addressData = {
      type: addressType,
      street: streetAddress,
      building,
      floor,
      apartment,
      landmark,
      contactName,
      contactPhone,
      latitude: pickedCoords?.latitude,
      longitude: pickedCoords?.longitude,
    };

    console.log("Address data:", addressData);

    await saveAddress(addressData);
    console.log("Address saved to profile");

    const promoParam = promo ? `&promo=${promo}` : "";
    router.push(
      `/payment-methods?plan=${plan}&days=${days}&time=${time}${promoParam}&address=${encodeURIComponent(
        JSON.stringify(addressData)
      )}`
    );
  };

  const addressTypes: { type: AddressType; label: string; icon: any }[] = [
    { type: "home", label: "Home", icon: Home },
    { type: "office", label: "Office", icon: Building2 },
    { type: "other", label: "Other", icon: MapPin },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Delivery Address",
          headerStyle: {
            backgroundColor: Colors.light.cardBackground,
          },
        }}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Delivery Address</Text>
            <Text style={styles.headerSubtitle}>
              Enter your delivery address for pickup and drop-off
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address Type</Text>
            <View style={styles.addressTypesContainer}>
              {addressTypes.map((type) => {
                const isSelected = addressType === type.type;
                const Icon = type.icon;
                return (
                  <TouchableOpacity
                    key={type.type}
                    style={[
                      styles.addressTypeCard,
                      isSelected && styles.addressTypeCardSelected,
                    ]}
                    onPress={() => setAddressType(type.type)}
                  >
                    <Icon
                      size={24}
                      color={isSelected ? "#fff" : Colors.light.tint}
                    />
                    <Text
                      style={[
                        styles.addressTypeLabel,
                        isSelected && styles.addressTypeLabelSelected,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address Details</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Street Address <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.streetRow}>
                <TextInput
                  style={[styles.input, styles.streetInput]}
                  placeholder="Enter street address"
                  placeholderTextColor={Colors.light.textSecondary}
                  value={streetAddress}
                  onChangeText={setStreetAddress}
                  multiline
                  numberOfLines={2}
                  testID="deliveryAddress.streetInput"
                />

                <TouchableOpacity
                  style={styles.openMapButton}
                  onPress={() => setShowMapPicker(true)}
                  testID="deliveryAddress.openMap"
                >
                  <Map size={18} color={Colors.light.tint} strokeWidth={2.5} />
                  <Text style={styles.openMapText}>Open map</Text>
                </TouchableOpacity>
              </View>

              <MapAddressPickerModal
                visible={showMapPicker}
                onClose={() => setShowMapPicker(false)}
                onPick={handleMapPicked}
                accentColor={Colors.light.tint}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Building No.</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Building"
                  placeholderTextColor={Colors.light.textSecondary}
                  value={building}
                  onChangeText={setBuilding}
                />
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Floor</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Floor"
                  placeholderTextColor={Colors.light.textSecondary}
                  value={floor}
                  onChangeText={setFloor}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Apartment/Unit</Text>
              <TextInput
                style={styles.input}
                placeholder="Apartment or unit number"
                placeholderTextColor={Colors.light.textSecondary}
                value={apartment}
                onChangeText={setApartment}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Landmark (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Nearby landmark or additional directions"
                placeholderTextColor={Colors.light.textSecondary}
                value={landmark}
                onChangeText={setLandmark}
                multiline
                numberOfLines={2}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>

            <View style={styles.inputContainer}>
              <View style={styles.inputLabelRow}>
                <User size={16} color={Colors.light.tint} />
                <Text style={styles.inputLabel}>
                  Contact Name <Text style={styles.required}>*</Text>
                </Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Your name"
                placeholderTextColor={Colors.light.textSecondary}
                value={contactName}
                onChangeText={setContactName}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputLabelRow}>
                <Phone size={16} color={Colors.light.tint} />
                <Text style={styles.inputLabel}>
                  Phone Number <Text style={styles.required}>*</Text>
                </Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Your phone number"
                placeholderTextColor={Colors.light.textSecondary}
                value={contactPhone}
                onChangeText={setContactPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.infoCard}>
            <MapPin size={20} color={Colors.light.tint} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Delivery Note</Text>
              <Text style={styles.infoText}>
                Our driver will pick up your clothes from this address and deliver
                them back after ironing according to your schedule.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!streetAddress.trim() ||
              !contactName.trim() ||
              !contactPhone.trim()) &&
              styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={
            !streetAddress.trim() ||
            !contactName.trim() ||
            !contactPhone.trim()
          }
        >
          <Text style={styles.continueButtonText}>Continue to Payment</Text>
        </TouchableOpacity>
      </View>
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
  scrollContent: {
    paddingBottom: 100,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    lineHeight: 24,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  addressTypesContainer: {
    flexDirection: "row",
    gap: 12,
  },
  addressTypeCard: {
    flex: 1,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.light.border,
    gap: 8,
  },
  addressTypeCardSelected: {
    borderColor: Colors.light.tint,
    backgroundColor: Colors.light.tint,
  },
  addressTypeLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  addressTypeLabelSelected: {
    color: "#fff",
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  inputLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  required: {
    color: "#E74C3C",
  },
  input: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
    minHeight: 52,
  },
  streetRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  streetInput: {
    flex: 1,
  },
  openMapButton: {
    height: 52,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: `${Colors.light.tint}0F`,
    borderWidth: 1,
    borderColor: `${Colors.light.tint}33`,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  openMapText: {
    fontSize: 12,
    fontWeight: "800" as const,
    color: Colors.light.tint,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: `${Colors.light.tint}08`,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.light.tint,
    flexDirection: "row",
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: Colors.light.cardBackground,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  continueButton: {
    backgroundColor: Colors.light.tint,
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.light.tint,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonDisabled: {
    backgroundColor: Colors.light.tabIconDefault,
    opacity: 0.5,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#fff",
  },
});
