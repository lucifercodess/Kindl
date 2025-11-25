import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  Modal,
  PanResponder,
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
  const menuButtonRef = useRef(null);
  const scrollableMenuButtonRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  
  // Filter modal states
  const [showAgeFilter, setShowAgeFilter] = useState(false);
  const [showHeightFilter, setShowHeightFilter] = useState(false);
  const [showIntentFilter, setShowIntentFilter] = useState(false);
  const [ageRange, setAgeRange] = useState({ min: 22, max: 35 });
  const [heightRange, setHeightRange] = useState({ min: 60, max: 72 }); // 5'0" to 6'0"
  const [selectedIntent, setSelectedIntent] = useState('');
  
  // Slider refs
  const ageRangeSliderRef = useRef(null);
  const heightRangeSliderRef = useRef(null);
  
  // Intent options
  const intentOptions = [
    'Looking for something meaningful',
    'Slow Dating',
    'Deep Conversations',
    'Healing & Honest Energy'
  ];
  
  // Helper functions for sliders
  const calculateAgeValue = (locationX, width) => {
    const percentage = Math.max(0, Math.min(1, locationX / width));
    return Math.round(18 + percentage * 42);
  };
  
  const calculateHeightValue = (locationX, width) => {
    const percentage = Math.max(0, Math.min(1, locationX / width));
    return Math.round(48 + percentage * 36); // 48 inches (4'0") to 84 inches (7'0")
  };
  
  const formatHeight = (inches) => {
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}'${remainingInches}"`;
  };
  
  // PanResponder for age range slider
  const ageRangePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const touchX = evt.nativeEvent.pageX;
        if (ageRangeSliderRef.current) {
          ageRangeSliderRef.current.measure((x, y, width, height, pageX, pageY) => {
            const relativeX = touchX - pageX;
            const value = calculateAgeValue(relativeX, width);
            
            const minPos = ((ageRange.min - 18) / 42) * width;
            const maxPos = ((ageRange.max - 18) / 42) * width;
            const distanceToMin = Math.abs(relativeX - minPos);
            const distanceToMax = Math.abs(relativeX - maxPos);
            
            if (distanceToMin < distanceToMax) {
              const newValue = Math.max(18, Math.min(ageRange.max - 1, value));
              setAgeRange({ ...ageRange, min: newValue });
            } else {
              const newValue = Math.max(ageRange.min + 1, Math.min(60, value));
              setAgeRange({ ...ageRange, max: newValue });
            }
            hapticLight();
          });
        }
      },
      onPanResponderMove: (evt) => {
        const touchX = evt.nativeEvent.pageX;
        if (ageRangeSliderRef.current) {
          ageRangeSliderRef.current.measure((x, y, width, height, pageX, pageY) => {
            const relativeX = touchX - pageX;
            const value = calculateAgeValue(relativeX, width);
            
            const minPos = ((ageRange.min - 18) / 42) * width;
            const maxPos = ((ageRange.max - 18) / 42) * width;
            const distanceToMin = Math.abs(relativeX - minPos);
            const distanceToMax = Math.abs(relativeX - maxPos);
            
            if (distanceToMin < distanceToMax) {
              const newValue = Math.max(18, Math.min(ageRange.max - 1, value));
              setAgeRange({ ...ageRange, min: newValue });
            } else {
              const newValue = Math.max(ageRange.min + 1, Math.min(60, value));
              setAgeRange({ ...ageRange, max: newValue });
            }
          });
        }
      },
      onPanResponderRelease: () => {
        hapticLight();
      },
    })
  ).current;
  
  // PanResponder for height range slider
  const heightRangePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const touchX = evt.nativeEvent.pageX;
        if (heightRangeSliderRef.current) {
          heightRangeSliderRef.current.measure((x, y, width, height, pageX, pageY) => {
            const relativeX = touchX - pageX;
            const value = calculateHeightValue(relativeX, width);
            
            const minPos = ((heightRange.min - 48) / 36) * width;
            const maxPos = ((heightRange.max - 48) / 36) * width;
            const distanceToMin = Math.abs(relativeX - minPos);
            const distanceToMax = Math.abs(relativeX - maxPos);
            
            if (distanceToMin < distanceToMax) {
              const newValue = Math.max(48, Math.min(heightRange.max - 1, value));
              setHeightRange({ ...heightRange, min: newValue });
            } else {
              const newValue = Math.max(heightRange.min + 1, Math.min(84, value));
              setHeightRange({ ...heightRange, max: newValue });
            }
            hapticLight();
          });
        }
      },
      onPanResponderMove: (evt) => {
        const touchX = evt.nativeEvent.pageX;
        if (heightRangeSliderRef.current) {
          heightRangeSliderRef.current.measure((x, y, width, height, pageX, pageY) => {
            const relativeX = touchX - pageX;
            const value = calculateHeightValue(relativeX, width);
            
            const minPos = ((heightRange.min - 48) / 36) * width;
            const maxPos = ((heightRange.max - 48) / 36) * width;
            const distanceToMin = Math.abs(relativeX - minPos);
            const distanceToMax = Math.abs(relativeX - maxPos);
            
            if (distanceToMin < distanceToMax) {
              const newValue = Math.max(48, Math.min(heightRange.max - 1, value));
              setHeightRange({ ...heightRange, min: newValue });
            } else {
              const newValue = Math.max(heightRange.min + 1, Math.min(84, value));
              setHeightRange({ ...heightRange, max: newValue });
            }
          });
        }
      },
      onPanResponderRelease: () => {
        hapticLight();
      },
    })
  ).current;
  
  // Multiple profile cards for testing
  const profiles = [
    {
      name: 'Alex',
      age: 28,
      vibeTag: 'Slow & Intentional',
      activeStatus: 'Active now',
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
    },
    {
      name: 'Jordan',
      age: 32,
      vibeTag: 'Deep & Thoughtful',
      activeStatus: 'Active today',
      bio: 'Writer and coffee enthusiast. I believe in taking things slow and building genuine connections. Love hiking, reading, and meaningful conversations.',
      photos: [
        { uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400' },
        { uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400' },
        { uri: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400' },
      ],
      about: {
        gender: 'Man',
        career: 'Writer',
        education: 'NYU',
        languages: 'English, French',
        height: "6'2\"",
        drinking: 'Socially',
        smoking: 'No',
        relationshipType: 'Monogamous',
        location: 'New York, NY',
      },
      prompts: [
        {
          title: 'I\'M LOOKING FOR',
          answer: 'A partner who values emotional intelligence and isn\'t afraid of vulnerability.',
        },
        {
          title: 'MY SIMPLE PLEASURES',
          answer: 'Early morning runs, good books, and conversations that last until 2am.',
        },
        {
          title: 'WE\'LL GET ALONG IF',
          answer: 'You appreciate the beauty in quiet moments and value depth over breadth.',
        },
      ],
      intent: 'Slow Dating',
    },
    {
      name: 'Sam',
      age: 26,
      vibeTag: 'Authentic & Warm',
      activeStatus: 'Active 2h ago',
      bio: 'Yoga instructor and plant parent. I\'m all about living intentionally and creating space for genuine connections. Love cooking, nature, and deep talks.',
      photos: [
        { uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400' },
        { uri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400' },
        { uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400' },
      ],
      about: {
        gender: 'Woman',
        career: 'Yoga Instructor',
        education: 'UCLA',
        languages: 'English, Italian',
        height: "5'7\"",
        drinking: 'No',
        smoking: 'No',
        relationshipType: 'Monogamous',
        location: 'Los Angeles, CA',
      },
      prompts: [
        {
          title: 'I\'M LOOKING FOR',
          answer: 'Someone who values mindfulness, growth, and authentic connection.',
        },
        {
          title: 'MY SIMPLE PLEASURES',
          answer: 'Sunrise yoga, farmers markets, and cozy evenings with good company.',
        },
        {
          title: 'WE\'LL GET ALONG IF',
          answer: 'You believe in the power of presence and value emotional honesty.',
        },
      ],
      intent: 'Deep Conversations',
    },
    {
      name: 'Taylor',
      age: 30,
      vibeTag: 'Adventurous & Grounded',
      activeStatus: 'Active now',
      bio: 'Photographer and traveler. I love capturing moments and exploring new places. Looking for someone to share adventures and quiet moments with.',
      photos: [
        { uri: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400' },
        { uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
        { uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400' },
      ],
      about: {
        gender: 'Man',
        career: 'Photographer',
        education: 'Art Institute',
        languages: 'English, Spanish',
        height: "6'0\"",
        drinking: 'Socially',
        smoking: 'No',
        relationshipType: 'Monogamous',
        location: 'Portland, OR',
      },
      prompts: [
        {
          title: 'I\'M LOOKING FOR',
          answer: 'A partner who shares my love for adventure and values meaningful connections.',
        },
        {
          title: 'MY SIMPLE PLEASURES',
          answer: 'Golden hour photography, road trips, and conversations around a campfire.',
        },
        {
          title: 'WE\'LL GET ALONG IF',
          answer: 'You appreciate both adventure and stillness, and value authentic moments.',
        },
      ],
      intent: 'Healing & Honest Energy',
    },
  ];

  // Current card index
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const profileData = profiles[currentCardIndex];

  // Animation refs for action buttons
  const skipScale = useRef(new Animated.Value(1)).current;
  
  // Card animation refs
  const cardOpacity = useRef(new Animated.Value(1)).current;
  const cardScale = useRef(new Animated.Value(1)).current;
  const cardTranslateY = useRef(new Animated.Value(0)).current;
  const cardBlur = useRef(new Animated.Value(0)).current;
  
  // Like animation refs
  const sparkPulseScale = useRef(new Animated.Value(0)).current;
  const sparkPulseOpacity = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(1)).current;
  const sparkIconOpacity = useRef(new Animated.Value(0)).current;
  const sparkIconTranslateY = useRef(new Animated.Value(0)).current;
  
  // Dislike animation refs
  const crossOpacity = useRef(new Animated.Value(0)).current;
  const crossScale = useRef(new Animated.Value(0.5)).current;
  const dustParticles = useRef(
    Array.from({ length: 6 }, () => ({
      opacity: new Animated.Value(0),
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
    }))
  ).current;

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

  // Premium Dislike Animation - "Soft Fade Away"
  const handleDislike = () => {
    hapticButtonPress();
    
    // Show cross icon
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
    
    // Card blur and fade down
    Animated.parallel([
      Animated.timing(cardBlur, {
        toValue: 10,
        duration: 400,
        useNativeDriver: false,
      }),
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
      // Reset animations and load next card
      cardOpacity.setValue(0);
      cardTranslateY.setValue(100);
      cardBlur.setValue(0);
      crossOpacity.setValue(0);
      crossScale.setValue(0.5);
      dustParticles.forEach(particle => {
        particle.opacity.setValue(0);
        particle.translateX.setValue(0);
        particle.translateY.setValue(0);
      });
      
      // Move to next card
      const nextIndex = (currentCardIndex + 1) % profiles.length;
      setCurrentCardIndex(nextIndex);
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
      
      // Animate next card rising up
      Animated.parallel([
        Animated.spring(cardTranslateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  // Premium Like Animation - "The Spark Pulse"
  const handleLike = () => {
    hapticButtonPress();
    
    // Spark pulse ring
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
    ]).start();
    
    // Heart fill animation
    Animated.sequence([
      Animated.spring(heartScale, {
        toValue: 1.3,
        useNativeDriver: true,
        tension: 200,
        friction: 3,
      }),
      Animated.spring(heartScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 200,
        friction: 3,
      }),
    ]).start();
    
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
      Animated.sequence([
        Animated.spring(cardScale, {
          toValue: 1.02,
          useNativeDriver: true,
          tension: 100,
          friction: 5,
        }),
        Animated.timing(cardScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
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
      // Reset animations and load next card
      cardOpacity.setValue(0);
      cardTranslateY.setValue(100);
      cardScale.setValue(1);
      sparkPulseScale.setValue(0);
      sparkPulseOpacity.setValue(0);
      
      // Move to next card
      const nextIndex = (currentCardIndex + 1) % profiles.length;
      setCurrentCardIndex(nextIndex);
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
      
      // Animate next card sliding up with bounce
      Animated.parallel([
        Animated.spring(cardTranslateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleSkip = () => {
    handleDislike();
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
    
    // Close the spark sheet
    setSparkSheetVisible(false);
    
    // Trigger the premium like animation after a short delay
    setTimeout(() => {
      handleLike();
    }, 200);
  };


  return (
    <View style={styles.wrapper}>
      {/* Fixed Action Buttons */}
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
      
      {/* Cross Icon Overlay for Dislike */}
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
      
      {/* Spark Pulse Ring for Like */}
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
      
      {/* Spark Icon for Like */}
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
      
      {/* Dust Particles for Dislike */}
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
      
      {/* Animated Card Container */}
      <Animated.View
        style={[
          styles.cardContainer,
          {
            opacity: cardOpacity,
            transform: [
              { scale: cardScale },
              { translateY: cardTranslateY },
            ],
          },
        ]}
      >

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
              ref={menuButtonRef}
              style={styles.headerIconButton}
              onPress={() => {
                hapticSelection();
                if (menuButtonRef.current) {
                  menuButtonRef.current.measureInWindow((x, y, width, height) => {
                    setMenuPosition({ top: y + height + 4, right: Dimensions.get('window').width - x - width });
                    setShowMenu(!showMenu);
                  });
                } else {
                  setShowMenu(!showMenu);
                }
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="ellipsis-horizontal" size={22} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Menu Dropdown */}
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
          <View style={styles.menuBackdrop}>
            <View 
              style={[styles.menuContainer, { top: menuPosition.top, right: menuPosition.right }]}
              onStartShouldSetResponder={() => true}
            >
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
          </View>
        </TouchableWithoutFeedback>
      </Modal>

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
                setShowAgeFilter(true);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.filterChipText}>Age</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterChip}
              onPress={() => {
                hapticSelection();
                setShowHeightFilter(true);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.filterChipText}>Height</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterChip}
              onPress={() => {
                hapticSelection();
                setShowIntentFilter(true);
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
              ref={scrollableMenuButtonRef}
              style={styles.headerIconButton}
              onPress={() => {
                hapticSelection();
                if (scrollableMenuButtonRef.current) {
                  scrollableMenuButtonRef.current.measureInWindow((x, y, width, height) => {
                    setMenuPosition({ top: y + height + 4, right: Dimensions.get('window').width - x - width });
                    setShowMenu(!showMenu);
                  });
                } else {
                  setShowMenu(!showMenu);
                }
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
      </Animated.View>

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

      {/* Age Filter Bottom Sheet */}
      <FilterBottomSheet
        visible={showAgeFilter}
        onClose={() => setShowAgeFilter(false)}
        title="Age Range"
        subtitle={`${ageRange.min} - ${ageRange.max}`}
      >
        <View style={styles.filterSheetContent}>
          <Text style={styles.filterSheetSubtitle}>
            {ageRange.min} - {ageRange.max}
          </Text>
          <View style={styles.rangeSliderContainer}>
            <Text style={styles.rangeLabel}>18</Text>
            <View
              ref={ageRangeSliderRef}
              style={styles.rangeSliderWrapper}
              {...ageRangePanResponder.panHandlers}
            >
              <View style={styles.rangeSliderTrack}>
                <View
                  style={[
                    styles.rangeSliderFill,
                    {
                      left: `${((ageRange.min - 18) / 42) * 100}%`,
                      width: `${((ageRange.max - ageRange.min) / 42) * 100}%`,
                    },
                  ]}
                />
              </View>
              <View
                style={[
                  styles.rangeSliderThumb,
                  { left: `${((ageRange.min - 18) / 42) * 100}%` },
                ]}
              />
              <View
                style={[
                  styles.rangeSliderThumb,
                  { left: `${((ageRange.max - 18) / 42) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.rangeLabel}>60</Text>
          </View>
        </View>
      </FilterBottomSheet>

      {/* Height Filter Bottom Sheet */}
      <FilterBottomSheet
        visible={showHeightFilter}
        onClose={() => setShowHeightFilter(false)}
        title="Height Range"
        subtitle={`${formatHeight(heightRange.min)} - ${formatHeight(heightRange.max)}`}
      >
        <View style={styles.filterSheetContent}>
          <Text style={styles.filterSheetSubtitle}>
            {formatHeight(heightRange.min)} - {formatHeight(heightRange.max)}
          </Text>
          <View style={styles.rangeSliderContainer}>
            <Text style={styles.rangeLabel}>4'0"</Text>
            <View
              ref={heightRangeSliderRef}
              style={styles.rangeSliderWrapper}
              {...heightRangePanResponder.panHandlers}
            >
              <View style={styles.rangeSliderTrack}>
                <View
                  style={[
                    styles.rangeSliderFill,
                    {
                      left: `${((heightRange.min - 48) / 36) * 100}%`,
                      width: `${((heightRange.max - heightRange.min) / 36) * 100}%`,
                    },
                  ]}
                />
              </View>
              <View
                style={[
                  styles.rangeSliderThumb,
                  { left: `${((heightRange.min - 48) / 36) * 100}%` },
                ]}
              />
              <View
                style={[
                  styles.rangeSliderThumb,
                  { left: `${((heightRange.max - 48) / 36) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.rangeLabel}>7'0"</Text>
          </View>
        </View>
      </FilterBottomSheet>

      {/* Intent Filter Bottom Sheet */}
      <FilterBottomSheet
        visible={showIntentFilter}
        onClose={() => setShowIntentFilter(false)}
        title="Dating Intent"
        subtitle={selectedIntent || 'Select an option'}
      >
        <View style={styles.filterSheetContent}>
          {intentOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.intentOption,
                {
                  backgroundColor: selectedIntent === option ? '#000000' : '#F8F8F8',
                  borderColor: selectedIntent === option ? '#000000' : '#E8E8E8',
                },
              ]}
              onPress={() => {
                hapticSelection();
                setSelectedIntent(option);
                setTimeout(() => setShowIntentFilter(false), 300);
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.intentOptionText,
                  {
                    color: selectedIntent === option ? '#FFFFFF' : '#111111',
                  },
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </FilterBottomSheet>
    </View>
  );
};

// Filter Bottom Sheet Component
const FilterBottomSheet = ({ visible, onClose, title, subtitle, children }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: Dimensions.get('window').height,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[
            styles.filterBackdrop,
            {
              opacity: backdropOpacity,
            },
          ]}
        >
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <Animated.View
              style={[
                styles.filterSheet,
                {
                  transform: [{ translateY: slideAnim }],
                  paddingBottom: insets.bottom + 20,
                },
              ]}
            >
              <View style={styles.filterSheetHeader}>
                <View>
                  <Text style={styles.filterSheetTitle}>{title}</Text>
                  <Text style={styles.filterSheetSubtitleSmall}>{subtitle}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    hapticSelection();
                    onClose();
                  }}
                  style={styles.filterSheetCloseButton}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
                </TouchableOpacity>
              </View>
              {children}
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
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
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  menuContainer: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 140,
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
  // Filter Bottom Sheet Styles
  filterBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  filterSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  filterSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  filterSheetTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 4,
  },
  filterSheetSubtitleSmall: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  filterSheetCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterSheetContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  filterSheetSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111111',
    textAlign: 'center',
    marginBottom: 32,
  },
  rangeSliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  rangeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    width: 40,
  },
  rangeSliderWrapper: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  rangeSliderTrack: {
    height: 4,
    backgroundColor: '#E8E8E8',
    borderRadius: 2,
    position: 'relative',
  },
  rangeSliderFill: {
    position: 'absolute',
    height: 4,
    backgroundColor: '#000000',
    borderRadius: 2,
  },
  rangeSliderThumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#000000',
    marginLeft: -12,
    marginTop: -10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  intentOption: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: 'center',
  },
  intentOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  fixedLikeButton: {
    position: 'absolute',
    right: 20,
    zIndex: 1,
  },
  likeButton: {
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
  cardContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  crossOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -60,
    marginTop: -60,
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: '#666666',
  },
});

export default ProfileCard;

