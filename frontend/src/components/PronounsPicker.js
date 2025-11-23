import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useTheme } from '../theme/theme';

/**
 * PronounsPicker - Custom picker for pronouns
 * Matches app's black & white theme
 */
const PronounsPicker = React.memo(({ value, onSelect, placeholder }) => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  const pronounsOptions = [
    'she/her',
    'he/him',
    'they/them',
    'she/they',
    'he/they',
    'any pronouns',
    'Prefer not to say',
  ];

  const handleSelect = (pronoun) => {
    onSelect(pronoun);
    setIsVisible(false);
  };

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
          {value || placeholder}
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
                Select Pronouns
              </Text>
              <TouchableOpacity
                onPress={() => setIsVisible(false)}
                style={styles.closeButton}
              >
                <Text style={[styles.closeButtonText, { color: theme.colors.textPrimary }]}>
                  Done
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.optionsList}>
              {pronounsOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.option,
                    {
                      backgroundColor:
                        value === option ? theme.colors.primaryBlack : theme.colors.primaryWhite,
                      borderColor:
                        value === option ? theme.colors.primaryBlack : theme.colors.border,
                      borderWidth: value === option ? 0 : 1,
                    },
                  ]}
                  onPress={() => handleSelect(option)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color:
                          value === option
                            ? theme.colors.primaryWhite
                            : theme.colors.textPrimary,
                        fontWeight: value === option ? '600' : '400',
                      },
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
});

PronounsPicker.displayName = 'PronounsPicker';

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
    maxHeight: '70%',
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
  closeButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  optionsList: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '400',
  },
});

export default PronounsPicker;

