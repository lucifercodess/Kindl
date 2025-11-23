import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';

/**
 * Custom hook for FinalTouchScreen logic
 * 
 * @returns {Object} Handlers for FinalTouchScreen
 */
export const useFinalTouch = () => {
  const navigation = useNavigation();

  const handleStartMatching = useCallback(() => {
    // TODO: Complete onboarding and navigate to main app
    console.log('Starting matching - onboarding complete!');
    
    // TODO: Navigate to main app/home screen
    // navigation.navigate('Home');
    // or
    // navigation.dispatch(
    //   CommonActions.reset({
    //     index: 0,
    //     routes: [{ name: 'Home' }],
    //   })
    // );
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
    handleStartMatching,
    handleResetToLaunch,
  };
};

