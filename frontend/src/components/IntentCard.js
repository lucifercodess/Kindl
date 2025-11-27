import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  Easing,
} from 'react-native';
import { useTheme } from '../theme/theme';
import { hapticLight } from '../utils/haptics';

/**
 * IntentCard - Enhanced intent card with animations and micro-reactions
 */
const IntentCard = React.memo(({
  intent,
  index,
  onPress,
  ambientVibes,
}) => {
  const { colors } = useTheme();
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(15)).current;
  const cardScale = useRef(new Animated.Value(1)).current;
  const iconScale = useRef(new Animated.Value(1)).current;
  const iconBreathe = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered entrance animation
    const delay = index * 70; // 70ms stagger
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 500,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(cardTranslateY, {
        toValue: 0,
        duration: 500,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  useEffect(() => {
    // Icon breathing animation (1-2% scale)
    Animated.loop(
      Animated.sequence([
        Animated.timing(iconBreathe, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(iconBreathe, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const iconScaleInterpolated = iconBreathe.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.015], // 1.5% scale
  });

  const handlePressIn = () => {
    Animated.spring(cardScale, {
      toValue: 0.97,
      tension: 300,
      friction: 20,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(cardScale, {
      toValue: 1,
      tension: 300,
      friction: 20,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    hapticLight();
    if (onPress) {
      onPress();
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: cardOpacity,
          transform: [
            { translateY: cardTranslateY },
            { scale: cardScale },
          ],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.card}
      >
        <View style={styles.content}>
          <Animated.View
            style={[
              styles.iconContainer,
              { transform: [{ scale: iconScaleInterpolated }] },
            ]}
          >
            <Text style={styles.icon}>{intent.icon}</Text>
          </Animated.View>
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {intent.title}
            </Text>
            {ambientVibes && ambientVibes.length > 0 && (
              <Text style={[styles.vibes, { color: colors.textSecondary }]}>
                {ambientVibes.join(' • ')}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

IntentCard.displayName = 'IntentCard';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  vibes: {
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: 0.1,
    lineHeight: 18,
  },
});

export default IntentCard;

