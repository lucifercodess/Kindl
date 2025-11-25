import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, View, Animated, Platform } from 'react-native';
import { useTheme } from '../theme/theme';

/**
 * KindlLogoTabIcon - Glowing K logo for bottom tab navigation
 * Premium glow effect with smooth animations
 */
const KindlLogoTabIcon = ({ focused }) => {
  const theme = useTheme();
  const baseGlowOpacity = useRef(new Animated.Value(focused ? 0.4 : 0)).current;
  const pulseGlowOpacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(focused ? 1 : 0.9)).current;
  const opacity = useRef(new Animated.Value(focused ? 1 : 0.4)).current;

  useEffect(() => {
    // Base animations
    Animated.parallel([
      Animated.spring(scale, {
        toValue: focused ? 1 : 0.9,
        useNativeDriver: true,
        tension: 400,
        friction: 8,
      }),
      Animated.timing(opacity, {
        toValue: focused ? 1 : 0.4,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(baseGlowOpacity, {
        toValue: focused ? 0.4 : 0,
        duration: 400,
        useNativeDriver: false,
      }),
    ]).start();

    // Subtle pulsing glow when focused
    if (focused) {
      pulseGlowOpacity.setValue(0);
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseGlowOpacity, {
            toValue: 0.2,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(pulseGlowOpacity, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: false,
          }),
        ])
      );
      pulse.start();
      return () => {
        pulse.stop();
        pulseGlowOpacity.setValue(0);
      };
    } else {
      pulseGlowOpacity.setValue(0);
    }
  }, [focused]);

        const color = focused ? '#FFFFFF' : '#666666';

  return (
    <View style={styles.logoContainer}>
      {/* Glow effect layer - base */}
      <Animated.View
        style={[
          styles.glowLayer,
          {
            opacity: baseGlowOpacity,
          },
        ]}
      >
        <Text style={[styles.cursiveK, styles.glowText, { color }]}>K</Text>
      </Animated.View>
      
      {/* Glow effect layer - pulse overlay */}
      <Animated.View
        style={[
          styles.glowLayer,
          {
            opacity: pulseGlowOpacity,
          },
        ]}
      >
        <Text style={[styles.cursiveK, styles.glowText, { color }]}>K</Text>
      </Animated.View>
      
      {/* Main K logo */}
      <Animated.View
        style={{
          transform: [{ scale }],
          opacity,
        }}
      >
        <Text style={[styles.cursiveK, { color }]}>K</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-8deg' }],
    marginTop: 8,
    position: 'relative',
  },
  glowLayer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 16,
        shadowOpacity: 0.3,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  glowText: {
    opacity: 0.5,
  },
  cursiveK: {
    fontSize: 42,
    fontStyle: 'italic',
    fontWeight: '300',
    lineHeight: 42,
    textAlign: 'center',
  },
});

export default KindlLogoTabIcon;

