import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useTheme } from '../theme/theme';

const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  style, 
  disabled = false,
  loading = false 
}) => {
  const theme = useTheme();
  const isPrimary = variant === 'primary';

  const buttonStyle = [
    styles.button,
    {
      backgroundColor: isPrimary ? theme.colors.primaryBlack : theme.colors.primaryWhite,
      borderWidth: isPrimary ? 0 : 2,
      borderColor: theme.colors.primaryBlack,
      borderRadius: theme.radius.lg,
      height: 54,
      opacity: disabled ? 0.5 : 1,
    },
    style,
  ];

  const textStyle = [
    styles.text,
    {
      color: isPrimary ? theme.colors.primaryWhite : theme.colors.primaryBlack,
      fontSize: theme.typography.button.fontSize,
      fontWeight: theme.typography.button.fontWeight,
    },
  ];

  const handlePress = () => {
    if (!disabled && !loading && onPress) {
      onPress();
    }
  };

  return (
    <Animatable.View
      animation={disabled ? undefined : 'pulse'}
      iterationCount={1}
      duration={200}
    >
      <TouchableOpacity
        style={buttonStyle}
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ disabled: disabled || loading }}
      >
        {loading ? (
          <ActivityIndicator 
            color={isPrimary ? theme.colors.primaryWhite : theme.colors.primaryBlack} 
            size="small"
          />
        ) : (
          <Text style={textStyle}>{title}</Text>
        )}
      </TouchableOpacity>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  text: {
    textAlign: 'center',
  },
});

export default Button;

