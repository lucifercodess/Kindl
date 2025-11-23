import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/theme';
import globalStyles from '../../theme/globalStyles';
import { useLifestyleBasics } from './hooks/useLifestyleBasics';
import HeightPicker from '../../components/HeightPicker';

// Dev mode flag
const __DEV__ = true;

/**
 * LifestyleBasicsScreen - Step 7 of onboarding
 * Soft, optional lifestyle basics - no pressure, no judgment
 */
const LifestyleBasicsScreen = React.memo(() => {
  const theme = useTheme();
  const [height, setHeight] = useState(null);
  const [drinks, setDrinks] = useState(null);
  const [smokes, setSmokes] = useState(null);
  const [exercise, setExercise] = useState(null);
  const [relationshipStyle, setRelationshipStyle] = useState(null);

  const { handleContinue, handleResetToLaunch } = useLifestyleBasics({
    height,
    drinks,
    smokes,
    exercise,
    relationshipStyle,
  });

  const drinksOptions = useMemo(() => [
    { id: 'never', label: "I don't drink" },
    { id: 'socially', label: 'Socially' },
    { id: 'yes', label: 'Yes' },
  ], []);

  const smokesOptions = useMemo(() => [
    { id: 'no', label: 'No' },
    { id: 'occasionally', label: 'Occasionally' },
    { id: 'yes', label: 'Yes' },
  ], []);

  const exerciseOptions = useMemo(() => [
    { id: 'rarely', label: 'Rarely' },
    { id: 'sometimes', label: 'Sometimes' },
    { id: 'often', label: 'Often' },
    { id: 'actively', label: 'Actively' },
  ], []);

  const relationshipStyleOptions = useMemo(() => [
    { id: 'monogamous', label: 'Monogamous' },
    { id: 'openToBoth', label: 'Open to both' },
    { id: 'preferNotSay', label: 'Prefer not to say' },
  ], []);

  const renderChips = useCallback((options, selectedValue, onSelect) => {
    return (
      <View style={styles.chipsContainer}>
        {options.map((option) => {
          const isSelected = selectedValue === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.chip,
                {
                  borderColor: isSelected 
                    ? theme.colors.primaryBlack 
                    : theme.colors.border,
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
              onPress={() => onSelect(isSelected ? null : option.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color: theme.colors.textPrimary,
                    fontWeight: isSelected ? '600' : '400',
                  },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }, [theme]);

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={[globalStyles.content, styles.container]}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
              A few basics about you
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Optional — these help us understand you better.
            </Text>
          </View>

          {/* Height */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.colors.textPrimary }]}>
              Height <Text style={styles.optional}>(optional)</Text>
            </Text>
            <HeightPicker
              value={height}
              onSelect={setHeight}
              placeholder="Select height"
            />
          </View>

          {/* Drinks */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.colors.textPrimary }]}>
              Drinks <Text style={styles.optional}>(optional)</Text>
            </Text>
            {renderChips(drinksOptions, drinks, setDrinks)}
          </View>

          {/* Smokes */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.colors.textPrimary }]}>
              Smokes <Text style={styles.optional}>(optional)</Text>
            </Text>
            {renderChips(smokesOptions, smokes, setSmokes)}
          </View>

          {/* Exercise */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.colors.textPrimary }]}>
              Exercise <Text style={styles.optional}>(optional)</Text>
            </Text>
            {renderChips(exerciseOptions, exercise, setExercise)}
          </View>

          {/* Relationship Style */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.colors.textPrimary }]}>
              Relationship style <Text style={styles.optional}>(optional)</Text>
            </Text>
            {renderChips(relationshipStyleOptions, relationshipStyle, setRelationshipStyle)}
          </View>

          {/* Continue Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                {
                  backgroundColor: theme.colors.primaryBlack,
                },
              ]}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.continueButtonText,
                  {
                    color: theme.colors.primaryWhite,
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

LifestyleBasicsScreen.displayName = 'LifestyleBasicsScreen';

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
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 18,
    width: '100%',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  optional: {
    fontSize: 14,
    fontWeight: '400',
    opacity: 0.5,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 4,
    marginBottom: 6,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '400',
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
    marginTop: 32,
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

export default LifestyleBasicsScreen;

