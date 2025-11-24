import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  withRepeat,
  withSpring,
  Easing
} from 'react-native-reanimated';
import { useTheme } from '../../theme/theme';
import globalStyles from '../../theme/globalStyles';
import { useFinalTouch } from './hooks/useFinalTouch';
import { hapticButtonPress } from '../../utils/haptics';

// Dev mode flag
const __DEV__ = true;

/**
 * FinalTouchScreen - Step 11 of onboarding
 * Premium personality summary with smooth animations
 */
const FinalTouchScreen = React.memo(() => {
  const theme = useTheme();
  const cardRef = useRef(null);
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const checkmarkScale = useSharedValue(0);
  const checkmarkRotation = useSharedValue(-180);
  const buttonScale = useSharedValue(0.9);
  const glowOpacity = useSharedValue(0);
  const { handleStartMatching, handleResetToLaunch } = useFinalTouch();

  useEffect(() => {
    // Fade in and scale up animation
    opacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) });
    scale.value = withTiming(1, { 
      duration: 600, 
      easing: Easing.out(Easing.back(1.2)) 
    });

    // Animate checkmark with rotation
    setTimeout(() => {
      checkmarkScale.value = withSpring(1, { damping: 8, stiffness: 100 });
      checkmarkRotation.value = withSpring(0, { damping: 8, stiffness: 100 });
    }, 200);

    // Animate glow
    glowOpacity.value = withTiming(0.15, { duration: 800, easing: Easing.out(Easing.ease) });

    // Subtle pulse animation for the card
    setTimeout(() => {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    }, 800);

    // Animate button
    setTimeout(() => {
      buttonScale.value = withSpring(1, { damping: 10, stiffness: 150 });
    }, 400);
  }, []);

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const animatedCheckmarkStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: checkmarkScale.value },
        { rotate: `${checkmarkRotation.value}deg` }
      ],
    };
  });

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  const animatedGlowStyle = useAnimatedStyle(() => {
    return {
      opacity: glowOpacity.value,
    };
  });

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={[globalStyles.content, globalStyles.centeredContent, styles.container]}>
        {/* Subtle gradient glow behind card */}
        <Animated.View 
          style={[
            styles.glowCircle,
            animatedGlowStyle,
            { backgroundColor: theme.colors.primaryBlack }
          ]}
        />

        <Animated.View 
          style={[styles.card, animatedCardStyle]}
        >
          <Animatable.View ref={cardRef} style={styles.cardContent}>
            {/* Animated checkmark */}
            <Animated.View style={animatedCheckmarkStyle}>
              <View style={styles.checkmarkContainer}>
                <Text style={[styles.checkmark, { color: theme.colors.primaryBlack }]}>
                  ✓
                </Text>
              </View>
            </Animated.View>

            {/* Title with sparkle */}
            <View style={styles.titleContainer}>
              <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                Your Kindl profile is ready.
              </Text>
        
            </View>

           

            <View style={styles.buttonContainer}>
              <Animated.View style={animatedButtonStyle}>
                <TouchableOpacity
                  style={[
                    styles.startButton,
                    {
                      backgroundColor: theme.colors.primaryBlack,
                    },
                  ]}
                  onPress={() => {
                    hapticButtonPress();
                    handleStartMatching();
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.startButtonText,
                      {
                        color: theme.colors.primaryWhite,
                      },
                    ]}
                  >
                    Start Matching
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </Animatable.View>
        </Animated.View>

        {/* Dev-only: Reset button */}
        {__DEV__ && (
          <TouchableOpacity
            onPress={handleResetToLaunch}
            style={styles.devResetButton}
            activeOpacity={0.7}
          >
            <Text style={[styles.devResetText, { color: theme.colors.textSecondary }]}>
              [Dev] Reset to Launch
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
});

FinalTouchScreen.displayName = 'FinalTouchScreen';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 32,
    position: 'relative',
  },
  glowCircle: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: 250,
    top: -100,
    alignSelf: 'center',
    opacity: 0.02,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  cardContent: {
    width: '100%',
    alignItems: 'center',
  },
  checkmarkContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkmark: {
    fontSize: 56,
    fontWeight: '300',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 36,
  },
  sparkle: {
    fontSize: 24,
    marginLeft: 8,
    marginTop: 2,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 8,
    opacity: 0.8,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 8,
  },
  startButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  startButtonText: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  devResetButton: {
    marginTop: 40,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
  },
  devResetText: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
    opacity: 0.6,
  },
});

export default FinalTouchScreen;

