import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '../theme/theme';

const MICRO_MESSAGES = [
  'Where intention meets connection.',
  'Discover what feels right for you.',
  'Every moment is a chance to connect.',
  'Slow down. Feel deeply.',
  'Your next meaningful conversation awaits.',
  'Trust the process of finding your people.',
];

/**
 * RotatingMicroMessages - Rotating emotional micro-messages under header
 */
const RotatingMicroMessages = React.memo(() => {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        // Change message
        setCurrentIndex((prev) => (prev + 1) % MICRO_MESSAGES.length);
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }).start();
      });
    }, 3500); // Change every 3.5 seconds

    return () => clearInterval(interval);
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.message,
          { color: '#8B7D7A', opacity: fadeAnim }, // Warmer, more alive color
        ]}
      >
        {MICRO_MESSAGES[currentIndex]}
      </Animated.Text>
    </View>
  );
});

RotatingMicroMessages.displayName = 'RotatingMicroMessages';

const styles = StyleSheet.create({
  container: {
    minHeight: 24,
    marginTop: 12, // Increased from 4 to 12 for more breathing room
  },
  message: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: 0.1,
    fontStyle: 'italic',
  },
});

export default RotatingMicroMessages;

