import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  withRepeat,
  Easing
} from 'react-native-reanimated';
import * as Animatable from 'react-native-animatable';
import { useTheme } from '../theme/theme';

/**
 * AnimatedTransition - Smooth animated transition between screens
 * Shows animated K logo similar to loading screen
 */
const AnimatedTransition = React.memo(() => {
  const theme = useTheme();
  const logoRef = useRef(null);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Fade in
    opacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) });
    
    // Heartbeat animation
    scale.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 200, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 200, easing: Easing.in(Easing.quad) }),
        withTiming(1, { duration: 100 }),
        withTiming(1.08, { duration: 180, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 180, easing: Easing.in(Easing.quad) }),
        withTiming(1, { duration: 1200 })
      ),
      -1,
      false
    );

    // Fade in animation
    if (logoRef.current) {
      logoRef.current.fadeIn(400);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.container}>
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

AnimatedTransition.displayName = 'AnimatedTransition';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
});

export default AnimatedTransition;

