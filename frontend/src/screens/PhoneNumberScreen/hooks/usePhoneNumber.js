import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { requestPhoneOtp } from '../../../utils/authApi';

export const usePhoneNumber = () => {
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!phone.trim()) {
      Alert.alert('Enter phone', 'Please enter your mobile number.');
      return;
    }

    try {
      setSubmitting(true);
      const data = await requestPhoneOtp(phone.trim());

      if (__DEV__ && data?.debugCode) {
        Alert.alert(
          'Dev code',
          `OTP for ${phone.trim()} is: ${data.debugCode}\n\n(In production this will be sent via SMS.)`
        );
      } else {
        Alert.alert('Code sent', 'We sent a 6-digit code to your phone.');
      }

      navigation.navigate('PhoneOtp', { phone: phone.trim() });
    } catch (err) {
      console.error('Request OTP failed', err);
      Alert.alert('Error', err.message || 'Unable to send code. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [navigation, phone]);

  return {
    phone,
    setPhone,
    submitting,
    handleSubmit,
  };
}


