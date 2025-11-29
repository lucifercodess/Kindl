import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Image, ScrollView, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../theme/theme';
import globalStyles from '../../theme/globalStyles';
import { hapticSelection, hapticButtonPress } from '../../utils/haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * ProfileCraftingScreen - Premium profile editing screen
 * "Crafting" and "Preview" modes with luxury design
 */
const ProfileCraftingScreen = React.memo(() => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [activeMode, setActiveMode] = useState('crafting'); // 'crafting' or 'preview'
  
  // Animation values for pill switcher
  const pillPosition = useSharedValue(0);

  // Calculate pill position based on active mode
  useEffect(() => {
    // 0 for crafting (left), 1 for preview (right)
    const targetPosition = activeMode === 'crafting' ? 0 : 1;
    pillPosition.value = withTiming(targetPosition, {
      duration: 200,
      easing: Easing.out(Easing.cubic),
    });
  }, [activeMode]);

  const handleBack = () => {
    hapticSelection();
    navigation.goBack();
  };

  const handleModeChange = (mode) => {
    if (mode !== activeMode) {
      hapticSelection();
      setActiveMode(mode);
    }
  };

  // Swipe gesture for tab switching - smooth animation
  const swipeX = useSharedValue(0);
  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-5, 5])
    .onUpdate((e) => {
      swipeX.value = e.translationX;
    })
    .onEnd((e) => {
      const { translationX, velocityX } = e;
      // Swipe right (positive translation) -> go to crafting
      if (translationX > 80 || velocityX > 800) {
        if (activeMode === 'preview') {
          runOnJS(handleModeChange)('crafting');
        }
      }
      // Swipe left (negative translation) -> go to preview
      else if (translationX < -80 || velocityX < -800) {
        if (activeMode === 'crafting') {
          runOnJS(handleModeChange)('preview');
        }
      }
      // Reset swipe position
      swipeX.value = withSpring(0, { damping: 20, stiffness: 300 });
    });

  const pillAnimatedStyle = useAnimatedStyle(() => {
    // Calculate translateX based on position (0 = left, 1 = right)
    // tabSwitcherContainer has paddingHorizontal: 24, so container width = SCREEN_WIDTH - 48
    // tabSwitcher has padding: 4, so inner width = (SCREEN_WIDTH - 48) - 8 = SCREEN_WIDTH - 56
    const innerWidth = SCREEN_WIDTH - 56;
    const tabWidth = innerWidth / 2;
    // Pill starts at left: 4, so translateX moves it by tabWidth when switching
    const translateX = pillPosition.value * tabWidth;
    
    return {
      transform: [{ translateX }],
      width: tabWidth,
    };
  });

  // Calculate progress (78% for now)
  const profileCompleteness = 78;

  // Image gallery state - 6 slots
  const [images, setImages] = useState([
    { id: '1', uri: null },
    { id: '2', uri: null },
    { id: '3', uri: null },
    { id: '4', uri: null },
    { id: '5', uri: null },
    { id: '6', uri: null },
  ]);

  // Handle adding image to a slot
  const handleAddImage = useCallback(async (index) => {
    try {
      hapticButtonPress();
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'We need camera roll permissions to add photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImages = [...images];
        newImages[index] = {
          ...newImages[index],
          uri: result.assets[0].uri,
        };
        setImages(newImages);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  }, [images]);

  // Handle removing an image
  const handleRemoveImage = useCallback((index) => {
    hapticSelection();
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const newImages = [...images];
            newImages[index] = { ...newImages[index], uri: null };
            setImages(newImages);
          },
        },
      ]
    );
  }, [images]);

  // Handle reordering images - swap positions
  const handleReorderImages = useCallback((fromIndex, toIndex) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= images.length || toIndex >= images.length) return;
    hapticSelection();
    const newImages = [...images];
    // Swap the two images
    const temp = newImages[fromIndex];
    newImages[fromIndex] = newImages[toIndex];
    newImages[toIndex] = temp;
    setImages(newImages);
  }, [images]);

  // Bio state
  const [bio, setBio] = useState('');
  const [isBioFocused, setIsBioFocused] = useState(false);

  // Prompts state - 3 prompts max
  const [prompts, setPrompts] = useState({
    warmth: null,
    spark: null,
    depth: null,
  });

  // Special prompts state
  const [specialPrompts, setSpecialPrompts] = useState({
    video: null,
    poll: null,
    voice: null,
  });

  // Handle AI bio generation
  const handleAIGenerateBio = useCallback(() => {
    hapticButtonPress();
    // TODO: Implement AI bio generation
    Alert.alert(
      'AI Bio Assistant',
      'We\'ll analyze your photos and profile to craft a personalized bio that reflects your authentic self.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Generate',
          onPress: () => {
            // Placeholder - will be replaced with actual AI call
            setBio('Adventure seeker • Coffee enthusiast • Always up for a good conversation. Let\'s create meaningful connections.');
          },
        },
      ]
    );
  }, []);

  return (
    <SafeAreaView style={[globalStyles.safeArea, styles.container]}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#000000" />
        </TouchableOpacity>
        
        <Text style={styles.topBarTitle}>Alex</Text>
        
        <View style={styles.topBarRight} />
      </View>

      {/* Profile Completeness */}
      <View style={styles.completenessContainer}>
        <Text style={styles.completenessText}>
          Profile completeness:{' '}
          <Text style={styles.completenessPercent}>{profileCompleteness}%</Text>
        </Text>
        
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${profileCompleteness}%` },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Pill Tab Switcher */}
      <View style={styles.tabSwitcherContainer}>
        <View style={styles.tabSwitcher}>
          {/* Active Pill Background */}
          <Animated.View
            style={[
              styles.activePill,
              pillAnimatedStyle,
            ]}
          />
          
          {/* Tabs */}
          <View style={styles.tabsRow}>
            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => handleModeChange('crafting')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  activeMode === 'crafting' && styles.tabTextActive,
                ]}
              >
                Crafting
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => handleModeChange('preview')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  activeMode === 'preview' && styles.tabTextActive,
                ]}
              >
                Preview
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Descriptor Text */}
      <View style={styles.descriptorContainer}>
        <Text style={styles.descriptorText}>
          {activeMode === 'crafting'
            ? 'Shape your story with intention.'
            : ''}
        </Text>
      </View>

      {/* Content */}
      <View style={styles.contentSlot}>
        <GestureDetector gesture={swipeGesture}>
          <View style={styles.contentWrapper}>
            {activeMode === 'crafting' ? (
              <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentScrollContainer}
              >
                <ImageGallery
                  images={images}
                  onAddImage={handleAddImage}
                  onRemoveImage={handleRemoveImage}
                  onReorderImages={handleReorderImages}
                />
                
                {/* Bio Editor Section */}
                <BioEditor
                  bio={bio}
                  setBio={setBio}
                  isFocused={isBioFocused}
                  onFocusChange={setIsBioFocused}
                  onAIGenerate={handleAIGenerateBio}
                />
                
                {/* Prompts Section */}
                <PromptsSection
                  prompts={prompts}
                  onPromptPress={(theme) => {
                    hapticSelection();
                    navigation.navigate('PromptsTheme', { theme });
                  }}
                />
                
                {/* Special Prompts Section */}
                <SpecialPromptsSection
                  specialPrompts={specialPrompts}
                  onVideoPress={() => {
                    hapticSelection();
                    navigation.navigate('VideoPrompt');
                  }}
                  onPollPress={() => {
                    hapticSelection();
                    navigation.navigate('PollPrompt');
                  }}
                  onVoicePress={() => {
                    hapticSelection();
                    navigation.navigate('VoicePrompt');
                  }}
                />
                
                {/* Profile Details Section */}
                <ProfileDetailsSection
                  navigation={navigation}
                />
              </ScrollView>
            ) : (
              <View style={styles.previewContainer}>
                <ProfilePreview />
              </View>
            )}
          </View>
        </GestureDetector>
      </View>
    </SafeAreaView>
  );
});

ProfileCraftingScreen.displayName = 'ProfileCraftingScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  topBarTitle: {
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: -0.3,
    color: '#000000',
  },
  topBarRight: {
    width: 40,
  },
  completenessContainer: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 24,
  },
  completenessText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#999999',
    marginBottom: 12,
  },
  completenessPercent: {
    color: '#222222',
    fontWeight: '500',
  },
  progressBarContainer: {
    width: '100%',
    paddingHorizontal: 28,
  },
  progressBarTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#F0F0F0',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 2,
  },
  tabSwitcherContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  tabSwitcher: {
    height: 42,
    backgroundColor: '#F4F4F4',
    borderRadius: 16,
    padding: 4,
    position: 'relative',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  activePill: {
    position: 'absolute',
    left: 4,
    top: 4,
    bottom: 4,
    backgroundColor: '#000000',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabsRow: {
    flex: 1,
    flexDirection: 'row',
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#444444',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  descriptorContainer: {
    paddingHorizontal: 28,
    marginBottom: 24,
  },
  descriptorText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#888888',
    textAlign: 'center',
  },
  contentSlot: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
  },
  contentScrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  previewContainer: {
    flex: 1,
  },
});

const previewStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  placeholderSubtext: {
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.5)',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});

/**
 * ImageGallery - Luxury drag-and-drop photo grid
 * 3 images per row, 2 rows (6 total slots)
 * Hinge/Tinder/Bumble style: visual feedback during drag, swap on release
 */
const ImageGallery = React.memo(({ images, onAddImage, onRemoveImage, onReorderImages }) => {
  const slotLayouts = useRef({});
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  const handleSlotLayout = useCallback((index, layout) => {
    slotLayouts.current[index] = layout;
  }, []);

  const findSlotAtPosition = useCallback((x, y) => {
    for (let i = 0; i < 6; i++) {
      const layout = slotLayouts.current[i];
      if (layout) {
        const inX = x >= layout.x && x <= layout.x + layout.width;
        const inY = y >= layout.y && y <= layout.y + layout.height;
        if (inX && inY) return i;
      }
    }
    return null;
  }, []);

  const handleDragStart = useCallback((index) => {
    setDraggedIndex(index);
    setHoverIndex(null);
  }, []);

  const handleDragMove = useCallback((x, y, currentDragIndex) => {
    if (currentDragIndex === null || currentDragIndex === undefined) return;
    
    const targetIndex = findSlotAtPosition(x, y);
    
    // Update hover index for visual feedback (don't swap yet)
    if (targetIndex !== null && targetIndex !== currentDragIndex) {
      setHoverIndex(targetIndex);
    } else {
      setHoverIndex(null);
    }
  }, [findSlotAtPosition]);

  const handleDragEnd = useCallback((fromIndex) => {
    // Only swap on release if we have a valid target
    if (hoverIndex !== null && hoverIndex !== fromIndex && hoverIndex >= 0 && hoverIndex < images.length) {
      onReorderImages(fromIndex, hoverIndex);
    }
    setDraggedIndex(null);
    setHoverIndex(null);
  }, [hoverIndex, images.length, onReorderImages]);

  // Calculate target position index for each slot during drag
  const getTargetPositionIndex = useCallback((index) => {
    if (draggedIndex === null || hoverIndex === null) return index;
    
    // If this is the dragged item, it's being moved to hoverIndex
    if (index === draggedIndex) return hoverIndex;
    
    // Calculate where other items should shift
    if (draggedIndex < hoverIndex) {
      // Dragging right: items between draggedIndex and hoverIndex shift left
      if (index > draggedIndex && index <= hoverIndex) {
        return index - 1;
      }
    } else if (draggedIndex > hoverIndex) {
      // Dragging left: items between hoverIndex and draggedIndex shift right
      if (index >= hoverIndex && index < draggedIndex) {
        return index + 1;
      }
    }
    
    return index;
  }, [draggedIndex, hoverIndex]);

  return (
    <View style={galleryStyles.container}>
      <View style={galleryStyles.grid}>
        {images.map((image, index) => {
          const targetPosIndex = getTargetPositionIndex(index);
          const isDragging = draggedIndex === index;
          const targetLayout = slotLayouts.current[targetPosIndex];
          const currentLayout = slotLayouts.current[index];
          
          return (
            <DraggableSlot
              key={image?.id || `slot-${index}`}
              index={index}
              targetLayout={targetLayout}
              currentLayout={currentLayout}
              image={image || { id: `slot-${index}`, uri: null }}
              isDragging={isDragging}
              onPress={() => image?.uri ? onRemoveImage(index) : onAddImage(index)}
              onDragStart={() => handleDragStart(index)}
              onDragMove={(x, y) => handleDragMove(x, y, draggedIndex)}
              onDragEnd={() => handleDragEnd(draggedIndex)}
              onLayout={(layout) => handleSlotLayout(index, layout)}
            />
          );
        })}
      </View>
      
      {/* Hint text */}
      <Text style={galleryStyles.hintText}>
        Hold and drag to reorder • Tap to add or remove
      </Text>
    </View>
  );
});

ImageGallery.displayName = 'ImageGallery';

/**
 * BioEditor - Premium bio editing section with AI assistant
 */
const BioEditor = React.memo(({ bio, setBio, isFocused, onFocusChange, onAIGenerate }) => {
  const scale = useSharedValue(1);
  const aiIconScale = useSharedValue(1);
  const aiIconOpacity = useSharedValue(0.8);

  useEffect(() => {
    if (isFocused) {
      scale.value = withSpring(1.01, { damping: 15, stiffness: 200 });
    } else {
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
    }
  }, [isFocused, scale]);

  // Subtle AI icon pulse animation
  useEffect(() => {
    aiIconScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    aiIconOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.6, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, [aiIconScale, aiIconOpacity]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const aiIconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: aiIconScale.value }],
    opacity: aiIconOpacity.value,
  }));

  const handleAIPress = () => {
    hapticButtonPress();
    onAIGenerate();
  };

  return (
    <Animated.View style={[bioEditorStyles.container, containerAnimatedStyle]}>
      {/* Section Header */}
      <View style={bioEditorStyles.header}>
        <Text style={bioEditorStyles.title}>Your Story</Text>
        <TouchableOpacity
          style={bioEditorStyles.aiButton}
          onPress={handleAIPress}
          activeOpacity={0.7}
        >
          <Animated.View style={aiIconAnimatedStyle}>
            <Ionicons name="sparkles" size={20} color="#000000" />
          </Animated.View>
          <Text style={bioEditorStyles.aiButtonText}>AI Write</Text>
        </TouchableOpacity>
      </View>

      {/* Bio Input */}
      <View style={bioEditorStyles.inputContainer}>
        <TextInput
          style={[
            bioEditorStyles.input,
            isFocused && bioEditorStyles.inputFocused,
          ]}
          placeholder="Share what makes you unique..."
          placeholderTextColor="rgba(0, 0, 0, 0.3)"
          value={bio}
          onChangeText={setBio}
          onFocus={() => onFocusChange(true)}
          onBlur={() => onFocusChange(false)}
          multiline
          maxLength={500}
          textAlignVertical="top"
        />
        <View style={bioEditorStyles.footer}>
          <Text style={bioEditorStyles.hintText}>
            {bio.length > 0 ? `${bio.length}/500` : 'Let your personality shine'}
          </Text>
          {bio.length === 0 && (
            <TouchableOpacity
              style={bioEditorStyles.aiHintButton}
              onPress={handleAIPress}
              activeOpacity={0.8}
            >
              <Ionicons name="sparkles" size={14} color="rgba(0, 0, 0, 0.5)" />
             
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
});

BioEditor.displayName = 'BioEditor';

/**
 * ProfilePreview - Clean preview of user's own profile without interaction buttons
 * Shows the profile exactly as ProfileCard but without spark buttons, filters, or like buttons
 */
const ProfilePreview = React.memo(() => {
  return (
    <View style={previewStyles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={previewStyles.scrollView}
      >
        <Text style={previewStyles.placeholderText}>
          Profile preview - showing your profile as others see it
        </Text>
        <Text style={previewStyles.placeholderSubtext}>
          (ProfileCard content without buttons will be rendered here)
        </Text>
      </ScrollView>
    </View>
  );
});

ProfilePreview.displayName = 'ProfilePreview';

/**
 * PromptsSection - Premium prompts display with cards
 */
const PromptsSection = React.memo(({ prompts, onPromptPress }) => {
  const themes = [
    { key: 'warmth', title: 'Warmth', description: 'Love, comfort, softness' },
    { key: 'spark', title: 'Spark', description: 'Attraction, vibe, energy' },
    { key: 'depth', title: 'Depth', description: 'Emotional expression' },
  ];

  return (
    <View style={promptsStyles.container}>
      <Text style={promptsStyles.sectionTitle}>Prompts</Text>
      <View style={promptsStyles.cardsContainer}>
        {themes.map((theme) => {
          const prompt = prompts[theme.key];
          return (
            <TouchableOpacity
              key={theme.key}
              style={promptsStyles.card}
              onPress={() => onPromptPress(theme.key)}
              activeOpacity={0.8}
            >
              <View style={promptsStyles.cardContent}>
                <View style={promptsStyles.cardHeader}>
                  <Text style={promptsStyles.cardTitle}>{theme.title}</Text>
                  <Ionicons name="chevron-forward" size={18} color="rgba(0, 0, 0, 0.3)" />
                </View>
                <View style={promptsStyles.cardDivider} />
                {prompt ? (
                  <Text style={promptsStyles.cardPreview} numberOfLines={2}>
                    {prompt.answer}
                  </Text>
                ) : (
                  <Text style={promptsStyles.cardPlaceholder}>
                    Add your story
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
});

PromptsSection.displayName = 'PromptsSection';

/**
 * SpecialPromptsSection - Video, Poll, Voice prompts with cards
 */
const SpecialPromptsSection = React.memo(({ specialPrompts, onVideoPress, onPollPress, onVoicePress }) => {
  const items = [
    { key: 'video', title: 'Video Prompt', icon: 'videocam-outline', onPress: onVideoPress, hasContent: !!specialPrompts.video },
    { key: 'poll', title: 'Poll Prompt', icon: 'stats-chart-outline', onPress: onPollPress, hasContent: !!specialPrompts.poll },
    { key: 'voice', title: 'Voice Prompt', icon: 'mic-outline', onPress: onVoicePress, hasContent: !!specialPrompts.voice },
  ];

  return (
    <View style={specialPromptsStyles.container}>
      <Text style={specialPromptsStyles.sectionTitle}>Special Prompts</Text>
      <View style={specialPromptsStyles.cardsContainer}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={specialPromptsStyles.card}
            onPress={item.onPress}
            activeOpacity={0.8}
          >
            <View style={specialPromptsStyles.cardContent}>
              <View style={specialPromptsStyles.cardHeader}>
                <View style={specialPromptsStyles.cardTitleRow}>
                  <Ionicons name={item.icon} size={20} color="#000000" />
                  <Text style={specialPromptsStyles.cardTitle}>{item.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="rgba(0, 0, 0, 0.3)" />
              </View>
              <View style={specialPromptsStyles.cardDivider} />
              {item.hasContent ? (
                <Text style={specialPromptsStyles.cardStatus}>Added</Text>
              ) : (
                <Text style={specialPromptsStyles.cardPlaceholder}>Add</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
});

SpecialPromptsSection.displayName = 'SpecialPromptsSection';

/**
 * ProfileDetailsSection - All profile fields with visibility toggles
 */
const ProfileDetailsSection = React.memo(({ navigation }) => {
  const profileFields = [
    // Identity
    { key: 'pronouns', label: 'Pronouns', category: 'Identity' },
    { key: 'gender', label: 'Gender', category: 'Identity' },
    { key: 'interestedIn', label: 'Interested In', category: 'Identity' },
    { key: 'sexuality', label: 'Sexuality', category: 'Identity' },
    // Basic Info
    { key: 'name', label: 'Name', category: 'Basic Info' },
    { key: 'age', label: 'Age', category: 'Basic Info' },
    { key: 'height', label: 'Height', category: 'Basic Info' },
    { key: 'location', label: 'Location', category: 'Basic Info' },
    { key: 'ethnicity', label: 'Ethnicity', category: 'Basic Info' },
    // Personal
    { key: 'children', label: 'Children', category: 'Personal' },
    { key: 'pets', label: 'Pets', category: 'Personal' },
    { key: 'zodiac', label: 'Zodiac Sign', category: 'Personal' },
    { key: 'work', label: 'Work', category: 'Personal' },
    { key: 'college', label: 'College', category: 'Personal' },
    { key: 'religion', label: 'Religion', category: 'Personal' },
    // Preferences
    { key: 'intentions', label: 'Intentions', category: 'Preferences' },
    { key: 'relationshipType', label: 'Relationship Type', category: 'Preferences' },
    { key: 'drinking', label: 'Drinking', category: 'Preferences' },
    { key: 'smoking', label: 'Smoking', category: 'Preferences' },
    { key: 'dogs', label: 'Dogs', category: 'Preferences' },
  ];

  const [profileData, setProfileData] = useState({});
  const [visibility, setVisibility] = useState({});

  const handleFieldPress = (field) => {
    hapticSelection();
    navigation.navigate('ProfileFieldEditor', { field });
  };

  // Group fields by category
  const groupedFields = profileFields.reduce((acc, field) => {
    if (!acc[field.category]) {
      acc[field.category] = [];
    }
    acc[field.category].push(field);
    return acc;
  }, {});

  return (
    <View style={profileDetailsStyles.container}>
      <Text style={profileDetailsStyles.sectionTitle}>Profile Details</Text>
      
      {Object.entries(groupedFields).map(([category, fields]) => (
        <View key={category} style={profileDetailsStyles.categoryContainer}>
          <Text style={profileDetailsStyles.categoryTitle}>{category}</Text>
          <View style={profileDetailsStyles.itemsContainer}>
            {fields.map((field) => {
              const value = profileData[field.key];
              const isVisible = visibility[field.key] !== false; // Default to visible
              
              return (
                <TouchableOpacity
                  key={field.key}
                  style={profileDetailsStyles.item}
                  onPress={() => handleFieldPress(field)}
                  activeOpacity={0.7}
                >
                  <View style={profileDetailsStyles.itemContent}>
                    <Text style={profileDetailsStyles.itemLabel}>{field.label}</Text>
                    {value ? (
                      <Text style={profileDetailsStyles.itemValue}>{value}</Text>
                    ) : (
                      <Text style={profileDetailsStyles.itemPlaceholder}>Add</Text>
                    )}
                    <Text style={[
                      profileDetailsStyles.itemVisibility,
                      !isVisible && profileDetailsStyles.itemVisibilityHidden
                    ]}>
                      {isVisible ? 'Visible' : 'Hidden'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="rgba(0, 0, 0, 0.3)" />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
});

ProfileDetailsSection.displayName = 'ProfileDetailsSection';

/**
 * DraggableSlot - Individual draggable image slot with smooth animations
 * Animates to target position during drag (like Hinge/Tinder)
 */
const DraggableSlot = React.memo(({
  index,
  targetLayout,
  currentLayout,
  image,
  isDragging,
  onPress,
  onDragStart,
  onDragMove,
  onDragEnd,
  onLayout,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.08);
  const zIndex = useSharedValue(1);
  
  // Position animation for non-dragged items shifting to make space
  const positionX = useSharedValue(0);
  const positionY = useSharedValue(0);
  
  const startX = useRef(0);
  const startY = useRef(0);
  const isActiveDrag = useSharedValue(false);
  const isDraggingRef = useSharedValue(false);
  
  // Update dragging ref when prop changes
  useEffect(() => {
    isDraggingRef.value = isDragging;
  }, [isDragging, isDraggingRef]);
  
  // Animate to target position when layout changes (for non-dragged items)
  useEffect(() => {
    if (!isDragging && targetLayout && currentLayout) {
      const deltaX = targetLayout.x - currentLayout.x;
      const deltaY = targetLayout.y - currentLayout.y;
      
      if (deltaX !== 0 || deltaY !== 0) {
        positionX.value = withSpring(deltaX, { damping: 20, stiffness: 300 });
        positionY.value = withSpring(deltaY, { damping: 20, stiffness: 300 });
      } else {
        // Reset position when target matches current
        positionX.value = withSpring(0, { damping: 20, stiffness: 300 });
        positionY.value = withSpring(0, { damping: 20, stiffness: 300 });
      }
    } else if (!isDragging) {
      // Reset position when not dragging
      positionX.value = withSpring(0, { damping: 20, stiffness: 300 });
      positionY.value = withSpring(0, { damping: 20, stiffness: 300 });
    }
  }, [targetLayout, currentLayout, isDragging, positionX, positionY]);

  // Long press to initiate drag
  const longPressGesture = Gesture.LongPress()
    .enabled(!!image.uri)
    .minDuration(150)
    .onStart(() => {
      isActiveDrag.value = true;
      // Reset position animations for dragged item
      positionX.value = 0;
      positionY.value = 0;
      runOnJS(hapticButtonPress)();
      runOnJS(onDragStart)();
      
      // Quick, subtle lift animation
      scale.value = withTiming(1.03, { duration: 100 });
      opacity.value = withTiming(0.92, { duration: 80 });
      shadowOpacity.value = withTiming(0.2, { duration: 100 });
      zIndex.value = 100;
    });

  // Pan gesture for dragging
  const panGesture = Gesture.Pan()
    .enabled(!!image.uri)
    .minDistance(0)
    .onUpdate((e) => {
      if (isActiveDrag.value) {
        translateX.value = e.translationX;
        translateY.value = e.translationY;
        
        // Calculate absolute position
        const absX = startX.current + e.translationX;
        const absY = startY.current + e.translationY;
        runOnJS(onDragMove)(absX, absY);
      }
    })
    .onEnd(() => {
      if (isActiveDrag.value) {
        isActiveDrag.value = false;
        
        // Fast snap back animation
        translateX.value = withTiming(0, { duration: 150 });
        translateY.value = withTiming(0, { duration: 150 });
        scale.value = withTiming(1, { duration: 100 });
        opacity.value = withTiming(1, { duration: 100 });
        shadowOpacity.value = withTiming(0.08, { duration: 100 });
        zIndex.value = 1;
        // Reset position animations
        positionX.value = 0;
        positionY.value = 0;
        
        runOnJS(onDragEnd)();
      }
    })
    .onFinalize(() => {
      if (isActiveDrag.value) {
        isActiveDrag.value = false;
        translateX.value = withTiming(0, { duration: 150 });
        translateY.value = withTiming(0, { duration: 150 });
        scale.value = withTiming(1, { duration: 100 });
        opacity.value = withTiming(1, { duration: 100 });
        shadowOpacity.value = withTiming(0.08, { duration: 100 });
        zIndex.value = 1;
        positionX.value = 0;
        positionY.value = 0;
      }
    });

  const composedGesture = Gesture.Simultaneous(longPressGesture, panGesture);

  const animatedSlotStyle = useAnimatedStyle(() => {
    // For dragged item: use finger translation
    // For other items: use position animation to shift
    const finalTranslateX = isDraggingRef.value ? translateX.value : positionX.value;
    const finalTranslateY = isDraggingRef.value ? translateY.value : positionY.value;
    
    return {
      transform: [
        { translateX: finalTranslateX },
        { translateY: finalTranslateY },
        { scale: scale.value },
      ],
      opacity: opacity.value,
      zIndex: zIndex.value,
      shadowOpacity: shadowOpacity.value,
    };
  });

  const handleLayout = (event) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    startX.current = x + width / 2;
    startY.current = y + height / 2;
    onLayout({ x, y, width, height });
  };

  return (
    <View
      style={galleryStyles.slotWrapper}
      onLayout={handleLayout}
    >
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[galleryStyles.slot, animatedSlotStyle]}>
          <TouchableOpacity
            style={galleryStyles.slotTouchable}
            activeOpacity={0.9}
            onPress={onPress}
            disabled={isDragging}
          >
            {image.uri ? (
              <>
                <Image
                  source={{ uri: image.uri }}
                  style={galleryStyles.image}
                  resizeMode="cover"
                />
                {/* Remove button */}
                <View style={galleryStyles.removeButton}>
                  <Ionicons name="close" size={14} color="#FFFFFF" />
                </View>
                {/* Primary badge */}
                {index === 0 && (
                  <View style={galleryStyles.primaryBadge}>
                    <Text style={galleryStyles.primaryBadgeText}>Main</Text>
                  </View>
                )}
              </>
            ) : (
              <View style={galleryStyles.emptySlot}>
                <View style={galleryStyles.addIconContainer}>
                  <Ionicons name="add" size={28} color="rgba(0, 0, 0, 0.25)" />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </View>
  );
});

DraggableSlot.displayName = 'DraggableSlot';

const galleryStyles = StyleSheet.create({
  container: {
    width: '100%',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  slotWrapper: {
    width: '31%',
    aspectRatio: 0.75,
    marginBottom: 12,
    borderRadius: 14,
    overflow: 'visible',
  },
  slot: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
    backgroundColor: '#FAFAFA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  slotTouchable: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  emptySlot: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderWidth: 1.5,
    borderColor: '#EBEBEB',
    borderStyle: 'dashed',
    borderRadius: 14,
  },
  addIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  primaryBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  primaryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  hintText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#AAAAAA',
    textAlign: 'center',
    marginTop: 16,
    letterSpacing: 0.1,
  },
});

const promptsStyles = StyleSheet.create({
  container: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: -0.3,
    marginBottom: 20,
  },
  cardsContainer: {
    gap: 12,
  },
  card: {
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardContent: {
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
    letterSpacing: -0.3,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#EBEBEB',
    marginVertical: 4,
  },
  cardPreview: {
    fontSize: 15,
    fontWeight: '400',
    color: '#000000',
    lineHeight: 22,
    paddingTop: 4,
  },
  cardPlaceholder: {
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.3)',
    fontStyle: 'italic',
    paddingTop: 4,
  },
});

const specialPromptsStyles = StyleSheet.create({
  container: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: -0.3,
    marginBottom: 20,
  },
  cardsContainer: {
    gap: 12,
  },
  card: {
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardContent: {
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
    letterSpacing: -0.3,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#EBEBEB',
    marginVertical: 4,
  },
  cardStatus: {
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.5)',
    paddingTop: 4,
  },
  cardPlaceholder: {
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.3)',
    fontStyle: 'italic',
    paddingTop: 4,
  },
});

const profileDetailsStyles = StyleSheet.create({
  container: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: -0.3,
    marginBottom: 24,
  },
  categoryContainer: {
    marginBottom: 32,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.5)',
    letterSpacing: 0.5,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  itemsContainer: {
    gap: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingVertical: 18,
  },
  itemContent: {
    flex: 1,
    gap: 4,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  itemValue: {
    fontSize: 14,
    fontWeight: '400',
    color: '#000000',
    lineHeight: 20,
  },
  itemPlaceholder: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.3)',
    fontStyle: 'italic',
  },
  itemVisibility: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.4)',
    marginTop: 4,
  },
  itemVisibilityHidden: {
    color: 'rgba(0, 0, 0, 0.25)',
    fontStyle: 'italic',
  },
});

const bioEditorStyles = StyleSheet.create({
  container: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: -0.3,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    gap: 6,
  },
  aiButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000000',
    letterSpacing: 0.1,
  },
  inputContainer: {
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#EBEBEB',
  },
  input: {
    fontSize: 15,
    fontWeight: '400',
    color: '#000000',
    lineHeight: 22,
    minHeight: 120,
    maxHeight: 200,
    padding: 0,
  },
  inputFocused: {
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    flexWrap: 'wrap',
    gap: 8,
  },
  hintText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#999999',
    flexShrink: 1,
  },
  aiHintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexShrink: 1,
  },
  aiHintText: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.5)',
    fontStyle: 'italic',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
});

export default ProfileCraftingScreen;

