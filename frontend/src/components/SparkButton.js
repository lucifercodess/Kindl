import React, { useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated, Platform, Text, View } from 'react-native';
import { useTheme } from '../theme/theme';
import { hapticSelection } from '../utils/haptics';

/**
 * SparkButton - Small spark icon button for photos/prompts
 * Positioned at bottom-right corner
 */
const SparkButton = ({ onPress, style, absolute = true }) => {
  const theme = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const buttonRef = useRef(null);

  const handlePress = () => {
    hapticSelection();
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 0.85,
        useNativeDriver: true,
        tension: 300,
        friction: 5,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 5,
      }),
    ]).start();
    
    if (onPress && buttonRef.current) {
      buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
        // Calculate center of button
        const centerX = pageX + width / 2;
        const centerY = pageY + height / 2;
        setTimeout(() => onPress({ x: centerX, y: centerY }), 100);
      });
    } else if (onPress) {
      setTimeout(() => onPress(null), 100);
    }
  };

  const containerStyle = absolute ? styles.container : styles.containerFlex;

  return (
    <Animated.View style={[containerStyle, style, { transform: [{ scale }] }]}>
      <View ref={buttonRef} collapsable={false}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primaryBlack }]}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <Text style={styles.sparkIcon}>✦</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    zIndex: 10,
  },
  containerFlex: {
    // For flexbox layouts (prompts)
    zIndex: 10,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sparkIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '300',
  },
});

export default SparkButton;

