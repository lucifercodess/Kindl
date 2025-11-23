import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';

/**
 * Custom hook for HowDoYouConnectScreen logic
 * 
 * @param {string} selectedOption - The selected connection style option
 * @returns {Object} Handlers for HowDoYouConnectScreen
 */
export const useHowDoYouConnect = (selectedOption) => {
  const navigation = useNavigation();

  const handleContinue = useCallback(() => {
    if (!selectedOption) return;
    
    // TODO: Save selected connection style to user profile/state
    console.log('Selected connection style:', selectedOption);
    
    // Navigate to Step 7: Lifestyle Basics
    navigation.navigate('LifestyleBasics');
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

