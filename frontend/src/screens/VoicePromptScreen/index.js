import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/theme';
import globalStyles from '../../theme/globalStyles';
import { hapticSelection, hapticButtonPress } from '../../utils/haptics';

const VOICE_PROMPTS = [
  'Tell me about a moment that changed you.',
  'What makes you feel most alive?',
  'Describe your perfect day.',
  'What\'s something you\'re passionate about?',
  'Share a story that shaped who you are.',
  'What does connection mean to you?',
];

const VoicePromptScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);

  const handleBack = () => {
    hapticSelection();
    navigation.goBack();
  };

  const handlePromptSelect = (prompt) => {
    hapticSelection();
    setSelectedPrompt(prompt);
  };

  const handleStartRecording = () => {
    if (!selectedPrompt) {
      Alert.alert('Select a Prompt', 'Please choose a prompt first.');
      return;
    }
    hapticButtonPress();
    setIsRecording(true);
    // TODO: Start voice recording
    // After recording completes:
    setTimeout(() => {
      setIsRecording(false);
      setHasRecording(true);
    }, 3000); // Placeholder
  };

  const handleStopRecording = () => {
    hapticButtonPress();
    setIsRecording(false);
    setHasRecording(true);
    // TODO: Stop and save recording
  };

  const handleSave = () => {
    hapticButtonPress();
    // TODO: Save voice prompt
    navigation.goBack();
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
        
        <Text style={styles.title}>Voice Prompt</Text>
        
        <View style={styles.topBarRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!selectedPrompt ? (
          <>
            <Text style={styles.subtitle}>
              Choose a prompt to answer
            </Text>
            <View style={styles.promptsList}>
              {VOICE_PROMPTS.map((prompt, index) => (
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
          </>
        ) : (
          <>
            <View style={styles.selectedPromptContainer}>
              <Text style={styles.selectedPromptLabel}>Selected Prompt</Text>
              <Text style={styles.selectedPromptText}>{selectedPrompt}</Text>
            </View>

            {/* Recording Section */}
            <View style={styles.recordingContainer}>
              {!hasRecording ? (
                <>
                  <View style={styles.recordingIconContainer}>
                    <Ionicons 
                      name={isRecording ? "stop-circle" : "mic"} 
                      size={64} 
                      color={isRecording ? "#FF3B30" : "#000000"} 
                    />
                  </View>
                  <Text style={styles.recordingText}>
                    {isRecording ? 'Recording...' : 'Tap to start recording'}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.recordButton,
                      isRecording && styles.recordButtonActive
                    ]}
                    onPress={isRecording ? handleStopRecording : handleStartRecording}
                    activeOpacity={0.8}
                  >
                    <Text style={[
                      styles.recordButtonText,
                      isRecording && styles.recordButtonTextActive
                    ]}>
                      {isRecording ? 'Stop Recording' : 'Start Recording'}
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <View style={styles.playbackContainer}>
                    <Ionicons name="play-circle" size={48} color="#000000" />
                    <Text style={styles.playbackText}>Recording saved</Text>
                    <TouchableOpacity
                      style={styles.reRecordButton}
                      onPress={() => {
                        setHasRecording(false);
                        setSelectedPrompt(null);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.reRecordButtonText}>Record Again</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* Save Button */}
      {hasRecording && (
        <View style={styles.saveButtonContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      )}
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
    paddingBottom: 100,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    color: '#888888',
    marginBottom: 24,
    textAlign: 'center',
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
  selectedPromptContainer: {
    marginBottom: 32,
    padding: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  selectedPromptLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.5)',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  selectedPromptText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
    lineHeight: 24,
  },
  recordingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  recordingIconContainer: {
    marginBottom: 24,
  },
  recordingText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
    marginBottom: 24,
  },
  recordButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
    backgroundColor: '#000000',
  },
  recordButtonActive: {
    backgroundColor: '#FF3B30',
  },
  recordButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  recordButtonTextActive: {
    color: '#FFFFFF',
  },
  playbackContainer: {
    alignItems: 'center',
    gap: 16,
  },
  playbackText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#000000',
  },
  reRecordButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  reRecordButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  saveButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 34,
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
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});

export default VoicePromptScreen;

