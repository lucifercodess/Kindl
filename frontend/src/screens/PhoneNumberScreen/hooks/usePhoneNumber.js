import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { requestPhoneOtp } from '../../../utils/authApi';

// Dev mode flag
const __DEV__ = true;

/**
 * Custom hook for PhoneNumberScreen logic
 * 
 * @param {string} phoneNumber - The phone number (10 digits)
 * @param {string} countryCode - The country code (e.g., '+91')
 * @param {boolean} isLogin - Whether this is a login flow (true) or sign up flow (false)
 * @returns {Object} Handlers for PhoneNumberScreen
 */
export const usePhoneNumber = (phoneNumber, countryCode, isLogin = false) => {
  const navigation = useNavigation();
  const [submitting, setSubmitting] = useState(false);

  const handleContinue = useCallback(async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      Alert.alert('Enter phone', 'Please enter a valid 10-digit mobile number.');
      return;
    }

    try {
      setSubmitting(true);
      // Combine country code and phone number
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      const data = await requestPhoneOtp(fullPhoneNumber);

      if (__DEV__ && data?.debugCode) {
        Alert.alert(
          'Dev code',
          `OTP for ${fullPhoneNumber} is: ${data.debugCode}\n\n(In production this will be sent via SMS.)`
        );
      } else {
        Alert.alert('Code sent', 'We sent a 6-digit code to your phone.');
      }

      navigation.navigate('PhoneOtp', { phone: fullPhoneNumber, isLogin });
    } catch (err) {
      console.error('Request OTP failed', err);
      Alert.alert('Error', err.message || 'Unable to send code. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [phoneNumber, countryCode, isLogin, navigation]);

  // Dev-only: Reset to Launch screen
  const handleResetToLaunch = useCallback(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Launch' }],
      })
    );
  }, [navigation]);

  return {
    handleContinue,
    handleResetToLaunch,
  };
}


