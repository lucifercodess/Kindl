import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Animated, ScrollView, ImageBackground, Easing, Modal, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/theme';
import globalStyles from '../../theme/globalStyles';
import { hapticSelection, hapticButtonPress } from '../../utils/haptics';
import TrustAndSafetyScreen from '../../components/trustAndSafety/TrustAndSafetyScreen';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Accent color for Elevate feature - soft champagne/gold
const ELEVATE_ACCENT = '#E8D5B7';

// Custom Ripple Icon Component for Elevate
const RippleIcon = React.memo(({ size = 24, color = '#000000', animated = false }) => {
  const ripple1 = useRef(new Animated.Value(0)).current;
  const ripple2 = useRef(new Animated.Value(0)).current;
  const ripple3 = useRef(new Animated.Value(0)).current;
  const opacity1 = useRef(new Animated.Value(0.6)).current;
  const opacity2 = useRef(new Animated.Value(0.4)).current;
  const opacity3 = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    if (animated) {
      const createRippleAnimation = (ripple, opacity, delay) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.parallel([
              Animated.timing(ripple, {
                toValue: 1,
                duration: 2000,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.sequence([
                Animated.timing(opacity, {
                  toValue: 0.6,
                  duration: 500,
                  useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                  toValue: 0,
                  duration: 1500,
                  useNativeDriver: true,
                }),
              ]),
            ]),
            Animated.timing(ripple, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.6,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        );
      };

      Animated.parallel([
        createRippleAnimation(ripple1, opacity1, 0),
        createRippleAnimation(ripple2, opacity2, 400),
        createRippleAnimation(ripple3, opacity3, 800),
      ]).start();
    }
  }, [animated]);

  const centerSize = size * 0.3;
  const ripple1Size = size * 0.6;
  const ripple2Size = size * 0.8;
  const ripple3Size = size;
  
  // Use accent color for outer ripple when on black background (white color)
  const outerRippleColor = color === '#FFFFFF' ? ELEVATE_ACCENT : color;

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      {/* Outer ripples */}
      {animated && (
        <>
          <Animated.View
            style={{
              position: 'absolute',
              width: ripple3Size,
              height: ripple3Size,
              borderRadius: ripple3Size / 2,
              borderWidth: 1,
              borderColor: outerRippleColor,
              opacity: opacity3,
              transform: [{ scale: ripple3 }],
            }}
          />
          <Animated.View
            style={{
              position: 'absolute',
              width: ripple2Size,
              height: ripple2Size,
              borderRadius: ripple2Size / 2,
              borderWidth: 1,
              borderColor: color,
              opacity: opacity2,
              transform: [{ scale: ripple2 }],
            }}
          />
          <Animated.View
            style={{
              position: 'absolute',
              width: ripple1Size,
              height: ripple1Size,
              borderRadius: ripple1Size / 2,
              borderWidth: 1,
              borderColor: color,
              opacity: opacity1,
              transform: [{ scale: ripple1 }],
            }}
          />
        </>
      )}
      {/* Static ripples (for non-animated version) */}
      {!animated && (
        <>
          <View
            style={{
              position: 'absolute',
              width: ripple3Size,
              height: ripple3Size,
              borderRadius: ripple3Size / 2,
              borderWidth: 1,
              borderColor: outerRippleColor,
              opacity: 0.15,
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: ripple2Size,
              height: ripple2Size,
              borderRadius: ripple2Size / 2,
              borderWidth: 1,
              borderColor: color,
              opacity: 0.25,
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: ripple1Size,
              height: ripple1Size,
              borderRadius: ripple1Size / 2,
              borderWidth: 1,
              borderColor: color,
              opacity: 0.35,
            }}
          />
        </>
      )}
      {/* Center dot */}
      <View
        style={{
          width: centerSize,
          height: centerSize,
          borderRadius: centerSize / 2,
          backgroundColor: color,
        }}
      />
    </View>
  );
});

RippleIcon.displayName = 'RippleIcon';

/**
 * ProfileScreen - User's own profile
 * Placeholder for now
 */
