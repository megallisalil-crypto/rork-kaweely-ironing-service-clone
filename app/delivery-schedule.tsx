import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { Calendar, Clock } from "lucide-react-native";
import Colors from "@/constants/colors";
import { useState } from "react";

type DayOfWeek = {
  id: string;
  label: string;
  shortLabel: string;
};

type TimeSlot = {
  id: string;
  label: string;
  time: string;
};

const daysOfWeek: DayOfWeek[] = [
  { id: "sunday", label: "Sunday", shortLabel: "Sun" },
  { id: "monday", label: "Monday", shortLabel: "Mon" },
  { id: "tuesday", label: "Tuesday", shortLabel: "Tue" },
  { id: "wednesday", label: "Wednesday", shortLabel: "Wed" },
  { id: "thursday", label: "Thursday", shortLabel: "Thu" },
  { id: "friday", label: "Friday", shortLabel: "Fri" },
  { id: "saturday", label: "Saturday", shortLabel: "Sat" },
];

const timeSlots: TimeSlot[] = [
  { id: "morning-early", label: "Early Morning", time: "8:00 AM - 10:00 AM" },
  { id: "morning-late", label: "Late Morning", time: "10:00 AM - 12:00 PM" },
  { id: "afternoon", label: "Afternoon", time: "12:00 PM - 3:00 PM" },
  { id: "evening", label: "Evening", time: "3:00 PM - 6:00 PM" },
  { id: "night", label: "Night", time: "6:00 PM - 9:00 PM" },
];

const subscriptionTitles: Record<string, string> = {
  weekly: "Weekly Plan",
  monthly: "1 Month Plan",
  "3months": "3 Months Plan",
  "6months": "6 Months Plan",
  yearly: "1 Year Plan",
};

export default function DeliveryScheduleScreen() {
  const router = useRouter();
  const { plan, promo } = useLocalSearchParams<{ plan: string; promo?: string }>();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleDayToggle = (dayId: string) => {
    if (selectedDays.includes(dayId)) {
      setSelectedDays(selectedDays.filter((id) => id !== dayId));
    } else {
      if (selectedDays.length >= 2) {
        Alert.alert(
          "Maximum Days Selected",
          "You can only select 2 days per week for delivery"
        );
        return;
      }
      setSelectedDays([...selectedDays, dayId]);
    }
  };

  const handleTimeSelect = (timeId: string) => {
    setSelectedTime(timeId);
  };

  const handleContinue = () => {
    if (selectedDays.length !== 2) {
      Alert.alert(
        "Select Delivery Days",
        "Please select exactly 2 days per week for delivery"
      );
      return;
    }

    if (!selectedTime) {
      Alert.alert("Select Delivery Time", "Please choose a delivery time slot");
      return;
    }

    console.log("Delivery schedule:", {
      plan,
      days: selectedDays,
      time: selectedTime,
      promo,
    });

    const promoParam = promo ? `&promo=${promo}` : "";
    router.push(
      `/payment-methods?plan=${plan}&days=${selectedDays.join(",")}&time=${selectedTime}${promoParam}`
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Delivery Schedule",
          headerStyle: {
            backgroundColor: Colors.light.cardBackground,
          },
        }}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Choose Delivery Schedule</Text>
            <Text style={styles.headerSubtitle}>
              Select 2 days per week and your preferred delivery time for{" "}
              {subscriptionTitles[plan || ""] || "your subscription"}
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Calendar size={24} color={Colors.light.tint} />
              <Text style={styles.sectionTitle}>Delivery Days</Text>
              <View style={styles.dayCounter}>
                <Text style={styles.dayCounterText}>
                  {selectedDays.length}/2
                </Text>
              </View>
            </View>
            <Text style={styles.sectionSubtitle}>
              Select 2 days of the week for delivery
            </Text>

            <View style={styles.daysGrid}>
              {daysOfWeek.map((day) => {
                const isSelected = selectedDays.includes(day.id);
                return (
                  <TouchableOpacity
                    key={day.id}
                    style={[
                      styles.dayCard,
                      isSelected && styles.dayCardSelected,
                    ]}
                    onPress={() => handleDayToggle(day.id)}
                  >
                    <Text
                      style={[
                        styles.dayShortLabel,
                        isSelected && styles.dayShortLabelSelected,
                      ]}
                    >
                      {day.shortLabel}
                    </Text>
                    <Text
                      style={[
                        styles.dayLabel,
                        isSelected && styles.dayLabelSelected,
                      ]}
                    >
                      {day.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={24} color={Colors.light.tint} />
              <Text style={styles.sectionTitle}>Delivery Time</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              Choose your preferred delivery time
            </Text>

            <View style={styles.timeSlotsContainer}>
              {timeSlots.map((slot) => {
                const isSelected = selectedTime === slot.id;
                return (
                  <TouchableOpacity
                    key={slot.id}
                    style={[
                      styles.timeSlotCard,
                      isSelected && styles.timeSlotCardSelected,
                    ]}
                    onPress={() => handleTimeSelect(slot.id)}
                  >
                    <View style={styles.timeSlotContent}>
                      <Text
                        style={[
                          styles.timeSlotLabel,
                          isSelected && styles.timeSlotLabelSelected,
                        ]}
                      >
                        {slot.label}
                      </Text>
                      <Text
                        style={[
                          styles.timeSlotTime,
                          isSelected && styles.timeSlotTimeSelected,
                        ]}
                      >
                        {slot.time}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Important</Text>
            <Text style={styles.infoText}>
              • Deliveries will be made on your selected days each week{"\n"}
              • You can change your schedule anytime from settings{"\n"}
              • We'll notify you 1 day before each delivery
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            (selectedDays.length !== 2 || !selectedTime) &&
              styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={selectedDays.length !== 2 || !selectedTime}
        >
          <Text style={styles.continueButtonText}>Continue to Address</Text>
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
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.light.text,
    flex: 1,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  dayCounter: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dayCounterText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#fff",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  dayCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.light.border,
    width: "30%",
    minHeight: 76,
  },
  dayCardSelected: {
    borderColor: Colors.light.tint,
    backgroundColor: Colors.light.tint,
  },
  dayShortLabel: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 6,
  },
  dayShortLabelSelected: {
    color: "#FFFFFF",
  },
  dayLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    textAlign: "center",
  },
  dayLabelSelected: {
    color: "rgba(255, 255, 255, 0.95)",
  },
  timeSlotsContainer: {
    gap: 12,
  },
  timeSlotCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  timeSlotCardSelected: {
    borderColor: Colors.light.tint,
    backgroundColor: Colors.light.tint,
  },
  timeSlotContent: {
    flexDirection: "column",
  },
  timeSlotLabel: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  timeSlotLabelSelected: {
    color: "#fff",
  },
  timeSlotTime: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  timeSlotTimeSelected: {
    color: "rgba(255, 255, 255, 0.9)",
  },
  infoCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    color: Colors.light.text,
    lineHeight: 22,
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
