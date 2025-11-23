import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../theme/theme';
import globalStyles from '../../theme/globalStyles';
import { useWhoDoYouWantToMeet } from './hooks/useWhoDoYouWantToMeet';

// Dev mode flag
const __DEV__ = true;

/**
 * WhoDoYouWantToMeetScreen - Step 4 of onboarding
 * Clean orientation selection screen
 */
const WhoDoYouWantToMeetScreen = React.memo(() => {
  const theme = useTheme();
  const [selectedOption, setSelectedOption] = useState(null);

  const { handleContinue, handleResetToLaunch } = useWhoDoYouWantToMeet(selectedOption);

  const options = useMemo(() => [
    { id: 'men', label: 'Men' },
    { id: 'women', label: 'Women' },
    { id: 'everyone', label: 'Everyone' },
  ], []);

  const handleSelectOption = useCallback((optionId) => {
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
              Who do you want to meet?
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
              onPress={handleContinue}
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

WhoDoYouWantToMeetScreen.displayName = 'WhoDoYouWantToMeetScreen';

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
    lineHeight: 36,
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
    backgroundColor: '#FFFFFF',
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

export default WhoDoYouWantToMeetScreen;

