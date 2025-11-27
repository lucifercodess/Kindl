import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { useTheme } from '../theme/theme';
import { hapticLight } from '../utils/haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.52; // Smaller cards - 52% instead of 70%
const CARD_SPACING = 12;

/**
 * IntentCarousel - Horizontal swipeable carousel for intent categories
 * Shows title and profile cards
 */
const IntentCarousel = ({ intent, profiles = [], onProfilePress, hideTitle = false }) => {
  const { colors } = useTheme();
  const flatListRef = useRef(null);
  
  // Micro-motions for title pill
  const pillBreathe = useRef(new Animated.Value(0)).current;
  const pillRotate = useRef(new Animated.Value(0)).current;
  const pillShimmer = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (hideTitle) return;
    
    // Slow 2% breathing scale (6s cycle)
    Animated.loop(
      Animated.sequence([
        Animated.timing(pillBreathe, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pillBreathe, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Soft 1% rotation wiggle (8s cycle)
    Animated.loop(
      Animated.sequence([
        Animated.timing(pillRotate, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pillRotate, {
          toValue: 0,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Very slow fade shimmer (10s cycle)
    Animated.loop(
      Animated.sequence([
        Animated.timing(pillShimmer, {
          toValue: 1,
          duration: 5000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pillShimmer, {
          toValue: 0,
          duration: 5000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [hideTitle]);
  
  const breatheScale = pillBreathe.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.02], // 2% scale
  });
  
  const rotateValue = pillRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-0.5deg', '0.5deg'], // 1% rotation wiggle
  });
  
  const shimmerOpacity = pillShimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.5], // Subtle shimmer
  });

  const handleProfilePress = (profile) => {
    hapticLight();
    if (onProfilePress) {
      onProfilePress(profile);
    }
  };

  const renderProfileCard = ({ item: profile, index }) => {
    const isLast = index === profiles.length - 1;
    return (
      <TouchableOpacity
        style={[
          styles.profileCard,
          !isLast && styles.profileCardSpacing,
        ]}
        onPress={() => handleProfilePress(profile)}
        activeOpacity={0.9}
      >
        <Image
          source={{ uri: profile.photo }}
          style={styles.profileImage}
          resizeMode="cover"
        />
        <View style={styles.profileOverlay} />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {profile.name}, {profile.age}
          </Text>
          {profile.location && (
            <Text style={styles.profileLocation}>{profile.location}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Section Title */}
      {!hideTitle && (
        <View style={styles.header}>
          <Animated.View
            style={[
              styles.titlePill,
              {
                transform: [
                  { scale: breatheScale },
                  { rotate: rotateValue },
                ],
              },
            ]}
          >
            <Animated.Text
              style={[
                styles.title,
                {
                  opacity: shimmerOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0.95], // Very subtle opacity change
                  }),
                },
              ]}
            >
              {intent.title}
            </Animated.Text>
          </Animated.View>
        </View>
      )}

      {/* Horizontal Carousel */}
      <FlatList
        ref={flatListRef}
        data={profiles}
        renderItem={renderProfileCard}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContent}
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        decelerationRate="fast"
        snapToAlignment="start"
        bounces={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  titlePill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.1,
    color: '#666666', // Lighter black
  },
  carouselContent: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  profileCard: {
    width: CARD_WIDTH,
    height: 240, // Reduced from 320
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#F8F8F8',
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
  profileCardSpacing: {
    marginRight: CARD_SPACING,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  profileInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 3,
    letterSpacing: -0.3,
  },
  profileLocation: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.9)',
  },
});

export default IntentCarousel;

