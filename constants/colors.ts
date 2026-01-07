const pureWhite = "#FFFFFF";
const softWhite = "#F8FAFC";
const lightGray = "#F1F5F9";
const mediumGray = "#94A3B8";
const darkGray = "#334155";
const deepCharcoal = "#0A0A0F";
const deeperCharcoal = "#050508";
const emeraldGreen = "#10B981";
const richBlack = "#000000";
const glassWhite = "rgba(255, 255, 255, 0.95)";
const glassBlack = "rgba(0, 0, 0, 0.85)";

export type ColorScheme = 'teal' | 'purple' | 'rose' | 'blue' | 'green' | 'sunset';

export const colorSchemes: Record<ColorScheme, { name: string; emoji: string }> = {
  teal: { name: 'Ocean Breeze', emoji: '🌊' },
  purple: { name: 'Royal Purple', emoji: '👑' },
  rose: { name: 'Rose Garden', emoji: '🌹' },
  blue: { name: 'Sky Blue', emoji: '☁️' },
  green: { name: 'Fresh Mint', emoji: '🍃' },
  sunset: { name: 'Sunset Glow', emoji: '🌅' },
};

const schemeColors = {
  teal: {
    primary: "#14B8A6",
    secondary: "#0EA5E9",
    accent: "#F59E0B",
    gradient1: "#14B8A6",
    gradient2: "#0EA5E9",
    gradient3: "#F59E0B",
    gradient4: "#F472B6",
    glow: "rgba(20, 184, 166, 0.25)",
  },
  purple: {
    primary: "#A855F7",
    secondary: "#C084FC",
    accent: "#F472B6",
    gradient1: "#A855F7",
    gradient2: "#8B5CF6",
    gradient3: "#C084FC",
    gradient4: "#F472B6",
    glow: "rgba(168, 85, 247, 0.25)",
  },
  rose: {
    primary: "#F43F5E",
    secondary: "#FB7185",
    accent: "#FBBF24",
    gradient1: "#F43F5E",
    gradient2: "#FB7185",
    gradient3: "#FBBF24",
    gradient4: "#FCD34D",
    glow: "rgba(244, 63, 94, 0.25)",
  },
  blue: {
    primary: "#3B82F6",
    secondary: "#60A5FA",
    accent: "#14B8A6",
    gradient1: "#3B82F6",
    gradient2: "#60A5FA",
    gradient3: "#14B8A6",
    gradient4: "#A855F7",
    glow: "rgba(59, 130, 246, 0.25)",
  },
  green: {
    primary: "#10B981",
    secondary: "#34D399",
    accent: "#14B8A6",
    gradient1: "#10B981",
    gradient2: "#34D399",
    gradient3: "#14B8A6",
    gradient4: "#3B82F6",
    glow: "rgba(16, 185, 129, 0.25)",
  },
  sunset: {
    primary: "#F97316",
    secondary: "#FB923C",
    accent: "#EC4899",
    gradient1: "#F97316",
    gradient2: "#FB923C",
    gradient3: "#EC4899",
    gradient4: "#A855F7",
    glow: "rgba(249, 115, 22, 0.25)",
  },
};

export const getColorScheme = (scheme: ColorScheme, isDark: boolean) => {
  const colors = schemeColors[scheme];
  
  return {
    light: {
      text: "#0F172A",
      textSecondary: "#64748B",
      textTertiary: "#94A3B8",
      background: "#FAFAFA",
      backgroundSecondary: softWhite,
      tint: colors.primary,
      accent: colors.accent,
      tabIconDefault: "#94A3B8",
      tabIconSelected: colors.primary,
      cardBackground: pureWhite,
      cardBackgroundSecondary: "#FCFCFC",
      border: "#E5E7EB",
      borderLight: "#F3F4F6",
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
      info: "#3B82F6",
      pending: "#F59E0B",
      pickup_scheduled: colors.secondary,
      pickup_in_progress: colors.accent,
      processing: colors.primary,
      ready: "#10B981",
      delivery_in_progress: colors.secondary,
      completed: "#10B981",
      cancelled: "#6B7280",
      primaryGradientStart: colors.gradient1,
      primaryGradientEnd: colors.gradient2,
      secondaryGradientStart: colors.gradient3,
      secondaryGradientEnd: colors.gradient4,
      glow: colors.glow,
      glassBackground: "rgba(255, 255, 255, 0.7)",
      glassBackgroundStrong: "rgba(255, 255, 255, 0.9)",
      glassBorder: "rgba(255, 255, 255, 0.3)",
      shadowColor: "rgba(0, 0, 0, 0.1)",
      shadowColorStrong: "rgba(0, 0, 0, 0.15)",
    },
    dark: {
      text: "#F9FAFB",
      textSecondary: "#9CA3AF",
      textTertiary: "#6B7280",
      background: richBlack,
      backgroundSecondary: deepCharcoal,
      tint: colors.primary,
      accent: colors.accent,
      tabIconDefault: "#6B7280",
      tabIconSelected: colors.primary,
      cardBackground: "#0F0F14",
      cardBackgroundSecondary: "#151519",
      border: "#1F1F23",
      borderLight: "#27272B",
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
      info: "#3B82F6",
      pending: "#F59E0B",
      pickup_scheduled: colors.secondary,
      pickup_in_progress: colors.accent,
      processing: colors.primary,
      ready: "#10B981",
      delivery_in_progress: colors.secondary,
      completed: "#10B981",
      cancelled: "#6B7280",
      primaryGradientStart: colors.gradient1,
      primaryGradientEnd: colors.gradient2,
      secondaryGradientStart: colors.gradient3,
      secondaryGradientEnd: colors.gradient4,
      glow: colors.glow,
      glassBackground: "rgba(15, 15, 20, 0.7)",
      glassBackgroundStrong: "rgba(15, 15, 20, 0.9)",
      glassBorder: "rgba(255, 255, 255, 0.1)",
      shadowColor: "rgba(0, 0, 0, 0.3)",
      shadowColorStrong: "rgba(0, 0, 0, 0.5)",
    },
  }[isDark ? 'dark' : 'light'];
};

const defaultColors = getColorScheme('teal', false);

export default {
  light: defaultColors,
  dark: getColorScheme('teal', true),
};
