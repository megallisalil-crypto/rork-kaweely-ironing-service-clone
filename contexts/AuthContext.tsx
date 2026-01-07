import { useState, useEffect, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { safeJsonParse, safeJsonStringify } from "@/utils/safeJsonParse";
import * as LocalAuthentication from "expo-local-authentication";
import { Platform } from "react-native";

const AUTH_STORAGE_KEY = "kaweely_auth";
const BIOMETRIC_ENABLED_KEY = "kaweely_biometric_enabled";
const ADMIN_CREDENTIALS_KEY = "kaweely_admin_credentials";

export type UserRole = 'customer' | 'driver' | 'admin';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  isGuest: boolean;
  gender?: 'male' | 'female';
  role: UserRole;
  qrToken?: string;
};

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    loadAuth();
    checkBiometricAvailability();
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    setHasCompletedOnboarding(false);
  };

  const completeOnboarding = useCallback(async () => {
    setHasCompletedOnboarding(true);
  }, []);

  const checkBiometricAvailability = async () => {
    if (Platform.OS === 'web') {
      setIsBiometricAvailable(false);
      return;
    }

    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsBiometricAvailable(compatible && enrolled);

      if (compatible && enrolled) {
        const stored = await AsyncStorage.getItem(BIOMETRIC_ENABLED_KEY);
        setIsBiometricEnabled(stored === 'true');
      }
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      setIsBiometricAvailable(false);
    }
  };

  const loadAuth = async () => {
    const timeoutId = setTimeout(() => {
      console.warn("Auth loading timeout, setting default state");
      setIsLoading(false);
    }, 2000);

    try {
      const stored = await Promise.race([
        AsyncStorage.getItem(AUTH_STORAGE_KEY),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500))
      ]);
      
      if (stored && typeof stored === 'string' && stored.trim().length > 0) {
        const authData = safeJsonParse<AuthUser>(stored);
        if (authData && typeof authData === 'object' && authData.id) {
          if (!authData.qrToken) {
            console.log('[Auth] Loaded user without QR token, generating now');
            authData.qrToken = `KW${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
            const jsonString = safeJsonStringify(authData);
            if (jsonString) {
              AsyncStorage.setItem(AUTH_STORAGE_KEY, jsonString).catch(console.error);
            }
          }
          setUser(authData);
          setIsAuthenticated(true);
        } else {
          console.warn("Invalid auth data, clearing");
          AsyncStorage.removeItem(AUTH_STORAGE_KEY).catch(console.error);
        }
      }
    } catch (error) {
      console.error("Error loading auth:", error);
      AsyncStorage.removeItem(AUTH_STORAGE_KEY).catch(console.error);
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  const login = useCallback(async (emailOrPhone: string, password: string, role: UserRole = 'customer') => {
    const isEmail = emailOrPhone.includes('@');
    const qrToken = `KW${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const userData: AuthUser = {
      id: Date.now().toString(),
      name: isEmail ? emailOrPhone.split('@')[0] : emailOrPhone,
      email: isEmail ? emailOrPhone : `${emailOrPhone}@kaweely.com`,
      phone: isEmail ? "+20 123 456 7890" : emailOrPhone,
      isGuest: false,
      role,
      qrToken,
    };
    
    setUser(userData);
    setIsAuthenticated(true);
    
    try {
      const jsonString = safeJsonStringify(userData);
      if (jsonString) {
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, jsonString);
      }
    } catch (error) {
      console.error("Error saving auth:", error);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, phone: string, password: string, role: UserRole = 'customer') => {
    const hasEmail = email && email.trim().length > 0;
    const hasPhone = phone && phone.trim().length > 0;
    
    let finalEmail = email;
    let finalPhone = phone;
    
    if (!hasEmail && hasPhone) {
      finalEmail = `${phone.replace(/\D/g, '')}@kaweely.com`;
    }
    
    if (!hasPhone && hasEmail) {
      finalPhone = "+20 000 000 0000";
    }
    
    const qrToken = `KW${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const userData: AuthUser = {
      id: Date.now().toString(),
      name,
      email: finalEmail,
      phone: finalPhone,
      isGuest: false,
      role,
      qrToken,
    };
    
    setUser(userData);
    setIsAuthenticated(true);
    
    try {
      const jsonString = safeJsonStringify(userData);
      if (jsonString) {
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, jsonString);
      }
    } catch (error) {
      console.error("Error saving auth:", error);
    }
  }, []);

  const loginAsGuest = useCallback(async () => {
    const qrToken = `KW${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const guestData: AuthUser = {
      id: `guest_${Date.now()}`,
      name: "Guest User",
      email: "guest@kaweely.com",
      phone: "",
      isGuest: true,
      role: 'customer',
      qrToken,
    };
    
    setUser(guestData);
    setIsAuthenticated(true);
    
    try {
      const jsonString = safeJsonStringify(guestData);
      if (jsonString) {
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, jsonString);
      }
    } catch (error) {
      console.error("Error saving guest auth:", error);
    }
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    setIsAuthenticated(false);
    
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      await AsyncStorage.removeItem("kaweely_profile");
      await AsyncStorage.removeItem("kaweely_orders");
      await AsyncStorage.removeItem("kaweely_cart");
    } catch (error) {
      console.error("Error clearing auth:", error);
    }
  }, []);

  const updateUserRole = useCallback(async (role: UserRole) => {
    if (!user) return;
    
    const updatedUser = { ...user, role };
    setUser(updatedUser);
    
    try {
      const jsonString = safeJsonStringify(updatedUser);
      if (jsonString) {
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, jsonString);
      }
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  }, [user]);

  const enableBiometric = useCallback(async (emailOrPhone: string, password: string) => {
    if (Platform.OS === 'web' || !isBiometricAvailable) {
      return false;
    }

    try {
      await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, 'true');
      await AsyncStorage.setItem(ADMIN_CREDENTIALS_KEY, safeJsonStringify({ emailOrPhone, password }) || '');
      setIsBiometricEnabled(true);
      return true;
    } catch (error) {
      console.error('Error enabling biometric:', error);
      return false;
    }
  }, [isBiometricAvailable]);

  const disableBiometric = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(BIOMETRIC_ENABLED_KEY);
      await AsyncStorage.removeItem(ADMIN_CREDENTIALS_KEY);
      setIsBiometricEnabled(false);
    } catch (error) {
      console.error('Error disabling biometric:', error);
    }
  }, []);

  const authenticateWithBiometric = useCallback(async (): Promise<{success: boolean, emailOrPhone?: string, password?: string}> => {
    if (Platform.OS === 'web' || !isBiometricAvailable || !isBiometricEnabled) {
      return { success: false };
    }

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access admin panel',
        fallbackLabel: 'Use passcode',
        disableDeviceFallback: false,
      });

      if (result.success) {
        const stored = await AsyncStorage.getItem(ADMIN_CREDENTIALS_KEY);
        if (stored) {
          const credentials = safeJsonParse<{emailOrPhone: string, password: string}>(stored);
          if (credentials) {
            return { success: true, emailOrPhone: credentials.emailOrPhone, password: credentials.password };
          }
        }
      }

      return { success: false };
    } catch (error) {
      console.error('Error authenticating with biometric:', error);
      return { success: false };
    }
  }, [isBiometricAvailable, isBiometricEnabled]);

  const regenerateQrToken = useCallback(() => {
    if (!user) {
      console.log('[Auth] No user found for QR regeneration');
      return;
    }
    
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
    const qrToken = `KW${timestamp.toString(36).toUpperCase()}${randomPart}`;
    const updatedUser = { ...user, qrToken };
    
    console.log('[Auth] Generating new QR token:', qrToken);
    
    setUser(updatedUser);
    
    AsyncStorage.setItem(AUTH_STORAGE_KEY, safeJsonStringify(updatedUser) || '')
      .then(() => {
        console.log('[Auth] QR Token saved successfully:', qrToken);
      })
      .catch((error) => {
        console.error('[Auth] Error saving QR token:', error);
      });
  }, [user]);



  return useMemo(() => ({
    user,
    isLoading,
    isAuthenticated,
    hasCompletedOnboarding,
    login,
    register,
    loginAsGuest,
    logout,
    updateUserRole,
    completeOnboarding,
    isBiometricAvailable,
    isBiometricEnabled,
    enableBiometric,
    disableBiometric,
    authenticateWithBiometric,
    regenerateQrToken,
  }), [user, isLoading, isAuthenticated, hasCompletedOnboarding, login, register, loginAsGuest, logout, updateUserRole, completeOnboarding, isBiometricAvailable, isBiometricEnabled, enableBiometric, disableBiometric, authenticateWithBiometric, regenerateQrToken]);
});
