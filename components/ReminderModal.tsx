import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Platform, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Bell, Calendar, Clock, Plus, Trash2, Power, CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useReminders } from '@/contexts/ReminderContext';
import { useState, useRef, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';



interface ReminderModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ReminderModal({ visible, onClose }: ReminderModalProps) {
  useTheme();
  const { reminders, addReminder, deleteReminder, toggleReminder } = useReminders();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  const glowAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [glowAnim, pulseAnim]);

  const handleCreateReminder = async () => {
    if (!title.trim() || !message.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const combinedDateTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedTime.getHours(),
      selectedTime.getMinutes()
    );

    if (combinedDateTime <= new Date()) {
      alert('Please select a future date and time');
      return;
    }

    setIsCreating(true);
    try {
      await addReminder(title, message, combinedDateTime);
      setTitle('');
      setMessage('');
      setSelectedDate(new Date());
      setSelectedTime(new Date());
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating reminder:', error);
      alert('Failed to create reminder. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: '#0f0f0f',
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      maxHeight: '90%',
      borderTopWidth: 3,
      borderLeftWidth: 2,
      borderRightWidth: 2,
      borderColor: '#FF6B35',
      shadowColor: '#FF6B35',
      shadowOffset: { width: 0, height: -12 },
      shadowOpacity: 0.6,
      shadowRadius: 32,
      elevation: 30,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 28,
      paddingTop: 32,
      paddingBottom: 24,
      borderBottomWidth: 2,
      borderBottomColor: 'rgba(255, 107, 53, 0.15)',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      flex: 1,
    },
    headerIconWrapper: {
      position: 'relative' as const,
    },
    headerIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#FF6B35',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.6,
      shadowRadius: 12,
      elevation: 10,
    },
    headerIconGlow: {
      position: 'absolute' as const,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#FF6B35',
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '900' as const,
      color: '#FFFFFF',
      letterSpacing: 0.5,
      flex: 1,
    },
    closeButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#1f1f1f',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: '#333333',
    },
    scrollContent: {
      padding: 24,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 60,
      gap: 16,
    },
    emptyIconWrapper: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: 'rgba(255, 107, 53, 0.1)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
      borderWidth: 3,
      borderColor: 'rgba(255, 107, 53, 0.3)',
    },
    emptyText: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: '#FFFFFF',
      textAlign: 'center',
    },
    emptySubtext: {
      fontSize: 14,
      color: '#888888',
      textAlign: 'center',
      lineHeight: 20,
    },
    reminderCard: {
      borderRadius: 24,
      marginBottom: 16,
      overflow: 'hidden' as const,
      borderWidth: 2,
      borderColor: 'rgba(255, 107, 53, 0.3)',
    },
    reminderCardGradient: {
      padding: 20,
    },
    reminderHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    reminderTitle: {
      fontSize: 18,
      fontWeight: '800' as const,
      color: '#FFFFFF',
      flex: 1,
      marginRight: 12,
    },
    reminderActions: {
      flexDirection: 'row',
      gap: 10,
    },
    reminderActionButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
    },
    reminderMessage: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.85)',
      marginBottom: 12,
      lineHeight: 20,
    },
    reminderDateTime: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.15)',
    },
    reminderDateTimeText: {
      fontSize: 13,
      fontWeight: '600' as const,
      color: 'rgba(255, 255, 255, 0.8)',
    },
    reminderStatus: {
      position: 'absolute' as const,
      top: 16,
      right: 16,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    reminderStatusActive: {
      backgroundColor: 'rgba(34, 197, 94, 0.2)',
      borderWidth: 1.5,
      borderColor: '#22C55E',
    },
    reminderStatusInactive: {
      backgroundColor: 'rgba(156, 163, 175, 0.2)',
      borderWidth: 1.5,
      borderColor: '#9CA3AF',
    },
    reminderStatusText: {
      fontSize: 11,
      fontWeight: '800' as const,
    },
    createButton: {
      borderRadius: 24,
      overflow: 'hidden' as const,
      marginTop: 8,
      marginBottom: 24,
      shadowColor: '#FF6B35',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 12,
    },
    createButtonGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      paddingVertical: 18,
      paddingHorizontal: 24,
    },
    createButtonText: {
      fontSize: 17,
      fontWeight: '900' as const,
      color: '#FFFFFF',
      letterSpacing: 0.5,
    },
    formContainer: {
      backgroundColor: '#1a1a1a',
      borderRadius: 24,
      padding: 24,
      marginBottom: 24,
      borderWidth: 2,
      borderColor: 'rgba(255, 107, 53, 0.3)',
    },
    formHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 24,
      paddingBottom: 16,
      borderBottomWidth: 2,
      borderBottomColor: 'rgba(255, 107, 53, 0.2)',
    },
    formTitle: {
      fontSize: 22,
      fontWeight: '900' as const,
      color: '#FFFFFF',
      letterSpacing: 0.3,
    },
    inputGroup: {
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 13,
      fontWeight: '700' as const,
      color: '#FF6B35',
      marginBottom: 10,
      letterSpacing: 0.5,
      textTransform: 'uppercase' as const,
    },
    input: {
      backgroundColor: '#0f0f0f',
      borderRadius: 16,
      paddingHorizontal: 18,
      paddingVertical: 16,
      fontSize: 15,
      color: '#FFFFFF',
      borderWidth: 2,
      borderColor: 'rgba(255, 107, 53, 0.3)',
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    dateTimeGroup: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 24,
    },
    dateTimeButton: {
      flex: 1,
      backgroundColor: '#0f0f0f',
      borderRadius: 16,
      padding: 16,
      borderWidth: 2,
      borderColor: 'rgba(255, 107, 53, 0.3)',
      gap: 8,
    },
    dateTimeLabel: {
      fontSize: 11,
      fontWeight: '700' as const,
      color: '#FF6B35',
      letterSpacing: 0.5,
      textTransform: 'uppercase' as const,
    },
    dateTimeValue: {
      fontSize: 15,
      fontWeight: '600' as const,
      color: '#FFFFFF',
    },
    dateTimeIcon: {
      position: 'absolute' as const,
      top: 14,
      right: 14,
    },
    formButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    formButton: {
      flex: 1,
      borderRadius: 16,
      overflow: 'hidden' as const,
    },
    formButtonGradient: {
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    formButtonText: {
      fontSize: 15,
      fontWeight: '800' as const,
      color: '#FFFFFF',
      letterSpacing: 0.3,
    },
    quickTemplates: {
      marginBottom: 24,
    },
    quickTemplatesTitle: {
      fontSize: 16,
      fontWeight: '800' as const,
      color: '#FFFFFF',
      marginBottom: 12,
      letterSpacing: 0.3,
    },
    quickTemplatesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    quickTemplate: {
      backgroundColor: 'rgba(255, 107, 53, 0.1)',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: 'rgba(255, 107, 53, 0.3)',
    },
    quickTemplateText: {
      fontSize: 13,
      fontWeight: '700' as const,
      color: '#FF6B35',
    },
    pickerContainer: {
      backgroundColor: '#0f0f0f',
      borderRadius: 20,
      marginBottom: 20,
      borderWidth: 2,
      borderColor: 'rgba(255, 107, 53, 0.4)',
      overflow: 'hidden' as const,
    },
    pickerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: 'rgba(255, 107, 53, 0.1)',
      borderBottomWidth: 2,
      borderBottomColor: 'rgba(255, 107, 53, 0.3)',
    },
    pickerTitle: {
      fontSize: 16,
      fontWeight: '800' as const,
      color: '#FFFFFF',
      letterSpacing: 0.3,
    },
    pickerDoneButton: {
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 12,
      backgroundColor: '#FF6B35',
    },
    pickerDoneText: {
      fontSize: 14,
      fontWeight: '800' as const,
      color: '#FFFFFF',
      letterSpacing: 0.3,
    },
  });

  const quickTemplates = [
    { title: 'Morning Ironing', message: "Time to prepare your clothes for ironing!", hours: 9 },
    { title: 'Evening Pickup', message: "Don't forget to schedule your ironing pickup!", hours: 18 },
    { title: 'Weekly Reminder', message: "Time for your weekly ironing order!", hours: 10 },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIconWrapper}>
                <Animated.View
                  style={[
                    styles.headerIconGlow,
                    {
                      opacity: glowAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.3, 0.7],
                      }),
                      transform: [{
                        scale: glowAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.9, 1.2],
                        }),
                      }],
                    },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.headerIcon,
                    {
                      transform: [{ scale: pulseAnim }],
                    },
                  ]}
                >
                  <LinearGradient
                    colors={['#FF6B35', '#FF8C42']}
                    style={StyleSheet.absoluteFillObject}
                  />
                  <Bell size={28} color="#FFFFFF" strokeWidth={2.5} />
                </Animated.View>
              </View>
              <Text style={styles.headerTitle}>Reminders</Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <X size={22} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {!showCreateForm && (
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => setShowCreateForm(true)}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#FF6B35', '#FF8C42']}
                  style={styles.createButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Plus size={22} color="#FFFFFF" strokeWidth={3} />
                  <Text style={styles.createButtonText}>Create New Reminder</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            {showCreateForm && (
              <View style={styles.formContainer}>
                <View style={styles.formHeader}>
                  <Text style={styles.formTitle}>New Reminder</Text>
                  <TouchableOpacity
                    onPress={() => setShowCreateForm(false)}
                    activeOpacity={0.7}
                  >
                    <X size={24} color="#888888" strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>

                <View style={styles.quickTemplates}>
                  <Text style={styles.quickTemplatesTitle}>Quick Templates</Text>
                  <View style={styles.quickTemplatesGrid}>
                    {quickTemplates.map((template, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={styles.quickTemplate}
                        onPress={() => {
                          setTitle(template.title);
                          setMessage(template.message);
                          const tomorrow = new Date();
                          tomorrow.setDate(tomorrow.getDate() + 1);
                          tomorrow.setHours(template.hours, 0, 0, 0);
                          setSelectedDate(tomorrow);
                          setSelectedTime(tomorrow);
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.quickTemplateText}>{template.title}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Title</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Morning Ironing Reminder"
                    placeholderTextColor="#555555"
                    value={title}
                    onChangeText={setTitle}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Message</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="What would you like to be reminded about?"
                    placeholderTextColor="#555555"
                    value={message}
                    onChangeText={setMessage}
                    multiline
                  />
                </View>

                <View style={styles.dateTimeGroup}>
                  <TouchableOpacity
                    style={styles.dateTimeButton}
                    onPress={() => setShowDatePicker(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.dateTimeLabel}>Date</Text>
                    <Text style={styles.dateTimeValue}>
                      {selectedDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Text>
                    <View style={styles.dateTimeIcon}>
                      <Calendar size={18} color="#FF6B35" strokeWidth={2.5} />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.dateTimeButton}
                    onPress={() => setShowTimePicker(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.dateTimeLabel}>Time</Text>
                    <Text style={styles.dateTimeValue}>
                      {selectedTime.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </Text>
                    <View style={styles.dateTimeIcon}>
                      <Clock size={18} color="#FF6B35" strokeWidth={2.5} />
                    </View>
                  </TouchableOpacity>
                </View>

                {showDatePicker && (
                  <View style={styles.pickerContainer}>
                    <View style={styles.pickerHeader}>
                      <Text style={styles.pickerTitle}>Select Date</Text>
                      <TouchableOpacity
                        onPress={() => setShowDatePicker(false)}
                        style={styles.pickerDoneButton}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.pickerDoneText}>Done</Text>
                      </TouchableOpacity>
                    </View>
                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      display="spinner"
                      onChange={(_event: any, date?: Date) => {
                        if (Platform.OS === 'android') {
                          setShowDatePicker(false);
                        }
                        if (date) setSelectedDate(date);
                      }}
                      minimumDate={new Date()}
                      textColor="#FFFFFF"
                    />
                  </View>
                )}

                {showTimePicker && (
                  <View style={styles.pickerContainer}>
                    <View style={styles.pickerHeader}>
                      <Text style={styles.pickerTitle}>Select Time</Text>
                      <TouchableOpacity
                        onPress={() => setShowTimePicker(false)}
                        style={styles.pickerDoneButton}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.pickerDoneText}>Done</Text>
                      </TouchableOpacity>
                    </View>
                    <DateTimePicker
                      value={selectedTime}
                      mode="time"
                      display="spinner"
                      onChange={(_event: any, time?: Date) => {
                        if (Platform.OS === 'android') {
                          setShowTimePicker(false);
                        }
                        if (time) setSelectedTime(time);
                      }}
                      textColor="#FFFFFF"
                    />
                  </View>
                )}

                <View style={styles.formButtons}>
                  <TouchableOpacity
                    style={styles.formButton}
                    onPress={() => setShowCreateForm(false)}
                    activeOpacity={0.85}
                  >
                    <LinearGradient
                      colors={['#333333', '#1a1a1a']}
                      style={styles.formButtonGradient}
                    >
                      <Text style={styles.formButtonText}>Cancel</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.formButton}
                    onPress={handleCreateReminder}
                    activeOpacity={0.85}
                    disabled={isCreating}
                  >
                    <LinearGradient
                      colors={['#FF6B35', '#FF8C42']}
                      style={styles.formButtonGradient}
                    >
                      <Text style={styles.formButtonText}>
                        {isCreating ? 'Creating...' : 'Create'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {reminders.length === 0 && !showCreateForm && (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconWrapper}>
                  <Bell size={48} color="#FF6B35" strokeWidth={2} />
                </View>
                <Text style={styles.emptyText}>No Reminders Yet</Text>
                <Text style={styles.emptySubtext}>
                  Create your first reminder to never miss{'\n'}your ironing schedule!
                </Text>
              </View>
            )}

            {reminders.map((reminder) => (
              <View key={reminder.id} style={styles.reminderCard}>
                <LinearGradient
                  colors={['rgba(31, 31, 31, 0.8)', 'rgba(15, 15, 15, 0.95)']}
                  style={styles.reminderCardGradient}
                >
                  <View style={styles.reminderHeader}>
                    <Text style={styles.reminderTitle}>{reminder.title}</Text>
                    <View style={styles.reminderActions}>
                      <TouchableOpacity
                        style={[
                          styles.reminderActionButton,
                          {
                            borderColor: reminder.isActive ? '#22C55E' : '#9CA3AF',
                            backgroundColor: reminder.isActive
                              ? 'rgba(34, 197, 94, 0.15)'
                              : 'rgba(156, 163, 175, 0.15)',
                          },
                        ]}
                        onPress={() => toggleReminder(reminder.id)}
                        activeOpacity={0.7}
                      >
                        <Power
                          size={18}
                          color={reminder.isActive ? '#22C55E' : '#9CA3AF'}
                          strokeWidth={2.5}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.reminderActionButton,
                          { borderColor: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.15)' },
                        ]}
                        onPress={() => deleteReminder(reminder.id)}
                        activeOpacity={0.7}
                      >
                        <Trash2 size={18} color="#EF4444" strokeWidth={2.5} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={styles.reminderMessage}>{reminder.message}</Text>
                  <View style={styles.reminderDateTime}>
                    <Clock size={16} color="rgba(255, 255, 255, 0.6)" strokeWidth={2} />
                    <Text style={styles.reminderDateTimeText}>
                      {formatDateTime(reminder.scheduledDate)}
                    </Text>
                    {reminder.isActive && (
                      <CheckCircle2 size={16} color="#22C55E" strokeWidth={2.5} />
                    )}
                  </View>
                </LinearGradient>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
