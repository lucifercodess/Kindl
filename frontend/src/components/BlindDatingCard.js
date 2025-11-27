import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/theme';
import { hapticLight, hapticSelection } from '../utils/haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const START_HOUR = 21; // 4 PM testing start
const START_MINUTE = 10;
const DURATION_MINUTES = 60;

const palette = {
  blush: '#E7C8BE',
  rose: '#D8A89C',
  clay: '#B57F72',
  parchment: '#FBF8F4',
  ivory: '#F6EEE7',
  cocoa: '#6E4F45',
};

/**
 * BlindDatingCard - Premium, luxury blind dating experience card
 * Sophisticated animations and subtle luxury design
 */
const BlindDatingCard = ({
  onPress,
  showIntroAnimation = false,
  onCountdownChange,
}) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  
  // Multiple animation refs for sophisticated effects
  const cardScale = useRef(new Animated.Value(1)).current;
  const cardOpacity = useRef(new Animated.Value(1)).current; // Start visible
  const shimmerAnim = useRef(new Animated.Value(-1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const livePulse = useRef(new Animated.Value(1)).current;
  const countdownScale = useRef(new Animated.Value(1)).current;
  const introHaloScale = useRef(new Animated.Value(0.4)).current;
  const introHaloOpacity = useRef(new Animated.Value(0)).current;
  const introSparkleOpacity = useRef(new Animated.Value(0)).current;
  const introSparkleTranslate = useRef(new Animated.Value(20)).current;
  const breatheAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  
  // Floating particles (3 small particles)
  const particles = useRef(
    Array(3).fill(null).map(() => ({
      opacity: new Animated.Value(0.3),
      translateY: new Animated.Value(0),
      translateX: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    // Card is already visible, just start background animations

    // Ultra-smooth shimmer effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: -1,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Subtle breathing glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Gentle breathing scale animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 0,
          duration: 4000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 5000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 5000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating particles (5s loop, very subtle)
    particles.forEach((particle, index) => {
      const delay = index * 1000;
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(particle.translateY, {
              toValue: -15,
              duration: 5000,
              easing: Easing.bezier(0.4, 0, 0.2, 1),
              useNativeDriver: true,
            }),
            Animated.timing(particle.translateX, {
              toValue: (index % 2 === 0 ? 1 : -1) * 8,
              duration: 5000,
              easing: Easing.bezier(0.4, 0, 0.2, 1),
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(particle.opacity, {
                toValue: 0.5,
                duration: 2500,
                easing: Easing.bezier(0.4, 0, 0.2, 1),
                useNativeDriver: true,
              }),
              Animated.timing(particle.opacity, {
                toValue: 0.2,
                duration: 2500,
                easing: Easing.bezier(0.4, 0, 0.2, 1),
                useNativeDriver: true,
              }),
            ]),
          ]),
          Animated.parallel([
            Animated.timing(particle.translateY, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(particle.translateX, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(particle.opacity, {
              toValue: 0.3,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    });
  }, []);

  useEffect(() => {
    if (showIntroAnimation) {
      introHaloScale.setValue(0.4);
      introHaloOpacity.setValue(0);
      introSparkleOpacity.setValue(0);
      introSparkleTranslate.setValue(20);

      Animated.parallel([
        Animated.sequence([
          Animated.timing(introHaloOpacity, {
            toValue: 0.6,
            duration: 300,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(introHaloOpacity, {
            toValue: 0,
            duration: 600,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(introHaloScale, {
          toValue: 1.6,
          duration: 900,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(200),
          Animated.parallel([
            Animated.timing(introSparkleOpacity, {
              toValue: 1,
              duration: 400,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(introSparkleTranslate, {
              toValue: -10,
              duration: 600,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(introSparkleOpacity, {
            toValue: 0,
            duration: 500,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [
    showIntroAnimation,
    introHaloScale,
    introHaloOpacity,
    introSparkleOpacity,
    introSparkleTranslate,
  ]);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      
      // Calculate today's start time
      const todayStart = new Date(now);
      todayStart.setHours(START_HOUR, START_MINUTE, 0, 0);
      
      // Calculate today's end time
      const todayEnd = new Date(todayStart);
      todayEnd.setMinutes(todayEnd.getMinutes() + DURATION_MINUTES);
      
      // Determine if we're in the active window
      let isBlindDatingHour = now >= todayStart && now < todayEnd;
      const wasActive = isActive;
      
      // Calculate target time (either end of current session or start of next)
      let target;
      if (isBlindDatingHour) {
        // Currently active - countdown to end
        target = new Date(todayEnd);
      } else {
        // Not active - countdown to next start
        if (now < todayStart) {
          // Today's session hasn't started yet
          target = new Date(todayStart);
        } else {
          // Today's session has passed - use tomorrow
          const tomorrowStart = new Date(todayStart);
          tomorrowStart.setDate(tomorrowStart.getDate() + 1);
          target = new Date(tomorrowStart);
        }
      }

      setIsActive(isBlindDatingHour);

      const diffMs = target - now;
      const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const payload = { hours, minutes, seconds, isActive: isBlindDatingHour };
      setTimeRemaining(payload);
      if (onCountdownChange) {
        onCountdownChange(payload);
      }

      if (wasActive !== isBlindDatingHour) {
        Animated.sequence([
          Animated.spring(cardScale, {
            toValue: 0.98,
            tension: 300,
            friction: 20,
            useNativeDriver: true,
          }),
          Animated.spring(cardScale, {
            toValue: 1,
            tension: 300,
            friction: 20,
            useNativeDriver: true,
          }),
        ]).start();
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [isActive, cardScale, onCountdownChange]);

  useEffect(() => {
    let animation;
    if (isActive) {
      // Smooth live pulse animation
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(livePulse, {
            toValue: 1.05,
            duration: 1500,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: true,
          }),
          Animated.timing(livePulse, {
            toValue: 1,
            duration: 1500,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
    } else {
      livePulse.setValue(1);
      countdownScale.setValue(1);
    }

    return () => {
      if (animation) {
        animation.stop();
      }
    };
  }, [isActive]);

  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-SCREEN_WIDTH * 2, SCREEN_WIDTH * 2],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.4],
  });

  const breatheScale = breatheAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.008],
  });

  const floatTranslateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -3],
  });

  const formatTime = (value) => String(value || 0).padStart(2, '0');

  const handlePress = () => {
    hapticSelection();
    Animated.sequence([
      Animated.timing(cardScale, {
        toValue: 0.985,
        duration: 140,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        toValue: 1,
        tension: 180,
        friction: 18,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Navigate to Blind Dating screen when active
    if (isActive) {
      setTimeout(() => {
        navigation.navigate('BlindDating');
      }, 100);
    } else if (onPress) {
      setTimeout(() => onPress(), 100);
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: cardOpacity,
          transform: [
            { scale: Animated.multiply(cardScale, breatheScale) },
            { translateY: floatTranslateY },
          ],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={handlePress}
        style={styles.touchable}
      >
        {/* Subtle shimmer overlay */}
        <Animated.View
          style={[
            styles.shimmer,
            {
              transform: [{ translateX: shimmerTranslateX }],
            },
          ]}
          pointerEvents="none"
        />

        {/* Gradient background */}
        {isActive ? (
          <View style={styles.gradientContainer} pointerEvents="none">
            <LinearGradient
              colors={['rgba(216, 168, 156, 0.28)', 'rgba(235, 206, 195, 0.18)', 'rgba(207, 153, 140, 0.26)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </View>
        ) : (
          <LinearGradient
            colors={['#F7F0EB', '#F3E6DD', '#F7F0EB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        )}

        {/* Soft glow effect */}
        <Animated.View
          style={[
            styles.glow,
            {
              opacity: isActive ? glowOpacity : 0,
            },
          ]}
          pointerEvents="none"
        />

        {/* Intro highlight burst */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.introHalo,
            {
              opacity: introHaloOpacity,
              transform: [{ scale: introHaloScale }],
            },
          ]}
        />
        <Animated.View
          pointerEvents="none"
          style={[
            styles.introSparkles,
            {
              opacity: introSparkleOpacity,
              transform: [{ translateY: introSparkleTranslate }],
            },
          ]}
        >
          <Text style={styles.sparkleIcon}>✦</Text>
          <Text style={[styles.sparkleIcon, styles.sparkleIconSmall]}>✺</Text>
          <Text style={styles.sparkleIcon}>✦</Text>
        </Animated.View>

        {/* Floating particles */}
        {particles.map((particle, index) => {
          const positions = [
            { top: '20%', left: '15%' },
            { top: '60%', right: '20%' },
            { top: '40%', left: '80%' },
          ];
          return (
            <Animated.View
              key={index}
              pointerEvents="none"
              style={[
                styles.floatingParticle,
                positions[index],
                {
                  opacity: particle.opacity,
                  transform: [
                    { translateX: particle.translateX },
                    { translateY: particle.translateY },
                  ],
                },
              ]}
            >
              <View style={styles.particleDot} />
            </Animated.View>
          );
        })}

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                Blind Dating
              </Text>
              {isActive && (
                <Animated.View
                  style={[
                    styles.liveBadgeContainer,
                    {
                      transform: [{ scale: livePulse }],
                    },
                  ]}
                >
                  <View style={styles.liveBadge}>
                    <Animated.View
                      style={[
                        styles.liveDot,
                        {
                          opacity: livePulse.interpolate({
                            inputRange: [1, 1.05],
                            outputRange: [1, 0.7],
                          }),
                        },
                      ]}
                    />
                    <Text style={styles.liveText}>LIVE</Text>
                  </View>
                </Animated.View>
              )}
            </View>
            {!isActive && (
              <Text style={[styles.timeRange, { color: colors.textSecondary }]}>
                9–10 PM
              </Text>
            )}
          </View>

          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Sixty minutes of curated serendipity.
          </Text>

          {isActive ? (
            <View style={styles.activeSection}>
              <Text style={[styles.activeText, { color: palette.clay }]}>
                The Serendipity Hour
              </Text>
              <Animated.View
                style={[
                  styles.joinButton,
                  {
                    transform: [{ scale: livePulse }],
                  },
                ]}
              >
                <LinearGradient
                  colors={[palette.rose, palette.clay, palette.rose]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.joinButtonGradient}
                >
                  <Text style={styles.joinButtonText}>Join blind dating</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={styles.arrowIcon} />
                </LinearGradient>
              </Animated.View>
            </View>
          ) : (
            <View style={styles.countdownSection}>
              <Text style={[styles.countdownLabel, { color: colors.textSecondary }]}>
                Starts in
              </Text>
              <Animated.View
                style={{
                  transform: [{ scale: countdownScale }],
                }}
              >
                <Text style={[styles.countdownTime, { color: colors.textPrimary }]}>
                  {formatTime(timeRemaining.hours)}h {formatTime(timeRemaining.minutes)}m {formatTime(timeRemaining.seconds)}s
                </Text>
              </Animated.View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 12, // Increased from 8 to 12 for more breathing room
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  touchable: {
    borderRadius: 28, // Increased from 32 to 28
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(181, 127, 114, 0.25)',
    backgroundColor: '#FFFFFF',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: SCREEN_WIDTH * 2,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    transform: [{ skewX: '-15deg' }],
    zIndex: 1,
  },
  gradientContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(200, 150, 140, 0.35)',
    borderRadius: 32,
    zIndex: 0,
  },
  content: {
    padding: 28,
    zIndex: 2,
    position: 'relative',
  },
  header: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -1,
    marginRight: 14,
  },
  liveBadgeContainer: {
    marginTop: 2,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.clay,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: palette.clay,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FFFFFF',
    marginRight: 9,
  },
  liveText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FEFBF7',
    letterSpacing: 1,
  },
  timeRange: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.3,
    opacity: 0.85,
  },
  description: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 26,
    marginBottom: 24,
    letterSpacing: 0.2,
    opacity: 0.9,
  },
  activeSection: {
    marginTop: 4,
  },
  activeText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 18,
    letterSpacing: 0.3,
  },
  joinButton: {
    borderRadius: 22,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: palette.clay,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 18,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  joinButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 28,
    gap: 10,
  },
  joinButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFF9F4',
    letterSpacing: 0.5,
  },
  arrowIcon: {
    marginLeft: 4,
  },
  countdownSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
    marginTop: 4,
  },
  countdownLabel: {
    fontSize: 17,
    fontWeight: '400',
    letterSpacing: 0.3,
    opacity: 0.85,
  },
  countdownTime: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  introHalo: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    marginLeft: -SCREEN_WIDTH / 2,
    marginTop: -SCREEN_WIDTH / 2,
    borderRadius: SCREEN_WIDTH,
    backgroundColor: 'rgba(223, 182, 170, 0.18)',
    zIndex: 1,
  },
  introSparkles: {
    position: 'absolute',
    top: 22,
    right: 36,
    flexDirection: 'row',
    gap: 10,
    zIndex: 3,
  },
  sparkleIcon: {
    fontSize: 16,
    color: palette.clay,
    opacity: 0.85,
  },
  sparkleIconSmall: {
    fontSize: 13,
    opacity: 0.7,
  },
  floatingParticle: {
    position: 'absolute',
    zIndex: 1,
  },
  particleDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(181, 127, 114, 0.4)',
  },
});

export default BlindDatingCard;