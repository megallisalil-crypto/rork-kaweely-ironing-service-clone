import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Switch,
} from "react-native";
import { Stack } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { usePromoCodes } from "@/contexts/PromoCodeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  Ticket,
  Plus,
  Percent,
  Gift,
  Trash2,
  X,
  Calendar,
  Users,
  TrendingUp,
  Eye,
  Copy,
} from "lucide-react-native";
import { PromoCode } from "@/types/promoCode";
import * as Clipboard from 'expo-clipboard';

export default function PromoCodesScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { promoCodes, createPromoCode, deletePromoCode, togglePromoCodeStatus, stats } = usePromoCodes();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoType, setPromoType] = useState<'percentage' | 'free_order'>('percentage');
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [description, setDescription] = useState("");
  const [expiryDays, setExpiryDays] = useState("");

  const resetForm = () => {
    setPromoCode("");
    setPromoType('percentage');
    setDiscountPercentage("");
    setUsageLimit("");
    setDescription("");
    setExpiryDays("");
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPromoCode(code);
  };

  const handleCreatePromoCode = async () => {
    if (!promoCode.trim()) {
      Alert.alert('Error', 'Please enter a promo code');
      return;
    }

    if (promoType === 'percentage') {
      const percentage = parseFloat(discountPercentage);
      if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
        Alert.alert('Error', 'Please enter a valid discount percentage (1-100)');
        return;
      }
    }

    const limit = parseInt(usageLimit);
    if (isNaN(limit) || limit <= 0) {
      Alert.alert('Error', 'Please enter a valid usage limit (minimum 1)');
      return;
    }

    try {
      let expiresAt: Date | undefined;
      if (expiryDays.trim()) {
        const days = parseInt(expiryDays);
        if (!isNaN(days) && days > 0) {
          expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + days);
        }
      }

      await createPromoCode({
        code: promoCode,
        type: promoType,
        discountPercentage: promoType === 'percentage' ? parseFloat(discountPercentage) : undefined,
        usageLimit: limit,
        expiresAt,
        description: description.trim() || undefined,
      });

      Alert.alert('Success', `Promo code "${promoCode}" created successfully!`);
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create promo code');
    }
  };

  const handleDeletePromoCode = (code: PromoCode) => {
    Alert.alert(
      'Delete Promo Code',
      `Are you sure you want to delete "${code.code}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deletePromoCode(code.id),
        },
      ]
    );
  };

  const handleCopyCode = async (code: string) => {
    await Clipboard.setStringAsync(code);
    Alert.alert('Copied!', `"${code}" copied to clipboard`);
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'No expiry';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <Stack.Screen
        options={{
          title: 'Promo Codes',
          headerStyle: { backgroundColor: colors.cardBackground },
          headerTintColor: colors.text,
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#8B5CF6', '#EC4899']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Promo Codes</Text>
              <Text style={styles.headerSubtitle}>Manage discount codes</Text>
            </View>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => setShowCreateModal(true)}
              activeOpacity={0.8}
            >
              <Plus size={20} color="#FFF" />
              <Text style={styles.createButtonText}>Create</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.cardBackground }]}>
            <Ticket size={20} color="#8B5CF6" />
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.totalCodes}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.cardBackground }]}>
            <Eye size={20} color="#10B981" />
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.activeCodes}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.cardBackground }]}>
            <Users size={20} color="#F59E0B" />
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.totalUsage}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Used</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>All Promo Codes</Text>

          {promoCodes.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.cardBackground }]}>
              <Ticket size={48} color={colors.textTertiary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No promo codes yet
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
                Create your first promo code to get started
              </Text>
            </View>
          ) : (
            promoCodes.map((code) => (
              <View
                key={code.id}
                style={[
                  styles.promoCard,
                  { 
                    backgroundColor: colors.cardBackground,
                    opacity: code.isActive ? 1 : 0.6,
                  }
                ]}
              >
                <View style={styles.promoHeader}>
                  <View style={styles.promoHeaderLeft}>
                    <View style={[
                      styles.typeIcon,
                      { 
                        backgroundColor: code.type === 'percentage' ? '#EDE9FE' : '#FCE7F3'
                      }
                    ]}>
                      {code.type === 'percentage' ? (
                        <Percent size={18} color="#8B5CF6" />
                      ) : (
                        <Gift size={18} color="#EC4899" />
                      )}
                    </View>
                    <View>
                      <TouchableOpacity onPress={() => handleCopyCode(code.code)}>
                        <View style={styles.codeRow}>
                          <Text style={[styles.codeText, { color: colors.text }]}>
                            {code.code}
                          </Text>
                          <Copy size={14} color={colors.textSecondary} />
                        </View>
                      </TouchableOpacity>
                      <Text style={[styles.codeType, { color: colors.textSecondary }]}>
                        {code.type === 'percentage' 
                          ? `${code.discountPercentage}% Discount` 
                          : 'Free Order'}
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={code.isActive}
                    onValueChange={() => togglePromoCodeStatus(code.id)}
                    trackColor={{ false: colors.border, true: '#10B981' }}
                    thumbColor="#FFF"
                  />
                </View>

                {code.description && (
                  <Text style={[styles.description, { color: colors.textSecondary }]}>
                    {code.description}
                  </Text>
                )}

                <View style={styles.promoStats}>
                  <View style={styles.promoStatItem}>
                    <Users size={14} color={colors.textTertiary} />
                    <Text style={[styles.promoStatText, { color: colors.textSecondary }]}>
                      {code.usageCount}/{code.usageLimit} used
                    </Text>
                  </View>
                  <View style={styles.promoStatItem}>
                    <Calendar size={14} color={colors.textTertiary} />
                    <Text style={[styles.promoStatText, { color: colors.textSecondary }]}>
                      {formatDate(code.expiresAt)}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeletePromoCode(code)}
                >
                  <Trash2 size={16} color="#EF4444" />
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Create Promo Code</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <X size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Promo Code</Text>
                <View style={styles.codeInputRow}>
                  <TextInput
                    style={[styles.input, styles.codeInput, { 
                      backgroundColor: colors.background,
                      color: colors.text,
                      borderColor: colors.border,
                    }]}
                    placeholder="e.g., SUMMER50"
                    placeholderTextColor={colors.textTertiary}
                    value={promoCode}
                    onChangeText={(text) => setPromoCode(text.toUpperCase())}
                    autoCapitalize="characters"
                    maxLength={20}
                  />
                  <TouchableOpacity
                    style={[styles.generateButton, { backgroundColor: colors.tint }]}
                    onPress={generateRandomCode}
                  >
                    <TrendingUp size={18} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Type</Text>
                <View style={styles.typeSelector}>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      { 
                        backgroundColor: colors.background,
                        borderColor: promoType === 'percentage' ? '#8B5CF6' : colors.border,
                        borderWidth: 2,
                      }
                    ]}
                    onPress={() => setPromoType('percentage')}
                  >
                    <Percent size={20} color={promoType === 'percentage' ? '#8B5CF6' : colors.textSecondary} />
                    <Text style={[
                      styles.typeButtonText,
                      { color: promoType === 'percentage' ? '#8B5CF6' : colors.textSecondary }
                    ]}>
                      Percentage
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      { 
                        backgroundColor: colors.background,
                        borderColor: promoType === 'free_order' ? '#EC4899' : colors.border,
                        borderWidth: 2,
                      }
                    ]}
                    onPress={() => setPromoType('free_order')}
                  >
                    <Gift size={20} color={promoType === 'free_order' ? '#EC4899' : colors.textSecondary} />
                    <Text style={[
                      styles.typeButtonText,
                      { color: promoType === 'free_order' ? '#EC4899' : colors.textSecondary }
                    ]}>
                      Free Order
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {promoType === 'percentage' && (
                <View style={styles.formGroup}>
                  <Text style={[styles.label, { color: colors.text }]}>Discount Percentage</Text>
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: colors.background,
                      color: colors.text,
                      borderColor: colors.border,
                    }]}
                    placeholder="e.g., 20"
                    placeholderTextColor={colors.textTertiary}
                    value={discountPercentage}
                    onChangeText={setDiscountPercentage}
                    keyboardType="numeric"
                    maxLength={3}
                  />
                </View>
              )}

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Usage Limit</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderColor: colors.border,
                  }]}
                  placeholder="e.g., 100"
                  placeholderTextColor={colors.textTertiary}
                  value={usageLimit}
                  onChangeText={setUsageLimit}
                  keyboardType="numeric"
                  maxLength={6}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Expiry (Days)</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderColor: colors.border,
                  }]}
                  placeholder="e.g., 30 (optional)"
                  placeholderTextColor={colors.textTertiary}
                  value={expiryDays}
                  onChangeText={setExpiryDays}
                  keyboardType="numeric"
                  maxLength={4}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Description (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea, { 
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderColor: colors.border,
                  }]}
                  placeholder="e.g., Summer sale special discount"
                  placeholderTextColor={colors.textTertiary}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                  maxLength={200}
                />
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleCreatePromoCode}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#8B5CF6', '#EC4899']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitButtonGradient}
                >
                  <Plus size={20} color="#FFF" />
                  <Text style={styles.submitButtonText}>Create Promo Code</Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={{ height: 20 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingBottom: 32,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  emptyState: {
    padding: 48,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  promoCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    gap: 12,
  },
  promoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promoHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  codeText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  codeType: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  promoStats: {
    flexDirection: 'row',
    gap: 16,
  },
  promoStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  promoStatText: {
    fontSize: 13,
    fontWeight: '500',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
    alignSelf: 'flex-start',
  },
  deleteButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  modalForm: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 2,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  codeInputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  codeInput: {
    flex: 1,
  },
  generateButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
  },
  typeButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  submitButton: {
    marginTop: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 18,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
