import React, { useEffect, useRef, useCallback } from 'react';
import { Text, StyleSheet, View, Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  withRepeat,
  Easing
} from 'react-native-reanimated';
import { useTheme } from '../theme/theme';

/**
 * KindlLogo - Animated logo component with heartbeat animation
 * Optimized with React.memo and useCallback
 */
const KindlLogoComponent = ({ style }) => {
  const theme = useTheme();
  const logoRef = useRef(null);
  const scale = useSharedValue(1);

  const startHeartbeat = useCallback(() => {
    // Heartbeat pattern: two quick beats (lub-dub) then pause
    // This creates a natural heartbeat rhythm representing "fire in heart"
    const heartbeat = () => {
      // First beat (lub) - stronger, faster
      scale.value = withSequence(
        withTiming(1.12, { 
          duration: 200, 
          easing: Easing.out(Easing.quad) 
        }),
        withTiming(1, { 
          duration: 200, 
          easing: Easing.in(Easing.quad) 
        }),
        // Small pause before second beat
        withTiming(1, { duration: 100 }),
        // Second beat (dub) - slightly smaller
        withTiming(1.08, { 
          duration: 180, 
          easing: Easing.out(Easing.quad) 
        }),
        withTiming(1, { 
          duration: 180, 
          easing: Easing.in(Easing.quad) 
        }),
        // Longer pause before next heartbeat cycle
        withTiming(1, { duration: 1200 })
      );
    };

    // Repeat the heartbeat pattern continuously
    scale.value = withRepeat(
      withSequence(
        // First beat (lub)
        withTiming(1.12, { duration: 200, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 200, easing: Easing.in(Easing.quad) }),
        withTiming(1, { duration: 100 }), // pause
        // Second beat (dub)
        withTiming(1.08, { duration: 180, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 180, easing: Easing.in(Easing.quad) }),
        withTiming(1, { duration: 1200 }) // longer pause
      ),
      -1, // infinite repeat
      false
    );
  }, []);

  useEffect(() => {
    // Fade in the entire logo
    if (logoRef.current) {
      logoRef.current.fadeIn(600);
    }
    
    // Start heartbeat animation after initial delay
    const timer = setTimeout(() => {
      startHeartbeat();
    }, 1000);

    return () => clearTimeout(timer);
  }, [startHeartbeat]);

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animatable.View ref={logoRef} style={style}>
      <View style={styles.logoContainer}>
        <Animated.View style={[styles.kContainer, animatedTextStyle]}>
          <Text style={[styles.cursiveK, { color: theme.colors.textPrimary }]}>
            K
          </Text>
        </Animated.View>
        <Text style={[styles.restOfText, { color: theme.colors.textPrimary }]}>
          indl
        </Text>
      </View>
    </Animatable.View>
  );
};

KindlLogoComponent.displayName = 'KindlLogo';

const styles = StyleSheet.create({
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kContainer: {
    marginRight: -6,
    transform: [{ rotate: '-8deg' }],
    // Only the K will animate with heartbeat
  },
  cursiveK: {
    fontSize: 100,
    fontStyle: 'italic',
    fontWeight: '300',
    lineHeight: 100,
    // Cursive K - elegant and flowing
    // The heartbeat animation will make it "beat" like a heart
  },
  restOfText: {
    fontSize: 64,
    fontWeight: '700',
    letterSpacing: -1,
    lineHeight: 64,
    // Rest of the text stays static, no animation
  },
});

const KindlLogo = React.memo(KindlLogoComponent);

export default KindlLogo;

