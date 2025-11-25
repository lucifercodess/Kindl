import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../theme/theme';
import globalStyles from '../../theme/globalStyles';
import { useWhatBringsYou } from './hooks/useWhatBringsYou';
import { hapticButtonPress, hapticSelection, hapticLight } from '../../utils/haptics';

// Dev mode flag
const __DEV__ = true; // In production, use process.env.NODE_ENV === 'development'

/**
 * WhatBringsYouScreen - Step 2 of onboarding
 * Clean, premium selection screen for user intent
 */
const WhatBringsYouScreen = React.memo(() => {
  const theme = useTheme();
  const [selectedOption, setSelectedOption] = useState(null);
  const { handleContinue, handleResetToLaunch } = useWhatBringsYou(selectedOption);

  const options = useMemo(() => [
    { id: 'lasting', label: 'Ready for something lasting' },
    { id: 'slow', label: 'Taking things slow & intentional' },
    { id: 'right', label: 'Open to connections that feel right' },
    { id: 'unsure', label: 'Not sure yet' },
  ], []);

  const handleSelectOption = useCallback((optionId) => {
    hapticSelection();
    setSelectedOption(optionId);
  }, []);

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScrollView 
        contentContainerStyle={[globalStyles.content, styles.container]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
              What brings you here?
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Help us personalize your experience
            </Text>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {options.map((option) => {
              const isSelected = selectedOption === option.id;
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.option,
                    {
                      backgroundColor: theme.colors.primaryWhite,
                      borderColor: isSelected 
                        ? theme.colors.primaryBlack 
                        : theme.colors.border,
                      borderWidth: isSelected ? 2 : 1,
                    },
                  ]}
                  onPress={() => handleSelectOption(option.id)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color: theme.colors.textPrimary,
                        fontWeight: isSelected ? '600' : '400',
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Continue Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                {
                  backgroundColor: selectedOption 
                    ? theme.colors.primaryBlack 
                    : theme.colors.border,
                  opacity: selectedOption ? 1 : 0.5,
                },
              ]}
              onPress={() => {
                if (selectedOption) {
                  hapticButtonPress();
                  handleContinue();
                } else {
                  hapticLight();
                }
              }}
              disabled={!selectedOption}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.continueButtonText,
                  {
                    color: selectedOption 
                      ? theme.colors.primaryWhite 
                      : theme.colors.textSecondary,
                  },
                ]}
              >
                Continue
              </Text>
            </TouchableOpacity>
            
            {/* Microtext */}
            <Text style={[styles.microtext, { color: theme.colors.textSecondary }]}>
              You can change this anytime.
            </Text>
          </View>

          {/* Dev-only: Reset button */}
          {__DEV__ && (
            <TouchableOpacity
              onPress={handleResetToLaunch}
              style={styles.devResetButton}
              activeOpacity={0.7}
            >
              <Text style={[styles.devResetText, { color: theme.colors.textSecondary }]}>
                [Dev] Reset to Launch
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});

WhatBringsYouScreen.displayName = 'WhatBringsYouScreen';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 32,
  },
  content: {
    width: '100%',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 22,
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 32,
  },
  option: {
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 8,
  },
  continueButton: {
    width: '100%',
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  microtext: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 12,
    opacity: 0.7,
  },
  devResetButton: {
    marginTop: 32,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
  },
  devResetText: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
    opacity: 0.6,
  },
});

export default WhatBringsYouScreen;

