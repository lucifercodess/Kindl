import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import KindlLogoTabIcon from './KindlLogoTabIcon';
import { hapticLight, hapticSelection } from '../utils/haptics';

/**
 * CustomTabBar - Premium glass morphism tab bar
 * Smooth, classy, black & white only
 */
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const scaleAnims = useRef(state.routes.map(() => new Animated.Value(1))).current;
  
  const tabIcons = [
    { name: 'Profile', icon: 'person', iconOutline: 'person-outline' },
    { name: 'Rooms', icon: 'sparkles', iconOutline: 'sparkles-outline' },
    { name: 'Home', isLogo: true },
    { name: 'Likes', icon: 'heart', iconOutline: 'heart-outline' },
    { name: 'Messages', icon: 'chatbubble', iconOutline: 'chatbubble-outline' },
  ];

  // Animate on tab change
  useEffect(() => {
    state.routes.forEach((route, index) => {
      const isFocused = state.index === index;
      
      Animated.spring(scaleAnims[index], {
        toValue: isFocused ? 1.15 : 1,
        useNativeDriver: true,
        tension: 400,
        friction: 8,
        velocity: 0.5,
      }).start();
    });
  }, [state.index]);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Black background */}
      <View style={styles.blackBackground} />
      
      {/* Subtle top border */}
      <View style={styles.border} />
      
      {/* Tab buttons */}
      <View style={styles.tabContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const tabConfig = tabIcons[index];

          const onPress = () => {
            // Enhanced haptic feedback - selection for active, light for inactive
            if (isFocused) {
              hapticSelection();
            } else {
              hapticLight();
            }
            
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              <Animated.View
                style={[
                  styles.iconContainer,
                  {
                    transform: [{ scale: scaleAnims[index] }],
                  },
                ]}
              >
                {tabConfig.isLogo ? (
                  <KindlLogoTabIcon focused={isFocused} />
                ) : (
                  <Ionicons
                    name={isFocused ? tabConfig.icon : tabConfig.iconOutline}
                    size={24}
                    color={isFocused ? '#FFFFFF' : '#666666'}
                  />
                )}
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  blackBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1A1A1A',
  },
  border: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabContainer: {
    flexDirection: 'row',
    minHeight: 60,
    paddingTop: 8,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: '100%',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
});

export default CustomTabBar;

