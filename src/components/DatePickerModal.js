import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform, ScrollView } from 'react-native';
import { useTheme } from '../theme/theme';

/**
 * DatePickerModal - Custom date picker matching app theme
 * Shows a modal with date selection
 */
const DatePickerModal = React.memo(({ value, onSelect, placeholder }) => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : new Date());

  const currentYear = new Date().getFullYear();
  const years = useMemo(() => {
    const yearList = [];
    for (let i = currentYear; i >= currentYear - 100; i--) {
      yearList.push(i);
    }
    return yearList;
  }, [currentYear]);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const [selectedMonth, setSelectedMonth] = useState(selectedDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(selectedDate.getFullYear());
  const [selectedDay, setSelectedDay] = useState(selectedDate.getDate());

  const days = useMemo(() => {
    const daysCount = daysInMonth(selectedMonth, selectedYear);
    return Array.from({ length: daysCount }, (_, i) => i + 1);
  }, [selectedMonth, selectedYear]);

  const handleConfirm = () => {
    const date = new Date(selectedYear, selectedMonth, selectedDay);
    onSelect(date);
    setIsVisible(false);
  };

  const formatDate = (date) => {
    if (!date) return '';
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const calculateAge = (date) => {
    if (!date) return null;
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
      age--;
    }
    return age > 0 && age < 120 ? age : null;
  };

  const displayValue = value ? formatDate(value) : '';
  const age = value ? calculateAge(value) : null;

  return (
    <>
      <TouchableOpacity
        style={[
          styles.pickerButton,
          {
            borderColor: value ? theme.colors.primaryBlack : theme.colors.border,
            borderWidth: value ? 2 : 1,
          },
        ]}
        onPress={() => setIsVisible(true)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.pickerButtonText,
            {
              color: value ? theme.colors.textPrimary : theme.colors.textSecondary,
            },
          ]}
        >
          {displayValue || placeholder}
        </Text>
        <Text style={[styles.chevron, { color: theme.colors.textSecondary }]}>▼</Text>
      </TouchableOpacity>
      {age !== null && (
        <Text style={[styles.ageText, { color: theme.colors.textSecondary }]}>
          Age: {age}
        </Text>
      )}

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.primaryWhite }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
                Select Birthdate
              </Text>
              <TouchableOpacity
                onPress={() => setIsVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={[styles.cancelButtonText, { color: theme.colors.textSecondary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.datePickerContainer}>
              {/* Month Picker */}
              <View style={styles.pickerColumn}>
                <Text style={[styles.pickerLabel, { color: theme.colors.textSecondary }]}>
                  Month
                </Text>
                <ScrollView style={styles.scrollPicker} showsVerticalScrollIndicator={false}>
                  {months.map((month, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.pickerItem,
                        selectedMonth === index && {
                          backgroundColor: theme.colors.primaryBlack,
                        },
                      ]}
                      onPress={() => setSelectedMonth(index)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          {
                            color:
                              selectedMonth === index
                                ? theme.colors.primaryWhite
                                : theme.colors.textPrimary,
                            fontWeight: selectedMonth === index ? '600' : '400',
                          },
                        ]}
                      >
                        {month}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Day Picker */}
              <View style={styles.pickerColumn}>
                <Text style={[styles.pickerLabel, { color: theme.colors.textSecondary }]}>
                  Day
                </Text>
                <ScrollView style={styles.scrollPicker} showsVerticalScrollIndicator={false}>
                  {days.map((day) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.pickerItem,
                        selectedDay === day && {
                          backgroundColor: theme.colors.primaryBlack,
                        },
                      ]}
                      onPress={() => setSelectedDay(day)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          {
                            color:
                              selectedDay === day
                                ? theme.colors.primaryWhite
                                : theme.colors.textPrimary,
                            fontWeight: selectedDay === day ? '600' : '400',
                          },
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Year Picker */}
              <View style={styles.pickerColumn}>
                <Text style={[styles.pickerLabel, { color: theme.colors.textSecondary }]}>
                  Year
                </Text>
                <ScrollView 
                  style={styles.scrollPicker} 
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContent}
                >
                  {years.map((year) => (
                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.pickerItem,
                        selectedYear === year && {
                          backgroundColor: theme.colors.primaryBlack,
                        },
                      ]}
                      onPress={() => setSelectedYear(year)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          {
                            color:
                              selectedYear === year
                                ? theme.colors.primaryWhite
                                : theme.colors.textPrimary,
                            fontWeight: selectedYear === year ? '600' : '400',
                          },
                        ]}
                      >
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: theme.colors.primaryBlack }]}
              onPress={handleConfirm}
              activeOpacity={0.8}
            >
              <Text style={[styles.confirmButtonText, { color: theme.colors.primaryWhite }]}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
});

DatePickerModal.displayName = 'DatePickerModal';

const styles = StyleSheet.create({
  pickerButton: {
    width: '100%',
    height: 54,
    borderRadius: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  pickerButtonText: {
    fontSize: 16,
    fontWeight: '400',
  },
  chevron: {
    fontSize: 12,
    marginLeft: 8,
  },
  ageText: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 8,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6E6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  cancelButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '400',
  },
  datePickerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'space-between',
    maxHeight: 400,
  },
  pickerColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  pickerLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  scrollPicker: {
    maxHeight: 300,
  },
  scrollContent: {
    paddingVertical: 4,
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerItemText: {
    fontSize: 16,
    fontWeight: '400',
  },
  confirmButton: {
    marginHorizontal: 20,
    marginTop: 20,
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DatePickerModal;

