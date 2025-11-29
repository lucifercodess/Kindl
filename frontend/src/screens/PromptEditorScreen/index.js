import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/theme';
import globalStyles from '../../theme/globalStyles';
import { hapticSelection, hapticButtonPress } from '../../utils/haptics';

const THEME_INFO = {
  warmth: { title: 'Warmth' },
  spark: { title: 'Spark' },
  depth: { title: 'Depth' },
  self: { title: 'Self' },
  moment: { title: 'Moment' },
};

const TIPS = [
  'The best prompts feel like stories.',
  'Answers that include a story get 27% more matches.',
  'Speak in your voice — not a dating bio.',
  'Be specific. Details make you memorable.',
];

const PromptEditorScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();
  const { theme: themeKey, prompt: promptText } = route.params || {};
  
  const themeInfo = THEME_INFO[themeKey] || THEME_INFO.warmth;
  const [answer, setAnswer] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [randomTip] = useState(TIPS[Math.floor(Math.random() * TIPS.length)]);
  
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isFocused) {
      scale.value = withSpring(1.01, { damping: 15, stiffness: 200 });
    } else {
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
    }
  }, [isFocused, scale]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleBack = () => {
    hapticSelection();
    navigation.goBack();
  };

  const handleSave = () => {
    hapticButtonPress();
    // TODO: Save prompt answer
    console.log('Saving prompt:', { theme: themeKey, prompt: promptText, answer });
    navigation.goBack();
  };

  const canSave = answer.trim().length > 0;

  return (
    <SafeAreaView style={[globalStyles.safeArea, styles.container]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="#000000" />
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {promptText}
            </Text>
          </View>
          
          <View style={styles.topBarRight} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={containerAnimatedStyle}>
            {/* Subtle Editor */}
            <View style={styles.editorContainer}>
              <TextInput
                style={styles.editorInput}
                placeholder="Write your truth…"
                placeholderTextColor="rgba(0, 0, 0, 0.3)"
                value={answer}
                onChangeText={setAnswer}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                multiline
                maxLength={500}
                textAlignVertical="top"
                autoFocus
              />
            </View>

            {/* Kindl Tip - Subtle */}
            <View style={styles.tipContainer}>
              <Text style={styles.tipText}>
                {randomTip}
              </Text>
            </View>
          </Animated.View>
        </ScrollView>

        {/* Save Button - Fixed at bottom */}
        <View style={styles.saveButtonContainer}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              !canSave && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={!canSave}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.saveButtonText,
              !canSave && styles.saveButtonTextDisabled,
            ]}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
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
  titleContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.3,
    color: '#000000',
  },
  topBarRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 100,
  },
  editorContainer: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    minHeight: 180,
  },
  editorInput: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
    lineHeight: 24,
    minHeight: 148,
    padding: 0,
  },
  tipContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  tipText: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.5)',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  saveButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  saveButton: {
    width: '100%',
    height: 54,
    borderRadius: 27,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: '#F0F0F0',
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  saveButtonTextDisabled: {
    color: '#CCCCCC',
  },
});

export default PromptEditorScreen;

