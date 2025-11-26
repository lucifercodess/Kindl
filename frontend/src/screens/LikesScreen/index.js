import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  FlatList,
  Animated,
  Easing,
  Modal,
  PanResponder,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/theme';
import globalStyles from '../../theme/globalStyles';
import { hapticButtonPress, hapticSelection, hapticLight } from '../../utils/haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * LikesScreen - Shows people who liked your profile
 * Displays likes with prompt details and comments
 */
const LikesScreen = React.memo(() => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [dismissedLikes, setDismissedLikes] = useState(new Set());
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const cardAnimations = useRef(new Map()).current;
  const profileModalTranslateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!showProfileModal) {
      profileModalTranslateY.setValue(0);
    }
  }, [showProfileModal, profileModalTranslateY]);

  const likes = useMemo(
    () => [
      {
        id: '1',
        name: 'Maya',
        age: 27,
        location: 'Los Angeles',
        photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
        likedType: 'prompt',
        likedTitle: 'My Simple Pleasures',
        likedContent: 'Morning coffee, long walks, and finding new music that makes me feel something.',
        message: "That line made me smile :)",
        likedPhoto: null,
        // Profile data
        bio: 'Coffee enthusiast, book lover, and always up for a good conversation. Looking for someone who values authenticity and meaningful connections.',
        vibeTag: 'Slow Dating',
        intent: 'Looking for something meaningful',
        similarities: [
          'Both love coffee',
          'Both value deep conversations',
          'Both enjoy reading',
          'Both prefer slow dating',
        ],
        photos: [
          { uri: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1' },
          { uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330' },
          { uri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9' },
        ],
        prompts: [
          { title: 'My Simple Pleasures', answer: 'Morning coffee, long walks, and finding new music that makes me feel something.' },
          { title: "I'M LOOKING FOR", answer: 'Someone who values deep conversations and meaningful connections over surface-level small talk.' },
          { title: 'WE\'LL GET ALONG IF', answer: 'You appreciate the little moments and aren\'t afraid to be vulnerable.' },
        ],
        about: {
          gender: 'Woman',
          career: 'Graphic Designer',
          education: 'Art Institute',
          languages: 'English, Spanish',
          height: "5'6\"",
          drinking: 'Socially',
          smoking: 'Never',
          relationshipType: 'Monogamous',
          location: 'Los Angeles, CA',
        },
      },
      {
        id: '2',
        name: 'Noah',
        age: 29,
        location: 'San Francisco',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
        likedType: 'photo',
        likedTitle: null,
        likedContent: null,
        message: "Love your style!",
        likedPhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
        // Profile data
        bio: 'Tech enthusiast by day, photographer by night. Always exploring new places and capturing moments that matter.',
        vibeTag: 'Deep Conversations',
        intent: 'Slow Dating',
        similarities: [
          'Both into photography',
          'Both love exploring new places',
          'Both value meaningful connections',
          'Both enjoy tech',
        ],
        photos: [
          { uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e' },
          { uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' },
          { uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d' },
        ],
        prompts: [
          { title: 'MY MOST IRRATIONAL FEAR', answer: 'Running out of coffee on a Monday morning.' },
          { title: 'I\'M A GREAT +1 BECAUSE', answer: 'I bring good energy and always know the best spots in town.' },
          { title: 'WE\'LL GET ALONG IF', answer: 'You appreciate good music, great food, and even better conversations.' },
        ],
        about: {
          gender: 'Man',
          career: 'Software Engineer',
          education: 'Stanford University',
          languages: 'English, French',
          height: "6'0\"",
          drinking: 'Socially',
          smoking: 'Never',
          relationshipType: 'Monogamous',
          location: 'San Francisco, CA',
        },
      },
      {
        id: '3',
        name: 'Amelia',
        age: 25,
        location: 'New York',
        photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
        likedType: 'prompt',
        likedTitle: "I'M LOOKING FOR",
        likedContent: 'Someone who values deep conversations and meaningful connections over surface-level small talk.',
        message: "This resonates so much with me",
        likedPhoto: null,
        // Profile data
        bio: 'Writer, dreamer, and believer in slow love. Looking for someone who understands that the best things take time.',
        vibeTag: 'Healing & Honest Energy',
        intent: 'Deep Conversations',
        similarities: [
          'Both value slow love',
          'Both enjoy writing',
          'Both prefer deep conversations',
          'Both believe in authenticity',
        ],
        photos: [
          { uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80' },
          { uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2' },
          { uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' },
        ],
        prompts: [
          { title: "I'M LOOKING FOR", answer: 'Someone who values deep conversations and meaningful connections over surface-level small talk.' },
          { title: 'MY LOVE LANGUAGE', answer: 'Quality time and words of affirmation. Show me you care through presence, not just presents.' },
          { title: 'WE\'LL GET ALONG IF', answer: 'You believe in taking things slow and building something real, one conversation at a time.' },
        ],
        about: {
          gender: 'Woman',
          career: 'Content Writer',
          education: 'NYU',
          languages: 'English, Italian',
          height: "5'4\"",
          drinking: 'Occasionally',
          smoking: 'Never',
          relationshipType: 'Monogamous',
          location: 'New York, NY',
        },
      },
    ],
    []
  );

  const visibleLikes = useMemo(
    () => likes.filter((like) => !dismissedLikes.has(like.id)),
    [likes, dismissedLikes]
  );

  const getCardAnimation = useCallback((likeId) => {
    if (!cardAnimations.has(likeId)) {
      cardAnimations.set(likeId, {
        opacity: new Animated.Value(1),
        translateX: new Animated.Value(0),
        scale: new Animated.Value(1),
      });
    }
    return cardAnimations.get(likeId);
  }, [cardAnimations]);

  const handleCreateSpark = useCallback(
    (like) => {
      hapticButtonPress();
      
      const anim = getCardAnimation(like.id);
      
      // Smooth slide-out and fade animation
      Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: 0,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(anim.translateX, {
          toValue: SCREEN_WIDTH,
          duration: 450,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(anim.scale, {
          toValue: 0.92,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Navigate to Messages screen after animation
        navigation.navigate('Messages');
        
        // Reset animation for next time
        anim.opacity.setValue(1);
        anim.translateX.setValue(0);
        anim.scale.setValue(1);
      });
    },
    [navigation, getCardAnimation]
  );

  const handleDismiss = useCallback(
    (likeId) => {
      hapticButtonPress();
      
      const anim = getCardAnimation(likeId);
      
      // Smooth slide-out to left and fade animation
      Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(anim.translateX, {
          toValue: -SCREEN_WIDTH,
          duration: 400,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(anim.scale, {
          toValue: 0.88,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Remove from list after animation
        setDismissedLikes((prev) => new Set([...prev, likeId]));
        
        // Clean up animation
        cardAnimations.delete(likeId);
      });
    },
    [getCardAnimation, cardAnimations]
  );

  const handleCardPress = useCallback(
    (like) => {
      hapticLight();
      setSelectedProfile(like);
      setShowProfileModal(true);
    },
    []
  );

  const renderLikeCard = useCallback(
    ({ item: like }) => {
      const anim = getCardAnimation(like.id);
      
      return (
        <Animated.View
          style={[
            styles.likeCard,
            {
              opacity: anim.opacity,
              transform: [
                { translateX: anim.translateX },
                { scale: anim.scale },
              ],
            },
          ]}
        >
        {/* Clickable card content */}
        <TouchableOpacity
          activeOpacity={0.95}
          onPress={() => handleCardPress(like)}
          style={styles.cardContent}
        >
          {/* Liked Image or Photo */}
          {(like.likedPhoto || like.likedType === 'photo') && (
            <View style={styles.likedImageBox}>
              <Image
                source={{ uri: like.likedPhoto || like.photo }}
                style={styles.likedImage}
                resizeMode="cover"
              />
            </View>
          )}

          {/* Prompt Box (if they liked a prompt) */}
          {like.likedType === 'prompt' && (
            <View style={styles.promptBox}>
              <Text style={[styles.promptBoxTitle, { color: colors.textPrimary }]}>
                {like.likedTitle}
              </Text>
              <Text style={[styles.promptBoxContent, { color: colors.textSecondary }]}>
                {like.likedContent}
              </Text>
            </View>
          )}

          {/* Message Bubble */}
          {like.message && (
            <View style={styles.messageContainer}>
              <View style={styles.messageBubble}>
                <Text style={styles.messageText}>{like.message}</Text>
              </View>
              <Text style={[styles.messageSenderName, { color: colors.textPrimary }]}>
                {like.name}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.sparkButton, { backgroundColor: colors.textPrimary }]}
            onPress={() => handleCreateSpark(like)}
            activeOpacity={0.8}
          >
            <Text style={[styles.sparkButtonText, { color: colors.primaryWhite }]}>
              Create Spark
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={() => handleDismiss(like.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.dismissButtonText, { color: colors.textSecondary }]}>
              Dismiss
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      );
    },
    [colors, handleCreateSpark, handleDismiss, handleCardPress, getCardAnimation]
  );

  const profilePanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => {
          const isVerticalSwipe = Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
          const isDownward = gestureState.dy > 6;
          return isVerticalSwipe && isDownward;
        },
        onPanResponderGrant: () => {
          profileModalTranslateY.setValue(0);
        },
        onPanResponderMove: (evt, gestureState) => {
          if (gestureState.dy > 0) {
            const dampedValue = gestureState.dy * 0.85;
            profileModalTranslateY.setValue(dampedValue);
          }
        },
        onPanResponderRelease: (evt, gestureState) => {
          if (gestureState.dy > 120 || gestureState.vy > 0.6) {
            Animated.timing(profileModalTranslateY, {
              toValue: SCREEN_HEIGHT,
              duration: 280,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }).start(() => {
              setShowProfileModal(false);
            });
          } else {
            Animated.spring(profileModalTranslateY, {
              toValue: 0,
              damping: 18,
              stiffness: 180,
              useNativeDriver: true,
            }).start();
          }
        },
      }),
    [profileModalTranslateY]
  );

  const renderProfileModal = () => {
    if (!showProfileModal || !selectedProfile) return null;

    const profileData = selectedProfile;

    return (
      <Modal
        visible={showProfileModal}
        animationType="slide"
        onRequestClose={() => {
          setShowProfileModal(false);
        }}
      >
        <Animated.View
          style={[
            profileModalStyles.container,
            {
              transform: [{ translateY: profileModalTranslateY }],
            },
          ]}
        >
          {/* Sticky Similarities Section - Swipe down here to dismiss */}
          {profileData.similarities && profileData.similarities.length > 0 && (
            <View 
              style={profileModalStyles.stickySimilaritiesSection}
              {...profilePanResponder.panHandlers}
            >
              <View style={profileModalStyles.dragHintWrapper}>
                <View style={profileModalStyles.dragHandle} />
              
              </View>
              <View style={profileModalStyles.similaritiesSection}>
                <View style={profileModalStyles.similaritiesHeader}>
                  <Ionicons name="sparkles" size={20} color="#1A1A1A" />
                  <Text style={profileModalStyles.similaritiesTitle}>What You Share</Text>
                </View>
                <View style={profileModalStyles.similaritiesList}>
                  {profileData.similarities.map((similarity, index) => (
                    <View key={index} style={profileModalStyles.similarityItem}>
                      <View style={profileModalStyles.similarityDot} />
                      <Text style={profileModalStyles.similarityText}>{similarity}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          <ScrollView
            style={profileModalStyles.scrollView}
            contentContainerStyle={profileModalStyles.contentContainer}
            showsVerticalScrollIndicator={false}
            bounces={true}
          >
            {/* Spacer to account for sticky header */}
            {profileData.similarities && profileData.similarities.length > 0 && (
              <View style={profileModalStyles.stickySpacer} />
            )}
            
            {/* SECTION 1: Hero Photo */}
            <View style={profileModalStyles.heroSection}>
              <Image
                source={{ uri: profileData.photos?.[0]?.uri || profileData.photo }}
                style={profileModalStyles.heroImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0, 0, 0, 0.7)']}
                style={profileModalStyles.heroGradient}
              />
              <View style={profileModalStyles.heroContent}>
                <View style={profileModalStyles.nameRow}>
                  <Text style={profileModalStyles.heroName}>
                    {profileData.name}{profileData.age ? `, ${profileData.age}` : ''}
                  </Text>
                </View>
                {profileData.vibeTag && (
                  <View style={profileModalStyles.vibeTagContainer}>
                    <Text style={profileModalStyles.vibeTag}>{profileData.vibeTag}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* User Bio */}
            {profileData.bio && (
              <View style={profileModalStyles.bioContainer}>
                <Text style={profileModalStyles.bioText}>{profileData.bio}</Text>
              </View>
            )}

            {/* SECTION 4: Intent Bar */}
            {profileData.intent && (
              <View style={profileModalStyles.intentBar}>
                <Text style={profileModalStyles.intentText}>{profileData.intent}</Text>
              </View>
            )}

            {/* SECTION 2: About Me Card */}
            {profileData.about && (
              <View style={profileModalStyles.aboutCard}>
                {profileData.about.gender && (
                  <View style={profileModalStyles.aboutRow}>
                    <Ionicons name="person-outline" size={18} color={colors.textSecondary} />
                    <Text style={profileModalStyles.aboutText}>{profileData.about.gender}</Text>
                  </View>
                )}
                {profileData.about.career && (
                  <View style={profileModalStyles.aboutRow}>
                    <Ionicons name="briefcase-outline" size={18} color={colors.textSecondary} />
                    <Text style={profileModalStyles.aboutText}>{profileData.about.career}</Text>
                  </View>
                )}
                {profileData.about.education && (
                  <View style={profileModalStyles.aboutRow}>
                    <Ionicons name="school-outline" size={18} color={colors.textSecondary} />
                    <Text style={profileModalStyles.aboutText}>{profileData.about.education}</Text>
                  </View>
                )}
                {profileData.about.languages && (
                  <View style={profileModalStyles.aboutRow}>
                    <Ionicons name="language-outline" size={18} color={colors.textSecondary} />
                    <Text style={profileModalStyles.aboutText}>{profileData.about.languages}</Text>
                  </View>
                )}
                {profileData.about.height && (
                  <View style={profileModalStyles.aboutRow}>
                    <Ionicons name="resize-outline" size={18} color={colors.textSecondary} />
                    <Text style={profileModalStyles.aboutText}>{profileData.about.height}</Text>
                  </View>
                )}
                {profileData.about.drinking && (
                  <View style={profileModalStyles.aboutRow}>
                    <Ionicons name="wine-outline" size={18} color={colors.textSecondary} />
                    <Text style={profileModalStyles.aboutText}>{profileData.about.drinking}</Text>
                  </View>
                )}
                {profileData.about.smoking && (
                  <View style={profileModalStyles.aboutRow}>
                    <FontAwesome5 name="smoking" size={13} color={colors.textSecondary} />
                    <Text style={profileModalStyles.aboutText}>{profileData.about.smoking}</Text>
                  </View>
                )}
                {profileData.about.relationshipType && (
                  <View style={profileModalStyles.aboutRow}>
                    <Ionicons name="heart-outline" size={18} color={colors.textSecondary} />
                    <Text style={profileModalStyles.aboutText}>{profileData.about.relationshipType}</Text>
                  </View>
                )}
                {profileData.about.location && (
                  <View style={profileModalStyles.aboutRow}>
                    <Ionicons name="location-outline" size={18} color={colors.textSecondary} />
                    <Text style={profileModalStyles.aboutText}>{profileData.about.location}</Text>
                  </View>
                )}
              </View>
            )}

            {/* SECTION 3: Photo + Prompt Sequences */}
            {profileData.photos?.slice(1).map((photo, index) => (
              <View key={index} style={profileModalStyles.photoPromptSection}>
                <View style={profileModalStyles.photoContainer}>
                  <Image
                    source={{ uri: photo.uri }}
                    style={profileModalStyles.promptPhoto}
                    resizeMode="cover"
                  />
                </View>
                {profileData.prompts?.[index] && (
                  <View style={profileModalStyles.promptBlock}>
                    <Text style={profileModalStyles.promptTitle}>
                      {profileData.prompts[index].title}
                    </Text>
                    <Text style={profileModalStyles.promptAnswer}>
                      {profileData.prompts[index].answer}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </Animated.View>
      </Modal>
    );
  };

  if (visibleLikes.length === 0) {
    return (
      <SafeAreaView style={globalStyles.safeArea}>
        <View style={[globalStyles.content, styles.container]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Likes</Text>
          </View>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No likes yet</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={[globalStyles.content, styles.container]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Likes</Text>
        </View>

        <FlatList
          data={visibleLikes}
          keyExtractor={(item) => item.id}
          renderItem={renderLikeCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
                People who resonated with something on your profile.
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No likes yet</Text>
            </View>
          }
        />
      </View>
      {renderProfileModal()}
    </SafeAreaView>
  );
});

LikesScreen.displayName = 'LikesScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionHeader: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  sectionDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
  likeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E6',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  likedImageBox: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    margin: 16,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E6',
    height: 340,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  likedImage: {
    width: '100%',
    height: '100%',
  },
  promptBox: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E6',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  promptBoxTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  promptBoxContent: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 26,
    letterSpacing: 0.2,
  },
  messageContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  messageBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F4F8',
    borderRadius: 18,
    borderBottomLeftRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 18,
    maxWidth: '88%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D0E8F0',
  },
  messageText: {
    fontSize: 15,
    color: '#1A3A52',
    lineHeight: 21,
    fontWeight: '500',
  },
  messageSenderName: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sparkButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkButtonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  dismissButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F7',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E8E8ED',
  },
  dismissButtonText: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6F6F6F',
    textAlign: 'center',
  },
  cardContent: {
    flex: 1,
  },
});

// Profile Modal Styles - Similar to ConversationScreen
const profileModalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    paddingTop: 0,
    paddingBottom: 100,
  },
  stickySpacer: {
    // Calculate: safe area top (60/40) + similarities section (~180-200) + padding
    // This ensures the hero photo starts well below the sticky section
    height: Platform.OS === 'ios' ? 290 : 270,
  },
  stickySimilaritiesSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  dragHintWrapper: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 10 : 4,
    paddingBottom: 6,
  },
  dragHandle: {
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    marginBottom: 4,
  },
  dragHintText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6A6F7D',
    letterSpacing: 0.3,
  },
  similaritiesSection: {
    backgroundColor: '#F3F6FF',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#DDE3FF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  similaritiesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  similaritiesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginLeft: 8,
    letterSpacing: 0.3,
  },
  similaritiesList: {
    gap: 12,
  },
  similarityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  similarityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3645FF',
    marginRight: 12,
  },
  similarityText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
    flex: 1,
    lineHeight: 22,
  },
  heroSection: {
    height: 350,
    position: 'relative',
    marginBottom: 20,
    marginHorizontal: 20,
    borderRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
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
    marginBottom: 24,
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
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
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
    marginBottom: 24,
    marginHorizontal: 20,
  },
  photoContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  promptPhoto: {
    width: '100%',
    height: 400,
  },
  promptBlock: {
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
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
});

export default LikesScreen;
