import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import * as Location from 'expo-location';

/**
 * Custom hook for InterestsScreen logic
 * 
 * @param {Array} selectedInterests - Array of selected interest IDs
 * @returns {Object} Handlers for InterestsScreen
 */
export const useInterests = (selectedInterests) => {
  const navigation = useNavigation();

  const handleContinue = useCallback(async () => {
    if (selectedInterests.length < 3 || selectedInterests.length > 5) return;
    
    // TODO: Save selected interests to user profile/state
    console.log('Selected interests:', selectedInterests);
    
    // Request location permission directly
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('Location permission:', status);
      // Navigate to animated transition regardless of permission status
      // User can enable location later in settings
      navigation.navigate('AnimatedTransition', { nextScreen: 'FinalTouch' });
    } catch (error) {
      console.error('Error requesting location permission:', error);
      // Still navigate even if permission request fails
      navigation.navigate('AnimatedTransition', { nextScreen: 'FinalTouch' });
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

