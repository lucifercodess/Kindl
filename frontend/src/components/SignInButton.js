import React, { useMemo } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/theme';
import globalStyles from '../theme/globalStyles';

/**
 * SignInButton - Optimized button component for sign-in actions
 * Uses React.memo to prevent unnecessary re-renders
 */
const SignInButton = React.memo(({ 
  title, 
  onPress, 
  icon, 
  variant = 'outline', // 'outline' or 'primary'
  style 
}) => {
  const theme = useTheme();
  const isPrimary = variant === 'primary';

  // Memoize styles to prevent recalculation on every render
  const buttonStyle = useMemo(() => [
    styles.button,
    {
      backgroundColor: isPrimary ? theme.colors.primaryBlack : theme.colors.primaryWhite,
      borderWidth: isPrimary ? 0 : 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.lg,
      height: 54,
    },
    style,
  ], [isPrimary, theme.colors, theme.radius.lg, style]);

  const textStyle = useMemo(() => [
    styles.text,
    {
      color: isPrimary ? theme.colors.primaryWhite : theme.colors.textPrimary,
      fontSize: theme.typography.button.fontSize,
      fontWeight: theme.typography.button.fontWeight,
    },
  ], [isPrimary, theme.colors, theme.typography.button]);

  // Don't override color for Google icon (it has its own colors)
  const iconColor = useMemo(() => 
    isPrimary ? theme.colors.primaryWhite : theme.colors.textPrimary,
    [isPrimary, theme.colors]
  );
  const isGoogleIcon = useMemo(() => 
    icon && icon.type && (icon.type.name === 'GoogleIcon' || icon.type.displayName === 'GoogleIcon'),
    [icon]
  );

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={styles.content}>
        {icon && (
          <View style={styles.iconContainer}>
            {isGoogleIcon ? (
              // Google icon keeps its own colors
              icon
            ) : (
              // Other icons use theme colors
              React.cloneElement(icon, { 
                color: iconColor,
                size: 20,
              })
            )}
          </View>
        )}
        <Text style={textStyle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
});

SignInButton.displayName = 'SignInButton';

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 10,
    opacity: 0.8, // Subtle icon
  },
  text: {
    textAlign: 'center',
  },
});

export default SignInButton;