// Animated Subscription Card Component
const AnimatedSubscriptionCard = React.memo(({ 
  imageUri, 
  gradientColors, 
  title, 
  subtitle, 
  titleStyle,
  subtitleStyle,
  badgeText, 
  badgeStyle, 
  badgeTextStyle,
  featureText, 
  featureIconColor,
  featureTextStyle,
  ctaText, 
  ctaStyle, 
  ctaTextStyle,
  onPress,
  index 
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Staggered entrance animation
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        delay: index * 150,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        delay: index * 150,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    hapticSelection();
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePress = () => {
    hapticButtonPress();
    onPress();
  };

  return (
    <Animated.View
      style={[
        styles.subscriptionCard,
        {
          opacity,
          transform: [{ scale }, { translateY }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
      >
        <ImageBackground
          source={{ uri: imageUri }}
          style={styles.cardBackground}
          imageStyle={styles.cardBackgroundImage}
        >
          <LinearGradient
            colors={gradientColors}
            style={styles.cardOverlay}
          >
            <View style={styles.cardTopSection}>
              <View style={styles.cardHeaderRow}>
                <View>
                  <Text style={[styles.subscriptionTitle, titleStyle]}>{title}</Text>
                  <Text style={[styles.subscriptionSubtitle, subtitleStyle]}>{subtitle}</Text>
                </View>
                <View style={[styles.badge, badgeStyle]}>
                  <Text style={[styles.badgeText, badgeTextStyle]}>{badgeText}</Text>
                </View>
              </View>
              
              <View style={styles.featureSingleLine}>
                <Ionicons name="checkmark-circle" size={16} color={featureIconColor} style={styles.featureIcon} />
                <Text style={[styles.featureText, featureTextStyle]}>{featureText}</Text>
              </View>
            </View>
            
            <View style={styles.cardBottomSection}>
              <View style={[styles.ctaButton, ctaStyle]}>
                <Text style={[styles.ctaText, ctaTextStyle]}>{ctaText}</Text>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    </Animated.View>
  );
});

AnimatedSubscriptionCard.displayName = 'AnimatedSubscriptionCard';

// Subscription Modal Component
const SubscriptionModal = React.memo(({ visible, onClose, initialSubscriptionType = 'kindl-plus' }) => {
  const theme = useTheme();
  const [activeSubscriptionType, setActiveSubscriptionType] = useState(initialSubscriptionType);
  const [activePlanPeriod, setActivePlanPeriod] = useState('monthly');
  const subscriptionScrollRef = useRef(null);
  const translateX = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setActiveSubscriptionType(initialSubscriptionType);
      setActivePlanPeriod('monthly');
      // Reset animation values
      translateX.setValue(SCREEN_WIDTH);
      backdropOpacity.setValue(0);
      
      // Scroll to the correct subscription type immediately
      if (subscriptionScrollRef.current) {
        const index = initialSubscriptionType === 'kindl-plus' ? 0 : 1;
        subscriptionScrollRef.current.scrollTo({ x: index * SCREEN_WIDTH, animated: false });
      }
      
      // Smooth and fast opening animation
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 250,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94), // Smooth ease-out curve
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Smooth and fast closing animation
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: SCREEN_WIDTH,
          duration: 200,
          easing: Easing.bezier(0.55, 0.06, 0.68, 0.19), // Smooth ease-in curve
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 180,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, initialSubscriptionType]);

  const handleSubscriptionScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    setActiveSubscriptionType(index === 0 ? 'kindl-plus' : 'kindl-aura');
  };


  const subscriptionData = {
    'kindl-plus': {
      title: 'Kindl +',
      subtitle: 'Premium',
      badgeText: '+',
      badgeStyle: { backgroundColor: '#000000' },
      badgeTextStyle: { color: '#FFFFFF' },
      titleStyle: { color: '#000' },
      subtitleStyle: { color: 'rgba(0, 0, 0, 0.5)' },
      featureText: 'Unlimited likes, see who likes you & advanced filters',
      featureIconColor: '#000',
      featureTextStyle: { color: 'rgba(0, 0, 0, 0.7)' },
      imageUri: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=600&h=800&fit=crop',
      gradientColors: ['rgba(255, 255, 255, 0.96)', 'rgba(255, 255, 255, 0.88)', 'rgba(255, 255, 255, 0.92)'],
      ctaStyle: { backgroundColor: '#000000' },
      ctaTextStyle: { color: '#FFFFFF' },
      plans: {
        weekly: { price: '₹199', period: 'week', savings: null },
        monthly: { price: '₹499', period: 'month', savings: null },
        yearly: { price: '₹3,999', period: 'year', savings: 'Save 33%' },
      },
      about: [
        'Unlimited likes to explore more profiles',
        'See who likes you before they match',
        'Advanced filters for better matches',
        'Read receipts for your messages',
        'Priority customer support',
        'Ad-free experience',
      ],
    },
    'kindl-aura': {
      title: 'Kindl Aura',
      subtitle: 'Elite',
      badgeText: '✦',
      badgeStyle: { backgroundColor: '#FFFFFF' },
      badgeTextStyle: { color: '#000000' },
      titleStyle: { color: '#FFFFFF' },
      subtitleStyle: { color: 'rgba(255, 255, 255, 0.6)' },
      featureText: 'Everything in Kindl +, priority support, exclusive events & profile boost',
      featureIconColor: '#FFF',
      featureTextStyle: { color: 'rgba(255, 255, 255, 0.85)' },
      imageUri: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=800&fit=crop',
      gradientColors: ['rgba(0, 0, 0, 0.78)', 'rgba(0, 0, 0, 0.68)', 'rgba(0, 0, 0, 0.72)'],
      ctaStyle: { backgroundColor: '#FFFFFF' },
      ctaTextStyle: { color: '#000000' },
      plans: {
        weekly: { price: '₹399', period: 'week', savings: null },
        monthly: { price: '₹999', period: 'month', savings: null },
        yearly: { price: '₹7,999', period: 'year', savings: 'Save 33%' },
      },
      about: [
        'Everything in Kindl +',
        'Priority profile boost (appear first in searches)',
        'Exclusive access to premium events',
        'VIP customer support with faster response',
        'Advanced analytics on your profile performance',
        'Early access to new features',
        'Premium badge on your profile',
      ],
    },
  };

  const renderSubscriptionPage = (type) => {
    const data = subscriptionData[type];
    const isDark = type === 'kindl-aura';

    return (
      <View key={type} style={styles.modalSubscriptionPage}>
        <ImageBackground
          source={{ uri: data.imageUri }}
          style={styles.modalCardBackground}
          imageStyle={styles.modalCardBackgroundImage}
        >
          <LinearGradient
            colors={data.gradientColors}
            style={styles.modalCardOverlay}
          >
            <View style={styles.modalContentContainer}>
              <View style={styles.modalCardTopSection}>
                <View style={styles.modalCardHeaderRow}>
                  <View style={styles.modalTitleContainer}>
                    <Text style={[styles.modalSubscriptionTitle, data.titleStyle]}>{data.title}</Text>
                    <Text style={[styles.modalSubscriptionSubtitle, data.subtitleStyle]}>{data.subtitle}</Text>
                  </View>
                  <View style={[styles.modalBadge, data.badgeStyle]}>
                    <Text style={[styles.modalBadgeText, data.badgeTextStyle]}>{data.badgeText}</Text>
                  </View>
                </View>
                
                <View style={styles.modalFeatureSingleLine}>
                  <Ionicons name="checkmark-circle" size={16} color={data.featureIconColor} style={styles.modalFeatureIcon} />
                  <Text style={[styles.modalFeatureText, data.featureTextStyle]}>{data.featureText}</Text>
                </View>
              </View>

              {/* All About It Section - Scrollable */}
              <ScrollView 
                style={styles.modalAboutScrollSection}
                contentContainerStyle={styles.modalAboutScrollContent}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
              >
                <Text style={[styles.modalAboutTitle, isDark && styles.modalAboutTitleDark]}>
                  All About {data.title}
                </Text>
                {data.about && data.about.map((item, index) => (
                  <View key={index} style={styles.modalAboutItem}>
                    <Ionicons 
                      name="checkmark-circle" 
                      size={18} 
                      color={data.featureIconColor} 
                      style={styles.modalAboutIcon} 
                    />
                    <Text style={[styles.modalAboutText, data.featureTextStyle]}>
                      {item}
                    </Text>
                  </View>
                ))}
              </ScrollView>

              {/* Plan Period Tabs */}
              <View style={styles.modalPlanTabsContainer}>
                <View style={styles.modalPlanTabsContent}>
                  {['weekly', 'monthly', 'yearly'].map((period) => {
                    const isActive = activePlanPeriod === period;
                    return (
                      <TouchableOpacity
                        key={period}
                        style={[
                          styles.modalPlanTab,
                          isActive && styles.modalPlanTabActive,
                          isDark && isActive && styles.modalPlanTabActiveDark
                        ]}
                        onPress={() => {
                          hapticSelection();
                          setActivePlanPeriod(period);
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={[
                          styles.modalPlanTabText,
                          isDark && styles.modalPlanTabTextDark,
                          isActive && (isDark ? styles.modalPlanTabTextActiveDark : styles.modalPlanTabTextActive)
                        ]}>
                          {period.charAt(0).toUpperCase() + period.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Plan Details */}
              <View style={styles.modalPlanDetails}>
              {['weekly', 'monthly', 'yearly'].map((period) => {
                const plan = data.plans[period];
                const isActive = activePlanPeriod === period;
                if (!isActive) return null;
                
                return (
                  <View key={period} style={styles.modalPlanDetailCard}>
                    <View style={styles.modalPriceRow}>
                      <Text style={[styles.modalSubscriptionPrice, isDark && styles.modalSubscriptionPriceDark]}>
                        {plan.price}
                      </Text>
                      <Text style={[styles.modalSubscriptionPeriod, isDark && styles.modalSubscriptionPeriodDark]}>
                        /{plan.period}
                      </Text>
                    </View>
                    {plan.savings && (
                      <View style={styles.modalSavingsBadge}>
                        <Text style={[styles.modalSavingsText, isDark && styles.modalSavingsTextDark]}>
                          {plan.savings}
                        </Text>
                      </View>
                    )}
                    <TouchableOpacity
                      style={[styles.modalCtaButton, data.ctaStyle]}
                      onPress={() => {
                        hapticButtonPress();
                        console.log(`Subscribe to ${data.title} - ${period}`);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.modalCtaText, data.ctaTextStyle]}>Subscribe</Text>
                    </TouchableOpacity>
                    
                    {/* Terms and Conditions Link */}
                    <TouchableOpacity
                      style={styles.modalTermsLink}
                      onPress={() => {
                        hapticSelection();
                        // TODO: Navigate to terms and conditions page
                        console.log('Terms and Conditions pressed');
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.modalTermsText, isDark && styles.modalTermsTextDark]}>
                        Terms and Conditions
                      </Text>
                      <Ionicons 
                        name="chevron-forward" 
                        size={16} 
                        color={isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)'} 
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
    );
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          styles.modalBackdrop,
          { opacity: backdropOpacity },
        ]}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />
      </Animated.View>
      
      <Animated.View
        style={[
          styles.modalContainer,
          { transform: [{ translateX }] },
        ]}
      >
        {/* Close Button */}
        <View style={styles.modalCloseButtonContainer}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={28} color="#000000" />
          </TouchableOpacity>
        </View>

        {/* Swipeable Subscription Pages */}
        <ScrollView
          ref={subscriptionScrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleSubscriptionScroll}
          scrollEventThrottle={16}
          style={styles.modalSubscriptionScroll}
          contentContainerStyle={styles.modalSubscriptionScrollContent}
          scrollEnabled={true}
          nestedScrollEnabled={false}
        >
          {renderSubscriptionPage('kindl-plus')}
          {renderSubscriptionPage('kindl-aura')}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
});

SubscriptionModal.displayName = 'SubscriptionModal';

// Elevate Animation Overlay Component
const ElevateAnimationOverlay = React.memo(({ visible, onComplete }) => {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const ripple1 = useRef(new Animated.Value(0)).current;
  const ripple2 = useRef(new Animated.Value(0)).current;
  const ripple3 = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (visible) {
      // Reset all animations
      scale.setValue(0);
      opacity.setValue(0);
      ripple1.setValue(0);
      ripple2.setValue(0);
      ripple3.setValue(0);
      textOpacity.setValue(0);
      textTranslateY.setValue(20);

      // Ripple animations
      Animated.parallel([
        Animated.timing(ripple1, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(ripple2, {
          toValue: 1,
          duration: 1000,
          delay: 100,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(ripple3, {
          toValue: 1,
          duration: 1200,
          delay: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();

      // Text animation
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 400,
          delay: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 400,
          delay: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();

      // Main overlay fade in
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto close after animation
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(textOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onComplete();
        });
      }, 2500);
    }
  }, [visible]);

  if (!visible) return null;

  const ripple1Scale = ripple1.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 3],
  });
  const ripple1Opacity = ripple1.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.2, 0],
  });

  const ripple2Scale = ripple2.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 3.5],
  });
  const ripple2Opacity = ripple2.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.25, 0.15, 0],
  });

  const ripple3Scale = ripple3.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 4],
  });
  const ripple3Opacity = ripple3.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.2, 0.1, 0],
  });

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View style={[styles.elevateOverlay, { opacity }]}>
        <View style={styles.elevateOverlayContent}>
          {/* Ripple effects */}
          <Animated.View
            style={[
              styles.elevateRipple,
              {
                transform: [{ scale: ripple1Scale }],
                opacity: ripple1Opacity,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.elevateRipple,
              {
                transform: [{ scale: ripple2Scale }],
                opacity: ripple2Opacity,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.elevateRipple,
              {
                transform: [{ scale: ripple3Scale }],
                opacity: ripple3Opacity,
              },
            ]}
          />

          {/* Main content */}
          <Animated.View
            style={[
              styles.elevateOverlayTextContainer,
              {
                opacity: textOpacity,
                transform: [{ translateY: textTranslateY }],
              },
            ]}
          >
            <Text style={styles.elevateOverlayTitle}>Elevated</Text>
            <Text style={styles.elevateOverlaySubtitle}>
              Your profile is now visible to more users
            </Text>
          </Animated.View>
        </View>
      </Animated.View>
    </Modal>
  );
});

