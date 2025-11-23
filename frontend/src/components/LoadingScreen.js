import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat,
  withSequence,
  Easing
} from 'react-native-reanimated';
import { useTheme } from '../theme/theme';
import globalStyles from '../theme/globalStyles';

/**
 * LoadingScreen - Shows animated K letter during loading
 * Similar to Hinge's H animation - only the K, no text
 */
const LoadingScreen = React.memo(() => {
  const theme = useTheme();
  const logoRef = useRef(null);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    // Fade in animation
    if (logoRef.current) {
      logoRef.current.fadeIn(400);
    }

    // Continuous pulse animation for the K (like heartbeat)
    scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { 
          duration: 600, 
          easing: Easing.out(Easing.quad) 
        }),
        withTiming(1, { 
          duration: 600, 
          easing: Easing.in(Easing.quad) 
        }),
        withTiming(1, { duration: 200 }), // pause
        withTiming(1.1, { 
          duration: 500, 
          easing: Easing.out(Easing.quad) 
        }),
        withTiming(1, { 
          duration: 500, 
          easing: Easing.in(Easing.quad) 
        }),
        withTiming(1, { duration: 1000 }) // longer pause
      ),
      -1, // infinite
      false
    );

    // Opacity pulse for breathing effect
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.7, { duration: 600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <View style={[globalStyles.container, globalStyles.centeredContent, styles.container]}>
      <Animatable.View ref={logoRef}>
        <Animated.View style={[styles.kContainer, animatedStyle]}>
          <Text style={[styles.cursiveK, { color: theme.colors.textPrimary }]}>
            K
          </Text>
        </Animated.View>
      </Animatable.View>
    </View>
  );
});

LoadingScreen.displayName = 'LoadingScreen';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  kContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-8deg' }],
  },
  cursiveK: {
    fontSize: 120,
    fontStyle: 'italic',
    fontWeight: '300',
    lineHeight: 120,
    // Large, elegant cursive K for loading animation
  },
});

export default LoadingScreen;

