import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { RefreshCw, TestTube, Trash2, AlertTriangle } from "lucide-react-native";
import { Order, OrderStatus } from "@/types/order";
import { clearCorruptedStorage, clearAllStorage } from "@/utils/clearCorruptedStorage";

export default function DebugStorage() {
  const [storageData, setStorageData] = useState<{ key: string; value: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const loadStorage = async () => {
    setLoading(true);
    try {
      const keys = await AsyncStorage.getAllKeys();
      console.log('[DebugStorage] Found keys:', keys);
      
      const items: { key: string; value: string }[] = [];
      
      for (const key of keys) {
        try {
          const value = await AsyncStorage.getItem(key);
          
          if (value && value !== 'null' && value !== 'undefined') {
            try {
              JSON.parse(value);
              items.push({ key, value });
              console.log(`[DebugStorage] ✅ ${key}:`, value.substring(0, 100));
            } catch (parseError) {
              console.error(`[DebugStorage] ❌ Corrupted JSON in ${key}:`, parseError);
              items.push({ key, value: '⚠️ CORRUPTED: ' + value.substring(0, 100) });
            }
          } else {
            items.push({ key, value: value || 'null' });
          }
        } catch (itemError) {
          console.error(`[DebugStorage] Error reading ${key}:`, itemError);
          items.push({ key, value: '❌ ERROR READING' });
        }
      }
      
      setStorageData(items);
    } catch (error) {
      console.error('[DebugStorage] Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testOrderCreation = async () => {
    try {
      console.log('[DebugStorage] 🧪 Testing order creation...');
      
      console.log('[DebugStorage] Step 1: Clearing ALL storage (fresh start)...');
      try {
        await AsyncStorage.clear();
        console.log('[DebugStorage] ✅ All storage cleared');
      } catch (clearError) {
        console.error('[DebugStorage] ❌ Failed to clear storage:', clearError);
        Alert.alert(
          '❌ Fatal Error',
          'Cannot clear storage. This is a critical issue. Please restart the app.',
          [{ text: 'OK' }]
        );
        return;
      }
      
      console.log('[DebugStorage] Step 1.5: Waiting 500ms for storage to fully clear...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('[DebugStorage] Step 2: Creating test order object...');
      const testOrder: Order = {
        id: 'test-' + Date.now(),
        orderNumber: 'TEST-' + Math.floor(Math.random() * 1000),
        customerName: 'Test Customer',
        phoneNumber: '1234567890',
        items: [{ id: '1', name: 'Test Item', quantity: 1, price: 100 }],
        subscription: 'none' as any,
        totalPrice: 100,
        status: 'pickup_scheduled' as OrderStatus,
        createdAt: new Date(),
        updatedAt: new Date(),
        pickupDate: new Date(),
        statusHistory: [{
          status: 'pickup_scheduled' as OrderStatus,
          timestamp: new Date()
        }]
      };
      
      console.log('[DebugStorage] Step 2.5: Verifying test order is valid JSON...');
      try {
        const testJson = JSON.stringify(testOrder);
        JSON.parse(testJson);
        console.log('[DebugStorage] ✅ Test order object is valid JSON');
      } catch (jsonError) {
        console.error('[DebugStorage] ❌ Test order is not valid JSON!', jsonError);
        throw new Error('Test order object is not serializable: ' + String(jsonError));
      }
      
      console.log('[DebugStorage] Step 3: Importing OrderManager...');
      const { OrderManager } = await import('@/utils/OrderManager');
      
      console.log('[DebugStorage] Step 4: Adding test order...');
      try {
        await OrderManager.addOrder(testOrder);
        console.log('[DebugStorage] ✅ Test order added successfully!');
      } catch (addError) {
        console.error('[DebugStorage] ❌ Failed to add order:', addError);
        throw addError;
      }
      
      console.log('[DebugStorage] Step 5: Waiting 1 second for save to complete...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('[DebugStorage] Step 6: Retrieving all orders...');
      let allOrders: Order[] = [];
      try {
        allOrders = await OrderManager.getAllOrders();
        console.log('[DebugStorage] ✅ Retrieved orders count:', allOrders.length);
      } catch (retrieveError) {
        console.error('[DebugStorage] ❌ Failed to retrieve orders:', retrieveError);
        throw new Error('Failed to retrieve orders: ' + String(retrieveError));
      }
      
      console.log('[DebugStorage] Step 7: Verifying storage directly...');
      let directCheck: string | null = null;
      try {
        directCheck = await AsyncStorage.getItem('kaweely_orders');
        console.log('[DebugStorage] Direct storage check:', directCheck ? directCheck.substring(0, 100) : 'null');
      } catch (directError) {
        console.error('[DebugStorage] ❌ Failed direct storage check:', directError);
      }
      
      if (allOrders.length === 0) {
        throw new Error('Order was not saved properly - getAllOrders returned empty array');
      }
      
      Alert.alert(
        '✅ Test Complete',
        `Order created successfully!\nTotal orders: ${allOrders.length}\n\nGo to Orders tab to see it.`,
        [
          { text: 'OK', onPress: loadStorage }
        ]
      );
    } catch (error) {
      console.error('[DebugStorage] ❌ Test failed:', error);
      console.error('[DebugStorage] Error type:', error instanceof Error ? error.constructor.name : typeof error);
      console.error('[DebugStorage] Error message:', error instanceof Error ? error.message : String(error));
      console.error('[DebugStorage] Error stack:', error instanceof Error ? error.stack : 'N/A');
      
      let errorMessage = '';
      let errorTitle = '❌ Test Failed';
      
      if (error instanceof SyntaxError) {
        errorTitle = '🔧 Storage Corruption Detected';
        errorMessage = `JSON parsing error: ${error.message}\n\nYour storage has corrupted data. This will be automatically fixed now.`;
      } else if (error instanceof Error) {
        if (error.message.includes('not saved properly') || error.message.includes('empty array')) {
          errorTitle = '⚠️ Save Verification Failed';
          errorMessage = `The order was created but didn't persist to storage.\n\nThis might be a storage issue. Clearing storage now...`;
        } else {
          errorMessage = `${error.name}: ${error.message}\n\nClearing storage to fix...`;
        }
      } else {
        errorMessage = `Unknown error: ${String(error)}\n\nClearing storage to fix...`;
      }
      
      Alert.alert(
        errorTitle,
        errorMessage,
        [
          { 
            text: 'Clear & Retry', 
            onPress: async () => {
              try {
                console.log('[DebugStorage] 🔄 Clearing storage and retrying...');
                await AsyncStorage.clear();
                await new Promise(resolve => setTimeout(resolve, 500));
                console.log('[DebugStorage] ✅ Storage cleared, now retrying test...');
                
                Alert.alert('✅ Cleared', 'Storage has been cleared! Click "Test Order" again to retry.', [
                  { text: 'OK', onPress: loadStorage }
                ]);
              } catch (clearError) {
                Alert.alert('❌ Error', 'Failed to clear storage: ' + String(clearError));
              }
            },
          },
          { text: 'Cancel', style: 'cancel', onPress: loadStorage }
        ]
      );
    }
  };

  const clearAllOrders = async () => {
    Alert.alert(
      'Clear All Orders',
      'Are you sure you want to delete all orders from storage?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('kaweely_orders');
              Alert.alert('Success', 'All orders cleared!', [
                { text: 'OK', onPress: loadStorage }
              ]);
            } catch (error) {
              const errorMessage = error instanceof Error 
                ? error.message 
                : String(error);
              Alert.alert('Error', errorMessage);
            }
          }
        }
      ]
    );
  };

  const handleClearCorrupted = async () => {
    try {
      setLoading(true);
      console.log('[DebugStorage] Clearing corrupted storage...');
      const count = await clearCorruptedStorage();
      Alert.alert(
        'Cleanup Complete',
        `Removed ${count} corrupted storage entries`,
        [
          { text: 'OK', onPress: loadStorage }
        ]
      );
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : String(error);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleNuclearClear = async () => {
    Alert.alert(
      '☢️ Nuclear Option',
      'This will completely WIPE ALL storage and reset the app to factory state. Are you absolutely sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: '⚠️ WIPE EVERYTHING',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              console.log('[DebugStorage] ☢️ NUCLEAR CLEAR INITIATED');
              await clearAllStorage();
              console.log('[DebugStorage] ✅ All storage wiped');
              Alert.alert(
                '✅ Complete Reset',
                'All storage has been wiped. The app is now in factory state. Try creating a test order.',
                [{ text: 'OK', onPress: loadStorage }]
              );
            } catch (error) {
              const errorMessage = error instanceof Error 
                ? error.message 
                : String(error);
              Alert.alert('❌ Error', 'Failed to clear storage: ' + errorMessage);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    const initDebug = async () => {
      console.log('[DebugStorage] Initializing debug screen...');
      console.log('[DebugStorage] ⚠️ CRITICAL: Forcing complete storage wipe on init');
      
      try {
        await AsyncStorage.clear();
        console.log('[DebugStorage] ✅ Complete storage wipe successful');
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('[DebugStorage] ⏰ Waited 500ms for storage to stabilize');
      } catch (clearError) {
        console.error('[DebugStorage] ❌ Failed to clear storage:', clearError);
      }
      
      try {
        await loadStorage();
      } catch (loadError) {
        console.error('[DebugStorage] Load storage failed:', loadError);
        setStorageData([]);
      }
    };
    initDebug();
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: "Debug Storage",
          headerRight: () => (
            <TouchableOpacity onPress={loadStorage} disabled={loading}>
              <RefreshCw size={24} color={loading ? "#999" : "#007AFF"} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>AsyncStorage Contents</Text>
          <Text style={styles.subtitle}>{storageData.length} keys found</Text>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.testButton} onPress={testOrderCreation}>
              <TestTube size={18} color="#fff" />
              <Text style={styles.testButtonText}>Test Order</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.clearButton} onPress={clearAllOrders}>
              <Trash2 size={18} color="#fff" />
              <Text style={styles.clearButtonText}>Clear Orders</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.fixButton} onPress={handleClearCorrupted}>
            <AlertTriangle size={18} color="#fff" />
            <Text style={styles.fixButtonText}>Fix Corrupted Storage</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.nuclearButton} onPress={handleNuclearClear}>
            <Text style={styles.nuclearButtonText}>☢️ NUCLEAR CLEAR (Wipe Everything)</Text>
          </TouchableOpacity>
          
          {storageData.map((item, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.key}>{item.key}</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.valueScroll}
              >
                <Text style={styles.value} selectable>
                  {item.value}
                </Text>
              </ScrollView>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  item: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  key: {
    fontSize: 14,
    fontWeight: "700",
    color: "#007AFF",
    marginBottom: 8,
  },
  valueScroll: {
    maxHeight: 200,
  },
  value: {
    fontSize: 12,
    color: "#333",
    fontFamily: "monospace",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  testButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  testButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  clearButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#EF4444",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  fixButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#F59E0B",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  fixButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  nuclearButton: {
    backgroundColor: "#DC2626",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#991B1B",
  },
  nuclearButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
});
