import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../../theme/theme';
import globalStyles from '../../theme/globalStyles';
import { usePhoneNumber } from './hooks/usePhoneNumber';
import { hapticButtonPress, hapticLight } from '../../utils/haptics';

// Dev mode flag
const __DEV__ = true;

/**
 * PhoneNumberScreen - Phone number entry for phone authentication
 * Premium, minimal design matching Kindl aesthetic
 */
const PhoneNumberScreen = React.memo(() => {
  const theme = useTheme();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');

  const { handleContinue, handleResetToLaunch } = usePhoneNumber(phoneNumber, countryCode);

  const isFormValid = useMemo(() => {
    // Basic validation: exactly 10 digits (Indian format)
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    return digitsOnly.length === 10;
  }, [phoneNumber]);

  const formatPhoneNumber = useCallback((text) => {
    // Remove all non-digits
    const digitsOnly = text.replace(/\D/g, '');
    
    // Indian format: XXXXXXXXXX (10 digits, no formatting)
    // Limit to 10 digits
    return digitsOnly.slice(0, 10);
  }, []);

  const handlePhoneChange = useCallback((text) => {
    const formatted = formatPhoneNumber(text);
    setPhoneNumber(formatted);
  }, [formatPhoneNumber]);

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <KeyboardAvoidingView
        style={globalStyles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={[globalStyles.content, globalStyles.centeredContent, styles.container]}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                Enter your phone number
              </Text>
              <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                We'll send you a verification code
              </Text>
            </View>

            {/* Phone Input Section - Centered and Premium */}
            <View style={styles.inputSection}>
              {/* Phone Input Container with Country Code Inside */}
              <View
                style={[
                  styles.phoneInputContainer,
                  {
                    borderColor: phoneNumber.length > 0 
                      ? theme.colors.primaryBlack 
                      : theme.colors.border,
                    borderWidth: phoneNumber.length > 0 ? 2 : 1,
                  },
                ]}
              >
                {/* Country Code - Inside Input on Left */}
                <View style={styles.countryCodeContainer}>
                  <Text style={[styles.countryCodeText, { color: theme.colors.textPrimary }]}>
                    {countryCode}
                  </Text>
                </View>

                {/* Divider */}
                <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

                {/* Phone Number Input */}
                <TextInput
                  style={[
                    styles.phoneInput,
                    {
                      color: theme.colors.textPrimary,
                    },
                  ]}
                  placeholder="Enter 10-digit number"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={phoneNumber}
                  onChangeText={handlePhoneChange}
                  keyboardType="number-pad"
                  maxLength={10}
                  autoFocus
                />
              </View>
            </View>

            {/* Info Text */}
            <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
              By continuing, you agree to receive SMS messages. Message and data rates may apply.
            </Text>

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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});

PhoneNumberScreen.displayName = 'PhoneNumberScreen';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  header: {
    marginBottom: 48,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  inputSection: {
    width: '100%',
    marginBottom: 24,
    alignItems: 'center',
  },
  phoneInputContainer: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 4,
  },
  countryCodeContainer: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryCodeText: {
    fontSize: 18,
    fontWeight: '400',
    color: '#111111',
  },
  divider: {
    width: 1,
    height: 32,
    marginHorizontal: 4,
  },
  phoneInput: {
    flex: 1,
    height: '100%',
    fontSize: 18,
    fontWeight: '400',
    paddingHorizontal: 12,
    letterSpacing: 1,
    ...Platform.select({
      ios: {
        paddingVertical: 0,
      },
      android: {
        paddingVertical: 0,
      },
    }),
  },
  infoText: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 32,
    paddingHorizontal: 20,
    opacity: 0.7,
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

export default PhoneNumberScreen;

