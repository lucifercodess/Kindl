import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { Alert } from 'react-native';
import { onboardingApi } from '../../../utils/onboardingApi';
import { useAuth } from '../../../hooks/useAuth';

/**
 * Custom hook for LifestyleBasicsScreen logic
 * 
 * @param {Object} formData - Lifestyle basics data
 * @param {Object} formData.height - User's height {feet, inches} (optional)
 * @param {string} formData.drinks - Drinking preference (optional)
 * @param {string} formData.smokes - Smoking preference (optional)
 * @param {string} formData.exercise - Exercise frequency (optional)
 * @param {string} formData.relationshipStyle - Relationship style (optional)
 * @returns {Object} Handlers for LifestyleBasicsScreen
 */
export const useLifestyleBasics = ({ height, drinks, smokes, exercise, relationshipStyle }) => {
  const navigation = useNavigation();
  const { accessToken } = useAuth();

  const handleContinue = useCallback(async () => {
    try {
      const heightCm =
        height && typeof height.feet === 'number' && typeof height.inches === 'number'
          ? Math.round((height.feet * 12 + height.inches) * 2.54)
          : undefined;

      await onboardingApi.updateLifestyle(
        {
          heightCm,
          drinks,
          smokes,
          exercise,
          relationshipStyle,
        },
        accessToken
      );

      // Navigate to Step 8: Interests
      navigation.navigate('Interests');
    } catch (err) {
      console.error('Failed to save lifestyle basics', err);
      Alert.alert('Error', err.message || 'Unable to save your details. Please try again.');
    }
  }, [height, drinks, smokes, exercise, relationshipStyle, navigation]);

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

