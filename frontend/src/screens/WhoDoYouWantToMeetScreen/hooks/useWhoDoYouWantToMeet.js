import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { Alert } from 'react-native';
import { onboardingApi } from '../../../utils/onboardingApi';
import { useAuth } from '../../../hooks/useAuth';

/**
 * Custom hook for WhoDoYouWantToMeetScreen logic
 * 
 * @param {string} selectedOption - The selected orientation option
 * @returns {Object} Handlers for WhoDoYouWantToMeetScreen
 */
export const useWhoDoYouWantToMeet = (selectedOption) => {
  const navigation = useNavigation();
  const { accessToken } = useAuth();

  const handleContinue = useCallback(async () => {
    if (!selectedOption) return;

    try {
      // Map single selection to array for backend
      await onboardingApi.updatePreference([selectedOption], accessToken);
      // Navigate to Step 5: Add Photos
      navigation.navigate('AddPhotos');
    } catch (err) {
      console.error('Failed to save preference', err);
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

