import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Stack } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { KAWEELY_POLICIES } from "@/constants/policies";
import { Shield } from "lucide-react-native";

export default function PoliciesScreen() {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    header: {
      padding: 24,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.tint + "15",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: "800" as const,
      color: colors.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: "600" as const,
      color: colors.tint,
      marginBottom: 12,
    },
    philosophy: {
      fontSize: 14,
      lineHeight: 22,
      color: colors.textSecondary,
      fontStyle: "italic" as const,
    },
    content: {
      padding: 24,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700" as const,
      color: colors.text,
      marginBottom: 16,
      paddingBottom: 8,
      borderBottomWidth: 2,
      borderBottomColor: colors.tint,
    },
    sectionTitleImportant: {
      borderBottomColor: "#e74c3c",
    },
    item: {
      fontSize: 14,
      lineHeight: 22,
      color: colors.text,
      marginBottom: 12,
      paddingLeft: 12,
    },
    footer: {
      padding: 24,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      alignItems: "center",
    },
    footerText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontStyle: "italic" as const,
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Service Policies",
          headerStyle: { backgroundColor: colors.cardBackground },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Shield size={28} color={colors.tint} strokeWidth={2} />
          </View>
          <Text style={styles.title}>{KAWEELY_POLICIES.title}</Text>
          <Text style={styles.subtitle}>{KAWEELY_POLICIES.subtitle}</Text>
          <Text style={styles.philosophy}>{KAWEELY_POLICIES.philosophy}</Text>
        </View>

        <View style={styles.content}>
          {KAWEELY_POLICIES.sections.map((section, index) => (
            <View key={index} style={styles.section}>
              <Text style={[styles.sectionTitle, section.important && styles.sectionTitleImportant]}>
                {section.title}
              </Text>
              {section.items.map((item, itemIndex) => (
                <Text key={itemIndex} style={styles.item}>
                  • {item}
                </Text>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Last Updated: {KAWEELY_POLICIES.lastUpdated}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
