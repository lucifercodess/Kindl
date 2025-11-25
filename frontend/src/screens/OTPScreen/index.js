import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../../theme/theme';
import globalStyles from '../../theme/globalStyles';
import { useOTP } from './hooks/useOTP';
import { hapticButtonPress, hapticSelection, hapticLight } from '../../utils/haptics';

// Dev mode flag
const __DEV__ = true;

/**
 * OTPScreen - 4-digit OTP verification
 * Premium, minimal design matching Kindl aesthetic
 */
const OTPScreen = React.memo(({ route }) => {
  const theme = useTheme();
  const phoneNumber = route?.params?.phoneNumber || '';
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef([]);

  const { handleVerify, handleResend, handleResetToLaunch } = useOTP(phoneNumber, otp);

  const isOTPComplete = useCallback(() => {
    return otp.every(digit => digit !== '');
  }, [otp]);

  const handleOTPChange = useCallback((text, index) => {
    // Only allow single digit
    if (text.length > 1) {
      // If pasting, handle it
      if (text.length === 4) {
        const digits = text.split('').slice(0, 4);
        setOtp(digits);
        hapticSelection();
        // Focus last input
        if (inputRefs.current[3]) {
          inputRefs.current[3].focus();
        }
        return;
      }
      return;
    }

    // Haptic feedback when entering digit
    if (text) {
      hapticSelection();
    }

    // Update the digit at this index
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input if digit entered
    if (text && index < 3 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  }, [otp]);

  const handleKeyPress = useCallback((e, index) => {
    // Handle backspace - move to previous input if current is empty
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [otp]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      setTimeout(() => {
        inputRefs.current[0].focus();
      }, 100);
    }
  }, []);

  const maskedPhoneNumber = useCallback(() => {
    if (!phoneNumber) return '';
    // Show last 4 digits only
    const digits = phoneNumber.replace(/\D/g, '');
    if (digits.length >= 4) {
      return `****${digits.slice(-4)}`;
    }
    return phoneNumber;
  }, [phoneNumber]);

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <KeyboardAvoidingView
        style={globalStyles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={[globalStyles.content, styles.container]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
              Enter verification code
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              We sent a code to {maskedPhoneNumber()}
            </Text>
          </View>

          {/* OTP Input Section */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.otpInput,
                  {
                    borderColor: digit 
                      ? theme.colors.primaryBlack 
                      : theme.colors.border,
                    borderWidth: digit ? 2 : 1,
                    color: theme.colors.textPrimary,
                  },
                ]}
                value={digit}
                onChangeText={(text) => handleOTPChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                textAlign="center"
              />
            ))}
          </View>

          {/* Resend Code */}
          <View style={styles.resendContainer}>
            <Text style={[styles.resendText, { color: theme.colors.textSecondary }]}>
              Didn't receive the code?{' '}
            </Text>
            <TouchableOpacity 
              onPress={() => {
                hapticLight();
                handleResend();
              }} 
              activeOpacity={0.7}
            >
              <Text style={[styles.resendLink, { color: theme.colors.textPrimary }]}>
                Resend
              </Text>
            </TouchableOpacity>
          </View>

          {/* Verify Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.verifyButton,
                {
                  backgroundColor: isOTPComplete() 
                    ? theme.colors.primaryBlack 
                    : theme.colors.border,
                  opacity: isOTPComplete() ? 1 : 0.5,
                },
              ]}
              onPress={() => {
                if (isOTPComplete()) {
                  hapticButtonPress();
                  handleVerify();
                } else {
                  hapticLight();
                }
              }}
              disabled={!isOTPComplete()}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.verifyButtonText,
                  {
                    color: isOTPComplete() 
                      ? theme.colors.primaryWhite 
                      : theme.colors.textSecondary,
                  },
                ]}
              >
                Verify
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});

OTPScreen.displayName = 'OTPScreen';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 32,
    flex: 1,
    justifyContent: 'space-between',
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
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 22,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  otpInput: {
    width: 64,
    height: 64,
    borderRadius: 14,
    fontSize: 24,
    fontWeight: '600',
    borderWidth: 1,
    ...Platform.select({
      ios: {
        paddingVertical: 0,
      },
      android: {
        paddingVertical: 0,
      },
    }),
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  resendText: {
    fontSize: 14,
    fontWeight: '400',
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 8,
  },
  verifyButton: {
    width: '100%',
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyButtonText: {
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

export default OTPScreen;

