import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';

/**
 * Custom hook for LocationPermissionsScreen logic
 * 
 * @param {boolean} locationGranted - Whether location permission is granted
 * @returns {Object} Handlers for LocationPermissionsScreen
 */
export const useLocationPermissions = (locationGranted) => {
  const navigation = useNavigation();

  const handleContinue = useCallback(() => {
    // TODO: Save permission status to user profile/state
    console.log('Location permission:', locationGranted ? 'granted' : 'not granted');
    
    // Navigate to animated transition screen, then to Final Touch
    navigation.navigate('AnimatedTransition', { nextScreen: 'FinalTouch' });
  }, [locationGranted, navigation]);

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

