import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/theme';
import globalStyles from '../theme/globalStyles';
import { hapticButtonPress, hapticSelection, hapticLight } from '../utils/haptics';
import SparkButton from './SparkButton';
import SparkBottomSheet from './SparkBottomSheet';

/**
 * ProfileCard - Premium profile discovery card for Kindl
 * Full vertical scrollable profile with intentional, slow-dating aesthetic
 */
const ProfileCard = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const [sparkSheetVisible, setSparkSheetVisible] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedContentType, setSelectedContentType] = useState('photo');
  const [sparkPosition, setSparkPosition] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  // Placeholder data
  const profileData = {
    name: 'Alex',
    age: 28,
    vibeTag: 'Slow & Intentional',
    activeStatus: 'Active now', // Can be 'Active now', 'Active today', 'Active 2h ago', etc.
    bio: 'I love exploring new places, trying different cuisines, and having deep conversations. Looking for someone who values authenticity and meaningful connections.',
    photos: [
      { uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
      { uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' },
      { uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400' },
    ],
    about: {
      gender: 'Woman',
      career: 'Product Designer',
      education: 'Stanford University',
      languages: 'English, Spanish',
      height: "5'10\"",
      drinking: 'Socially',
      smoking: 'No',
      relationshipType: 'Monogamous',
      location: 'San Francisco, CA',
    },
    prompts: [
      {
        title: 'I\'M LOOKING FOR',
        answer: 'Someone who values deep conversations and meaningful connections over surface-level small talk.',
      },
      {
        title: 'MY SIMPLE PLEASURES',
        answer: 'Morning coffee, long walks, and finding new music that makes me feel something.',
      },
      {
        title: 'WE\'LL GET ALONG IF',
        answer: 'You appreciate slow mornings, honest conversations, and the beauty in everyday moments.',
      },
    ],
    intent: 'Looking for something meaningful',
  };

  // Animation refs for action buttons
  const skipScale = useRef(new Animated.Value(1)).current;

  const animateButton = (scaleRef, callback) => {
    hapticSelection();
    Animated.sequence([
      Animated.spring(scaleRef, {
        toValue: 0.9,
        useNativeDriver: true,
        tension: 300,
        friction: 5,
      }),
      Animated.spring(scaleRef, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 5,
      }),
    ]).start();
    if (callback) callback();
  };

  const handleSkip = () => {
    animateButton(skipScale, () => {
      console.log('Skipped');
    });
  };

  const handleSparkPress = (content, contentType, position) => {
    // Get the position of the spark button
    if (position && position.x && position.y) {
      setSparkPosition({ x: position.x, y: position.y });
    } else {
      // Fallback to center if position not available
      const { width, height } = require('react-native').Dimensions.get('window');
      setSparkPosition({ x: width / 2, y: height / 2 });
    }
    setSelectedContent(content);
    setSelectedContentType(contentType);
    setSparkSheetVisible(true);
  };

  const handleSendSpark = (sparkData) => {
    console.log('Spark sent:', sparkData);
    // TODO: Send spark to backend
    
    // Auto-scroll to next section (simulate moving to next card)
    // In production, this would navigate to next profile
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
    }, 300);
  };


  return (
    <View style={styles.wrapper}>
      {/* Fixed Dislike Button on Left */}
      <View style={[styles.fixedDislikeButton, { bottom: 50 + insets.bottom }]}>
        <Animated.View style={{ transform: [{ scale: skipScale }] }}>
          <TouchableOpacity
            style={styles.dislikeButton}
            onPress={handleSkip}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={32} color="#000000" />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Sticky Profile Header */}
      {scrollY > 0 && (
        <View style={[styles.profileHeader, styles.stickyHeader, { paddingTop: insets.top, paddingBottom: 4 }]}>
          {scrollY > 50 ? (
            <Text style={styles.headerName}>{profileData.name}</Text>
          ) : (
            <View style={styles.activeStatusContainer}>
              <View style={styles.activeDot} />
              <Text style={styles.activeStatusText}>{profileData.activeStatus}</Text>
            </View>
          )}
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={() => {
                hapticSelection();
                console.log('Revert/Back');
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={() => {
                hapticSelection();
                setShowMenu(!showMenu);
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="ellipsis-horizontal" size={22} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Menu Dropdown */}
      {showMenu && (
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              hapticSelection();
              console.log('Block');
              setShowMenu(false);
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="ban-outline" size={18} color={theme.colors.textPrimary} />
            <Text style={styles.menuItemText}>Block</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              hapticSelection();
              console.log('Report');
              setShowMenu(false);
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="flag-outline" size={18} color={theme.colors.textPrimary} />
            <Text style={styles.menuItemText}>Report</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        onScroll={(event) => {
          setScrollY(event.nativeEvent.contentOffset.y);
        }}
        scrollEventThrottle={16}
      >
        {/* Filter Bar - Scrolls with content */}
        <View style={styles.filterBar}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterBarContent}
          >
            <TouchableOpacity
              style={styles.filterIconButton}
              onPress={() => {
                hapticSelection();
                navigation.navigate('DatingPreferences');
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="options-outline" size={20} color={theme.colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterChip}
              onPress={() => {
                hapticSelection();
                console.log('Open Age filter');
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.filterChipText}>Age</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterChip}
              onPress={() => {
                hapticSelection();
                console.log('Open Height filter');
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.filterChipText}>Height</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterChip}
              onPress={() => {
                hapticSelection();
                console.log('Open Intent filter');
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.filterChipText}>Intent</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Profile Header - Scrolls with content initially */}
        <View style={styles.profileHeader}>
          <View style={styles.activeStatusContainer}>
            <View style={styles.activeDot} />
            <Text style={styles.activeStatusText}>{profileData.activeStatus}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={() => {
                hapticSelection();
                console.log('Revert/Back');
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={() => {
                hapticSelection();
                setShowMenu(!showMenu);
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="ellipsis-horizontal" size={22} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION 1: Hero Photo */}
      <View style={styles.heroSection}>
        <Image
          source={{ uri: profileData.photos[0].uri }}
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
          onPress={(position) => handleSparkPress(profileData.photos[0].uri, 'photo', position)}
        />
      </View>

      {/* User Bio */}
      <View style={styles.bioContainer}>
        <Text style={styles.bioText}>{profileData.bio}</Text>
      </View>

      {/* SECTION 4: Intent Bar */}
      <View style={styles.intentBar}>
        <Text style={styles.intentText}>{profileData.intent}</Text>
      </View>

      {/* SECTION 2: About Me Card */}
      <View style={styles.aboutCard}>
        <View style={styles.aboutRow}>
          <Ionicons name="person-outline" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.aboutText}>{profileData.about.gender}</Text>
        </View>
        <View style={styles.aboutRow}>
          <Ionicons name="briefcase-outline" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.aboutText}>{profileData.about.career}</Text>
        </View>
        <View style={styles.aboutRow}>
          <Ionicons name="school-outline" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.aboutText}>{profileData.about.education}</Text>
        </View>
        <View style={styles.aboutRow}>
          <Ionicons name="language-outline" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.aboutText}>{profileData.about.languages}</Text>
        </View>
        <View style={styles.aboutRow}>
          <Ionicons name="resize-outline" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.aboutText}>{profileData.about.height}</Text>
        </View>
        <View style={styles.aboutRow}>
          <Ionicons name="wine-outline" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.aboutText}>{profileData.about.drinking}</Text>
        </View>
        <View style={styles.aboutRow}>
          <FontAwesome5 name="smoking" size={13} color={theme.colors.textSecondary} />
          <Text style={styles.aboutText}>{profileData.about.smoking}</Text>
        </View>
        <View style={styles.aboutRow}>
          <Ionicons name="heart-outline" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.aboutText}>{profileData.about.relationshipType}</Text>
        </View>
        <View style={styles.aboutRow}>
          <Ionicons name="location-outline" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.aboutText}>{profileData.about.location}</Text>
        </View>
      </View>

      {/* SECTION 3: Photo + Prompt Sequences */}
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
      </ScrollView>

      {/* Spark Modal */}
      <SparkBottomSheet
        visible={sparkSheetVisible}
        onClose={() => setSparkSheetVisible(false)}
        onSend={handleSendSpark}
        content={selectedContent}
        contentType={selectedContentType}
        userName={profileData.name}
        startPosition={sparkPosition}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    paddingTop: 0,
    paddingBottom: 100,
  },
  filterBar: {
    paddingVertical: 12,
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  filterBarContent: {
    alignItems: 'center',
    gap: 12,
  },
  filterIconButton: {
    width: 40,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111111',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 8,
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 0,
  },
  activeStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  activeStatusText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4A4A4A',
  },
  headerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 140,
    zIndex: 1000,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#111111',
    marginLeft: 12,
  },
  // SECTION 1: Hero Photo
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
    fontSize: 38,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  vibeTagContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  vibeTag: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  // SECTION 2: About Me Card
  aboutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    marginHorizontal: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    paddingVertical: 4,
  },
  aboutText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#111111',
    marginLeft: 14,
    flex: 1,
    letterSpacing: 0.1,
  },
  // SECTION 3: Photo + Prompt Sequences
  photoPromptSection: {
    marginBottom: 24,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 16,
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
  promptPhoto: {
    height: 280,
    width: '100%',
  },
  promptBlock: {
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    minHeight: 140,
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
  promptContent: {
    flex: 1,
    marginBottom: 16, // Fixed gap between text and button
  },
  promptButtonRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginTop: 'auto',
    paddingTop: 8,
  },
  promptButtonSpacer: {
    flex: 1,
  },
  promptSparkButton: {
    position: 'relative',
    bottom: 0,
    right: 0,
  },
  promptTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4A4A4A',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  promptAnswer: {
    fontSize: 17,
    fontWeight: '400',
    color: '#111111',
    lineHeight: 26,
    letterSpacing: 0.2,
  },
  // SECTION 4: Intent Bar
  intentBar: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 28,
    marginHorizontal: 20,
    marginBottom: 24,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  intentText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  fixedDislikeButton: {
    position: 'absolute',
    left: 20,
    zIndex: 1,
  },
  dislikeButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
});

export default ProfileCard;

