import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useTheme } from '../../theme/theme';
import globalStyles from '../../theme/globalStyles';
import { useWhoAreYou } from './hooks/useWhoAreYou';
import PronounsPicker from '../../components/PronounsPicker';
import DatePickerModal from '../../components/DatePickerModal';
import { hapticButtonPress, hapticSelection, hapticLight } from '../../utils/haptics';

// Dev mode flag
const __DEV__ = true;

/**
 * WhoAreYouScreen - Step 3 of onboarding
 * Minimal identity screen for basic user info
 */
const WhoAreYouScreen = React.memo(() => {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [gender, setGender] = useState(null);
  const [pronouns, setPronouns] = useState(null);
  const [birthdate, setBirthdate] = useState(null);

  const { handleContinue, handleResetToLaunch } = useWhoAreYou({
    name,
    gender,
    pronouns,
    birthdate,
  });

  const genders = useMemo(() => [
    { id: 'male', label: 'Male' },
    { id: 'female', label: 'Female' },
    { id: 'nonbinary', label: 'Non-binary' },
    { id: 'preferNotSay', label: 'Prefer not to say' },
  ], []);

  const handleSelectGender = useCallback((genderId) => {
    hapticSelection();
    setGender(genderId);
  }, []);

  const handleBirthdateSelect = useCallback((date) => {
    setBirthdate(date);
  }, []);

  const isFormValid = useMemo(() => {
    return name.trim().length > 0 && gender && birthdate !== null;
  }, [name, gender, birthdate]);

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScrollView 
        contentContainerStyle={[globalStyles.content, styles.container]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
              Who are you?
            </Text>
          </View>

          {/* Name Field */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
              Name
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: theme.colors.border,
                  color: theme.colors.textPrimary,
                },
              ]}
              placeholder="Enter your name"
              placeholderTextColor={theme.colors.textSecondary}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          {/* Gender Selection */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
              Gender
            </Text>
            <View style={styles.genderContainer}>
              {genders.map((genderOption) => {
                const isSelected = gender === genderOption.id;
                return (
                  <TouchableOpacity
                    key={genderOption.id}
                    style={[
                      styles.genderOption,
                      {
                        borderColor: isSelected 
                          ? theme.colors.primaryBlack 
                          : theme.colors.border,
                        borderWidth: isSelected ? 2 : 1,
                      },
                    ]}
                    onPress={() => handleSelectGender(genderOption.id)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.genderOptionText,
                        {
                          color: theme.colors.textPrimary,
                          fontWeight: isSelected ? '600' : '400',
                        },
                      ]}
                    >
                      {genderOption.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Pronouns (Optional) */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
              Pronouns <Text style={styles.optional}>(optional)</Text>
            </Text>
            <PronounsPicker
              value={pronouns}
              onSelect={setPronouns}
              placeholder="Select pronouns"
            />
          </View>

          {/* Birthdate */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
              Birthdate
            </Text>
            <DatePickerModal
              value={birthdate}
              onSelect={handleBirthdateSelect}
              placeholder="MM/DD/YYYY"
            />
          </View>

          {/* Continue Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                {
                  backgroundColor: isFormValid 
                    ? theme.colors.primaryBlack 
                    : theme.colors.border,
                  opacity: isFormValid ? 1 : 0.5,
                },
              ]}
              onPress={() => {
                if (isFormValid) {
                  hapticButtonPress();
                  handleContinue();
                } else {
                  hapticLight();
                }
              }}
              disabled={!isFormValid}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.continueButtonText,
                  {
                    color: isFormValid 
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

WhoAreYouScreen.displayName = 'WhoAreYouScreen';

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
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 36,
  },
  fieldContainer: {
    marginBottom: 24,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  optional: {
    fontSize: 14,
    fontWeight: '400',
    opacity: 0.6,
  },
  input: {
    width: '100%',
    height: 54,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '400',
    ...Platform.select({
      ios: {
        paddingVertical: 0,
      },
      android: {
        paddingVertical: 0,
      },
    }),
  },
  genderContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  genderOption: {
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 12,
  },
  genderOptionText: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    flexShrink: 1,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 16,
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

export default WhoAreYouScreen;

