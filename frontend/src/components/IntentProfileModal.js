import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  Animated,
  Easing,
  Dimensions,
  PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../theme/theme';
import { hapticButtonPress, hapticSelection, hapticLight } from '../utils/haptics';
import SparkButton from './SparkButton';
import SparkBottomSheet from './SparkBottomSheet';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * IntentProfileModal - Full profile view matching ProfileCard design
 * Swipe down to close, only skip button and spark buttons
 */
const IntentProfileModal = ({ visible, profile, onClose, onSpark, onSkip }) => {
  const { colors } = useTheme();
  const [sparkSheetVisible, setSparkSheetVisible] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedContentType, setSelectedContentType] = useState('photo');
  const [sparkPosition, setSparkPosition] = useState({ x: 0, y: 0 });
  const [showCrossOverlay, setShowCrossOverlay] = useState(false);
  const [showSparkOverlay, setShowSparkOverlay] = useState(false);
  const scrollYRef = useRef(0);
  const scrollViewRef = useRef(null);

  // Animation refs
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  
  // Skip animation refs
  const skipScale = useRef(new Animated.Value(1)).current;
  const cardOpacity = useRef(new Animated.Value(1)).current;
  const cardTranslateY = useRef(new Animated.Value(0)).current;
  
  // Dislike animation refs
  const crossScale = useRef(new Animated.Value(0.5)).current;
  const crossOpacity = useRef(new Animated.Value(0)).current;

  // Dust particles for skip animation
  const dustParticles = useRef(
    Array(6).fill(null).map(() => ({
      opacity: new Animated.Value(0),
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
    }))
  ).current;

  // Like/Spark animation refs
  const sparkPulseScale = useRef(new Animated.Value(0)).current;
  const sparkPulseOpacity = useRef(new Animated.Value(0)).current;
  const sparkIconOpacity = useRef(new Animated.Value(0)).current;
  const sparkIconTranslateY = useRef(new Animated.Value(0)).current;

  // Generate sample profile data if minimal data provided
  const profileData = useMemo(() => {
    if (!profile) return null;
    
    return {
      name: profile.name || 'Unknown',
      age: profile.age || 25,
      location: profile.location || 'Unknown',
      bio: profile.bio || 'Coffee enthusiast, book lover, and always up for a good conversation. Looking for someone who values authenticity and meaningful connections.',
      vibeTag: profile.vibeTag || 'Slow Dating',
      intent: profile.intent || 'Looking for something meaningful',
      activeStatus: profile.activeStatus || 'Active now',
      photos: profile.photos || [
        { uri: profile.photo },
        { uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' },
        { uri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400' },
      ],
      prompts: profile.prompts || [
        { title: 'MY SIMPLE PLEASURES', answer: 'Morning coffee, long walks, and finding new music that makes me feel something.' },
        { title: "I'M LOOKING FOR", answer: 'Someone who values deep conversations and meaningful connections over surface-level small talk.' },
        { title: "WE'LL GET ALONG IF", answer: 'You appreciate the little moments and aren\'t afraid to be vulnerable.' },
      ],
      about: profile.about || {
        gender: 'Woman',
        career: 'Designer',
        education: 'University',
        languages: 'English',
        height: "5'6\"",
        drinking: 'Socially',
        smoking: 'Never',
        relationshipType: 'Monogamous',
        location: profile.location || 'Los Angeles, CA',
      },
    };
  }, [profile]);

  // Pan responder for swipe to close - only works when scroll is at top
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          // Only respond to downward swipes when scroll is at top
          const isAtTop = scrollYRef.current <= 0;
          return isAtTop && gestureState.dy > 15 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx) * 1.5;
        },
        onPanResponderMove: (_, gestureState) => {
          // Only allow drag if scroll is at top
          const isAtTop = scrollYRef.current <= 0;
          if (isAtTop && gestureState.dy > 0) {
            translateY.setValue(gestureState.dy);
            const opacity = Math.max(0, 1 - gestureState.dy / 400);
            backdropOpacity.setValue(opacity);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          const isAtTop = scrollYRef.current <= 0;
          if (isAtTop && (gestureState.dy > 150 || gestureState.vy > 0.5)) {
            // Close modal
            closeModal();
          } else {
            // Snap back
            Animated.parallel([
              Animated.spring(translateY, {
                toValue: 0,
                tension: 65,
                friction: 11,
                useNativeDriver: true,
              }),
              Animated.timing(backdropOpacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
              }),
            ]).start();
          }
        },
      }),
    [translateY, backdropOpacity]
  );

  useEffect(() => {
    if (visible && profile) {
      // Reset all animations immediately - stop any running animations first
      cardOpacity.stopAnimation();
      cardTranslateY.stopAnimation();
      crossOpacity.stopAnimation();
      crossScale.stopAnimation();
      sparkPulseScale.stopAnimation();
      sparkPulseOpacity.stopAnimation();
      sparkIconOpacity.stopAnimation();
      sparkIconTranslateY.stopAnimation();
      skipScale.stopAnimation();
      
      // Reset all animation values
      cardOpacity.setValue(1);
      cardTranslateY.setValue(0);
      crossOpacity.setValue(0);
      crossScale.setValue(0.5);
      sparkPulseScale.setValue(0);
      sparkPulseOpacity.setValue(0);
      sparkIconOpacity.setValue(0);
      sparkIconTranslateY.setValue(0);
      skipScale.setValue(1);
      setShowCrossOverlay(false);
      setShowSparkOverlay(false);
      scrollYRef.current = 0;
      // Reset scroll position
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: false });
      }
      dustParticles.forEach(p => {
        p.opacity.stopAnimation();
        p.translateX.stopAnimation();
        p.translateY.stopAnimation();
        p.opacity.setValue(0);
        p.translateX.setValue(0);
        p.translateY.setValue(0);
      });

      // Reset modal position
      translateY.setValue(0);
      backdropOpacity.setValue(1);

      // Animate in
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, profile]);

  const closeModal = () => {
    // Stop all animations and reset values
    cardOpacity.stopAnimation();
    cardTranslateY.stopAnimation();
    crossOpacity.stopAnimation();
    crossScale.stopAnimation();
    sparkPulseScale.stopAnimation();
    sparkPulseOpacity.stopAnimation();
    sparkIconOpacity.stopAnimation();
    sparkIconTranslateY.stopAnimation();
    skipScale.stopAnimation();
    
    // Reset all animation values
    cardOpacity.setValue(1);
    cardTranslateY.setValue(0);
    crossOpacity.setValue(0);
    crossScale.setValue(0.5);
    sparkPulseScale.setValue(0);
    sparkPulseOpacity.setValue(0);
    sparkIconOpacity.setValue(0);
    sparkIconTranslateY.setValue(0);
    skipScale.setValue(1);
    setShowCrossOverlay(false);
    setShowSparkOverlay(false);
    dustParticles.forEach(p => {
      p.opacity.stopAnimation();
      p.translateX.stopAnimation();
      p.translateY.stopAnimation();
      p.opacity.setValue(0);
      p.translateX.setValue(0);
      p.translateY.setValue(0);
    });
    
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handleSkip = () => {
    hapticButtonPress();
    
    // Skip button scale animation
    Animated.sequence([
      Animated.spring(skipScale, {
        toValue: 0.9,
        useNativeDriver: true,
        tension: 300,
        friction: 5,
      }),
      Animated.spring(skipScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 5,
      }),
    ]).start();
    
    // Show cross icon
    setShowCrossOverlay(true);
    Animated.parallel([
      Animated.spring(crossScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.timing(crossOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate dust particles
    const dustAnimations = dustParticles.map((particle, index) => {
      const angle = (index * 60) * (Math.PI / 180);
      const distance = 50 + Math.random() * 30;
      return Animated.parallel([
        Animated.timing(particle.opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(particle.translateX, {
          toValue: Math.cos(angle) * distance,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(particle.translateY, {
          toValue: Math.sin(angle) * distance,
          duration: 600,
          useNativeDriver: true,
        }),
      ]);
    });
    
    // Card fade down
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(cardTranslateY, {
        toValue: 100,
        duration: 500,
        useNativeDriver: true,
      }),
      ...dustAnimations,
    ]).start(() => {
      if (onSkip) onSkip();
      closeModal();
    });
  };

  const handleSparkSent = () => {
    hapticButtonPress();
    
    // Spark pulse ring
    setShowSparkOverlay(true);
    Animated.sequence([
      Animated.parallel([
        Animated.spring(sparkPulseScale, {
          toValue: 3,
          useNativeDriver: true,
          tension: 40,
          friction: 6,
        }),
        Animated.timing(sparkPulseOpacity, {
          toValue: 0.6,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(sparkPulseOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(sparkPulseScale, {
          toValue: 4,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setShowSparkOverlay(false);
    });
    
    // Spark icon appears and drifts up
    Animated.parallel([
      Animated.timing(sparkIconOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(sparkIconTranslateY, {
        toValue: -60,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      sparkIconOpacity.setValue(0);
      sparkIconTranslateY.setValue(0);
    });
    
    // Card scale up and fade up
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(cardTranslateY, {
        toValue: -50,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onSpark) onSpark();
      closeModal();
    });
  };

  const handleSparkPress = (content, contentType, position) => {
    hapticLight();
    if (position && position.x && position.y) {
      setSparkPosition({ x: position.x, y: position.y });
    } else {
      setSparkPosition({ x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2 });
    }
    setSelectedContent(content);
    setSelectedContentType(contentType);
    setSparkSheetVisible(true);
  };

  const handleSendSpark = (sparkData) => {
    setSparkSheetVisible(false);
    setTimeout(() => {
      handleSparkSent();
    }, 200);
  };

  if (!visible || !profileData) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={closeModal}
    >
      {/* Backdrop */}
      <Animated.View
        style={[
          styles.backdrop,
          { opacity: backdropOpacity },
        ]}
      />
      
      {/* Modal Container */}
      <Animated.View
        style={[
          styles.modalContainer,
          {
            transform: [{ translateY }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        {/* Back Button - Top Left */}
        <View style={styles.fixedBackButton}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={closeModal}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-down" size={28} color="#000000" />
          </TouchableOpacity>
        </View>

        {/* Skip Button - Fixed Position */}
        <View style={styles.fixedSkipButton}>
          <Animated.View style={{ transform: [{ scale: skipScale }] }}>
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={32} color="#000000" />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Animation Overlays */}
        {showCrossOverlay && (
          <Animated.View
            style={[
              styles.crossOverlay,
              {
                opacity: crossOpacity,
                transform: [{ scale: crossScale }],
              },
            ]}
            pointerEvents="none"
          >
            <Ionicons name="close-circle" size={120} color="#000000" />
          </Animated.View>
        )}

        {showSparkOverlay && (
          <>
            <Animated.View
              style={[
                styles.sparkPulseRing,
                {
                  opacity: sparkPulseOpacity,
                  transform: [{ scale: sparkPulseScale }],
                },
              ]}
              pointerEvents="none"
            >
              <View style={styles.pulseRingInner} />
            </Animated.View>

            <Animated.View
              style={[
                styles.sparkIconContainer,
                {
                  opacity: sparkIconOpacity,
                  transform: [{ translateY: sparkIconTranslateY }],
                },
              ]}
              pointerEvents="none"
            >
              <Text style={styles.sparkIcon}>✦</Text>
            </Animated.View>
          </>
        )}

        {dustParticles.map((particle, index) => (
          <Animated.View
            key={index}
            style={[
              styles.dustParticle,
              {
                opacity: particle.opacity,
                transform: [
                  { translateX: particle.translateX },
                  { translateY: particle.translateY },
                ],
              },
            ]}
            pointerEvents="none"
          >
            <View style={styles.dustDot} />
          </Animated.View>
        ))}

        {/* Scrollable Content */}
        <Animated.View
          style={[
            styles.cardContainer,
            {
              opacity: cardOpacity,
              transform: [{ translateY: cardTranslateY }],
            },
          ]}
        >
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={true}
            onScroll={(event) => {
              scrollYRef.current = event.nativeEvent.contentOffset.y;
            }}
            scrollEventThrottle={16}
          >
            {/* Hero Photo */}
            <View style={styles.heroSection}>
              <Image
                source={{ uri: profileData.photos[0]?.uri || profileData.photo }}
                style={styles.heroImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0, 0, 0, 0.7)']}
                style={styles.heroGradient}
              />
              <View style={styles.heroContent}>
                <View style={styles.nameRow}>
                  <Text style={styles.heroName}>
                    {profileData.name}, {profileData.age}
                  </Text>
                </View>
                <View style={styles.vibeTagContainer}>
                  <Text style={styles.vibeTag}>{profileData.vibeTag}</Text>
                </View>
              </View>
              <SparkButton
                onPress={(position) => handleSparkPress(profileData.photos[0]?.uri, 'photo', position)}
              />
            </View>

            {/* User Bio */}
            <View style={styles.bioContainer}>
              <Text style={styles.bioText}>{profileData.bio}</Text>
            </View>

            {/* Intent Bar */}
            <View style={styles.intentBar}>
              <Text style={styles.intentText}>{profileData.intent}</Text>
            </View>

            {/* About Me Card */}
            <View style={styles.aboutCard}>
              {profileData.about.gender && (
                <View style={styles.aboutRow}>
                  <Ionicons name="person-outline" size={18} color={colors.textSecondary} />
                  <Text style={styles.aboutText}>{profileData.about.gender}</Text>
                </View>
              )}
              {profileData.about.career && (
                <View style={styles.aboutRow}>
                  <Ionicons name="briefcase-outline" size={18} color={colors.textSecondary} />
                  <Text style={styles.aboutText}>{profileData.about.career}</Text>
                </View>
              )}
              {profileData.about.education && (
                <View style={styles.aboutRow}>
                  <Ionicons name="school-outline" size={18} color={colors.textSecondary} />
                  <Text style={styles.aboutText}>{profileData.about.education}</Text>
                </View>
              )}
              {profileData.about.languages && (
                <View style={styles.aboutRow}>
                  <Ionicons name="language-outline" size={18} color={colors.textSecondary} />
                  <Text style={styles.aboutText}>{profileData.about.languages}</Text>
                </View>
              )}
              {profileData.about.height && (
                <View style={styles.aboutRow}>
                  <Ionicons name="resize-outline" size={18} color={colors.textSecondary} />
                  <Text style={styles.aboutText}>{profileData.about.height}</Text>
                </View>
              )}
              {profileData.about.drinking && (
                <View style={styles.aboutRow}>
                  <Ionicons name="wine-outline" size={18} color={colors.textSecondary} />
                  <Text style={styles.aboutText}>{profileData.about.drinking}</Text>
                </View>
              )}
              {profileData.about.smoking && (
                <View style={styles.aboutRow}>
                  <FontAwesome5 name="smoking" size={13} color={colors.textSecondary} />
                  <Text style={styles.aboutText}>{profileData.about.smoking}</Text>
                </View>
              )}
              {profileData.about.relationshipType && (
                <View style={styles.aboutRow}>
                  <Ionicons name="heart-outline" size={18} color={colors.textSecondary} />
                  <Text style={styles.aboutText}>{profileData.about.relationshipType}</Text>
                </View>
              )}
              {profileData.about.location && (
                <View style={styles.aboutRow}>
                  <Ionicons name="location-outline" size={18} color={colors.textSecondary} />
                  <Text style={styles.aboutText}>{profileData.about.location}</Text>
                </View>
              )}
            </View>

            {/* Photo + Prompt Sequences */}
            {profileData.photos.slice(1).map((photo, index) => (
              <View key={index} style={styles.photoPromptSection}>
                <View style={styles.photoContainer}>
                  <Image
                    source={{ uri: photo.uri }}
                    style={styles.promptPhoto}
                    resizeMode="cover"
                  />
                  <SparkButton
                    onPress={(position) => handleSparkPress(photo.uri, 'photo', position)}
                  />
                </View>
                {profileData.prompts[index] && (
                  <View style={styles.promptBlock}>
                    <View style={styles.promptContent}>
                      <Text style={styles.promptTitle}>
                        {profileData.prompts[index].title}
                      </Text>
                      <Text style={styles.promptAnswer}>
                        {profileData.prompts[index].answer}
                      </Text>
                    </View>
                    <View style={styles.promptButtonRow}>
                      <View style={styles.promptButtonSpacer} />
                      <SparkButton
                        onPress={(position) => handleSparkPress(profileData.prompts[index].answer, 'prompt', position)}
                        absolute={false}
                      />
                    </View>
                  </View>
                )}
              </View>
            ))}

            {/* Bottom Padding */}
            <View style={{ height: 120 }} />
          </ScrollView>
        </Animated.View>
      </Animated.View>

      {/* Spark Bottom Sheet */}
      <SparkBottomSheet
        visible={sparkSheetVisible}
        onClose={() => setSparkSheetVisible(false)}
        onSend={handleSendSpark}
        content={selectedContent}
        contentType={selectedContentType}
        userName={profileData.name}
        startPosition={sparkPosition}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    flex: 1,
    marginTop: 100,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  fixedBackButton: {
    position: 'absolute',
    top: 16,
    left: 20,
    zIndex: 100,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  fixedSkipButton: {
    position: 'absolute',
    bottom: 50,
    left: 30,
    zIndex: 100,
  },
  skipButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E8E8E8',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  crossOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -60,
    marginTop: -60,
    zIndex: 1000,
  },
  sparkPulseRing: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -100,
    marginTop: -100,
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#000000',
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRingInner: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: '#000000',
  },
  sparkIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -15,
    marginTop: -15,
    zIndex: 1001,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkIcon: {
    fontSize: 40,
    color: '#000000',
    fontWeight: '300',
  },
  dustParticle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -2,
    marginTop: -2,
    zIndex: 998,
  },
  dustDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#000000',
  },
  heroSection: {
    height: 500,
    position: 'relative',
    marginBottom: 20,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  heroContent: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
  },
  nameRow: {
    marginBottom: 8,
  },
  heroName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  vibeTagContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  vibeTag: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  bioContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  bioText: {
    fontSize: 17,
    fontWeight: '400',
    color: '#111111',
    lineHeight: 26,
    letterSpacing: 0.2,
  },
  intentBar: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  intentText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  aboutCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  aboutText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#1A1A1A',
    marginLeft: 12,
    flex: 1,
  },
  photoPromptSection: {
    marginBottom: 20,
  },
  photoContainer: {
    height: 400,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
  },
  promptPhoto: {
    width: '100%',
    height: '100%',
  },
  promptBlock: {
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  promptContent: {
    marginBottom: 12,
  },
  promptTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: '#1A1A1A',
    marginBottom: 14,
  },
  promptAnswer: {
    fontSize: 17,
    fontWeight: '400',
    color: '#1A1A1A',
    lineHeight: 26,
    letterSpacing: 0.2,
  },
  promptButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  promptButtonSpacer: {
    flex: 1,
  },
});

export default IntentProfileModal;
