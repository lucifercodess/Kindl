import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';

/**
 * Custom hook for SoftWelcomeScreen logic
 * 
 * @returns {Object} Handlers for SoftWelcomeScreen
 */
export const useSoftWelcome = () => {
  const navigation = useNavigation();

  const handleGetStarted = useCallback(() => {
    // Navigate to Step 2: What brings you here?
    console.log('Start the Spark pressed');
    navigation.navigate('WhatBringsYou');
  }, [navigation]);

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
    handleGetStarted,
    handleResetToLaunch, // Dev helper
  };
};

