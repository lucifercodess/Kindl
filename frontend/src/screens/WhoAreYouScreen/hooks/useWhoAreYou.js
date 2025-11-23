import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';

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

  const handleContinue = useCallback(() => {
    // TODO: Save user data to profile/state
    console.log('User data:', {
      name,
      gender,
      pronouns: pronouns || null,
      birthdate: birthdate ? birthdate.toISOString() : null,
    });
    
    // Navigate to Step 4: Who do you want to meet?
    navigation.navigate('WhoDoYouWantToMeet');
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

