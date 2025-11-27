import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  Modal,
  Dimensions,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { useTheme } from '../../theme/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hapticButtonPress, hapticSelection, hapticLight } from '../../utils/haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CHAT_DURATION = 30; // 30 seconds

/**
 * BlindDatingScreen - Blind dating experience with anonymous chat
 */
const BlindDatingScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  
  const [state, setState] = useState('connecting'); // 'connecting', 'chat', 'ended'
  const [timeRemaining, setTimeRemaining] = useState(CHAT_DURATION);
  const [showMenu, setShowMenu] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const [showButtons, setShowButtons] = useState(true);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const isExitingRef = useRef(false);
  const menuButtonRef = useRef(null);
  
  // Animation refs
  const profileScale = useRef(new Animated.Value(0.8)).current;
  const profileOpacity = useRef(new Animated.Value(0)).current;
  const connectingPulse = useRef(new Animated.Value(1)).current;
  const chatOpacity = useRef(new Animated.Value(0)).current;
  const [blurAmount, setBlurAmount] = useState(100);
  const [avatarBlurIntensity, setAvatarBlurIntensity] = useState(100);
  const [gradientColors, setGradientColors] = useState(['#FEFCFA', '#FDF9F5', '#FCF7F0']);
  const timerScale = useRef(new Animated.Value(1)).current;
  const dot1Opacity = useRef(new Animated.Value(0.4)).current;
  const dot2Opacity = useRef(new Animated.Value(0.6)).current;
  const dot3Opacity = useRef(new Animated.Value(0.8)).current;
  const countdownIntervalRef = useRef(null);
  
  // Connecting state cinematic animations
  const connectingContentOpacity = useRef(new Animated.Value(0)).current;
  const gradientAnimation = useRef(new Animated.Value(0)).current;
  const avatarOpacity1 = useRef(new Animated.Value(1)).current;
  const avatarOpacity2 = useRef(new Animated.Value(0)).current;
  const avatarOpacity3 = useRef(new Animated.Value(0)).current;
  const avatarHaloScale = useRef(new Animated.Value(1)).current;
  const avatarHaloOpacity = useRef(new Animated.Value(0.4)).current;
  const connectingSparkOpacity = useRef(new Animated.Value(0.3)).current;
  const connectingTitleScale = useRef(new Animated.Value(1)).current;
  const [currentAvatarIndex, setCurrentAvatarIndex] = useState(0);
  const particlesRef = useRef(
    Array.from({ length: 15 }, () => ({
      translateY: new Animated.Value(Math.random() * SCREEN_HEIGHT),
      opacity: new Animated.Value(0.1 + Math.random() * 0.15),
      translateX: new Animated.Value(Math.random() * SCREEN_WIDTH),
    }))
  ).current;
  
  // Spark animation refs (matching ProfileCard.js)
  const sparkPulseScale = useRef(new Animated.Value(0)).current;
  const sparkPulseOpacity = useRef(new Animated.Value(0)).current;
  const sparkIconOpacity = useRef(new Animated.Value(0)).current;
  const sparkIconTranslateY = useRef(new Animated.Value(0)).current;
  
  // Ended state animation refs
  const endedContentOpacity = useRef(new Animated.Value(0)).current;
  const endedButton1Opacity = useRef(new Animated.Value(0)).current;
  const endedButton1TranslateY = useRef(new Animated.Value(20)).current;
  const endedButton2Opacity = useRef(new Animated.Value(0)).current;
  const endedButton2TranslateY = useRef(new Animated.Value(20)).current;
  const endedButton3Opacity = useRef(new Animated.Value(0)).current;
  const endedButton3TranslateY = useRef(new Animated.Value(20)).current;
  const sparkButtonPulse = useRef(new Animated.Value(1)).current;
  const backgroundTranslateX = useRef(new Animated.Value(0)).current;
  
  // Sample user data
  const userProfile = {
    name: 'You',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
  };
  
  // Placeholder avatars for connecting state
  const placeholderAvatars = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
  ];
  
  // Matched person (anonymous)
  const matchedPerson = {
    name: 'Alex',
    firstName: 'A',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    messages: [
      { id: '1', text: 'Hey! Nice to meet you 🌟', isFromUser: false, timestamp: Date.now() - 5000 },
      { id: '2', text: 'Hi there! Great to connect', isFromUser: true, timestamp: Date.now() - 3000 },
      { id: '3', text: 'What brings you to blind dating?', isFromUser: false, timestamp: Date.now() - 1000 },
    ],
  };

  // Cinematic connecting state animations
  useEffect(() => {
    if (state !== 'connecting') return;

    // Content fade-in (350ms)
    Animated.timing(connectingContentOpacity, {
      toValue: 1,
      duration: 350,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    // Continuous gradient animation (update colors every 2 seconds)
    const gradientInterval = setInterval(() => {
      setGradientColors((prev) => {
        if (prev[0] === '#FEFCFA') {
          return ['#FDF9F5', '#FCF7F0', '#FEFCFA'];
        } else if (prev[0] === '#FDF9F5') {
          return ['#FCF7F0', '#FEFCFA', '#FDF9F5'];
        } else {
          return ['#FEFCFA', '#FDF9F5', '#FCF7F0'];
        }
      });
    }, 2000);

    // Floating particles animation (12s loop, slow upward)
    particlesRef.forEach((particle, index) => {
      const startY = Math.random() * SCREEN_HEIGHT;
      const endY = -50;
      const startX = Math.random() * SCREEN_WIDTH;
      const driftX = (Math.random() - 0.5) * 100;
      
      particle.translateY.setValue(startY);
      particle.translateX.setValue(startX);
      
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(particle.translateY, {
              toValue: endY,
              duration: 12000 + Math.random() * 3000,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(particle.translateX, {
              toValue: startX + driftX,
              duration: 12000 + Math.random() * 3000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(particle.translateY, {
            toValue: SCREEN_HEIGHT + 50,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    // Avatar halo pulse (1 → 1.06 → 1 over 4 seconds)
    Animated.loop(
      Animated.sequence([
        Animated.timing(avatarHaloScale, {
          toValue: 1.06,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(avatarHaloScale, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Avatar crossfade (cycle through 3 avatars every 1.2s)
    const avatarCycle = () => {
      const nextIndex = (currentAvatarIndex + 1) % placeholderAvatars.length;
      
      // Fade out current
      const fadeOut = currentAvatarIndex === 0 ? avatarOpacity1 : 
                     currentAvatarIndex === 1 ? avatarOpacity2 : avatarOpacity3;
      // Fade in next
      const fadeIn = nextIndex === 0 ? avatarOpacity1 : 
                    nextIndex === 1 ? avatarOpacity2 : avatarOpacity3;
      
      Animated.parallel([
        Animated.timing(fadeOut, {
          toValue: 0,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(fadeIn, {
          toValue: 1,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
      
      setCurrentAvatarIndex(nextIndex);
    };

    const avatarInterval = setInterval(avatarCycle, 1200);

    // Spark icon pulse (0.3 → 1 → 0.3 over 1.4s)
    Animated.loop(
      Animated.sequence([
        Animated.timing(connectingSparkOpacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(connectingSparkOpacity, {
          toValue: 0.3,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();


    // Simulate finding a match after 2 seconds
    // Bonus: "Almost time" animations in last 500ms
    const matchTimer = setTimeout(() => {
      // Last 500ms - bonus animations
      // Keep blur high
      setAvatarBlurIntensity(100);
      
      Animated.parallel([
        // Spark pulses faster
        Animated.sequence([
          Animated.timing(connectingSparkOpacity, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(connectingSparkOpacity, {
            toValue: 0.3,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(connectingSparkOpacity, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
        // Text scales up slightly
        Animated.timing(connectingTitleScale, {
          toValue: 1.03,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Transition to chat
        setState('chat');
        setMessages(matchedPerson.messages);
        
        // Chat entrance animation
        Animated.timing(chatOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();
        
        setTimeout(() => setBlurAmount(100), 300);
        startCountdown();
      });
    }, 2000);

    return () => {
      clearInterval(avatarInterval);
      clearInterval(gradientInterval);
      clearTimeout(matchTimer);
    };
  }, [state]);

  const startCountdown = () => {
    // Clear any existing interval
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    
    countdownIntervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
          setState('ended');
          return 0;
        }
        
        // Pulse animation when time is low
        if (prev <= 5) {
          Animated.sequence([
            Animated.spring(timerScale, {
              toValue: 1.15,
              tension: 200,
              friction: 5,
              useNativeDriver: true,
            }),
            Animated.spring(timerScale, {
              toValue: 1,
              tension: 200,
              friction: 5,
              useNativeDriver: true,
            }),
          ]).start();
        }
        
        return prev - 1;
      });
    }, 1000);
  };
  
  // Cleanup countdown on unmount
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  // Intercept back button/gesture when in chat state
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      // Only intercept if we're in chat state and not already exiting
      if (state === 'chat' && !isExitingRef.current) {
        // Prevent default behavior of leaving the screen
        e.preventDefault();
        // Show exit confirmation modal
        setShowExitConfirm(true);
      }
    });

    return unsubscribe;
  }, [navigation, state]);

  const handleConfirmExit = () => {
    hapticButtonPress();
    isExitingRef.current = true;
    setShowExitConfirm(false);
    // Allow navigation after closing modal
    setTimeout(() => {
      navigation.dispatch(CommonActions.goBack());
    }, 100);
  };

  const handleCancelExit = () => {
    setShowExitConfirm(false);
    hapticSelection();
  };

  // Ended state animations
  useEffect(() => {
    if (state === 'ended') {
      // Background parallax animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(backgroundTranslateX, {
            toValue: 20,
            duration: 10000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(backgroundTranslateX, {
            toValue: -20,
            duration: 10000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Content fade-in
      Animated.timing(endedContentOpacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();

      // Staggered button animations
      Animated.sequence([
        Animated.parallel([
          Animated.timing(endedButton1Opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(endedButton1TranslateY, {
            toValue: 0,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(endedButton2Opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(endedButton2TranslateY, {
            toValue: 0,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(endedButton3Opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(endedButton3TranslateY, {
            toValue: 0,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      // Spark button pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(sparkButtonPulse, {
            toValue: 1.02,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(sparkButtonPulse, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Reset animations when not in ended state
      endedContentOpacity.setValue(0);
      endedButton1Opacity.setValue(0);
      endedButton1TranslateY.setValue(20);
      endedButton2Opacity.setValue(0);
      endedButton2TranslateY.setValue(20);
      endedButton3Opacity.setValue(0);
      endedButton3TranslateY.setValue(20);
      sparkButtonPulse.setValue(1);
      backgroundTranslateX.setValue(0);
    }
  }, [state]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    hapticLight();
    const newMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isFromUser: true,
      timestamp: Date.now(),
    };
    
    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
    
    // Simulate response after 1-2 seconds
    setTimeout(() => {
      const responses = [
        'Interesting! Tell me more 😊',
        'I love that perspective!',
        'That sounds amazing!',
        'I can relate to that ✨',
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];
      
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isFromUser: false,
        timestamp: Date.now(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
    }, 1000 + Math.random() * 1000);
  };

  const handleSpark = () => {
    hapticButtonPress();
    
    // Hide buttons and fade out content immediately
    setShowButtons(false);
    
    // Fade out the content (title and buttons)
    Animated.timing(endedContentOpacity, {
      toValue: 0,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
    
    // Spark pulse ring animation (matching ProfileCard.js)
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
      sparkPulseScale.setValue(0);
      sparkPulseOpacity.setValue(0);
      
      // Navigate back after animation
      setTimeout(() => {
        navigation.goBack();
      }, 100);
    });
  };

  const handleNextChat = () => {
    hapticButtonPress();
    // Reset and find next person
    setState('connecting');
    setTimeRemaining(CHAT_DURATION);
    setMessages([]);
    setInputText('');
    
    // Reset animations
    chatOpacity.setValue(0);
    setBlurAmount(20);
    
    // Simulate finding another match
    setTimeout(() => {
      setState('chat');
      setMessages(matchedPerson.messages);
      Animated.timing(chatOpacity, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
      
      setTimeout(() => setBlurAmount(15), 300);
      startCountdown();
    }, 2500);
  };

  const handleExit = () => {
    hapticButtonPress();
    setShowMenu(false);
    // Small delay to ensure menu closes before navigation
    setTimeout(() => {
      navigation.goBack();
    }, 50);
  };

  const handleReport = () => {
    hapticSelection();
    setShowMenu(false);
    // Handle report action
    console.log('Report user');
  };

  if (state === 'connecting') {
    return (
      <SafeAreaView style={styles.connectingWrapper}>
        {/* Animated Gradient Background */}
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Floating Particles */}
        {particlesRef.map((particle, index) => (
          <Animated.View
            key={index}
            style={[
              styles.particle,
              {
                opacity: particle.opacity,
                transform: [
                  { translateY: particle.translateY },
                  { translateX: particle.translateX },
                ],
              },
            ]}
          />
        ))}

        {/* Content */}
        <Animated.View
          style={[
            styles.connectingContainer,
            {
              opacity: connectingContentOpacity,
              transform: [{ scale: connectingContentOpacity }],
            },
          ]}
        >
          {/* Header Text */}
          <Animated.Text
            style={[
              styles.connectingTitle,
              { transform: [{ scale: connectingTitleScale }] },
            ]}
          >
            Curating your serendipity…
          </Animated.Text>

          {/* Avatar with Halo */}
          <View style={styles.avatarContainer}>
            {/* Halo Glow */}
            <Animated.View
              style={[
                styles.avatarHalo,
                {
                  transform: [{ scale: avatarHaloScale }],
                  opacity: avatarHaloOpacity,
                },
              ]}
            />

            {/* Blurred Avatars (crossfading) */}
            <View style={styles.avatarWrapper}>
              <Animated.View style={[styles.avatarImageContainer, { opacity: avatarOpacity1 }]}>
                <Image
                  source={{ uri: placeholderAvatars[0] }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
                <BlurView intensity={100} style={StyleSheet.absoluteFill} />
                <BlurView intensity={100} style={StyleSheet.absoluteFill} />
                <BlurView intensity={100} style={StyleSheet.absoluteFill} />
              </Animated.View>
              <Animated.View style={[styles.avatarImageContainer, styles.avatarImageOverlay, { opacity: avatarOpacity2 }]}>
                <Image
                  source={{ uri: placeholderAvatars[1] }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
                <BlurView intensity={100} style={StyleSheet.absoluteFill} />
                <BlurView intensity={100} style={StyleSheet.absoluteFill} />
                <BlurView intensity={100} style={StyleSheet.absoluteFill} />
              </Animated.View>
              <Animated.View style={[styles.avatarImageContainer, styles.avatarImageOverlay, { opacity: avatarOpacity3 }]}>
                <Image
                  source={{ uri: placeholderAvatars[2] }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
                <BlurView intensity={100} style={StyleSheet.absoluteFill} />
                <BlurView intensity={100} style={StyleSheet.absoluteFill} />
                <BlurView intensity={100} style={StyleSheet.absoluteFill} />
              </Animated.View>
            </View>
          </View>

          {/* Pulsing Spark Icon */}
          <Animated.View
            style={[
              styles.connectingSparkContainer,
              { opacity: connectingSparkOpacity },
            ]}
          >
            <Text style={styles.connectingSparkIcon}>✦</Text>
          </Animated.View>
        </Animated.View>
      </SafeAreaView>
    );
  }

  if (state === 'chat') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#FBF8F4' }]}>
        {/* Header */}
        <View style={[styles.chatHeader, { paddingTop: Math.max(insets.top, 4) }]}>
          <View style={styles.headerLeft}>
            <Animated.View style={[styles.headerProfileContainer, { opacity: chatOpacity }]}>
              <View style={styles.blurredAvatarContainer}>
                <Image
                  source={{ uri: matchedPerson.photo }}
                  style={styles.blurredAvatar}
                  resizeMode="cover"
                />
                <BlurView intensity={100} style={StyleSheet.absoluteFill} />
                <BlurView intensity={100} style={StyleSheet.absoluteFill} />
                <BlurView intensity={100} style={StyleSheet.absoluteFill} />
              </View>
              <Text style={styles.nameText}>{matchedPerson.firstName}***</Text>
            </Animated.View>
          </View>
          
          <View style={styles.headerRight}>
            <TouchableOpacity
              ref={menuButtonRef}
              style={styles.menuButton}
              onPress={() => {
                if (menuButtonRef.current) {
                  menuButtonRef.current.measureInWindow((x, y, width, height) => {
                    setMenuPosition({ top: y + height + 8, right: Dimensions.get('window').width - x - width });
                    setShowMenu(true);
                  });
                } else {
                  setShowMenu(true);
                }
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="ellipsis-horizontal" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Timer */}
        <View style={styles.timerContainer}>
          <Animated.View style={{ transform: [{ scale: timerScale }] }}>
            <Text style={styles.timerText}>{timeRemaining}s</Text>
          </Animated.View>
        </View>

        {/* Chat Messages */}
        <Animated.View
          style={[
            styles.chatContainer,
            { opacity: chatOpacity },
          ]}
        >
          <ScrollView
            style={styles.messagesScroll}
            contentContainerStyle={[styles.messagesContent, { paddingBottom: 80 }]}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageBubble,
                  message.isFromUser ? styles.messageRight : styles.messageLeft,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.isFromUser && styles.messageTextRight,
                  ]}
                >
                  {message.text}
                </Text>
              </View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Input - Fixed at bottom */}
        <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 4), paddingTop: 8 }]}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor="#999999"
              multiline
              maxLength={200}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                !inputText.trim() && styles.sendButtonDisabled,
              ]}
              onPress={handleSendMessage}
              disabled={!inputText.trim()}
              activeOpacity={0.7}
            >
              <Ionicons
                name="send"
                size={18}
                color={inputText.trim() ? '#FFFFFF' : '#CCCCCC'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Spark Pulse Ring */}
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
        
        {/* Spark Icon */}
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

        {/* Menu Modal */}
        <Modal
          visible={showMenu}
          transparent
          animationType="none"
          onRequestClose={() => setShowMenu(false)}
        >
          <TouchableOpacity
            style={styles.menuBackdrop}
            activeOpacity={1}
            onPress={() => setShowMenu(false)}
          >
            <View style={[styles.menuContent, { top: menuPosition.top, right: menuPosition.right }]}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setShowMenu(false);
                  handleReport();
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="flag-outline" size={18} color={colors.textPrimary} />
                <Text style={styles.menuItemText}>Report</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleExit}
                activeOpacity={0.7}
              >
                <Ionicons name="exit-outline" size={18} color={colors.textPrimary} />
                <Text style={styles.menuItemText}>Exit Chat</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Exit Confirmation Modal */}
        <Modal
          visible={showExitConfirm}
          transparent
          animationType="fade"
          onRequestClose={handleCancelExit}
        >
          <View style={styles.exitConfirmBackdrop}>
            <View style={styles.exitConfirmModal}>
              <Text style={styles.exitConfirmTitle}>Exit Chat?</Text>
              <Text style={styles.exitConfirmMessage}>
                Are you sure you want to exit the chat? This will end your blind dating session.
              </Text>
              
              <View style={styles.exitConfirmButtons}>
                <TouchableOpacity
                  style={styles.exitConfirmCancelButton}
                  onPress={handleCancelExit}
                  activeOpacity={0.7}
                >
                  <Text style={styles.exitConfirmCancelText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.exitConfirmExitButton}
                  onPress={handleConfirmExit}
                  activeOpacity={0.7}
                >
                  <Text style={styles.exitConfirmExitText}>Exit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  // State: 'ended'
  return (
    <View style={styles.endedWrapper}>
      {/* Background Image with Blur */}
      <Animated.View
        style={[
          styles.endedBackgroundImage,
          {
            transform: [{ translateX: backgroundTranslateX }],
          },
        ]}
      >
        <Image
          source={{ uri: matchedPerson.photo }}
          style={styles.endedBackgroundImageSource}
          resizeMode="cover"
        />
        <BlurView intensity={30} style={StyleSheet.absoluteFill} />
        <View style={styles.endedBackgroundOverlay} />
      </Animated.View>

      <SafeAreaView style={styles.endedSafeArea}>
        <Animated.View
          style={[
            styles.endedContent,
            {
              opacity: endedContentOpacity,
            },
          ]}
        >
          {/* Header Text */}
          <Text style={styles.endedTitle}>Did something spark?</Text>

          {/* Buttons */}
          {showButtons && (
            <View style={styles.endedActionButtons}>
              {/* Primary: Spark */}
              <Animated.View
                style={[
                  {
                    opacity: endedButton1Opacity,
                    transform: [
                      { translateY: endedButton1TranslateY },
                      { scale: sparkButtonPulse },
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.endedSparkButton}
                  onPress={handleSpark}
                  activeOpacity={0.9}
                >
                  <Text style={styles.endedSparkButtonText}>Spark ✦</Text>
                </TouchableOpacity>
              </Animated.View>

              {/* Secondary: Keep exploring */}
              <Animated.View
                style={[
                  {
                    opacity: endedButton2Opacity,
                    transform: [{ translateY: endedButton2TranslateY }],
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.endedKeepExploringButton}
                  onPress={handleNextChat}
                  activeOpacity={0.8}
                >
                  <Text style={styles.endedKeepExploringButtonText}>Keep exploring</Text>
                </TouchableOpacity>
              </Animated.View>

              {/* Tertiary: Step away */}
              <Animated.View
                style={[
                  {
                    opacity: endedButton3Opacity,
                    transform: [{ translateY: endedButton3TranslateY }],
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.endedStepAwayButton}
                  onPress={handleExit}
                  activeOpacity={0.7}
                >
                  <Text style={styles.endedStepAwayButtonText}>Step away</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          )}
        </Animated.View>
      </SafeAreaView>

      {/* Spark Pulse Ring for ended state */}
      <Animated.View
        style={[
          styles.endedSparkPulseRing,
          {
            opacity: sparkPulseOpacity,
            transform: [{ scale: sparkPulseScale }],
          },
        ]}
        pointerEvents="none"
      >
        <View style={styles.endedPulseRingInner} />
      </Animated.View>
      
      {/* Spark Icon for ended state */}
      <Animated.View
        style={[
          styles.endedSparkIconContainer,
          {
            opacity: sparkIconOpacity,
            transform: [{ translateY: sparkIconTranslateY }],
          },
        ]}
        pointerEvents="none"
      >
        <Text style={styles.endedSparkIcon}>✦</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  connectingWrapper: {
    flex: 1,
    position: 'relative',
  },
  connectingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
    paddingBottom: 40,
  },
  connectingTitle: {
    fontSize: 29,
    fontWeight: '700',
    color: '#2A2A2A',
    marginBottom: 48,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  avatarContainer: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  avatarHalo: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(218, 181, 164, 0.25)',
    zIndex: 0,
  },
  avatarWrapper: {
    width: 180,
    height: 180,
    borderRadius: 90,
    overflow: 'hidden',
    position: 'relative',
    zIndex: 1,
  },
  avatarImageContainer: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    overflow: 'hidden',
  },
  avatarImageOverlay: {
    zIndex: 2,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  connectingSparkContainer: {
    marginTop: 24,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectingSparkIcon: {
    fontSize: 32,
    color: '#2A2A2A',
    fontWeight: '300',
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(218, 181, 164, 0.3)',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.04)',
    backgroundColor: '#FBF8F4',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  blurredAvatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  blurredAvatar: {
    width: '100%',
    height: '100%',
  },
  nameText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 16,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  timerText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666666',
    letterSpacing: 0.5,
  },
  chatContainer: {
    flex: 1,
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 24,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  messageLeft: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  messageRight: {
    backgroundColor: '#000000',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 6,
  },
  messageText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#1A1A1A',
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  messageTextRight: {
    color: '#FFFFFF',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    backgroundColor: '#FFFFFF',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1A1A1A',
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#F0F0F0',
  },
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContent: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 8,
    minWidth: 180,
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
    paddingHorizontal: 18,
    paddingVertical: 14,
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  endedWrapper: {
    flex: 1,
    position: 'relative',
  },
  endedBackgroundImage: {
    position: 'absolute',
    top: -50,
    left: -50,
    right: -50,
    bottom: -50,
    width: SCREEN_WIDTH + 100,
    height: SCREEN_HEIGHT + 100,
  },
  endedBackgroundImageSource: {
    width: '100%',
    height: '100%',
  },
  endedBackgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  endedSafeArea: {
    flex: 1,
  },
  endedContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
    paddingBottom: 40,
  },
  endedTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 48,
    letterSpacing: -0.5,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  endedActionButtons: {
    width: '100%',
    gap: 16,
    marginTop: 'auto',
  },
  endedSparkButton: {
    width: '100%',
    backgroundColor: '#000000',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  endedSparkButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  endedKeepExploringButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#000000',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  endedKeepExploringButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0.2,
  },
  endedStepAwayButton: {
    width: '100%',
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endedStepAwayButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666666',
    letterSpacing: 0.2,
  },
  actionButtons: {
    width: '100%',
    gap: 16,
  },
  actionButton: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  sparkButton: {
    backgroundColor: '#000000',
  },
  sparkPulseRing: {
    position: 'absolute',
    top: SCREEN_HEIGHT / 2 - 100,
    left: SCREEN_WIDTH / 2 - 100,
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
    top: SCREEN_HEIGHT / 2 - 20,
    left: SCREEN_WIDTH / 2 - 20,
    width: 40,
    height: 40,
    zIndex: 1001,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkIcon: {
    fontSize: 40,
    color: '#000000',
    fontWeight: '300',
  },
  endedSparkPulseRing: {
    position: 'absolute',
    top: SCREEN_HEIGHT / 2 - 100,
    left: SCREEN_WIDTH / 2 - 100,
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endedPulseRingInner: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  endedSparkIconContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT / 2 - 20,
    left: SCREEN_WIDTH / 2 - 20,
    width: 40,
    height: 40,
    zIndex: 1001,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endedSparkIcon: {
    fontSize: 40,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  nextButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#000000',
  },
  exitButton: {
    backgroundColor: '#F8F8F8',
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  exitConfirmBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  exitConfirmModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    maxWidth: 340,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  exitConfirmTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  exitConfirmMessage: {
    fontSize: 16,
    fontWeight: '400',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
  },
  exitConfirmButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  exitConfirmCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitConfirmCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  exitConfirmExitButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitConfirmExitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default BlindDatingScreen;

