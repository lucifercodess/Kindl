import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { hapticSelection } from '../../utils/haptics';
import Badge from './Badge';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

/**
 * SafetyCard Component for Trust & Safety
 * Premium card with animations and badge support
 */
const SafetyCard = React.memo(({ title, subtitle, icon, badge, onPress }) => {
  const scale = useSharedValue(1);
  const chevronTranslateX = useSharedValue(0);

  const handlePressIn = () => {
    hapticSelection();
    scale.value = withSpring(0.97, {
      damping: 10,
      stiffness: 120,
    });
    chevronTranslateX.value = withTiming(2, { duration: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 10,
      stiffness: 120,
    });
    chevronTranslateX.value = withTiming(0, { duration: 150 });
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const animatedChevronStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: chevronTranslateX.value }],
    };
  });

  return (
    <AnimatedTouchable
      activeOpacity={1}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.card, animatedCardStyle]}
    >
      <View style={styles.cardContent}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          {icon}
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          {title && (
            <Text style={styles.title}>{title}</Text>
          )}
          <Text style={[styles.subtitle, !title && styles.subtitleNoTitle]}>{subtitle}</Text>
        </View>

        {/* Badge or Chevron */}
        <View style={styles.rightContainer}>
          {badge ? (
            <Badge type={badge} />
          ) : (
            <Animated.View style={animatedChevronStyle}>
              <Ionicons name="chevron-forward" size={18} color="rgba(0, 0, 0, 0.25)" />
            </Animated.View>
          )}
        </View>
      </View>
    </AnimatedTouchable>
  );
});

SafetyCard.displayName = 'SafetyCard';

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 28,
    marginBottom: 24,
    borderRadius: 24,
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#EDEDED',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
    letterSpacing: -0.1,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#777777',
    lineHeight: 20,
  },
  subtitleNoTitle: {
    marginTop: 0,
  },
  rightContainer: {
    marginLeft: 12,
  },
});

export default SafetyCard;

