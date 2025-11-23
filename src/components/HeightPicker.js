import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useTheme } from '../theme/theme';

/**
 * HeightPicker - Custom picker for height in feet and inches
 * Matches app's black & white theme
 */
const HeightPicker = React.memo(({ value, onSelect, placeholder }) => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedFeet, setSelectedFeet] = useState(value?.feet || 5);
  const [selectedInches, setSelectedInches] = useState(value?.inches || 0);

  const feetOptions = Array.from({ length: 4 }, (_, i) => i + 4); // 4 to 7 feet
  const inchesOptions = Array.from({ length: 12 }, (_, i) => i); // 0 to 11 inches

  const handleConfirm = () => {
    onSelect({ feet: selectedFeet, inches: selectedInches });
    setIsVisible(false);
  };

  const formatHeight = (height) => {
    if (!height) return '';
    return `${height.feet}'${height.inches}"`;
  };

  const displayValue = value ? formatHeight(value) : '';

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
              fontWeight: value ? '400' : '400',
            },
          ]}
        >
          {displayValue || placeholder}
        </Text>
        <Text style={[styles.chevron, { color: theme.colors.textSecondary }]}>▼</Text>
      </TouchableOpacity>

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
                Select Height
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

            <View style={styles.pickerContainer}>
              {/* Feet Picker */}
              <View style={styles.pickerColumn}>
                <Text style={[styles.pickerLabel, { color: theme.colors.textSecondary }]}>
                  Feet
                </Text>
                <ScrollView style={styles.scrollPicker} showsVerticalScrollIndicator={false}>
                  {feetOptions.map((feet) => (
                    <TouchableOpacity
                      key={feet}
                      style={[
                        styles.pickerItem,
                        selectedFeet === feet && {
                          backgroundColor: theme.colors.primaryBlack,
                        },
                      ]}
                      onPress={() => setSelectedFeet(feet)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          {
                            color:
                              selectedFeet === feet
                                ? theme.colors.primaryWhite
                                : theme.colors.textPrimary,
                            fontWeight: selectedFeet === feet ? '600' : '400',
                          },
                        ]}
                      >
                        {feet}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Inches Picker */}
              <View style={styles.pickerColumn}>
                <Text style={[styles.pickerLabel, { color: theme.colors.textSecondary }]}>
                  Inches
                </Text>
                <ScrollView style={styles.scrollPicker} showsVerticalScrollIndicator={false}>
                  {inchesOptions.map((inches) => (
                    <TouchableOpacity
                      key={inches}
                      style={[
                        styles.pickerItem,
                        selectedInches === inches && {
                          backgroundColor: theme.colors.primaryBlack,
                        },
                      ]}
                      onPress={() => setSelectedInches(inches)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          {
                            color:
                              selectedInches === inches
                                ? theme.colors.primaryWhite
                                : theme.colors.textPrimary,
                            fontWeight: selectedInches === inches ? '600' : '400',
                          },
                        ]}
                      >
                        {inches}
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

HeightPicker.displayName = 'HeightPicker';

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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
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
  pickerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'space-around',
    maxHeight: 300,
  },
  pickerColumn: {
    flex: 1,
    marginHorizontal: 8,
  },
  pickerLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  scrollPicker: {
    maxHeight: 250,
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

export default HeightPicker;

