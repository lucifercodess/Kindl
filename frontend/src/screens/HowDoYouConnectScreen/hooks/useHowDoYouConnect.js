import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { Alert } from 'react-native';
import { onboardingApi } from '../../../utils/onboardingApi';
import { useAuth } from '../../../hooks/useAuth';

/**
 * Custom hook for HowDoYouConnectScreen logic
 * 
 * @param {string} selectedOption - The selected connection style option
 * @returns {Object} Handlers for HowDoYouConnectScreen
 */
export const useHowDoYouConnect = (selectedOption) => {
  const navigation = useNavigation();
  const { accessToken } = useAuth();

  const handleContinue = useCallback(async () => {
    if (!selectedOption) return;

    try {
      await onboardingApi.updateConnectionStyle(selectedOption, accessToken);
      // Navigate to Step 7: Lifestyle Basics
      navigation.navigate('LifestyleBasics');
    } catch (err) {
      console.error('Failed to save connection style', err);
      Alert.alert('Error', err.message || 'Unable to save your choice. Please try again.');
    }
  }, [selectedOption, navigation]);

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

