import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';

/**
 * Custom hook for WhatBringsYouScreen logic
 * 
 * @param {string} selectedOption - The selected intent option
 * @returns {Object} Handlers for WhatBringsYouScreen
 */
export const useWhatBringsYou = (selectedOption) => {
  const navigation = useNavigation();

  const handleContinue = useCallback(() => {
    if (!selectedOption) return;
    
    // TODO: Save selected option to user profile/state
    console.log('Selected intent:', selectedOption);
    
    // Navigate to Step 3: Who are you?
    navigation.navigate('WhoAreYou');
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

