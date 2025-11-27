import React, { useRef, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { useTheme } from '../../theme/theme';
import globalStyles from '../../theme/globalStyles';
import BlindDatingCard from '../../components/BlindDatingCard';
import IntentCarousel from '../../components/IntentCarousel';
import IntentProfileModal from '../../components/IntentProfileModal';
import RotatingMicroMessages from '../../components/RotatingMicroMessages';
import behaviorTracker from '../../utils/behaviorTracker';
import personalizationEngine from '../../utils/personalizationEngine';

/**
 * IntentFeedsScreen - Premium intent-based discovery with horizontal carousels
 * Enhanced with UI, UX, motion, and personalization improvements
 */
const IntentFeedsScreen = React.memo(() => {
  const { colors } = useTheme();
  const [showBlindIntro, setShowBlindIntro] = useState(true);
  const [finalCountdown, setFinalCountdown] = useState(null);
  const [showFinalOverlay, setShowFinalOverlay] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedIntentId, setSelectedIntentId] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [removedProfiles, setRemovedProfiles] = useState(new Set());
  const finalCountdownScale = useRef(new Animated.Value(0.8)).current;
  const finalCountdownOpacity = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // Time-based background tint
  const timeBasedBackground = useMemo(
    () => personalizationEngine.getTimeBasedBackground(),
    []
  );

  // Sample profile data for each intent category
  const generateProfiles = (intentId, count = 5) => {
    const baseProfiles = [
      {
        id: `${intentId}-1`,
        name: 'Maya',
        age: 27,
        location: 'Los Angeles',
        photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
      },
      {
        id: `${intentId}-2`,
        name: 'Noah',
        age: 29,
        location: 'San Francisco',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      },
      {
        id: `${intentId}-3`,
        name: 'Amelia',
        age: 25,
        location: 'New York',
        photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      },
      {
        id: `${intentId}-4`,
        name: 'Jordan',
        age: 32,
        location: 'Seattle',
        photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
      },
      {
        id: `${intentId}-5`,
        name: 'Sam',
        age: 26,
        location: 'Portland',
        photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
      },
      {
        id: `${intentId}-6`,
        name: 'Alex',
        age: 28,
        location: 'Austin',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      },
      {
        id: `${intentId}-7`,
        name: 'Taylor',
        age: 30,
        location: 'Denver',
        photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400',
      },
    ];

    return baseProfiles.slice(0, count);
  };

  const baseIntentCategories = useMemo(() => [
    {
      id: '1',
      title: 'Slow & Intentional',
      description: 'Meet people who take things at a meaningful pace.',
      icon: '🕊️',
      profiles: generateProfiles('1', 6),
    },
    {
      id: '2',
      title: 'Meaningful Connection',
      description: 'For those who want something real and lasting.',
      icon: '✨',
      profiles: generateProfiles('2', 5),
    },
    {
      id: '3',
      title: 'Deep Conversations',
      description: 'People who value emotional depth and honesty.',
      icon: '💬',
      profiles: generateProfiles('3', 7),
    },
    {
      id: '4',
      title: 'Creative Energy',
      description: 'For artists, creators, and expressive personalities.',
      icon: '🎨',
      profiles: generateProfiles('4', 5),
    },
    {
      id: '5',
      title: 'Outdoors & Active',
      description: 'Hiking, adventures, and nature lovers.',
      icon: '🌿',
      profiles: generateProfiles('5', 6),
    },
    {
      id: '6',
      title: 'Food & Coffee Dates',
      description: 'For the chill, cozy, café-date vibe.',
      icon: '☕',
      profiles: generateProfiles('6', 5),
    },
    {
      id: '7',
      title: 'Spiritual & Calm',
      description: 'Mindful, compassionate, peaceful energy.',
      icon: '🌙',
      profiles: generateProfiles('7', 6),
    },
  ], []);

  // Get recently viewed intents
  const recentlyViewedIds = useMemo(() => {
    return behaviorTracker.getRecentlyViewed(2);
  }, []);

  // Get recommended intents (mock user vibe tags for now)
  const recommendedIntents = useMemo(() => {
    const userVibeTags = []; // TODO: Get from user profile/onboarding
    return personalizationEngine.getRecommendedIntents(
      baseIntentCategories,
      userVibeTags,
      3
    );
  }, [baseIntentCategories]);

  // Get blended recommendations
  const blendedRecommendations = useMemo(() => {
    const userVibeTags = []; // TODO: Get from user profile/onboarding
    return personalizationEngine.getBlendedRecommendations(
      userVibeTags,
      baseIntentCategories
    );
  }, [baseIntentCategories]);

  // Personalized ordering of intents
  const orderedIntentCategories = useMemo(() => {
    const intentIds = baseIntentCategories.map((i) => i.id);
    const orderedIds = behaviorTracker.getOrderedIntents(intentIds);
    return orderedIds.map((id) =>
      baseIntentCategories.find((i) => i.id === id)
    );
  }, [baseIntentCategories]);

  // Get time-based contextual micro-copy
  const timeBasedCopy = useMemo(
    () => personalizationEngine.getTimeBasedCopy(),
    []
  );

  useEffect(() => {
    // Smooth fade and slide-up animation on first load
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  useEffect(() => {
    Animated.timing(overlayOpacity, {
      toValue: showFinalOverlay ? 1 : 0,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [showFinalOverlay, overlayOpacity]);

  useEffect(() => {
    if (showFinalOverlay && finalCountdown !== null) {
      finalCountdownScale.setValue(0.7);
      finalCountdownOpacity.setValue(0);
      Animated.sequence([
        Animated.parallel([
          Animated.spring(finalCountdownScale, {
            toValue: 1.1,
            friction: 5,
            tension: 140,
            useNativeDriver: true,
          }),
          Animated.timing(finalCountdownOpacity, {
            toValue: 1,
            duration: 220,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(finalCountdownOpacity, {
            toValue: 0.05,
            duration: 280,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(finalCountdownScale, {
            toValue: 0.95,
            duration: 280,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [
    showFinalOverlay,
    finalCountdown,
    finalCountdownScale,
    finalCountdownOpacity,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setShowBlindIntro(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  const handleBlindDatingPress = () => {
    console.log('Blind dating pressed');
  };

  const handleCountdownChange = ({ hours, minutes, seconds, isActive }) => {
    const shouldShow =
      !isActive &&
      hours === 0 &&
      minutes === 0 &&
      seconds > 0 &&
      seconds <= 10;

    if (shouldShow) {
      setFinalCountdown(seconds);
      setShowFinalOverlay(true);
    } else if (showFinalOverlay) {
      setShowFinalOverlay(false);
      setFinalCountdown(null);
    }
  };

  const handleProfilePress = (profile, intentId) => {
    behaviorTracker.trackIntentView(intentId);
    setSelectedProfile(profile);
    setSelectedIntentId(intentId);
    setShowProfileModal(true);
  };

  const handleProfileClose = () => {
    setShowProfileModal(false);
    setTimeout(() => {
      setSelectedProfile(null);
    }, 300);
  };

  const handleProfileSpark = () => {
    if (selectedProfile?.id) {
      setRemovedProfiles((prev) => new Set([...prev, selectedProfile.id]));
    }
    console.log('Profile sparked:', selectedProfile?.name);
  };

  const handleProfileSkip = () => {
    if (selectedProfile?.id) {
      setRemovedProfiles((prev) => new Set([...prev, selectedProfile.id]));
    }
    console.log('Profile skipped:', selectedProfile?.name);
  };

  const getRecentlyViewedIntents = () => {
    return recentlyViewedIds
      .map((id) => baseIntentCategories.find((i) => i.id === id))
      .filter(Boolean);
  };

  const renderSectionDivider = () => (
    <View style={styles.sectionDivider} />
  );

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <Animated.View
        style={[
          globalStyles.content,
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            backgroundColor: timeBasedBackground,
          },
        ]}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Intent Feeds
          </Text>
          <RotatingMicroMessages />
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Blind Dating Card */}
          <BlindDatingCard
            onPress={handleBlindDatingPress}
            showIntroAnimation={showBlindIntro}
            onCountdownChange={handleCountdownChange}
          />

          {renderSectionDivider()}

          {/* Recently Viewed Section */}
          {recentlyViewedIds.length > 0 && (
            <>
              <View style={[styles.sectionHeader, styles.recentlyViewedHeader]}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  Recently Viewed
                </Text>
              </View>
              {getRecentlyViewedIntents().map((intent, index) => {
                const filteredProfiles = intent.profiles.filter(
                  (profile) => !removedProfiles.has(profile.id)
                );
                if (filteredProfiles.length === 0) return null;
                return (
                  <IntentCarousel
                    key={`recent-${intent.id}`}
                    intent={intent}
                    profiles={filteredProfiles}
                    onProfilePress={(profile) =>
                      handleProfilePress(profile, intent.id)
                    }
                  />
                );
              })}
              {renderSectionDivider()}
            </>
          )}

          {/* Recommended For You Section */}
          {recommendedIntents.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  Recommended For You
                </Text>
                <Text style={[styles.timeBasedCopy, { color: colors.textSecondary }]}>
                  {timeBasedCopy}
                </Text>
              </View>
              {recommendedIntents.map((intent) => {
                const filteredProfiles = intent.profiles.filter(
                  (profile) => !removedProfiles.has(profile.id)
                );
                if (filteredProfiles.length === 0) return null;
                return (
                  <IntentCarousel
                    key={`recommended-${intent.id}`}
                    intent={intent}
                    profiles={filteredProfiles}
                    onProfilePress={(profile) =>
                      handleProfilePress(profile, intent.id)
                    }
                  />
                );
              })}
              {renderSectionDivider()}
            </>
          )}

          {/* Blended Recommendations */}
          {blendedRecommendations.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  Blended Vibes
                </Text>
                <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                  Combining your favorite energies
                </Text>
              </View>
              {blendedRecommendations.map((intent) => {
                const filteredProfiles = intent.profiles.filter(
                  (profile) => !removedProfiles.has(profile.id)
                );
                if (filteredProfiles.length === 0) return null;
                return (
                  <IntentCarousel
                    key={`blended-${intent.id}`}
                    intent={intent}
                    profiles={filteredProfiles}
                    onProfilePress={(profile) =>
                      handleProfilePress(profile, intent.id)
                    }
                  />
                );
              })}
              {renderSectionDivider()}
            </>
          )}

          {/* All Intent Categories */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Explore All Intents
            </Text>
          </View>
          {orderedIntentCategories.map((intent) => {
            const filteredProfiles = intent.profiles.filter(
              (profile) => !removedProfiles.has(profile.id)
            );
            if (filteredProfiles.length === 0) return null;

            return (
              <IntentCarousel
                key={intent.id}
                intent={intent}
                profiles={filteredProfiles}
                onProfilePress={(profile) =>
                  handleProfilePress(profile, intent.id)
                }
              />
            );
          })}
        </ScrollView>
        {(showFinalOverlay || finalCountdown !== null) && (
          <Animated.View
            pointerEvents={showFinalOverlay ? 'auto' : 'none'}
            style={[
              styles.finalOverlay,
              { opacity: overlayOpacity },
            ]}
          >
            <Animated.Text
              style={[
                styles.finalCountdownText,
                {
                  opacity: finalCountdownOpacity,
                  transform: [{ scale: finalCountdownScale }],
                },
              ]}
            >
              {finalCountdown}
            </Animated.Text>
            <Text style={styles.finalOverlaySubtext}>Blind Dating begins</Text>
          </Animated.View>
        )}

        {/* Profile Modal */}
        <IntentProfileModal
          visible={showProfileModal}
          profile={selectedProfile}
          onClose={handleProfileClose}
          onSpark={handleProfileSpark}
          onSkip={handleProfileSkip}
        />
      </Animated.View>
    </SafeAreaView>
  );
});

IntentFeedsScreen.displayName = 'IntentFeedsScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionDivider: {
    height: 12,
    backgroundColor: '#FAFAFA',
    marginVertical: 8,
    marginHorizontal: 20, // Match Blind Dating card margins
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  recentlyViewedHeader: {
    paddingTop: 34, // +10px more space above
    paddingBottom: 4, // 4px spacing below
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 15,
    fontWeight: '400',
    letterSpacing: 0.1,
    fontStyle: 'italic',
  },
  timeBasedCopy: {
    fontSize: 15,
    fontWeight: '400',
    letterSpacing: 0.1,
    fontStyle: 'italic',
    marginTop: 4,
  },
  finalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  finalCountdownText: {
    fontSize: 96,
    fontWeight: '700',
    letterSpacing: -4,
    color: '#111111',
  },
  finalOverlaySubtext: {
    marginTop: 12,
    fontSize: 18,
    color: '#555555',
    letterSpacing: 0.5,
  },
});

export default IntentFeedsScreen;
