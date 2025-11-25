import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Modal,
  ScrollView,
  PanResponder,
} from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { Feather, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../theme/theme';
import globalStyles from '../../theme/globalStyles';
import { hapticLight, hapticSelection, hapticButtonPress } from '../../utils/haptics';

const WINDOW_WIDTH = Dimensions.get('window').width;
const MAX_WAVE_POINTS = 36;

// Swipe to reply constants
const SWIPE_THRESHOLD = 60;
const MAX_SWIPE = 80;

const generateWaveform = (length = 28) =>
  Array.from({ length }, () => 0.35 + Math.random() * 0.65);

const formatDuration = (ms = 0) => {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const formatRelativeTime = (timestamp) => {
  if (!timestamp || timestamp === 'Now' || timestamp === 'Just now') return 'Just now';
  if (timestamp.includes('PM') || timestamp.includes('AM')) {
    // Already formatted time like "9:41 PM"
    return timestamp;
  }
  return timestamp;
};

// LOW_QUALITY preset for faster recording start
const FAST_RECORDING_OPTIONS = {
  isMeteringEnabled: false,
  android: {
    extension: '.m4a',
    outputFormat: Audio.AndroidOutputFormat.MPEG_4,
    audioEncoder: Audio.AndroidAudioEncoder.AAC,
    sampleRate: 22050,
    numberOfChannels: 1,
    bitRate: 64000,
  },
  ios: {
    extension: '.m4a',
    outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
    audioQuality: Audio.IOSAudioQuality.LOW,
    sampleRate: 22050,
    numberOfChannels: 1,
    bitRate: 64000,
  },
  web: {
    mimeType: 'audio/webm',
    bitsPerSecond: 64000,
  },
};

const ConversationScreen = React.memo(({ route }) => {
  const { colors } = useTheme();
  const inputRef = useRef(null);
  const navigation = useNavigation();
  const routeParams = route?.params || {};
  const [inputValue, setInputValue] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [recordingState, setRecordingState] = useState('idle');
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingWaveform, setRecordingWaveform] = useState(() => generateWaveform(18));
  const [recordedClip, setRecordedClip] = useState(null);
  const [activePlaybackId, setActivePlaybackId] = useState(null);
  const [playbackProgress, setPlaybackProgress] = useState({});
  const [playbackPosition, setPlaybackPosition] = useState({});
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showUnmatchModal, setShowUnmatchModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMessageForReaction, setSelectedMessageForReaction] = useState(null);
  const [reactionMenuPosition, setReactionMenuPosition] = useState({ x: 0, y: 0 });
  const [replyingTo, setReplyingTo] = useState(null);
  const replyBarAnim = useRef(new Animated.Value(0)).current;
  const messageBubbleRefs = useRef({});
  const messageSwipeAnimations = useRef({});
  const profileModalTranslateX = useRef(new Animated.Value(0)).current;
  const messageAnimations = useRef({});
  const typingDot1Anim = useRef(new Animated.Value(0.4)).current;
  const typingDot2Anim = useRef(new Animated.Value(0.4)).current;
  const typingDot3Anim = useRef(new Animated.Value(0.4)).current;
  const messageRefs = useRef({});
  const listRef = useRef(null);
  const recordingRef = useRef(null);
  const waveformTimerRef = useRef(null);
  const playbackRef = useRef(null);
  const recordingBusyRef = useRef(false);
  const preloadedSoundRef = useRef(null);
  const recordingAnim = useRef(new Animated.Value(0)).current;

  const participant = useMemo(
    () => ({
      name: 'Maya',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
      status: 'Active now',
      age: 28,
      bio: 'I love exploring new places, trying different cuisines, and having deep conversations. Looking for someone who values authenticity and meaningful connections.',
      photos: [
        { uri: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1' },
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
      vibeTag: 'Deep & Thoughtful',
      ...routeParams.participant,
    }),
    [routeParams.participant]
  );

  const messages = useMemo(() => {
    if (routeParams.messages && Array.isArray(routeParams.messages)) {
      return routeParams.messages;
    }
    return [
      { id: 'm1', from: 'them', text: 'Still thinking about that rooftop sunset.', timestamp: '9:41 PM' },
      { id: 'm2', from: 'me', text: 'We never even captured a photo. Want to recreate it this weekend?', timestamp: '9:42 PM' },
      { id: 'm3', from: 'them', text: "Absolutely. I'll bring the disposable camera.", timestamp: '9:44 PM' },
      { id: 'm4', from: 'me', text: "Love it. I'll scout a spot with a better skyline view.", timestamp: '9:45 PM' },
    ];
  }, [routeParams.messages]);

  // Pre-warm audio system on mount - this eliminates first-time delay
  useEffect(() => {
    let mounted = true;
    const warmUpAudio = async () => {
      try {
        // Request permission early
        await Audio.requestPermissionsAsync();
        // Set initial audio mode
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
        });
        if (mounted) setIsAudioReady(true);
      } catch (e) {
        console.warn('Audio warm-up error', e);
        if (mounted) setIsAudioReady(true);
      }
    };
    warmUpAudio();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    setChatMessages(messages);
  }, [messages]);

  // Typing indicator animation
  useEffect(() => {
    if (!isTyping) {
      typingDot1Anim.setValue(0.4);
      typingDot2Anim.setValue(0.4);
      typingDot3Anim.setValue(0.4);
      return;
    }
    
    const typingAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(typingDot1Anim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(typingDot2Anim, {
            toValue: 1,
            duration: 400,
            delay: 150,
            useNativeDriver: true,
          }),
          Animated.timing(typingDot3Anim, {
            toValue: 1,
            duration: 400,
            delay: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(typingDot1Anim, {
            toValue: 0.4,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(typingDot2Anim, {
            toValue: 0.4,
            duration: 400,
            delay: 150,
            useNativeDriver: true,
          }),
          Animated.timing(typingDot3Anim, {
            toValue: 0.4,
            duration: 400,
            delay: 300,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    
    typingAnimation.start();
    
    return () => {
      typingAnimation.stop();
      typingDot1Anim.setValue(0.4);
      typingDot2Anim.setValue(0.4);
      typingDot3Anim.setValue(0.4);
    };
  }, [isTyping, typingDot1Anim, typingDot2Anim, typingDot3Anim]);

  useEffect(() => {
    if (listRef.current && chatMessages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [chatMessages.length]);

  const stopWaveTimer = useCallback(() => {
    if (waveformTimerRef.current) {
      clearInterval(waveformTimerRef.current);
      waveformTimerRef.current = null;
    }
  }, []);

  const beginWaveTimer = useCallback(() => {
    stopWaveTimer();
    waveformTimerRef.current = setInterval(() => {
      setRecordingDuration((prev) => prev + 200);
      setRecordingWaveform((prev) => {
        const next = [...prev, 0.35 + Math.random() * 0.65];
        return next.length > MAX_WAVE_POINTS ? next.slice(-MAX_WAVE_POINTS) : next;
      });
    }, 200);
  }, [stopWaveTimer]);

  const stopPlayback = useCallback(async () => {
    if (playbackRef.current) {
      try {
        await playbackRef.current.stopAsync();
        await playbackRef.current.unloadAsync();
      } catch (e) {}
      playbackRef.current = null;
    }
    setActivePlaybackId(null);
  }, []);

  useEffect(() => {
    return () => {
      stopWaveTimer();
      stopPlayback();
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(() => {});
      }
      if (preloadedSoundRef.current) {
        preloadedSoundRef.current.unloadAsync().catch(() => {});
      }
    };
  }, [stopWaveTimer, stopPlayback]);

  // Reset profile modal animation when it closes
  useEffect(() => {
    if (!showProfileModal) {
      profileModalTranslateX.setValue(0);
    }
  }, [showProfileModal, profileModalTranslateX]);

  // Animate reply bar entrance/exit
  useEffect(() => {
    Animated.spring(replyBarAnim, {
      toValue: replyingTo ? 1 : 0,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();
  }, [replyingTo, replyBarAnim]);

  const isRecordingVisible = recordingState !== 'idle';

  useEffect(() => {
    Animated.timing(recordingAnim, {
      toValue: isRecordingVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isRecordingVisible, recordingAnim]);

  const handleSendText = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    hapticLight();
    
    const newMessage = {
      id: `local-${Date.now()}`,
      from: 'me',
      text: trimmed,
      timestamp: 'Just now',
      status: 'sent',
    };
    
    // Attach reply reference if replying
    if (replyingTo) {
      newMessage.replyTo = {
        id: replyingTo.id,
        from: replyingTo.from,
        text: replyingTo.text || (replyingTo.audio ? '🎤 Voice note' : replyingTo.image ? '📷 Photo' : ''),
      };
    }
    
    setChatMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    setReplyingTo(null);
  }, [inputValue, replyingTo]);

  const handlePickImage = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        hapticButtonPress();
        const imageUri = result.assets[0].uri;
        
        const newPhotoMessage = {
          id: `photo-${Date.now()}`,
          from: 'me',
          image: { uri: imageUri },
          timestamp: 'Just now',
          status: 'sent',
        };
        
        // Attach reply reference if replying
        if (replyingTo) {
          newPhotoMessage.replyTo = {
            id: replyingTo.id,
            from: replyingTo.from,
            text: replyingTo.text || (replyingTo.audio ? '🎤 Voice note' : replyingTo.image ? '📷 Photo' : ''),
          };
        }
        
        setChatMessages((prev) => [...prev, newPhotoMessage]);
        setReplyingTo(null);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  }, [replyingTo]);

  const handleMessageLongPress = useCallback((item, event) => {
    hapticSelection();
    
    // Show reaction menu for all messages
    const bubbleRef = messageBubbleRefs.current[item.id];
    if (bubbleRef) {
      bubbleRef.measureInWindow((x, y, width, height) => {
        setSelectedMessageForReaction(item);
        // Position menu at left side of bubble, below it
        const menuWidth = 220;
        const xPos = Math.max(20, Math.min(x, WINDOW_WIDTH - menuWidth - 20));
        const yPos = Math.min(y + height + 8, Dimensions.get('window').height - 100);
        setReactionMenuPosition({ x: xPos, y: yPos });
      });
    } else {
      // Fallback to touch position if ref not available
      const { pageX, pageY } = event.nativeEvent;
      setSelectedMessageForReaction(item);
      const menuWidth = 220;
      const x = Math.max(20, Math.min(pageX - menuWidth / 2, WINDOW_WIDTH - menuWidth - 20));
      const y = Math.min(pageY + 30, Dimensions.get('window').height - 100);
      setReactionMenuPosition({ x, y });
    }
  }, []);

  const handleAddReaction = useCallback((messageId, reaction) => {
    hapticButtonPress();
    setChatMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, reaction } : msg
      )
    );
    setSelectedMessageForReaction(null);
  }, []);

  const reactions = ['❤️', '😊', '👍', '🔥', '💯'];

  // Get or create swipe animation for a message
  const getMessageSwipeAnim = useCallback((messageId) => {
    if (!messageSwipeAnimations.current[messageId]) {
      messageSwipeAnimations.current[messageId] = new Animated.Value(0);
    }
    return messageSwipeAnimations.current[messageId];
  }, []);

  // Create pan responder for message swipe
  const createMessagePanResponder = useCallback((item) => {
    const swipeAnim = getMessageSwipeAnim(item.id);
    
    return PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only respond to horizontal swipes to the right
        return gestureState.dx > 10 && Math.abs(gestureState.dy) < 30;
      },
      onPanResponderGrant: () => {
        swipeAnim.setOffset(swipeAnim._value);
        swipeAnim.setValue(0);
      },
      onPanResponderMove: (evt, gestureState) => {
        // Only allow rightward swipe with easing
        if (gestureState.dx > 0) {
          const dampedSwipe = Math.min(gestureState.dx * 0.8, MAX_SWIPE);
          swipeAnim.setValue(dampedSwipe);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        swipeAnim.flattenOffset();
        
        if (gestureState.dx >= SWIPE_THRESHOLD) {
          // Trigger reply
          hapticButtonPress();
          setReplyingTo(item);
          inputRef.current?.focus();
        }
        
        // Spring back to original position
        Animated.spring(swipeAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 10,
        }).start();
      },
      onPanResponderTerminate: () => {
        swipeAnim.flattenOffset();
        Animated.spring(swipeAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 10,
        }).start();
      },
    });
  }, [getMessageSwipeAnim]);

  // Store pan responders for each message
  const messagePanResponders = useRef({});
  
  const getMessagePanResponder = useCallback((item) => {
    if (!messagePanResponders.current[item.id]) {
      messagePanResponders.current[item.id] = createMessagePanResponder(item);
    }
    return messagePanResponders.current[item.id];
  }, [createMessagePanResponder]);

  // Cancel reply mode
  const cancelReply = useCallback(() => {
    setReplyingTo(null);
  }, []);

  // Fast recording start - show UI immediately, prepare in background
  const startRecording = useCallback(async () => {
    if (recordingState !== 'idle' || recordingBusyRef.current) return;
    recordingBusyRef.current = true;

    // Clear reply when starting to record
    setReplyingTo(null);

    // Show recording UI immediately for perceived speed
    setRecordingState('capturing');
    setRecordedClip(null);
    setRecordingDuration(0);
    setRecordingWaveform(generateWaveform(18));
    beginWaveTimer();

    try {
      // Set audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Clean up any existing recording
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync().catch(() => {});
        recordingRef.current = null;
      }

      const recording = new Audio.Recording();
      // Use faster/lighter recording preset
      await recording.prepareToRecordAsync(FAST_RECORDING_OPTIONS);
      await recording.startAsync();
      recordingRef.current = recording;
    } catch (error) {
      console.error('recording start error', error);
      stopWaveTimer();
      setRecordingState('idle');
    }
    recordingBusyRef.current = false;
  }, [recordingState, beginWaveTimer, stopWaveTimer]);

  const finishRecording = useCallback(async () => {
    if (!recordingRef.current) return null;
    
    stopWaveTimer();
    
    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      const status = await recordingRef.current.getStatusAsync();
      recordingRef.current = null;
      
      // Switch to playback mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });
      
      if (!uri) return null;
      
      const clip = {
        uri,
        duration: status?.durationMillis || recordingDuration,
        waveform: [...recordingWaveform],
      };

      // Preload the sound for instant preview playback
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri },
          { progressUpdateIntervalMillis: 100 }
        );
        preloadedSoundRef.current = sound;
      } catch (e) {
        console.warn('Preload error', e);
      }
      
      return clip;
    } catch (error) {
      console.error('finish recording error', error);
      return null;
    }
  }, [recordingDuration, recordingWaveform, stopWaveTimer]);

  const pauseRecording = useCallback(async () => {
    if (recordingState !== 'capturing') return;
    
    const clip = await finishRecording();
    if (!clip) {
      setRecordingState('idle');
      return;
    }
    
    setRecordedClip(clip);
    setPlaybackProgress((prev) => ({ ...prev, preview: 0 }));
    setPlaybackPosition((prev) => ({ ...prev, preview: 0 }));
    setRecordingState('preview');
  }, [finishRecording, recordingState]);

  const handleCancelRecording = useCallback(async () => {
    if (recordingState === 'idle') return;
    
    stopWaveTimer();
    await stopPlayback();
    
    if (recordingRef.current) {
      await recordingRef.current.stopAndUnloadAsync().catch(() => {});
      recordingRef.current = null;
    }
    
    if (preloadedSoundRef.current) {
      await preloadedSoundRef.current.unloadAsync().catch(() => {});
      preloadedSoundRef.current = null;
    }
    
    setRecordedClip(null);
    setPlaybackProgress({});
    setPlaybackPosition({});
    setRecordingState('idle');
    setRecordingWaveform(generateWaveform(18));
    setRecordingDuration(0);
  }, [recordingState, stopWaveTimer, stopPlayback]);

  const handleRetakeRecording = useCallback(async () => {
    await stopPlayback();
    if (preloadedSoundRef.current) {
      await preloadedSoundRef.current.unloadAsync().catch(() => {});
      preloadedSoundRef.current = null;
    }
    setRecordedClip(null);
    setPlaybackProgress({});
    setPlaybackPosition({});
    setRecordingState('idle');
    setRecordingWaveform(generateWaveform(18));
    setRecordingDuration(0);
    setTimeout(() => startRecording(), 50);
  }, [startRecording, stopPlayback]);

  const handleSendVoiceNote = useCallback(async () => {
    if (!recordedClip?.uri) return;
    
    await stopPlayback();
    if (preloadedSoundRef.current) {
      await preloadedSoundRef.current.unloadAsync().catch(() => {});
      preloadedSoundRef.current = null;
    }
    
    const newVoiceMessage = {
      id: `voice-${Date.now()}`,
      from: 'me',
      audio: { ...recordedClip, waveform: [...recordedClip.waveform] },
      timestamp: 'Now',
    };
    
    // Note: Voice notes don't typically carry reply context since recording clears it
    // But we could support it in the future by preserving replyingTo before recording
    
    setChatMessages((prev) => [...prev, newVoiceMessage]);
    
    setRecordedClip(null);
    setPlaybackProgress({});
    setPlaybackPosition({});
    setRecordingState('idle');
    setRecordingWaveform(generateWaveform(18));
    setRecordingDuration(0);
  }, [recordedClip, stopPlayback]);

  // Instant preview playback using preloaded sound
  const handlePreviewPlayback = useCallback(async () => {
    if (!recordedClip?.uri) return;
    
    // If already playing preview, stop it
    if (activePlaybackId === 'preview') {
      await stopPlayback();
      setPlaybackProgress((prev) => ({ ...prev, preview: 0 }));
      setPlaybackPosition((prev) => ({ ...prev, preview: 0 }));
      return;
    }
    
    await stopPlayback();
    
    try {
      let sound = preloadedSoundRef.current;
      
      // If preloaded sound exists, check if it's loaded
      if (sound) {
        try {
          const status = await sound.getStatusAsync();
          if (!status.isLoaded) {
            // Sound is not loaded, unload and recreate
            await sound.unloadAsync().catch(() => {});
            sound = null;
            preloadedSoundRef.current = null;
          }
        } catch (e) {
          // Error checking status, recreate
          sound = null;
          preloadedSoundRef.current = null;
        }
      }
      
      // If no preloaded sound or it was unloaded, create one
      if (!sound) {
        const result = await Audio.Sound.createAsync(
          { uri: recordedClip.uri },
          { progressUpdateIntervalMillis: 100 }
        );
        sound = result.sound;
        preloadedSoundRef.current = sound;
      }
      
      // Set up status callback
      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;
        if (status.didJustFinish) {
          setActivePlaybackId(null);
          setPlaybackProgress((prev) => ({ ...prev, preview: 0 }));
          setPlaybackPosition((prev) => ({ ...prev, preview: 0 }));
          sound.setPositionAsync(0).catch(() => {});
          return;
        }
        if (status.durationMillis > 0) {
          setPlaybackProgress((prev) => ({ ...prev, preview: status.positionMillis / status.durationMillis }));
          setPlaybackPosition((prev) => ({ ...prev, preview: status.positionMillis }));
        }
      });
      
      playbackRef.current = sound;
      setActivePlaybackId('preview');
      setPlaybackProgress((prev) => ({ ...prev, preview: 0 }));
      setPlaybackPosition((prev) => ({ ...prev, preview: 0 }));
      
      // Reset position and play
      await sound.setPositionAsync(0);
      await sound.playAsync();
    } catch (error) {
      console.error('preview playback error', error);
      setActivePlaybackId(null);
    }
  }, [activePlaybackId, recordedClip, stopPlayback]);

  // Fast playback for chat voice notes
  const playAudio = useCallback(async (id, uri) => {
    if (!uri) return;
    
    if (activePlaybackId === id) {
      await stopPlayback();
      setPlaybackProgress((prev) => ({ ...prev, [id]: 0 }));
      setPlaybackPosition((prev) => ({ ...prev, [id]: 0 }));
      return;
    }
    
    await stopPlayback();
    
    // Show playing state immediately
    setActivePlaybackId(id);
    setPlaybackProgress((prev) => ({ ...prev, [id]: 0 }));
    setPlaybackPosition((prev) => ({ ...prev, [id]: 0 }));
    
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true, progressUpdateIntervalMillis: 100 },
        (status) => {
          if (!status.isLoaded) return;
          if (status.didJustFinish) {
            setActivePlaybackId(null);
            setPlaybackProgress((prev) => ({ ...prev, [id]: 0 }));
            setPlaybackPosition((prev) => ({ ...prev, [id]: 0 }));
            sound.unloadAsync().catch(() => {});
            if (playbackRef.current === sound) playbackRef.current = null;
            return;
          }
          if (status.durationMillis > 0) {
            setPlaybackProgress((prev) => ({ ...prev, [id]: status.positionMillis / status.durationMillis }));
            setPlaybackPosition((prev) => ({ ...prev, [id]: status.positionMillis }));
          }
        }
      );
      playbackRef.current = sound;
    } catch (error) {
      console.error('playback error', error);
      setActivePlaybackId(null);
    }
  }, [activePlaybackId, stopPlayback]);

  const handleVoicePlayback = useCallback((message) => {
    if (!message?.audio?.uri) return;
    playAudio(message.id, message.audio.uri);
  }, [playAudio]);

  const composerOpacity = recordingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  
  const recordingTranslateX = recordingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-WINDOW_WIDTH, 0],
  });

  const renderWaveform = useCallback((data, variant = 'dark', progress = 0) => {
    const total = data.length || 1;
    const filledCount = Math.floor(progress * total);
    
    return (
      <View style={styles.waveformRow}>
        {data.map((value, index) => (
          <View
            key={index}
            style={[
              styles.waveformBar,
              variant === 'light' ? styles.waveformBarLight : styles.waveformBarDark,
              index < filledCount && (variant === 'light' ? styles.waveformBarLightFilled : styles.waveformBarDarkFilled),
              { height: 6 + value * 26 },
            ]}
          />
        ))}
      </View>
    );
  }, []);

  const renderMessage = useCallback(({ item }) => {
    const isMine = item.from === 'me';
    const swipeAnim = getMessageSwipeAnim(item.id);
    const panResponder = getMessagePanResponder(item);
    
    // Calculate reply indicator animations based on swipe progress
    const replyIndicatorOpacity = swipeAnim.interpolate({
      inputRange: [0, SWIPE_THRESHOLD / 2, SWIPE_THRESHOLD],
      outputRange: [0, 0.6, 1],
      extrapolate: 'clamp',
    });
    
    const replyIndicatorScale = swipeAnim.interpolate({
      inputRange: [0, SWIPE_THRESHOLD * 0.6, SWIPE_THRESHOLD],
      outputRange: [0.5, 0.85, 1.1],
      extrapolate: 'clamp',
    });
    
    const replyIndicatorRotate = swipeAnim.interpolate({
      inputRange: [0, SWIPE_THRESHOLD],
      outputRange: ['-45deg', '0deg'],
      extrapolate: 'clamp',
    });

    // Render reply preview if this message is replying to another
    const renderReplyPreview = () => {
      if (!item.replyTo) return null;
      const isReplyToMe = item.replyTo.from === 'me';
      return (
        <TouchableOpacity 
          style={[styles.replyPreviewInMessage, isMine ? styles.replyPreviewInMessageMine : styles.replyPreviewInMessageTheirs]}
          activeOpacity={0.7}
        >
          <View style={[styles.replyPreviewBar, isMine ? styles.replyPreviewBarMine : styles.replyPreviewBarTheirs]} />
          <View style={styles.replyPreviewContent}>
            <Text style={[styles.replyPreviewName, isMine ? styles.replyPreviewNameMine : styles.replyPreviewNameTheirs]}>
              {isReplyToMe ? 'You' : participant.name}
            </Text>
            <Text 
              style={[styles.replyPreviewText, isMine ? styles.replyPreviewTextMine : styles.replyPreviewTextTheirs]}
              numberOfLines={1}
            >
              {item.replyTo.text}
            </Text>
          </View>
        </TouchableOpacity>
      );
    };

    if (item.audio) {
      const progress = activePlaybackId === item.id ? (playbackProgress[item.id] || 0) : 0;
      const position = activePlaybackId === item.id ? (playbackPosition[item.id] || 0) : 0;
      const isPlaying = activePlaybackId === item.id;
      
      // Show current position when playing, total duration when not playing
      const displayTime = isPlaying ? formatDuration(position) : formatDuration(item.audio.duration);
      
      return (
        <View style={styles.swipeMessageContainer}>
          {/* Reply indicator */}
          <Animated.View 
            style={[
              styles.swipeReplyIndicator,
              isMine ? styles.swipeReplyIndicatorMine : styles.swipeReplyIndicatorTheirs,
              { 
                opacity: replyIndicatorOpacity, 
                transform: [
                  { scale: replyIndicatorScale },
                  { rotate: replyIndicatorRotate }
                ] 
              }
            ]}
          >
            <Feather name="corner-up-left" size={18} color="#1E1E24" />
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.swipeMessageInner, 
              isMine ? styles.swipeMessageInnerMine : styles.swipeMessageInnerTheirs,
              { transform: [{ translateX: swipeAnim }] }
            ]}
            {...panResponder.panHandlers}
          >
            <View style={styles.voiceContent}>
              {renderReplyPreview()}
              <View style={[styles.voiceBubble, isMine ? styles.voiceBubbleMine : styles.voiceBubbleTheirs]}>
                <TouchableOpacity
                  style={[styles.voicePlayButton, isMine && styles.voicePlayButtonMine]}
                  onPress={() => {
                    hapticSelection();
                    handleVoicePlayback(item);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.voicePlayIcon, isMine && styles.voicePlayIconLight]}>
                    {isPlaying ? '❚❚' : '▶'}
                  </Text>
                </TouchableOpacity>
                <View style={styles.voiceWaveformContent}>
                  <View style={styles.voiceWaveformWrapper}>
                    {renderWaveform(item.audio.waveform || generateWaveform(20), isMine ? 'light' : 'dark', progress)}
                  </View>
                  <Text style={[styles.voiceDuration, isMine ? styles.voiceDurationLight : styles.voiceDurationDark]}>
                    {displayTime}
                  </Text>
                </View>
              </View>
              <Text style={[styles.messageTime, isMine ? styles.timeMine : styles.timeTheirs]}>{item.timestamp}</Text>
            </View>
          </Animated.View>
        </View>
      );
    }

    if (item.image) {
      return (
        <View style={styles.swipeMessageContainer}>
          {/* Reply indicator */}
          <Animated.View 
            style={[
              styles.swipeReplyIndicator,
              isMine ? styles.swipeReplyIndicatorMine : styles.swipeReplyIndicatorTheirs,
              { 
                opacity: replyIndicatorOpacity, 
                transform: [
                  { scale: replyIndicatorScale },
                  { rotate: replyIndicatorRotate }
                ] 
              }
            ]}
          >
            <Feather name="corner-up-left" size={18} color="#1E1E24" />
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.swipeMessageInner, 
              isMine ? styles.swipeMessageInnerMine : styles.swipeMessageInnerTheirs,
              { transform: [{ translateX: swipeAnim }] }
            ]}
            {...panResponder.panHandlers}
          >
            <TouchableOpacity
              ref={(ref) => {
                if (ref) messageBubbleRefs.current[item.id] = ref;
              }}
              onLongPress={(e) => handleMessageLongPress(item, e)}
              activeOpacity={0.9}
              style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleTheirs, styles.imageBubble, item.replyTo && styles.imageBubbleWithReply]}
            >
              {renderReplyPreview()}
              <Image source={{ uri: item.image.uri }} style={styles.messageImage} resizeMode="cover" />
              {item.reaction && (
                <View style={[styles.reactionBadge, isMine ? styles.reactionBadgeMine : styles.reactionBadgeTheirs]}>
                  <Text style={styles.reactionText}>{item.reaction}</Text>
                </View>
              )}
              <View style={styles.messageFooter}>
                <Text style={[styles.messageTime, isMine ? styles.timeMine : styles.timeTheirs]}>
                  {formatRelativeTime(item.timestamp)}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      );
    }

    return (
      <View style={styles.swipeMessageContainer}>
        {/* Reply indicator */}
        <Animated.View 
          style={[
            styles.swipeReplyIndicator,
            isMine ? styles.swipeReplyIndicatorMine : styles.swipeReplyIndicatorTheirs,
            { 
              opacity: replyIndicatorOpacity, 
              transform: [
                { scale: replyIndicatorScale },
                { rotate: replyIndicatorRotate }
              ] 
            }
          ]}
        >
          <Feather name="corner-up-left" size={18} color="#1E1E24" />
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.swipeMessageInner, 
            isMine ? styles.swipeMessageInnerMine : styles.swipeMessageInnerTheirs,
            { transform: [{ translateX: swipeAnim }] }
          ]}
          {...panResponder.panHandlers}
        >
          <TouchableOpacity
            ref={(ref) => {
              if (ref) messageBubbleRefs.current[item.id] = ref;
            }}
            onLongPress={(e) => handleMessageLongPress(item, e)}
            activeOpacity={0.9}
            style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleTheirs, item.replyTo && styles.bubbleWithReply]}
          >
            {renderReplyPreview()}
            <Text style={[styles.messageText, isMine && styles.messageTextMine]}>{item.text}</Text>
            {item.reaction && (
              <View style={[styles.reactionBadge, isMine ? styles.reactionBadgeMine : styles.reactionBadgeTheirs]}>
                <Text style={styles.reactionText}>{item.reaction}</Text>
              </View>
            )}
            <View style={styles.messageFooter}>
              <Text style={[styles.messageTime, isMine ? styles.timeMine : styles.timeTheirs]}>
                {formatRelativeTime(item.timestamp)}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }, [activePlaybackId, playbackProgress, playbackPosition, handleVoicePlayback, renderWaveform, handleMessageLongPress, participant.name, getMessageSwipeAnim, getMessagePanResponder]);

  const handleArchive = useCallback(() => {
    setShowMenu(false);
    // TODO: Implement archive functionality
    console.log('Archive conversation');
  }, []);

  const unmatchReasons = [
    'Not interested',
    'Inappropriate behavior',
    'Spam or fake profile',
    'Found someone else',
    'Other',
  ];

  const handleUnmatchClick = useCallback(() => {
    setShowMenu(false);
    setShowUnmatchModal(true);
    setSelectedReason(null);
  }, []);

  const handleConfirmUnmatch = useCallback(() => {
    if (!selectedReason) return;
    
    // TODO: Implement unmatch functionality with selected reason
    console.log('Unmatch user with reason:', selectedReason);
    
    setShowUnmatchModal(false);
    setSelectedReason(null);
    // Navigate back after unmatch
    navigation.goBack();
  }, [selectedReason, navigation]);

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
        <Text style={styles.backIcon}>‹</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.headerAvatarWrapper} 
        activeOpacity={0.8}
        onPress={() => setShowProfileModal(true)}
      >
        <Image source={{ uri: participant.avatar }} style={styles.headerAvatar} />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.headerInfo}
        onPress={() => setShowProfileModal(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.headerName, { color: colors.textPrimary }]}>{participant.name}</Text>
        <Text style={styles.headerStatus}>{participant.status}</Text>
      </TouchableOpacity>
      <View style={styles.headerActions}>
        <TouchableOpacity 
          style={styles.headerIcon}
          onPress={() => setShowMenu(!showMenu)}
          activeOpacity={0.7}
        >
          <Text style={styles.headerIconText}>⋯</Text>
        </TouchableOpacity>
        {showMenu && (
          <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleArchive}
              activeOpacity={0.7}
            >
              <Text style={styles.menuItemText}>Archive</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleUnmatchClick}
              activeOpacity={0.7}
            >
              <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>Unmatch</Text>
        </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  // Render reply bar above composer
  const renderReplyBar = () => {
    if (!replyingTo) return null;
    
    const isReplyToMe = replyingTo.from === 'me';
    const replyText = replyingTo.text || (replyingTo.audio ? '🎤 Voice note' : replyingTo.image ? '📷 Photo' : '');
    
    const replyBarTranslateY = replyBarAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [60, 0],
    });
    
    const replyBarOpacity = replyBarAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    
    return (
      <Animated.View 
        style={[
          styles.replyBarContainer,
          { 
            transform: [{ translateY: replyBarTranslateY }],
            opacity: replyBarOpacity,
          }
        ]}
      >
        <View style={styles.replyBarContent}>
          <View style={styles.replyBarLeft}>
            <View style={styles.replyBarAccent} />
            <View style={styles.replyBarTextContainer}>
              <Text style={styles.replyBarName}>
                Replying to {isReplyToMe ? 'yourself' : participant.name}
              </Text>
              <Text style={styles.replyBarText} numberOfLines={1}>
                {replyText}
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.replyBarClose}
            onPress={cancelReply}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Feather name="x" size={18} color="#6F6F6F" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  const renderComposer = () => (
    <View style={styles.composerOuterContainer}>
      {renderReplyBar()}
      <View style={styles.composerContainer}>
        <TouchableOpacity
          style={[styles.voiceButton, recordingState !== 'idle' && styles.voiceButtonRecording]}
          activeOpacity={0.6}
          onPress={startRecording}
          disabled={recordingState !== 'idle'}
        >
          <Feather
            name="mic"
            size={20}
            color={recordingState !== 'idle' ? '#FFFFFF' : '#6F6F6F'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.photoButton}
          onPress={handlePickImage}
          activeOpacity={0.6}
        >
          <Ionicons name="image-outline" size={20} color="#6F6F6F" />
        </TouchableOpacity>
        <View style={styles.inputWrapper}>
          <TextInput
            ref={inputRef}
            placeholder={replyingTo ? `Reply to ${replyingTo.from === 'me' ? 'yourself' : participant.name}...` : "Send a spark..."}
            placeholderTextColor="#B2B2BA"
            style={styles.textInput}
            multiline
            value={inputValue}
            onChangeText={setInputValue}
            returnKeyType="send"
            onSubmitEditing={handleSendText}
          />
        </View>
        <TouchableOpacity
          style={[styles.sendButton, !inputValue.trim() && styles.sendButtonDisabled]}
          activeOpacity={0.7}
          onPress={handleSendText}
          disabled={!inputValue.trim()}
        >
          <Text style={styles.sendIcon}>↑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRecordingPanel = () => {
    if (recordingState === 'idle') return <View style={styles.recordingPanel} />;

    const isPreview = recordingState === 'preview';
    const previewProgress = isPreview && activePlaybackId === 'preview' ? (playbackProgress.preview || 0) : 0;
    const previewPosition = isPreview && activePlaybackId === 'preview' ? (playbackPosition.preview || 0) : 0;
    const isPreviewPlaying = activePlaybackId === 'preview';
    const waveformData = isPreview ? (recordedClip?.waveform || generateWaveform(24)) : recordingWaveform;
    
    // Show current position when playing, total duration when not playing
    const displayTime = isPreview 
      ? (isPreviewPlaying ? formatDuration(previewPosition) : formatDuration(recordedClip?.duration))
      : formatDuration(recordingDuration);

    return (
      <View style={styles.recordingPanel}>
        <View style={styles.recordingTopRow}>
          <TouchableOpacity style={styles.recordingClose} onPress={handleCancelRecording} activeOpacity={0.7}>
            <Text style={styles.recordingCloseIcon}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.recordingTimer}>
            {displayTime}
          </Text>
          {isPreview ? (
            <TouchableOpacity style={styles.recordingRetake} onPress={handleRetakeRecording} activeOpacity={0.7}>
              <Text style={styles.recordingRetakeText}>Retake</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.recordingSpacer} />
          )}
        </View>
        <View style={styles.recordingWaveform}>
          {renderWaveform(waveformData, 'dark', previewProgress)}
        </View>
        <View style={styles.recordingActions}>
          {recordingState === 'capturing' ? (
            <TouchableOpacity style={styles.recordingPauseButton} onPress={pauseRecording} activeOpacity={0.7}>
              <Text style={styles.recordingPauseText}>Pause</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.previewPlayButton, isPreviewPlaying && styles.previewPlayButtonActive]}
                onPress={handlePreviewPlayback}
                activeOpacity={0.7}
              >
                <Text style={[styles.previewPlayIcon, isPreviewPlaying && styles.previewPlayIconActive]}>
                  {isPreviewPlaying ? '❚❚' : '▶'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.recordingSendButton} onPress={handleSendVoiceNote} activeOpacity={0.7}>
                <Text style={styles.recordingSendText}>Send</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  };

  const renderComposerSection = () => (
    <View style={styles.composerWrapper}>
      <Animated.View style={[styles.composerAnimated, { opacity: composerOpacity }]} pointerEvents={isRecordingVisible ? 'none' : 'auto'}>
        {renderComposer()}
      </Animated.View>
      <Animated.View
        style={[styles.recordingOverlay, { transform: [{ translateX: recordingTranslateX }], opacity: recordingAnim }]}
        pointerEvents={isRecordingVisible ? 'auto' : 'none'}
      >
        {renderRecordingPanel()}
      </Animated.View>
    </View>
  );

  const renderUnmatchModal = () => {
    if (!showUnmatchModal) return null;

    return (
      <Modal
        visible={showUnmatchModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowUnmatchModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => setShowUnmatchModal(false)}>
            <View style={styles.modalBackdrop} />
          </TouchableWithoutFeedback>
          <View style={styles.unmatchModalContainer}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Why are you unmatching?</Text>
              <Text style={styles.modalSubtitle}>Help us improve your experience</Text>
            </View>
            
            <ScrollView style={styles.reasonsList} showsVerticalScrollIndicator={false}>
              {unmatchReasons.map((reason) => (
                <TouchableOpacity
                  key={reason}
                  style={[
                    styles.reasonItem,
                    selectedReason === reason && styles.reasonItemSelected,
                  ]}
                  onPress={() => setSelectedReason(reason)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.radioButton,
                    selectedReason === reason && styles.radioButtonSelected,
                  ]}>
                    {selectedReason === reason && <View style={styles.radioButtonInner} />}
                  </View>
                  <Text style={[
                    styles.reasonText,
                    selectedReason === reason && styles.reasonTextSelected,
                  ]}>
                    {reason}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[
                  styles.unmatchButton,
                  !selectedReason && styles.unmatchButtonDisabled,
                ]}
                onPress={handleConfirmUnmatch}
                disabled={!selectedReason}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.unmatchButtonText,
                  !selectedReason && styles.unmatchButtonTextDisabled,
                ]}>
                  Unmatch
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const profilePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        // Only respond to swipes starting from the left edge (first 50px)
        return evt.nativeEvent.pageX < 50;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only respond if swiping right from left edge
        return evt.nativeEvent.pageX < 50 && gestureState.dx > 10;
      },
      onPanResponderGrant: () => {
        profileModalTranslateX.setOffset(profileModalTranslateX._value);
        profileModalTranslateX.setValue(0);
      },
      onPanResponderMove: (evt, gestureState) => {
        // Only allow rightward swipe (positive dx)
        if (gestureState.dx > 0) {
          profileModalTranslateX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        profileModalTranslateX.flattenOffset();
        const swipeThreshold = WINDOW_WIDTH * 0.3;
        
        if (gestureState.dx > swipeThreshold || gestureState.vx > 0.5) {
          // Swipe right to dismiss
          Animated.timing(profileModalTranslateX, {
            toValue: WINDOW_WIDTH,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            setShowProfileModal(false);
            profileModalTranslateX.setValue(0);
          });
        } else {
          // Spring back
          Animated.spring(profileModalTranslateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 8,
          }).start();
        }
      },
    })
  ).current;

  const renderReactionMenu = () => {
    if (!selectedMessageForReaction) return null;

    return (
      <Modal
        visible={!!selectedMessageForReaction}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedMessageForReaction(null)}
      >
        <TouchableWithoutFeedback onPress={() => setSelectedMessageForReaction(null)}>
          <View style={styles.reactionMenuOverlay}>
            <View style={[
              styles.reactionMenu,
              {
                position: 'absolute',
                left: reactionMenuPosition.x,
                top: reactionMenuPosition.y,
              }
            ]}>
              {reactions.map((reaction) => (
                <TouchableOpacity
                  key={reaction}
                  style={styles.reactionButton}
                  onPress={() => handleAddReaction(selectedMessageForReaction.id, reaction)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.reactionButtonText}>{reaction}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };


  const renderProfileModal = () => {
    if (!showProfileModal) return null;

    const profileData = participant;

    return (
      <Modal
        visible={showProfileModal}
        animationType="slide"
        onRequestClose={() => setShowProfileModal(false)}
      >
        <View style={profileModalStyles.container}>
          <Animated.View
            style={[
              profileModalStyles.wrapper,
              {
                transform: [{ translateX: profileModalTranslateX }],
              },
            ]}
            {...profilePanResponder.panHandlers}
          >
            <ScrollView
              style={profileModalStyles.scrollView}
              contentContainerStyle={profileModalStyles.contentContainer}
              showsVerticalScrollIndicator={false}
            >
              {/* SECTION 1: Hero Photo */}
              <View style={profileModalStyles.heroSection}>
                <Image
                  source={{ uri: profileData.photos?.[0]?.uri || profileData.avatar }}
                  style={profileModalStyles.heroImage}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0, 0, 0, 0.7)']}
                  style={profileModalStyles.heroGradient}
                />
                <TouchableOpacity
                  style={profileModalStyles.heroBackButton}
                  onPress={() => setShowProfileModal(false)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
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
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={globalStyles.content}>
        <View style={styles.container}>
          {renderHeader()}
          {showMenu && (
            <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
              <View style={styles.menuOverlay} />
            </TouchableWithoutFeedback>
          )}
          {chatMessages.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateEmoji}>💬</Text>
              <Text style={styles.emptyStateTitle}>Start the conversation</Text>
              <Text style={styles.emptyStateSubtitle}>
                Send a message or voice note to {participant.name} to begin
              </Text>
            </View>
          ) : (
          <FlatList
            ref={listRef}
            data={chatMessages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.messagesList}
            style={styles.messagesListWrapper}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
              ListFooterComponent={
                isTyping ? (
                  <View style={[styles.messageRow, styles.messageRowTheirs]}>
                    <View style={[styles.bubble, styles.bubbleTheirs, styles.typingBubble]}>
                      <View style={styles.typingIndicator}>
                        <Animated.View
                          style={[
                            styles.typingDot,
                            {
                              opacity: typingDot1Anim,
                              transform: [
                                {
                                  scale: typingDot1Anim.interpolate({
                                    inputRange: [0.4, 1],
                                    outputRange: [0.8, 1],
                                  }),
                                },
                              ],
                            },
                          ]}
                        />
                        <Animated.View
                          style={[
                            styles.typingDot,
                            {
                              opacity: typingDot2Anim,
                              transform: [
                                {
                                  scale: typingDot2Anim.interpolate({
                                    inputRange: [0.4, 1],
                                    outputRange: [0.8, 1],
                                  }),
                                },
                              ],
                            },
                          ]}
                        />
                        <Animated.View
                          style={[
                            styles.typingDot,
                            {
                              opacity: typingDot3Anim,
                              transform: [
                                {
                                  scale: typingDot3Anim.interpolate({
                                    inputRange: [0.4, 1],
                                    outputRange: [0.8, 1],
                                  }),
                                },
                              ],
                            },
                          ]}
                        />
                      </View>
                    </View>
                  </View>
                ) : null
              }
            />
          )}
          {renderComposerSection()}
        </View>
        {renderUnmatchModal()}
        {renderProfileModal()}
        {renderReactionMenu()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});

ConversationScreen.displayName = 'ConversationScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    columnGap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  backIcon: {
    fontSize: 20,
    color: '#2E2E35',
  },
  headerAvatarWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    marginRight: 12,
  },
  headerAvatar: {
    width: '100%',
    height: '100%',
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 20,
    fontWeight: '600',
  },
  headerStatus: {
    fontSize: 13,
    color: '#9E9EA6',
    marginTop: 2,
  },
  headerActions: {
    marginLeft: 8,
    alignItems: 'flex-end',
  },
  headerIcon: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#ECECEC',
  },
  headerIconText: {
    fontSize: 18,
    color: '#4A4A52',
  },
    menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    },
    menuContainer: {
    position: 'absolute',
    top: 50,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 6,
    minWidth: 140,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    zIndex: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E8E8ED',
    },
    menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    },
    menuItemText: {
    fontSize: 15,
    color: '#2E2E35',
    fontWeight: '500',
    },
    menuItemTextDanger: {
    color: '#E63946',
    },
  messagesList: {
    paddingVertical: 12,
    paddingBottom: 16,
    flexGrow: 1,
  },
  messagesListWrapper: {
    flex: 1,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  messageRowMine: {
    justifyContent: 'flex-end',
  },
  messageRowTheirs: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  bubbleMine: {
    borderBottomRightRadius: 4,
    backgroundColor: '#2A2A2F',
  },
  bubbleTheirs: {
    borderBottomLeftRadius: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E8E8ED',
  },
  bubbleWithReply: {
    minWidth: 220,
    flexShrink: 0,
  },
  messageText: {
    fontSize: 16,
    color: '#2F2F35',
  },
  messageTextMine: {
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 11,
    },
    messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    alignSelf: 'flex-end',
    gap: 4,
    },
  timeMine: {
    color: '#C4C4CA',
  },
  timeTheirs: {
    color: '#8F8F96',
  },
    emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
    },
    emptyStateEmoji: {
    fontSize: 64,
    marginBottom: 20,
    },
    emptyStateTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1E1E24',
    marginBottom: 8,
    textAlign: 'center',
    },
    emptyStateSubtitle: {
    fontSize: 15,
    color: '#6F6F6F',
    textAlign: 'center',
    lineHeight: 22,
    },
    typingBubble: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 60,
    },
    typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    },
    typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9E9EA6',
    },
  composerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: 12,
    paddingBottom: 16,
    gap: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ECECEE',
    backgroundColor: '#FFFFFF',
  },
  composerWrapper: {
    position: 'relative',
    minHeight: 90,
  },
  composerAnimated: {
    width: '100%',
  },
  recordingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8E8ED',
  },
  voiceButtonRecording: {
    backgroundColor: '#1E1E24',
    borderColor: '#1E1E24',
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  textInput: {
    fontSize: 16,
    color: '#1E1E24',
    maxHeight: 120,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E1E24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.3,
    backgroundColor: '#F4F4F5',
  },
  sendIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '400',
  },
  waveformRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flex: 1,
    gap: 3,
  },
  waveformBar: {
    width: 3,
    borderRadius: 2,
  },
  waveformBarDark: {
    backgroundColor: '#D6D7DE',
  },
  waveformBarDarkFilled: {
    backgroundColor: '#1E1E24',
  },
  waveformBarLight: {
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  waveformBarLightFilled: {
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  voiceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  voiceContent: {
    flex: 1,
    maxWidth: '80%',
  },
  voiceBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 22,
    gap: 12,
  },
  voiceBubbleMine: {
    backgroundColor: '#2A2A2F',
  },
  voiceBubbleTheirs: {
    backgroundColor: '#FFFFFF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E8E8ED',
  },
  voicePlayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1E1E24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voicePlayButtonMine: {
    borderColor: '#FFFFFF',
  },
  voicePlayIcon: {
    fontSize: 14,
    color: '#1E1E24',
    fontWeight: '700',
  },
  voicePlayIconLight: {
    color: '#FFFFFF',
  },
  voiceWaveformContent: {
    flex: 1,
    justifyContent: 'center',
  },
  voiceWaveformWrapper: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 4,
  },
  voiceDuration: {
    fontSize: 12,
    fontWeight: '600',
  },
  voiceDurationLight: {
    color: '#F5F5F5',
  },
  voiceDurationDark: {
    color: '#4A4A4F',
  },
  recordingPanel: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ECECEE',
  },
  recordingTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  recordingClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingCloseIcon: {
    fontSize: 18,
    color: '#2F2F35',
  },
  recordingTimer: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E2E35',
  },
  recordingRetake: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#F4F4F5',
  },
  recordingRetakeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2F2F35',
  },
  recordingSpacer: {
    width: 36,
  },
  recordingWaveform: {
    height: 48,
    marginBottom: 18,
    overflow: 'hidden',
  },
  recordingActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  recordingPauseButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: '#1E1E24',
    alignItems: 'center',
  },
  recordingPauseText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  previewPlayButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#D5D5DA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewPlayButtonActive: {
    backgroundColor: '#1E1E24',
    borderColor: '#1E1E24',
  },
  previewPlayIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E1E24',
  },
  previewPlayIconActive: {
    color: '#FFFFFF',
  },
  recordingSendButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: '#1E1E24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingSendText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
    modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    },
    unmatchModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    maxHeight: '80%',
    },
    modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D5D5DA',
    alignSelf: 'center',
    marginBottom: 20,
    },
    modalHeader: {
    paddingHorizontal: 20,
    marginBottom: 24,
    },
    modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E1E24',
    marginBottom: 8,
    },
    modalSubtitle: {
    fontSize: 15,
    color: '#6F6F6F',
    fontWeight: '400',
    },
    reasonsList: {
    maxHeight: 300,
    paddingHorizontal: 20,
    },
    reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F0F0F0',
    },
    reasonItemSelected: {
    backgroundColor: '#FAFAFA',
    },
    radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D5D5DA',
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
    },
    radioButtonSelected: {
    borderColor: '#1E1E24',
    },
    radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1E1E24',
    },
    reasonText: {
    fontSize: 16,
    color: '#2E2E35',
    fontWeight: '400',
    flex: 1,
    },
    reasonTextSelected: {
    fontWeight: '500',
    color: '#1E1E24',
    },
    modalFooter: {
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#F0F0F0',
    },
    unmatchButton: {
    backgroundColor: '#1E1E24',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    },
    unmatchButtonDisabled: {
    backgroundColor: '#F4F4F5',
    },
    unmatchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    },
    unmatchButtonTextDisabled: {
    color: '#9E9EA6',
    },
    photoButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8E8ED',
    },
    imageBubble: {
    padding: 0,
    overflow: 'hidden',
    },
    imageBubbleWithReply: {
    paddingTop: 12,
    paddingHorizontal: 12,
    minWidth: 220,
    },
    messageImage: {
    width: '100%',
    height: 250,
    borderRadius: 20,
    },
    reactionBadge: {
    position: 'absolute',
    bottom: -20,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
    },
    reactionBadgeMine: {
    backgroundColor: 'rgba(42, 42, 47, 0.9)',
    },
    reactionBadgeTheirs: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    reactionText: {
    fontSize: 16,
    },
    reactionMenuOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    },
    reactionMenu: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 8,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    alignSelf: 'flex-start',
    },
    reactionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    },
    reactionButtonText: {
    fontSize: 24,
    },
    // Swipe to reply styles
    swipeMessageContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 14,
    overflow: 'visible',
    },
    swipeReplyIndicator: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F2',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
    },
    swipeReplyIndicatorMine: {
    right: 8,
    left: undefined,
    },
    swipeReplyIndicatorTheirs: {
    left: 8,
    right: undefined,
    },
    swipeMessageInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    },
    swipeMessageInnerMine: {
    justifyContent: 'flex-end',
    },
    swipeMessageInnerTheirs: {
    justifyContent: 'flex-start',
    },
    // Reply bar above composer
    composerOuterContainer: {
    backgroundColor: '#FFFFFF',
    },
    replyBarContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ECECEE',
    },
    replyBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    paddingVertical: 10,
    paddingRight: 12,
    overflow: 'hidden',
    },
    replyBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    },
    replyBarAccent: {
    width: 3,
    height: '100%',
    minHeight: 36,
    backgroundColor: '#1E1E24',
    borderRadius: 2,
    marginRight: 12,
    },
    replyBarTextContainer: {
    flex: 1,
    },
    replyBarName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E1E24',
    marginBottom: 2,
    },
    replyBarText: {
    fontSize: 14,
    color: '#6F6F6F',
    },
    replyBarClose: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E8E8ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    },
    // Reply preview in message bubble
    replyPreviewInMessage: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
    width: '100%',
    },
    replyPreviewInMessageMine: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    },
    replyPreviewInMessageTheirs: {
    backgroundColor: '#F5F5F7',
    },
    replyPreviewBar: {
    width: 3,
    borderRadius: 2,
    alignSelf: 'stretch',
    },
    replyPreviewBarMine: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    replyPreviewBarTheirs: {
    backgroundColor: '#1E1E24',
    },
    replyPreviewContent: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    },
    replyPreviewName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
    },
    replyPreviewNameMine: {
    color: 'rgba(255, 255, 255, 0.8)',
    },
    replyPreviewNameTheirs: {
    color: '#1E1E24',
    },
    replyPreviewText: {
    fontSize: 13,
    },
    replyPreviewTextMine: {
    color: 'rgba(255, 255, 255, 0.65)',
    },
    replyPreviewTextTheirs: {
    color: '#6F6F6F',
    },
    });

// Profile Modal Styles - Exact copy from ProfileCard
const profileModalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  wrapper: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    paddingTop: Platform.OS === 'ios' ? 80 : 80,
    paddingBottom: 100,
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
  heroBackButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
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
});
export default ConversationScreen;