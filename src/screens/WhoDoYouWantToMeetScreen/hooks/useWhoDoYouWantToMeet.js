import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';

/**
 * Custom hook for WhoDoYouWantToMeetScreen logic
 * 
 * @param {string} selectedOption - The selected orientation option
 * @returns {Object} Handlers for WhoDoYouWantToMeetScreen
 */
export const useWhoDoYouWantToMeet = (selectedOption) => {
  const navigation = useNavigation();

  const handleContinue = useCallback(() => {
    if (!selectedOption) return;
    
    // TODO: Save selected orientation to user profile/state
    console.log('Selected orientation:', selectedOption);
    
    // Navigate to Step 5: Add Photos
    navigation.navigate('AddPhotos');
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

