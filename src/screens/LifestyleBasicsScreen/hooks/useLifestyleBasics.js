import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';

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

  const handleContinue = useCallback(() => {
    // TODO: Save lifestyle basics to user profile/state
    console.log('Lifestyle basics:', {
      height: height ? `${height.feet}'${height.inches}"` : null,
      drinks: drinks || null,
      smokes: smokes || null,
      exercise: exercise || null,
      relationshipStyle: relationshipStyle || null,
    });
    
    // Navigate to Step 8: Interests
    navigation.navigate('Interests');
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

