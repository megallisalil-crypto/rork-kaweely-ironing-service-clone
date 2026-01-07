import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { Shirt, Heart, X, Search } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useWardrobe } from '@/contexts/WardrobeContext';
import { useState, useMemo } from 'react';
import { WardrobeItem, GarmentStatus } from '@/types/wardrobe';

export default function WardrobeScreen() {

  const { colors } = useTheme();
  const { items, stats, favorites, updateItem, deleteItem, getItemsByStatus } = useWardrobe();
  const [selectedFilter, setSelectedFilter] = useState<GarmentStatus | 'all' | 'favorites'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);

  const filteredItems = useMemo(() => {
    let result = items;

    if (selectedFilter === 'favorites') {
      result = favorites;
    } else if (selectedFilter !== 'all') {
      result = getItemsByStatus(selectedFilter);
    }

    if (searchQuery) {
      result = result.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return result;
  }, [items, favorites, selectedFilter, searchQuery, getItemsByStatus]);

  const getStatusColor = (status: GarmentStatus) => {
    switch (status) {
      case 'in_closet': return colors.success;
      case 'in_service': return colors.warning;
      case 'needs_cleaning': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getStatusLabel = (status: GarmentStatus) => {
    switch (status) {
      case 'in_closet': return 'In Closet';
      case 'in_service': return 'In Service';
      case 'needs_cleaning': return 'Needs Cleaning';
      default: return status;
    }
  };

  const handleDelete = (item: WardrobeItem) => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to remove "${item.name}" from your wardrobe?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteItem(item.id);
            setSelectedItem(null);
          },
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 20,
      backgroundColor: colors.cardBackground,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 16,
    },
    statCard: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 24,
      fontWeight: '800' as const,
      color: colors.text,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 4,
      fontWeight: '600' as const,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    searchInput: {
      flex: 1,
      marginLeft: 8,
      fontSize: 15,
      color: colors.text,
    },
    filtersContainer: {
      padding: 16,
    },
    filtersScroll: {
      flexDirection: 'row',
      gap: 8,
    },
    filterChip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.cardBackground,
      borderWidth: 1,
      borderColor: colors.border,
    },
    filterChipActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    filterChipText: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colors.textSecondary,
    },
    filterChipTextActive: {
      color: '#FFFFFF',
    },
    content: {
      flex: 1,
    },
    itemsGrid: {
      padding: 16,
    },
    itemCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    itemInfo: {
      flex: 1,
    },
    itemName: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 4,
    },
    itemBrand: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '600' as const,
    },
    favoriteButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    itemDetails: {
      gap: 8,
    },
    itemDetailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    itemDetailLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: '600' as const,
    },
    itemDetailValue: {
      fontSize: 13,
      color: colors.text,
      fontWeight: '700' as const,
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      alignSelf: 'flex-start',
    },
    statusBadgeText: {
      fontSize: 12,
      fontWeight: '700' as const,
      color: '#FFFFFF',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    emptyText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 16,
      fontWeight: '600' as const,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: colors.cardBackground,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '800' as const,
      color: colors.text,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalBody: {
      gap: 16,
    },
    modalSection: {
      gap: 8,
    },
    modalSectionTitle: {
      fontSize: 14,
      fontWeight: '700' as const,
      color: colors.textSecondary,
      textTransform: 'uppercase' as const,
    },
    modalSectionValue: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text,
    },
    careHistoryItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    careHistoryType: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colors.text,
      textTransform: 'capitalize' as const,
    },
    careHistoryDate: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    modalActions: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 20,
    },
    actionButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionButtonPrimary: {
      backgroundColor: colors.accent,
    },
    actionButtonDanger: {
      backgroundColor: colors.error,
    },
    actionButtonText: {
      fontSize: 15,
      fontWeight: '700' as const,
      color: '#FFFFFF',
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'My Wardrobe',
          headerStyle: { backgroundColor: colors.cardBackground },
          headerTintColor: colors.text,
        }}
      />

      <View style={styles.header}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Items</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.inCloset}</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.inService}</Text>
            <Text style={styles.statLabel}>In Service</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>${stats.totalValue}</Text>
            <Text style={styles.statLabel}>Total Value</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Search size={18} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your wardrobe..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filtersScroll}>
            <TouchableOpacity
              style={[styles.filterChip, selectedFilter === 'all' && styles.filterChipActive]}
              onPress={() => setSelectedFilter('all')}
            >
              <Text style={[styles.filterChipText, selectedFilter === 'all' && styles.filterChipTextActive]}>
                All Items
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, selectedFilter === 'favorites' && styles.filterChipActive]}
              onPress={() => setSelectedFilter('favorites')}
            >
              <Text style={[styles.filterChipText, selectedFilter === 'favorites' && styles.filterChipTextActive]}>
                Favorites
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, selectedFilter === 'in_closet' && styles.filterChipActive]}
              onPress={() => setSelectedFilter('in_closet')}
            >
              <Text style={[styles.filterChipText, selectedFilter === 'in_closet' && styles.filterChipTextActive]}>
                In Closet
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, selectedFilter === 'in_service' && styles.filterChipActive]}
              onPress={() => setSelectedFilter('in_service')}
            >
              <Text style={[styles.filterChipText, selectedFilter === 'in_service' && styles.filterChipTextActive]}>
                In Service
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, selectedFilter === 'needs_cleaning' && styles.filterChipActive]}
              onPress={() => setSelectedFilter('needs_cleaning')}
            >
              <Text style={[styles.filterChipText, selectedFilter === 'needs_cleaning' && styles.filterChipTextActive]}>
                Needs Cleaning
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <ScrollView style={styles.content}>
        {filteredItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Shirt size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'No items match your search'
                : 'Your wardrobe is empty. Add items to get started!'}
            </Text>
          </View>
        ) : (
          <View style={styles.itemsGrid}>
            {filteredItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.itemCard}
                onPress={() => setSelectedItem(item)}
                activeOpacity={0.7}
              >
                <View style={styles.itemHeader}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    {item.brand && <Text style={styles.itemBrand}>{item.brand}</Text>}
                  </View>
                  <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => updateItem(item.id, { isFavorite: !item.isFavorite })}
                  >
                    <Heart
                      size={20}
                      color={item.isFavorite ? colors.error : colors.textSecondary}
                      fill={item.isFavorite ? colors.error : 'none'}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.itemDetails}>
                  <View style={styles.itemDetailRow}>
                    <Text style={styles.itemDetailLabel}>Category</Text>
                    <Text style={styles.itemDetailValue}>{item.category}</Text>
                  </View>
                  <View style={styles.itemDetailRow}>
                    <Text style={styles.itemDetailLabel}>Times Worn</Text>
                    <Text style={styles.itemDetailValue}>{item.timesWorn}</Text>
                  </View>
                  <View style={styles.itemDetailRow}>
                    <Text style={styles.itemDetailLabel}>Times Cleaned</Text>
                    <Text style={styles.itemDetailValue}>{item.timesCleaned}</Text>
                  </View>
                  <View style={styles.itemDetailRow}>
                    <Text style={styles.itemDetailLabel}>Value</Text>
                    <Text style={styles.itemDetailValue}>${item.estimatedValue}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusBadgeText}>{getStatusLabel(item.status)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={selectedItem !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedItem(null)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setSelectedItem(null)} />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedItem?.name}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedItem(null)}>
                <X size={18} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {selectedItem && (
                <>
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Brand</Text>
                    <Text style={styles.modalSectionValue}>{selectedItem.brand || 'Not specified'}</Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Category</Text>
                    <Text style={styles.modalSectionValue}>{selectedItem.category}</Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Color</Text>
                    <Text style={styles.modalSectionValue}>{selectedItem.color}</Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Size</Text>
                    <Text style={styles.modalSectionValue}>{(selectedItem as any).size || 'Not specified'}</Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Estimated Value</Text>
                    <Text style={styles.modalSectionValue}>${selectedItem.estimatedValue}</Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Status</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedItem.status) }]}>
                      <Text style={styles.statusBadgeText}>{getStatusLabel(selectedItem.status)}</Text>
                    </View>
                  </View>

                  {selectedItem.careHistory.length > 0 && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Care History</Text>
                      {selectedItem.careHistory.slice(-5).reverse().map((record, index) => (
                        <View key={index} style={styles.careHistoryItem}>
                          <Text style={styles.careHistoryType}>
                            {record.type.replace('_', ' ')}
                          </Text>
                          <Text style={styles.careHistoryDate}>
                            {record.date.toLocaleDateString()}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.actionButtonPrimary]}
                      onPress={() => {
                        updateItem(selectedItem.id, { isFavorite: !selectedItem.isFavorite });
                        setSelectedItem(null);
                      }}
                    >
                      <Text style={styles.actionButtonText}>
                        {selectedItem.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.actionButtonDanger]}
                      onPress={() => handleDelete(selectedItem)}
                    >
                      <Text style={styles.actionButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
