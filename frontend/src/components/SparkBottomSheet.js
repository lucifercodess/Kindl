import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../theme/theme';
import { hapticButtonPress, hapticSelection } from '../utils/haptics';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * SparkBottomSheet - Centered modal for sending sparks
 * Clean, minimal design with name, image/prompt, and message input
 */
const SparkBottomSheet = ({ visible, onClose, onSend, content, contentType = 'photo', userName = 'Alex', startPosition = null }) => {
  const theme = useTheme();
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
  
  // Calculate center position
  const centerX = SCREEN_WIDTH / 2;
  const centerY = SCREEN_HEIGHT / 2;
  
  // Start position (from spark button) or center as fallback
  const startX = startPosition?.x || centerX;
  const startY = startPosition?.y || centerY;
  
  const translateX = useRef(new Animated.Value(startX - centerX)).current;
  const translateY = useRef(new Animated.Value(startY - centerY)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const [sparkMessage, setSparkMessage] = useState('');

  const wordCount = sparkMessage.trim().split(/\s+/).filter(word => word.length > 0).length;
  const maxWords = 50;

  useEffect(() => {
    if (visible) {
      // Reset to start position
      const currentStartX = startPosition?.x || centerX;
      const currentStartY = startPosition?.y || centerY;
      translateX.setValue(currentStartX - centerX);
      translateY.setValue(currentStartY - centerY);
      scaleAnim.setValue(0.3);
      opacityAnim.setValue(0);
      
      // Animate to center with smooth, luxurious spring animation
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.3,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
      setSparkMessage(''); // Reset message when closing
    }
  }, [visible, startPosition]);

  const handleClose = () => {
    hapticSelection();
    onClose();
    setSparkMessage('');
  };

  const handleSend = () => {
    if (!sparkMessage.trim() || wordCount > maxWords) {
      hapticSelection();
      return;
    }
    
    hapticButtonPress();
    onSend({
      message: sparkMessage.trim(),
      content,
      contentType,
    });
    
    handleClose();
  };

  const handleMessageChange = (text) => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    if (words.length <= maxWords || text.length < sparkMessage.length) {
      setSparkMessage(text);
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacity,
            },
          ]}
        >
          <BlurView
            intensity={80}
            tint="light"
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.backdropOverlay} />
          <TouchableWithoutFeedback onPress={handleClose}>
            <View style={styles.backdropTouchable} />
          </TouchableWithoutFeedback>
        </Animated.View>

        <Animated.View
          style={[
            styles.modal,
            {
              transform: [
                { translateX },
                { translateY },
                { scale: scaleAnim },
              ],
              opacity: opacityAnim,
            },
          ]}
        >
          {/* Close button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            activeOpacity={0.7}
          >
            <Text style={styles.closeIcon}>×</Text>
          </TouchableOpacity>

          {/* Name at top */}
          <Text style={[styles.userName, { color: theme.colors.textPrimary }]}>
            {userName}
          </Text>

          {/* Image or Prompt content */}
          {contentType === 'photo' ? (
            <Image
              source={{ uri: content }}
              style={styles.contentImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.promptContent}>
              <Text style={styles.promptText}>{content}</Text>
            </View>
          )}

          {/* Message input */}
          <View style={styles.messageContainer}>
            <TextInput
              style={[
                styles.messageInput,
                {
                  borderColor: wordCount > maxWords ? '#FF3B30' : theme.colors.border,
                  color: theme.colors.textPrimary,
                  minHeight: 44,
                  maxHeight: 120,
                },
              ]}
              placeholder="Send your message"
              placeholderTextColor={theme.colors.textSecondary}
              value={sparkMessage}
              onChangeText={handleMessageChange}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Send Spark button */}
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: sparkMessage.trim() && wordCount <= maxWords
                  ? theme.colors.primaryBlack
                  : theme.colors.border,
                opacity: sparkMessage.trim() && wordCount <= maxWords ? 1 : 0.5,
              },
            ]}
            onPress={handleSend}
            disabled={!sparkMessage.trim() || wordCount > maxWords}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.sendButtonText,
                {
                  color: sparkMessage.trim() && wordCount <= maxWords
                    ? theme.colors.primaryWhite
                    : theme.colors.textSecondary,
                },
              ]}
            >
              Send Spark
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backdropOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  backdropTouchable: {
    flex: 1,
  },
  modal: {
    width: '85%',
    maxWidth: 340,
    backgroundColor: 'transparent',
    padding: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  closeIcon: {
    fontSize: 22,
    fontWeight: '300',
    color: '#111111',
    lineHeight: 22,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  contentImage: {
    width: '100%',
    height: 280,
    borderRadius: 12,
    marginBottom: 12,
  },
  promptContent: {
    backgroundColor: 'rgba(248, 248, 248, 0.95)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  promptText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#111111',
    lineHeight: 22,
  },
  messageContainer: {
    marginBottom: 12,
  },
  messageInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 15,
    fontWeight: '400',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    ...Platform.select({
      ios: {
        paddingVertical: 10,
      },
      android: {
        paddingVertical: 10,
      },
    }),
  },
  sendButton: {
    width: '100%',
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SparkBottomSheet;

