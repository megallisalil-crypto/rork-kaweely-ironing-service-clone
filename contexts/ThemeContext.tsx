import { useState, useEffect, useMemo, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import createContextHook from "@nkzw/create-context-hook";
import { getColorScheme, ColorScheme } from "@/constants/colors";

const THEME_STORAGE_KEY = "kaweely_theme";
const COLOR_SCHEME_STORAGE_KEY = "kaweely_color_scheme";

export type ThemeMode = "light" | "dark";

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [colorScheme, setColorScheme] = useState<ColorScheme>("teal");
  const [isLoading, setIsLoading] = useState(true);
  const [isAppActive, setIsAppActive] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (stored === "dark" || stored === "light") {
        setTheme(stored);
      }
      
      const storedScheme = await AsyncStorage.getItem(COLOR_SCHEME_STORAGE_KEY);
      if (storedScheme && ['teal', 'purple', 'rose', 'blue', 'green', 'sunset'].includes(storedScheme)) {
        setColorScheme(storedScheme as ColorScheme);
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = useCallback(async () => {
    const newTheme: ThemeMode = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  }, [theme]);

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    setTheme(mode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  }, []);

  const changeColorScheme = useCallback(async (scheme: ColorScheme) => {
    setColorScheme(scheme);
    try {
      await AsyncStorage.setItem(COLOR_SCHEME_STORAGE_KEY, scheme);
      console.log("Color scheme changed to:", scheme);
    } catch (error) {
      console.error("Error saving color scheme:", error);
    }
  }, []);

  const colors = useMemo(() => getColorScheme(colorScheme, theme === 'dark'), [colorScheme, theme]);

  const StatusBarComponent = useCallback(() => (
    <StatusBar style={theme === "dark" ? "light" : "dark"} />
  ), [theme]);

  const toggleAppActive = useCallback(() => {
    setIsAppActive(prev => !prev);
  }, []);

  return useMemo(() => ({
    theme,
    colorScheme,
    colors,
    isDark: theme === "dark",
    isLoading,
    toggleTheme,
    setThemeMode,
    changeColorScheme,
    StatusBarComponent,
    isAppActive,
    toggleAppActive,
  }), [theme, colorScheme, colors, isLoading, toggleTheme, setThemeMode, changeColorScheme, StatusBarComponent, isAppActive, toggleAppActive]);
});
