import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { Alert } from 'react-native';
import { onboardingApi } from '../../../utils/onboardingApi';
import { useAuth } from '../../../hooks/useAuth';

/**
 * Custom hook for WhoAreYouScreen logic
 * 
 * @param {Object} formData - User form data
 * @param {string} formData.name - User's name
 * @param {string} formData.gender - Selected gender
 * @param {string} formData.pronouns - Pronouns (optional)
 * @param {Date} formData.birthdate - Birthdate as Date object
 * @returns {Object} Handlers for WhoAreYouScreen
 */
export const useWhoAreYou = ({ name, gender, pronouns, birthdate }) => {
  const navigation = useNavigation();
  const { accessToken } = useAuth();

  const handleContinue = useCallback(async () => {
    if (!name || !gender || !birthdate) {
      return;
    }

    try {
      await onboardingApi.updateWhoAreYou({ name, gender, pronouns, birthdate }, accessToken);
      // Navigate to Step 4: Who do you want to meet?
      navigation.navigate('WhoDoYouWantToMeet');
    } catch (err) {
      console.error('Failed to save profile basics', err);
      Alert.alert('Error', err.message || 'Unable to save your details. Please try again.');
    }
  }, [name, gender, pronouns, birthdate, navigation]);

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

