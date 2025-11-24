import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';

/**
 * Custom hook for PhoneNumberScreen logic
 * 
 * @param {string} phoneNumber - The entered phone number
 * @param {string} countryCode - The selected country code
 * @returns {Object} Handlers for PhoneNumberScreen
 */
export const usePhoneNumber = (phoneNumber, countryCode) => {
  const navigation = useNavigation();

  const handleContinue = useCallback(() => {
    // Extract digits only for validation
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    if (digitsOnly.length < 10) return;
    
    // TODO: Send OTP to phone number
    // For now, we'll simulate sending OTP and navigate to OTP screen
    const fullPhoneNumber = `${countryCode}${digitsOnly}`;
    console.log('Phone number entered:', fullPhoneNumber);
    
    // Navigate to OTP screen with phone number
    navigation.navigate('OTP', { phoneNumber: fullPhoneNumber });
  }, [phoneNumber, countryCode, navigation]);

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
};

