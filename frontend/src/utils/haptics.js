import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Premium haptic feedback utility
 * Provides different haptic types for different interactions
 */

/**
 * Haptic feedback for primary button presses
 * Medium impact - feels substantial and premium
 */
export const hapticButtonPress = () => {
  if (Platform.OS === 'ios') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
};

/**
 * Haptic feedback for secondary/light actions
 * Light impact - subtle feedback
 */
export const hapticLight = () => {
  if (Platform.OS === 'ios') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
};

/**
 * Haptic feedback for option selections
 * Selection feedback - feels like selecting an option
 */
export const hapticSelection = () => {
  if (Platform.OS === 'ios') {
    Haptics.selectionAsync();
  }
};

/**
 * Haptic feedback for successful actions
 * Success notification - feels satisfying
 */
export const hapticSuccess = () => {
  if (Platform.OS === 'ios') {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }
};

/**
 * Haptic feedback for errors
 * Error notification
 */
export const hapticError = () => {
  if (Platform.OS === 'ios') {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }
};

/**
 * Haptic feedback for warnings
 * Warning notification
 */
export const hapticWarning = () => {
  if (Platform.OS === 'ios') {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }
};

/**
 * Custom haptic feedback with specific impact style
 * @param {Haptics.ImpactFeedbackStyle} style - The impact style (Light, Medium, Heavy)
 */
export const hapticImpact = (style = Haptics.ImpactFeedbackStyle.Medium) => {
  if (Platform.OS === 'ios') {
    Haptics.impactAsync(style);
  }
};

