import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import { onboardingApi } from '../../../utils/onboardingApi';
import { useAuth } from '../../../hooks/useAuth';

/**
 * Custom hook for InterestsScreen logic
 * 
 * @param {Array} selectedInterests - Array of selected interest IDs
 * @returns {Object} Handlers for InterestsScreen
 */
export const useInterests = (selectedInterests) => {
  const navigation = useNavigation();
  const { accessToken } = useAuth();

  const handleContinue = useCallback(async () => {
    if (selectedInterests.length < 3 || selectedInterests.length > 5) return;

    try {
      // Save interests
      await onboardingApi.updateInterests(selectedInterests, accessToken);

      // Request location permission directly
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('Location permission:', status);

      if (status === 'granted') {
        const { coords } = await Location.getCurrentPositionAsync({});
        await onboardingApi.updateLocation(
          {
            lat: coords.latitude,
            lng: coords.longitude,
            accuracy: coords.accuracy ?? 0,
          },
          accessToken
        );
      }

      // Mark onboarding complete (we are at the end of the flow)
      await onboardingApi.complete(accessToken);

      // Navigate to animated transition regardless of permission status
      navigation.navigate('AnimatedTransition', { nextScreen: 'FinalTouch' });
    } catch (error) {
      console.error('Error during interests/location save:', error);
      Alert.alert('Error', error.message || 'Unable to save your choices. Please try again.');
    }
  }, [selectedInterests, navigation]);

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

