import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/theme';
import globalStyles from '../../theme/globalStyles';
import Button from '../../components/Button';
import { useSoftWelcome } from './hooks/useSoftWelcome';

/**
 * SoftWelcomeScreen - Step 1 of onboarding
 * Premium, emotional, "Spark" themed welcome
 */
const SoftWelcomeScreen = React.memo(() => {
  const theme = useTheme();
  const { handleGetStarted, handleResetToLaunch } = useSoftWelcome();
  
  // Dev mode - show reset button (only in development)
  const __DEV__ = true; // In production, set this to false or use process.env.NODE_ENV

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={[globalStyles.content, globalStyles.centeredContent, styles.container]}>
        <View style={styles.content}>
          {/* Soft glow circle behind headline */}
          <View style={[styles.glowCircle, { backgroundColor: theme.colors.textPrimary }]} />
          
          {/* Headline with sparkle */}
          <View style={styles.headlineContainer}>
            <Text style={[styles.headline, { color: theme.colors.textPrimary }]}>
            Let’s find your kind of person.
            <Text style={styles.sparkle}> ✨</Text>
            </Text>
          </View>
          
          {/* Subtext */}
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Your story matters. Let’s shape it together.
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              title="Start the Spark"
              onPress={handleGetStarted}
              variant="primary"
              style={styles.button}
            />
          </View>

          {/* Dev-only: Reset button to go back to Launch screen */}
          {__DEV__ && (
            <TouchableOpacity
              onPress={handleResetToLaunch}
              style={styles.devResetButton}
              activeOpacity={0.7}
            >
              <Text style={[styles.devResetText, { color: theme.colors.textSecondary }]}>
                [Dev] Reset to Launch
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
});

SoftWelcomeScreen.displayName = 'SoftWelcomeScreen';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
  },
  glowCircle: {
    position: 'absolute',
    width: 600, // Bigger circle - radius 300
    height: 600,
    borderRadius: 300,
    opacity: 0.02, // Lighter - 2% opacity
    top: -150, // Position behind headline
    alignSelf: 'center',
  },
  headlineContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 20,
    zIndex: 1,
    flexWrap: 'wrap',
  },
  headline: {
    fontSize: 34,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 42,
    flexShrink: 1,
  },
  sparkle: {
    fontSize: 20,
    marginLeft: 6,
    marginTop: 2, // Align with text baseline
    lineHeight: 42,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 26,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 24,
  },
  button: {
    width: '100%',
  },
  devResetButton: {
    marginTop: 32,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  devResetText: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
    opacity: 0.6,
  },
});

export default SoftWelcomeScreen;