ElevateAnimationOverlay.displayName = 'ElevateAnimationOverlay';

// Elevate Modal Component (Bottom Sheet)
const ElevateModal = React.memo(({ visible, onClose, onSelectBoost }) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const [selectedBoost, setSelectedBoost] = useState(1);
  const cardScales = useRef([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
  ]).current;

  const boostOptions = [
    { id: 1, count: 1, price: 99, pricePerBoost: 99, popular: false },
    { id: 5, count: 5, price: 399, pricePerBoost: 80, popular: true },
    { id: 10, count: 10, price: 699, pricePerBoost: 70, popular: false },
  ];

  useEffect(() => {
    if (visible) {
      setSelectedBoost(5); // Default to most popular
      translateY.setValue(SCREEN_HEIGHT);
      backdropOpacity.setValue(0);
      
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 350,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 250,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handleSelectBoost = (boost, index) => {
    hapticSelection();
    setSelectedBoost(boost.id);
    
    // Subtle scale animation
    Animated.sequence([
      Animated.timing(cardScales[index], {
        toValue: 0.97,
        duration: 150,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(cardScales[index], {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleConfirm = () => {
    const selected = boostOptions.find(b => b.id === selectedBoost);
    if (selected) {
      hapticButtonPress();
      handleClose();
      setTimeout(() => {
        onSelectBoost(selected);
      }, 300);
    }
  };

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={handleClose}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.elevateModalBackdrop}
        onPress={handleClose}
      >
        <Animated.View
          style={[
            styles.elevateModalBackdropAnimated,
            { opacity: backdropOpacity },
          ]}
        />
      </TouchableOpacity>
      
      <Animated.View
        style={[
          styles.elevateModalContainer,
          { transform: [{ translateY }] },
        ]}
      >
        {/* Handle */}
        <View style={styles.elevateModalHandle} />
        
        {/* Header */}
        <View style={styles.elevateModalHeader}>
          <View style={styles.elevateModalHeaderIcon}>
            <RippleIcon size={20} color="#FFFFFF" />
            <View style={styles.elevateModalHeaderIconAccent} />
          </View>
          <View style={styles.elevateModalHeaderText}>
            <Text style={styles.elevateModalTitle}>Elevate your profile</Text>
            <Text style={styles.elevateModalSubtitle}>For better reach</Text>
          </View>
          <TouchableOpacity onPress={handleClose} style={styles.elevateModalCloseButton}>
            <Ionicons name="close" size={18} color="rgba(0, 0, 0, 0.4)" />
          </TouchableOpacity>
        </View>

        {/* Boost Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.boostCardsContainer}
          style={styles.boostCardsScroll}
          decelerationRate="fast"
          snapToInterval={SCREEN_WIDTH * 0.72 + 12}
          snapToAlignment="start"
        >
          {boostOptions.map((boost, index) => (
            <Animated.View
              key={boost.id}
              style={[
                { transform: [{ scale: cardScales[index] }] },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handleSelectBoost(boost, index)}
                style={[
                  styles.boostCard,
                  selectedBoost === boost.id && styles.boostCardSelected,
                ]}
              >
                {/* Popular Badge */}
                {boost.popular && (
                  <View style={styles.boostPopularBadge}>
                    <Ionicons name="star" size={10} color="#FFFFFF" />
                    <Text style={styles.boostPopularText}>POPULAR</Text>
                  </View>
                )}
                
                {/* Selection Indicator */}
                {selectedBoost === boost.id && (
                  <View style={styles.boostSelectedIndicator}>
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  </View>
                )}

                {/* Card Content */}
                <View style={styles.boostCardContent}>
                  {/* Icon */}
                  <View style={[
                    styles.boostCardIcon,
                    selectedBoost === boost.id && styles.boostCardIconSelected,
                  ]}>
                    <RippleIcon 
                      size={28} 
                      color={selectedBoost === boost.id ? "#FFFFFF" : "#000000"}
                      animated={selectedBoost === boost.id}
                    />
                    {selectedBoost === boost.id && (
                      <View style={styles.boostCardIconAccent} />
                    )}
                  </View>
                  
                  {/* Count */}
                  <View style={styles.boostCardCountContainer}>
                    <Text style={styles.boostCardCount}>{boost.count}</Text>
                    <Text style={styles.boostCardLabel}>
                      {boost.count === 1 ? 'Elevate' : 'Elevates'}
                    </Text>
                  </View>
                  
                  {/* Price */}
                  <View style={styles.boostCardPriceContainer}>
                    <Text style={styles.boostCardPrice}>₹{boost.price}</Text>
                    {boost.count > 1 && (
                      <Text style={styles.boostCardPricePer}>₹{boost.pricePerBoost}/each</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>

        {/* Confirm Button */}
        <View style={styles.elevateModalFooter}>
          <TouchableOpacity
            onPress={handleConfirm}
            activeOpacity={0.9}
            style={styles.elevateModalConfirmButton}
          >
            <Text style={styles.elevateModalConfirmText}>
              Get {boostOptions.find(b => b.id === selectedBoost)?.count} Elevate{selectedBoost > 1 ? 's' : ''}
            </Text>
          </TouchableOpacity>
          <Text style={styles.elevateModalDisclaimer}>
            One-time purchase • No subscription
          </Text>
        </View>
      </Animated.View>
    </Modal>
  );
});

ElevateModal.displayName = 'ElevateModal';

const ProfileScreen = React.memo(() => {
  const theme = useTheme();
  const navigation = useNavigation();
  const avatarScale = useRef(new Animated.Value(0.98)).current;
  const [activeTab, setActiveTab] = useState('Enhancements');
  const [subscriptionModalVisible, setSubscriptionModalVisible] = useState(false);
  const [selectedSubscriptionType, setSelectedSubscriptionType] = useState('kindl-plus');
  const [elevateModalVisible, setElevateModalVisible] = useState(false);
  const [showElevateAnimation, setShowElevateAnimation] = useState(false);

  useEffect(() => {
    // Subtle scale animation on mount
    Animated.spring(avatarScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, []);

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      {/* Header with Logo and Settings */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={[styles.kLetter, { color: theme.colors.textPrimary }]}>K</Text>
          <Text style={[styles.restOfText, { color: theme.colors.textPrimary }]}>indl</Text>
        </View>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => {
            // TODO: Navigate to settings
            console.log('Settings pressed');
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={28} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>
      
      {/* Premium Profile Section */}
      <View style={styles.profileSection}>
        {/* Floating Avatar */}
        <View style={styles.avatarContainer}>
          <Animated.View style={[styles.profilePictureContainer, { transform: [{ scale: avatarScale }] }]}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop' }}
              style={styles.profilePicture}
            />
            <TouchableOpacity
              style={[styles.editButton, { borderColor: theme.colors.primaryBlack }]}
              onPress={() => {
                hapticButtonPress();
                navigation.getParent()?.navigate('ProfileCrafting');
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="pencil" size={12} color={theme.colors.primaryBlack} />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Name + Verification */}
        <TouchableOpacity
          style={styles.nameContainer}
          onPress={() => {
            hapticButtonPress();
            navigation.getParent()?.navigate('ProfileCrafting');
          }}
          activeOpacity={0.8}
        >
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: theme.colors.textPrimary }]}>Alex</Text>
            <View style={styles.verifiedBadgeContainer}>
              <View style={styles.verifiedBadge}>
                <Ionicons 
                  name="checkmark" 
                  size={11} 
                  color="#FFFFFF"
                  style={styles.checkmarkIcon}
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Premium Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'Enhancements' && styles.activeTab,
            activeTab === 'Enhancements' && { borderBottomColor: theme.colors.primaryBlack }
          ]}
          onPress={() => setActiveTab('Enhancements')}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.tabText,
            { color: activeTab === 'Enhancements' ? theme.colors.textPrimary : theme.colors.textSecondary }
          ]}>
            Enhancements
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'Trust and Safety' && styles.activeTab,
            activeTab === 'Trust and Safety' && { borderBottomColor: theme.colors.primaryBlack }
          ]}
          onPress={() => setActiveTab('Trust and Safety')}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.tabText,
            { color: activeTab === 'Trust and Safety' ? theme.colors.textPrimary : theme.colors.textSecondary }
          ]}>
            Trust and Safety
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Tab Content */}
      <View style={styles.tabContent}>
        {activeTab === 'Enhancements' && (
          <View style={styles.enhancementsContent}>
            {/* Premium Subscriptions Carousel */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.subscriptionsContainer}
              style={styles.subscriptionsScroll}
              decelerationRate="fast"
                          snapToInterval={SCREEN_WIDTH - 24}
              snapToAlignment="start"
            >
              {/* Kindl + Card */}
              <AnimatedSubscriptionCard
                index={0}
                imageUri="https://images.unsplash.com/photo-1557683316-973673baf926?w=600&h=800&fit=crop"
                gradientColors={['rgba(255, 255, 255, 0.96)', 'rgba(255, 255, 255, 0.88)', 'rgba(255, 255, 255, 0.92)']}
                title="Kindl +"
                subtitle="Premium"
                badgeText="+"
                badgeStyle={styles.plusBadge}
                featureText="Unlimited likes, see who likes you & advanced filters"
                featureIconColor="#000"
                ctaText="Upgrade"
                ctaStyle={styles.plusCta}
                ctaTextStyle={styles.ctaText}
                onPress={() => {
                              hapticButtonPress();
                              setSelectedSubscriptionType('kindl-plus');
                              setSubscriptionModalVisible(true);
                }}
              />

              {/* Kindl Aura Card */}
              <AnimatedSubscriptionCard
                index={1}
                imageUri="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=800&fit=crop"
                gradientColors={['rgba(0, 0, 0, 0.78)', 'rgba(0, 0, 0, 0.68)', 'rgba(0, 0, 0, 0.72)']}
                title="Kindl Aura"
                subtitle="Elite"
                titleStyle={styles.auraTitle}
                subtitleStyle={styles.auraSubtitle}
                badgeText="✦"
                badgeStyle={styles.auraBadge}
                badgeTextStyle={styles.auraBadgeText}
                featureText="Everything in Kindl +, priority support, exclusive events & profile boost"
                featureIconColor="#FFF"
                featureTextStyle={styles.auraFeatureText}
                ctaText="Upgrade"
                ctaStyle={styles.auraCta}
                ctaTextStyle={[styles.ctaText, styles.auraCtaText]}
                onPress={() => {
                              hapticButtonPress();
                              setSelectedSubscriptionType('kindl-aura');
                              setSubscriptionModalVisible(true);
                }}
              />
            </ScrollView>

                        {/* Elevate Card - Below Cards, Full Width */}
                        <View style={styles.elevateButtonContainer}>
                          <TouchableOpacity
                            onPress={() => {
                              hapticButtonPress();
                              setElevateModalVisible(true);
                            }}
                            activeOpacity={0.7}
                            style={styles.elevateCard}
                          >
                            <View style={styles.elevateIconContainer}>
                              <View style={styles.elevateIconCircle}>
                                <RippleIcon size={20} color="#FFFFFF" />
                                <View style={styles.elevateIconCircleAccent} />
                              </View>
                            </View>
                            <View style={styles.elevateTextContainer}>
                              <Text style={styles.elevateTitle}>Elevate</Text>
                              <Text style={styles.elevateDescription}>
                                Get seen by more users in the next hour
                              </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="rgba(0, 0, 0, 0.25)" />
                          </TouchableOpacity>
                        </View>
          </View>
        )}
        
        {activeTab === 'Trust and Safety' && (
          <TrustAndSafetyScreen />
        )}
      </View>

      {/* Subscription Modal */}
      <SubscriptionModal
        visible={subscriptionModalVisible}
        onClose={() => setSubscriptionModalVisible(false)}
        initialSubscriptionType={selectedSubscriptionType}
      />

      {/* Elevate Modal */}
      <ElevateModal
        visible={elevateModalVisible}
        onClose={() => setElevateModalVisible(false)}
        onSelectBoost={(boost) => {
          // TODO: Implement boost purchase API call
          console.log('Selected boost:', boost);
          setShowElevateAnimation(true);
        }}
      />

      {/* Elevate Animation Overlay */}
      <ElevateAnimationOverlay
        visible={showElevateAnimation}
        onComplete={() => setShowElevateAnimation(false)}
      />
    </SafeAreaView>
  );
});

ProfileScreen.displayName = 'ProfileScreen';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  kLetter: {
    fontSize: 36,
    fontStyle: 'italic',
    fontWeight: '300',
    marginRight: -4,
    transform: [{ rotate: '-8deg' }],
  },
  restOfText: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  settingsButton: {
    padding: 8,
  },
  profileSection: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 0,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 8,
    alignItems: 'center',
  },
  profilePictureContainer: {
    width: 130,
    height: 130,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profilePicture: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#E0E0E0',
  },
  editButton: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  nameContainer: {
    alignItems: 'center',
    marginBottom: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 32,
    fontWeight: '600',
    letterSpacing: 1,
    marginRight: 8,
  },
  verifiedBadgeContainer: {
    position: 'relative',
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkIcon: {
    fontWeight: '900',
  },
  microcopy: {
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.3,
    opacity: 0.6,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
  },
  tab: {
    flex: 1,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  tabContent: {
    flex: 1,
  },
  tabContentInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  enhancementsContent: {
    flex: 1,
    paddingTop: 8,
  },
  elevateButtonContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  elevateCard: {
    width: '100%',
    minHeight: 72,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  elevateCardDisabled: {
    opacity: 0.5,
  },
  elevateIconContainer: {
    position: 'relative',
    marginRight: 16,
  },
  elevateIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  elevateIconCircleAccent: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: ELEVATE_ACCENT,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },
  elevateIconBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#000000',
    paddingHorizontal: 4,
  },
  elevateIconBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#000000',
  },
  elevateTextContainer: {
    flex: 1,
  },
  elevateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 3,
    letterSpacing: -0.1,
  },
  elevateDescription: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.55)',
    lineHeight: 18,
  },
  elevateOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  elevateOverlayContent: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 200,
    height: 200,
  },
  elevateRipple: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  elevateOverlayTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  elevateOverlayTitle: {
    fontSize: 42,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  elevateOverlaySubtitle: {
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 16,
    textAlign: 'center',
    letterSpacing: 0.3,
    lineHeight: 22,
  },
  subscriptionsScroll: {
    flexGrow: 0,
  },
  subscriptionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 16,
  },
  subscriptionCard: {
    width: SCREEN_WIDTH - 40,
    height: 280,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  cardBackground: {
    width: '100%',
    height: '100%',
  },
  cardBackgroundImage: {
    borderRadius: 22,
    resizeMode: 'cover',
  },
  cardOverlay: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    borderRadius: 22,
  },
  cardTopSection: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  subscriptionTitle: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: '#000',
    marginBottom: 4,
  },
  subscriptionSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 1.5,
    color: 'rgba(0, 0, 0, 0.5)',
    textTransform: 'uppercase',
  },
  auraTitle: {
    color: '#FFFFFF',
  },
  auraSubtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusBadge: {
    backgroundColor: '#000000',
  },
  auraBadge: {
    backgroundColor: '#FFFFFF',
  },
  badgeText: {
    fontSize: 20,
    fontWeight: '300',
    color: '#FFFFFF',
  },
  auraBadgeText: {
    fontSize: 18,
    color: '#000000',
  },
  featureSingleLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 8,
  },
  featureIcon: {
    marginTop: 2,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.2,
    color: 'rgba(0, 0, 0, 0.7)',
    flex: 1,
  },
  auraFeatureText: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  cardBottomSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.08)',
    alignItems: 'center',
  },
  auraCardBottomSection: {
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  subscriptionPrice: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -1,
    color: '#000',
  },
  subscriptionPeriod: {
    fontSize: 15,
    fontWeight: '400',
    marginLeft: 6,
    letterSpacing: 0.3,
    color: 'rgba(0, 0, 0, 0.5)',
  },
  auraPrice: {
    color: '#FFFFFF',
  },
  auraPeriod: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  ctaButton: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  plusCta: {
    backgroundColor: '#000000',
    width: '100%',
    height: 48,
  },
  auraCta: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: 48,
  },
  ctaText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: '#FFFFFF',
  },
  auraCtaText: {
    color: '#000000',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: '600',
  },
  // Modal Styles
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalCloseButtonContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1000,
  },
  modalCloseButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  modalSubscriptionScroll: {
    flex: 1,
  },
  modalSubscriptionScrollContent: {
    flexDirection: 'row',
  },
  modalSubscriptionPage: {
    width: SCREEN_WIDTH,
    height: '100%',
    borderRadius: 0,
    overflow: 'hidden',
  },
  modalCardBackground: {
    width: '100%',
    height: '100%',
  },
  modalCardBackgroundImage: {
    resizeMode: 'cover',
  },
  modalCardOverlay: {
    flex: 1,
  },
  modalContentContainer: {
    flex: 1,
    padding: 24,
    paddingTop: 100,
    paddingBottom: 24,
  },
  modalCardTopSection: {
    marginBottom: 20,
  },
  modalCardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  modalTitleContainer: {
    flex: 1,
  },
  modalSubscriptionTitle: {
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: -1,
    marginBottom: 8,
    lineHeight: 56,
    includeFontPadding: false,
    textAlignVertical: 'top',
  },
  modalSubscriptionSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  modalBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    alignSelf: 'flex-start',
  },
  modalBadgeText: {
    fontSize: 24,
    fontWeight: '300',
  },
  modalFeatureSingleLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 8,
  },
  modalFeatureIcon: {
    marginTop: 2,
  },
  modalFeatureText: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.2,
    flex: 1,
    lineHeight: 22,
  },
  modalAboutScrollSection: {
    flex: 1,
    maxHeight: 200,
    marginTop: 20,
    marginBottom: 20,
  },
  modalAboutScrollContent: {
    paddingBottom: 8,
  },
  modalPlanTabsContainer: {
    marginTop: 0,
    marginBottom: 24,
  },
  modalPlanTabsContent: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 4,
    justifyContent: 'center',
  },
  modalPlanTab: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    minWidth: 100,
    alignItems: 'center',
  },
  modalPlanTabActive: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  modalPlanTabActiveDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  modalPlanTabText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(0, 0, 0, 0.6)',
  },
  modalPlanTabTextDark: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  modalPlanTabTextActive: {
    color: '#000000',
  },
  modalPlanTabTextActiveDark: {
    color: '#FFFFFF',
  },
  modalAboutTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#000',
  },
  modalAboutTitleDark: {
    color: '#FFFFFF',
  },
  modalAboutItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 10,
  },
  modalAboutIcon: {
    marginTop: 2,
  },
  modalAboutText: {
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.2,
    flex: 1,
    lineHeight: 20,
  },
  modalPlanDetails: {
    minHeight: 180,
  },
  modalTermsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 8,
    gap: 4,
  },
  modalTermsText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.6)',
    textDecorationLine: 'underline',
  },
  modalTermsTextDark: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  modalPlanDetailCard: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.08)',
  },
  modalPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  modalSubscriptionPrice: {
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: -1,
    color: '#000',
  },
  modalSubscriptionPriceDark: {
    color: '#FFFFFF',
  },
  modalSubscriptionPeriod: {
    fontSize: 18,
    fontWeight: '400',
    marginLeft: 8,
    letterSpacing: 0.3,
    color: 'rgba(0, 0, 0, 0.5)',
  },
  modalSubscriptionPeriodDark: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  modalSavingsBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    marginBottom: 20,
  },
  modalSavingsText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4CAF50',
  },
  modalSavingsTextDark: {
    color: '#81C784',
  },
  modalCtaButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  modalCtaText: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  // Elevate Modal Styles
  elevateModalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  elevateModalBackdropAnimated: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  elevateModalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 6,
    paddingBottom: 32,
    maxHeight: SCREEN_HEIGHT * 0.68,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 16,
  },
  elevateModalHandle: {
    width: 36,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignSelf: 'center',
    marginBottom: 24,
  },
  elevateModalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  elevateModalHeaderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  elevateModalHeaderIconAccent: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: ELEVATE_ACCENT,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  elevateModalHeaderText: {
    flex: 1,
    paddingTop: 2,
  },
  elevateModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  elevateModalSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.45)',
    lineHeight: 18,
  },
  elevateModalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  boostCardsScroll: {
    flexGrow: 0,
  },
  boostCardsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 12,
  },
  boostCard: {
    width: SCREEN_WIDTH * 0.72,
    height: 200,
    borderRadius: 20,
    backgroundColor: '#FAFAFA',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
    position: 'relative',
  },
  boostCardSelected: {
    borderColor: '#000000',
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
    shadowColor: ELEVATE_ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  boostPopularBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: ELEVATE_ACCENT,
  },
  boostPopularText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  boostSelectedIndicator: {
    position: 'absolute',
    top: 50,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boostCardContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  boostCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boostCardIconSelected: {
    backgroundColor: '#000000',
  },
  boostCardIconAccent: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: ELEVATE_ACCENT,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  boostCardCountContainer: {
    marginTop: 16,
  },
  boostCardCount: {
    fontSize: 48,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -2,
    lineHeight: 52,
  },
  boostCardLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.5)',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  boostCardPriceContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'flex-end',
  },
  boostCardPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.5,
  },
  boostCardPricePer: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.4)',
    marginTop: 2,
  },
  elevateModalFooter: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  elevateModalConfirmButton: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: ELEVATE_ACCENT,
  },
  elevateModalConfirmText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  elevateModalDisclaimer: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.4)',
    textAlign: 'center',
    marginTop: 12,
  },
});

export default ProfileScreen;

