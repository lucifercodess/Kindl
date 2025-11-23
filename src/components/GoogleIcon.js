import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

/**
 * Colored Google Icon
 * Uses Google's brand colors
 */
const GoogleIcon = ({ size = 20 }) => {
  // Google brand colors
  const googleBlue = '#4285F4';
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <FontAwesome5 
        name="google" 
        size={size} 
        color={googleBlue}
        solid
      />
    </View>
  );
};

GoogleIcon.displayName = 'GoogleIcon';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GoogleIcon;

