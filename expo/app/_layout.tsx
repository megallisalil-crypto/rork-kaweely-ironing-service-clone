// template
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState, Component, ErrorInfo, ReactNode } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { OrderProvider } from "@/contexts/OrderContext";
import { GlassBackground } from "@/components/GlassBackground";
import { LoyaltyProvider } from "@/contexts/LoyaltyContext";
import { OffersProvider } from "@/contexts/OffersContext";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { WalletProvider } from "@/contexts/WalletContext";
import { FeedbackProvider } from "@/contexts/FeedbackContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { AddressProvider } from "@/contexts/AddressContext";
import { InstallmentProvider } from "@/contexts/InstallmentContext";
import { SustainabilityProvider } from "@/contexts/SustainabilityContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { PromoCodeProvider } from "@/contexts/PromoCodeContext";
import { DriverProvider } from "@/contexts/DriverContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { ReminderProvider } from "@/contexts/ReminderContext";
import { FabricScanProvider } from "@/contexts/FabricScanContext";
import { WardrobeProvider } from "@/contexts/WardrobeContext";
import { SocialChallengeProvider } from "@/contexts/SocialChallengeContext";
import { VoiceCommandProvider } from "@/contexts/VoiceCommandContext";
import { SOSProvider } from "@/contexts/SOSContext";
import { GarmentImagesProvider } from "@/contexts/GarmentImagesContext";
import LiveSupportButton from "@/components/LiveSupportButton";
import VoiceCommandButton from "@/components/VoiceCommandButton";
import VoiceCommandOverlay from "@/components/VoiceCommandOverlay";
import { OnboardingScreen } from "@/components/OnboardingScreen";
import { clearCorruptedStorage, clearAllStorage } from "@/utils/storageCleanup";
import { emergencyCleanup } from "@/utils/emergencyCleanup";
import { validateAndCleanStorage } from "@/utils/storageValidator";

validateAndCleanStorage().then(() => {
  console.log("[App] Storage validation complete");
}).catch((err) => {
  console.error("[App] Storage validation failed:", err);
});

emergencyCleanup().then(() => {
  console.log("[App] Emergency cleanup complete");
}).catch((err) => {
  console.error("[App] Emergency cleanup failed:", err);
});

SplashScreen.preventAutoHideAsync();

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

class GlobalErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[GlobalErrorBoundary] Error caught:', error);
    console.error('[GlobalErrorBoundary] Error type:', error.name);
    console.error('[GlobalErrorBoundary] Error message:', error.message);
    console.error('[GlobalErrorBoundary] Error info:', errorInfo);
    
    const isSyntaxError = error instanceof SyntaxError || 
                          error.name === 'SyntaxError' ||
                          error.message.includes('JSON Parse') || 
                          error.message.includes('Unexpected token') ||
                          error.message.includes('expected') ||
                          error.message.includes('parse');
    
    if (isSyntaxError) {
      console.log('[GlobalErrorBoundary] Storage corruption detected - clearing all storage...');
      clearAllStorage().then(() => {
        console.log('[GlobalErrorBoundary] Storage cleared successfully');
        setTimeout(() => {
          this.setState({ hasError: false, error: null });
        }, 500);
      }).catch(err => {
        console.error('[GlobalErrorBoundary] Failed to clear storage:', err);
      });
    }
  }

  handleReset = async () => {
    console.log('[GlobalErrorBoundary] Resetting app state...');
    try {
      await clearAllStorage();
      this.setState({ hasError: false, error: null });
    } catch (err) {
      console.error('[GlobalErrorBoundary] Error during reset:', err);
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={errorStyles.container}>
          <View style={errorStyles.content}>
            <Text style={errorStyles.title}>Oops! Something went wrong</Text>
            <Text style={errorStyles.message}>
              {this.state.error instanceof SyntaxError ||
               this.state.error?.name === 'SyntaxError' ||
               this.state.error?.message?.includes('JSON Parse') ||
               this.state.error?.message?.includes('expected')
                ? 'Data corruption detected. The app storage has been automatically cleared. Tap below to restart.'
                : 'An unexpected error occurred. Try clearing the app data to fix this issue.'}
            </Text>
            <TouchableOpacity style={errorStyles.button} onPress={this.handleReset}>
              <Text style={errorStyles.buttonText}>Restart App</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const errorStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center' as const,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center' as const,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center' as const,
    marginBottom: 24,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#fff',
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
    mutations: {
      retry: false,
    },
  },
});

