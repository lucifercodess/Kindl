import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { verifyPhoneOtp } from '../../../utils/authApi';

export const usePhoneOtp = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const phone = route.params?.phone;
  const isLogin = route.params?.isLogin || false;

  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!code.trim() || code.trim().length < 4) {
      Alert.alert('Enter code', 'Please enter the verification code we sent.');
      return;
    }

    try {
      setSubmitting(true);
      const data = await verifyPhoneOtp(phone, code.trim());
      console.log('Phone OTP verified:', data);
      Alert.alert('Verified', `User ID: ${data?.user?.id || 'unknown'}`);
      // TODO: store accessToken/refreshToken and user in a global auth store
      
      // If this is a login flow, go directly to MainApp (Home tab - center K logo)
      // Otherwise, go to SoftWelcome for onboarding
      if (isLogin) {
        // Reset to MainApp and navigate to Home tab (center K logo)
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'MainApp',
                state: {
                  routes: [
                    { name: 'Profile' },
                    { name: 'Rooms' },
                    { name: 'Home' },
                    { name: 'Likes' },
                    { name: 'Messages' },
                  ],
                  index: 2, // Home is at index 2 (center tab)
                },
              },
            ],
          })
        );
      } else {
        navigation.navigate('SoftWelcome');
      }
    } catch (err) {
      console.error('Verify OTP failed', err);
      Alert.alert('Error', err.message || 'Invalid or expired code. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [code, navigation, phone, isLogin]);

  return {
    phone,
    code,
    setCode,
    submitting,
    handleSubmit,
  };
}


