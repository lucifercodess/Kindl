import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';

/**
 * Custom hook for OTPScreen logic
 * 
 * @param {string} phoneNumber - The phone number being verified
 * @param {Array} otp - Array of 4 OTP digits
 * @returns {Object} Handlers for OTPScreen
 */
export const useOTP = (phoneNumber, otp) => {
  const navigation = useNavigation();

  const handleVerify = useCallback(() => {
    // Check if OTP is complete
    if (!otp.every(digit => digit !== '')) return;
    
    const otpCode = otp.join('');
    console.log('OTP entered:', otpCode);
    console.log('Verifying for phone:', phoneNumber);
    
    // TODO: Verify OTP with backend
    // For now, simulate verification success
    // In production, this would call an API to verify the OTP
    
    // Navigate to Loading screen first (shows K logo)
    navigation.navigate('Loading');
    
    // After loading animation, navigate to MainApp (for login/signup via phone)
    setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'MainApp' }],
        })
      );
    }, 2000);
  }, [otp, phoneNumber, navigation]);

  const handleResend = useCallback(() => {
    // TODO: Resend OTP to phone number
    console.log('Resending OTP to:', phoneNumber);
    
    // In production, this would call an API to resend the OTP
    // For now, just log it
  }, [phoneNumber]);

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
    handleVerify,
    handleResend,
    handleResetToLaunch,
  };
};