function RootLayoutNav() {
  const { colors, StatusBarComponent } = useTheme();
  const { isAuthenticated, isLoading, user, hasCompletedOnboarding, completeOnboarding } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }} />
    );
  }

  if (!hasCompletedOnboarding) {
    return (
      <>
        <StatusBarComponent />
        <OnboardingScreen onComplete={completeOnboarding} />
      </>
    );
  }

  return (
    <>
      <StatusBarComponent />
      <Stack screenOptions={{ 
        headerBackTitle: "Back",
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.tint,
        headerTitleStyle: {
          color: colors.text,
        },
      }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="auth" options={{ headerShown: false }} />
            <Stack.Screen name="driver-auth" options={{ headerShown: true }} />
          </>
        ) : user?.role === 'driver' ? (
          <>
            <Stack.Screen name="driver-dashboard" options={{ headerShown: false }} />
            <Stack.Screen name="driver-active-orders" />
            <Stack.Screen name="driver-notifications" />
            <Stack.Screen name="driver-profile" />
            <Stack.Screen name="driver-order/[id]" />
            <Stack.Screen name="driver-order-accept/[id]" />
          </>
        ) : user?.role === 'admin' ? (
          <>
            <Stack.Screen name="admin-dashboard" options={{ headerShown: false }} />
            <Stack.Screen name="admin-orders" />
            <Stack.Screen name="setup-admin" />
          </>
        ) : (
          <>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="order/[id]" />
            <Stack.Screen name="payment-methods" options={{ presentation: "modal" }} />
            <Stack.Screen name="delivery-schedule" />
            <Stack.Screen name="delivery-address" />
            <Stack.Screen name="price-calculator" />
            <Stack.Screen name="rewards" />
            <Stack.Screen name="referrals" />
            <Stack.Screen name="promo-codes" />
            <Stack.Screen name="store" />
            <Stack.Screen name="eco-impact" />
            <Stack.Screen name="wardrobe" />
            <Stack.Screen name="challenges" />
            <Stack.Screen name="clear-storage" />
            <Stack.Screen name="test-generate-5-icons" />
            <Stack.Screen name="cart" options={{ presentation: "modal" }} />
            <Stack.Screen name="fabric-scan" />
            <Stack.Screen 
              name="add-money" 
              options={{ 
                presentation: "modal",
                headerShown: true,
                contentStyle: { zIndex: 999 }
              }} 
            />
            <Stack.Screen 
              name="send-money" 
              options={{ 
                presentation: "modal",
                headerShown: true,
                contentStyle: { zIndex: 999 }
              }} 
            />
          </>
        )}
      </Stack>
    </>
  );
}

function AppContent() {
  const { isLoading: isLanguageLoading } = useLanguage();
  const { isLoading: isAuthLoading } = useAuth();
  const [isCleanupDone, setIsCleanupDone] = useState(false);

  useEffect(() => {
    const runCleanup = async () => {
      try {
        const timeout = setTimeout(() => {
          setIsCleanupDone(true);
        }, 1000);
        
        await clearCorruptedStorage();
        clearTimeout(timeout);
        setIsCleanupDone(true);
      } catch {
        setIsCleanupDone(true);
      }
    };
    runCleanup();
  }, []);

  useEffect(() => {
    if (!isLanguageLoading && !isAuthLoading && isCleanupDone) {
      const timer = setTimeout(() => {
        SplashScreen.hideAsync().catch(() => {});
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLanguageLoading, isAuthLoading, isCleanupDone]);

  return (
    <AdminProvider>
      <DriverProvider>
        <PromoCodeProvider>
          <ReminderProvider>
            <FabricScanProvider>
              <GarmentImagesProvider>
                <WardrobeProvider>
                  <SocialChallengeProvider>
                  <WalletProvider>
                    <CartProvider>
                    <OffersProvider>
                      <LoyaltyProvider>
                        <FeedbackProvider>
                          <SubscriptionProvider>
                            <InstallmentProvider>
                              <AddressProvider>
                                <SOSProvider>
                                  <OrderProvider>
                                    <SustainabilityProvider>
                                      <VoiceCommandProvider>
                                      <GestureHandlerRootView style={{ flex: 1 }}>
                                        <GlassBackground>
                                          <RootLayoutNav />
                                          <LiveSupportButton />
                                          <VoiceCommandButton />
                                          <VoiceCommandOverlay />
                                        </GlassBackground>
                                      </GestureHandlerRootView>
                                      </VoiceCommandProvider>
                                    </SustainabilityProvider>
                                  </OrderProvider>
                                </SOSProvider>
                              </AddressProvider>
                            </InstallmentProvider>
                          </SubscriptionProvider>
                        </FeedbackProvider>
                      </LoyaltyProvider>
                    </OffersProvider>
                    </CartProvider>
                  </WalletProvider>
                  </SocialChallengeProvider>
                </WardrobeProvider>
              </GarmentImagesProvider>
            </FabricScanProvider>
          </ReminderProvider>
        </PromoCodeProvider>
      </DriverProvider>
    </AdminProvider>
  );
}

export default function RootLayout() {
  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <LanguageProvider>
              <CurrencyProvider>
                <AppContent />
              </CurrencyProvider>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}
