import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../theme/theme';
import globalStyles from '../../theme/globalStyles';
import { hapticSelection } from '../../utils/haptics';

// Theme prompts data
const THEME_PROMPTS = {
  warmth: [
    'The softest thing about me:',
    'What brings calm to my day:',
    'A moment I still think about:',
    'Someone once told me:',
    'The way I show love:',
    'What makes me feel at home:',
  ],
  spark: [
    'What makes connection feel real to you?',
    'The energy I bring to a room:',
    'What draws me to someone:',
    'A conversation that changed me:',
    'The vibe I\'m looking for:',
    'What makes me feel alive:',
  ],
  depth: [
    'Something I\'m still learning:',
    'A truth I hold close:',
    'What I need in a connection:',
    'The hardest lesson I\'ve learned:',
    'What I\'m most grateful for:',
    'A moment that shaped me:',
  ],
  self: [
    'How I recharge:',
    'My inner world looks like:',
    'What I value most:',
    'The way I see myself:',
    'What keeps me grounded:',
    'My mental space:',
  ],
  moment: [
    'A memory that still makes me smile:',
    'The best day I\'ve had recently:',
    'Something I\'ll never forget:',
    'A moment of pure joy:',
    'An experience that changed me:',
    'A story I love to tell:',
  ],
};

const THEME_INFO = {
  warmth: { title: 'Warmth', description: 'Love, comfort, softness' },
  spark: { title: 'Spark', description: 'Attraction, vibe, energy' },
  depth: { title: 'Depth', description: 'Emotional expression' },
  self: { title: 'Self', description: 'Identity, inner world' },
  moment: { title: 'Moment', description: 'Experiences, nostalgia' },
};

const PromptsThemeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();
  const { theme: themeKey } = route.params || { theme: 'warmth' };
  
  const themeInfo = THEME_INFO[themeKey] || THEME_INFO.warmth;
  const prompts = THEME_PROMPTS[themeKey] || THEME_PROMPTS.warmth;

  const handleBack = () => {
    hapticSelection();
    navigation.goBack();
  };

  const handlePromptSelect = (promptText) => {
    hapticSelection();
    navigation.navigate('PromptEditor', {
      theme: themeKey,
      prompt: promptText,
    });
  };

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
        
        <Text style={styles.title}>{themeInfo.title}</Text>
        
        <View style={styles.topBarRight} />
      </View>

      {/* Prompts List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.promptsList}>
          {prompts.map((prompt, index) => (
            <TouchableOpacity
              key={index}
              style={styles.promptItem}
              onPress={() => handlePromptSelect(prompt)}
              activeOpacity={0.7}
            >
              <Text style={styles.promptText}>{prompt}</Text>
              <Ionicons name="chevron-forward" size={18} color="rgba(0, 0, 0, 0.3)" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
  title: {
    fontSize: 22,
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
    paddingBottom: 40,
  },
  promptsList: {
    gap: 1,
  },
  promptItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  promptText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
    lineHeight: 24,
    paddingRight: 16,
  },
});

export default PromptsThemeScreen;

