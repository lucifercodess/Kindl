import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/theme';
import globalStyles from '../../theme/globalStyles';
import { useInterests } from './hooks/useInterests';

// Dev mode flag
const __DEV__ = true;

/**
 * InterestsScreen - Step 8 of onboarding
 * Beautiful grid-style interests selection like Instagram Highlights
 */
const InterestsScreen = React.memo(() => {
  const theme = useTheme();
  const [selectedInterests, setSelectedInterests] = useState([]);

  const { handleContinue, handleResetToLaunch } = useInterests(selectedInterests);

  const interests = useMemo(() => [
    { id: 'music', label: 'Music', icon: '🎵' },
    { id: 'travel', label: 'Travel', icon: '✈️' },
    { id: 'fitness', label: 'Fitness', icon: '🏋️' },
    { id: 'series', label: 'Series', icon: '📺' },
    { id: 'art', label: 'Art', icon: '🎨' },
    { id: 'pets', label: 'Pets', icon: '🐶' },
    { id: 'foodie', label: 'Foodie', icon: '🍽️' },
    { id: 'tech', label: 'Tech', icon: '💻' },
    { id: 'outdoors', label: 'Outdoors', icon: '🌿' },
    { id: 'spirituality', label: 'Spirituality', icon: '🧘' },
  ], []);

  const minInterests = 3;
  const maxInterests = 5;

  const handleToggleInterest = useCallback((interestId) => {
    setSelectedInterests((prev) => {
      const isSelected = prev.includes(interestId);
      if (isSelected) {
        return prev.filter((id) => id !== interestId);
      } else {
        if (prev.length >= maxInterests) {
          return prev;
        }
        return [...prev, interestId];
      }
    });
  }, [maxInterests]);

  const canContinue = useMemo(() => {
    return selectedInterests.length >= minInterests && selectedInterests.length <= maxInterests;
  }, [selectedInterests.length, minInterests, maxInterests]);

  const selectedCount = selectedInterests.length;
  const totalSteps = 8;
  const currentStep = 8;

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={[globalStyles.content, styles.container]}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
              What interests you? ✨
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Pick a few things that feel you. It helps us spark better matches.
            </Text>
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            {Array.from({ length: totalSteps }, (_, i) => (
              <View
                key={i}
                style={[
                  styles.progressDot,
                  {
                    backgroundColor:
                      i < currentStep
                        ? theme.colors.primaryBlack
                        : theme.colors.border,
                    width: i < currentStep ? 8 : 6,
                    height: i < currentStep ? 8 : 6,
                  },
                ]}
              />
            ))}
          </View>

          {/* Gradient Arc Background */}
          <View style={[styles.gradientArc, { backgroundColor: theme.colors.textPrimary }]} />

          {/* Interests Grid */}
          <View style={styles.gridContainer}>
            {interests.map((interest) => {
              const isSelected = selectedInterests.includes(interest.id);
              return (
                <TouchableOpacity
                  key={interest.id}
                  style={[
                    styles.interestChip,
                    {
                      backgroundColor: isSelected 
                        ? theme.colors.primaryBlack 
                        : theme.colors.primaryWhite,
                      borderColor: isSelected 
                        ? theme.colors.primaryBlack 
                        : theme.colors.border,
                      borderWidth: isSelected ? 0 : 1,
                    },
                  ]}
                  onPress={() => handleToggleInterest(interest.id)}
                  activeOpacity={0.6}
                  disabled={!isSelected && selectedCount >= maxInterests}
                >
                  <Text style={styles.interestIcon}>{interest.icon}</Text>
                  <Text
                    style={[
                      styles.interestText,
                      {
                        color: isSelected 
                          ? theme.colors.primaryWhite 
                          : theme.colors.textPrimary,
                        fontWeight: isSelected ? '600' : '400',
                        opacity: !isSelected && selectedCount >= maxInterests ? 0.4 : 1,
                      },
                    ]}
                  >
                    {interest.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Continue Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                {
                  backgroundColor: canContinue 
                    ? theme.colors.primaryBlack 
                    : theme.colors.border,
                  opacity: canContinue ? 1 : 0.5,
                },
              ]}
              onPress={handleContinue}
              disabled={!canContinue}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.continueButtonText,
                  {
                    color: canContinue 
                      ? theme.colors.primaryWhite 
                      : theme.colors.textSecondary,
                  },
                ]}
              >
                Continue
              </Text>
            </TouchableOpacity>
          </View>

          {/* Dev-only: Reset button */}
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

InterestsScreen.displayName = 'InterestsScreen';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    paddingTop: 24,
    paddingBottom: 24,
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    width: '100%',
    flex: 1,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
    opacity: 0.8,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    zIndex: 1,
  },
  progressDot: {
    borderRadius: 4,
    marginHorizontal: 3,
  },
  gradientArc: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: 250,
    opacity: 0.02,
    top: 100,
    alignSelf: 'center',
    zIndex: 0,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
    flex: 1,
    zIndex: 1,
  },
  interestChip: {
    width: '31%',
    aspectRatio: 1.1,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  interestIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  interestText: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 18,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 8,
  },
  continueButton: {
    width: '100%',
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  devResetButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
  },
  devResetText: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
    opacity: 0.6,
  },
});

export default InterestsScreen;

