import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/theme';
import globalStyles from '../../theme/globalStyles';
import { hapticButtonPress, hapticSelection, hapticLight } from '../../utils/haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * LikesScreen - Shows people who liked your profile
 * Displays likes with prompt details and comments
 */
const LikesScreen = React.memo(() => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [dismissedLikes, setDismissedLikes] = useState(new Set());

  const likes = useMemo(
    () => [
      {
        id: '1',
        name: 'Maya',
        age: 27,
        location: 'Los Angeles',
        photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
        likedType: 'prompt',
        likedTitle: 'My Simple Pleasures',
        likedContent: 'Morning coffee, long walks, and finding new music that makes me feel something.',
        message: "That line made me smile :)",
        likedPhoto: null, // If they liked a photo, this would be the photo URL
      },
      {
        id: '2',
        name: 'Noah',
        age: 29,
        location: 'San Francisco',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
        likedType: 'photo',
        likedTitle: null,
        likedContent: null,
        message: "Love your style!",
        likedPhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1', // The photo they liked
      },
      {
        id: '3',
        name: 'Amelia',
        age: 25,
        location: 'New York',
        photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
        likedType: 'prompt',
        likedTitle: "I'M LOOKING FOR",
        likedContent: 'Someone who values deep conversations and meaningful connections over surface-level small talk.',
        message: "This resonates so much with me",
        likedPhoto: null,
      },
    ],
    []
  );

  const visibleLikes = useMemo(
    () => likes.filter((like) => !dismissedLikes.has(like.id)),
    [likes, dismissedLikes]
  );

  const handleCreateSpark = useCallback(
    (like) => {
      hapticButtonPress();
      navigation.navigate('Conversation', {
        participant: {
          name: like.name,
          avatar: like.photo,
          status: 'Active now',
        },
      });
    },
    [navigation]
  );

  const handleDismiss = useCallback(
    (likeId) => {
      hapticButtonPress();
      setDismissedLikes((prev) => new Set([...prev, likeId]));
    },
    []
  );

  const renderLikeCard = useCallback(
    ({ item: like }) => (
      <View style={styles.likeCard}>
        {/* Liked Image or Photo */}
        {(like.likedPhoto || like.likedType === 'photo') && (
          <View style={styles.likedImageBox}>
            <Image
              source={{ uri: like.likedPhoto || like.photo }}
              style={styles.likedImage}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Prompt Box (if they liked a prompt) */}
        {like.likedType === 'prompt' && (
          <View style={styles.promptBox}>
            <Text style={[styles.promptBoxTitle, { color: colors.textPrimary }]}>
              {like.likedTitle}
            </Text>
            <Text style={[styles.promptBoxContent, { color: colors.textSecondary }]}>
              {like.likedContent}
            </Text>
          </View>
        )}

        {/* Message Bubble */}
        {like.message && (
          <View style={styles.messageContainer}>
            <View style={styles.messageBubble}>
              <Text style={styles.messageText}>{like.message}</Text>
            </View>
            <Text style={[styles.messageSenderName, { color: colors.textPrimary }]}>
              {like.name}
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.sparkButton, { backgroundColor: colors.textPrimary }]}
            onPress={() => handleCreateSpark(like)}
            activeOpacity={0.8}
          >
            <Text style={[styles.sparkButtonText, { color: colors.primaryWhite }]}>
              Create Spark
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={() => handleDismiss(like.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.dismissButtonText, { color: colors.textSecondary }]}>
              Dismiss
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [colors, handleCreateSpark, handleDismiss]
  );

  if (visibleLikes.length === 0) {
    return (
      <SafeAreaView style={globalStyles.safeArea}>
        <View style={[globalStyles.content, styles.container]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Likes</Text>
          </View>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No likes yet</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={[globalStyles.content, styles.container]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Likes</Text>
        </View>

        <FlatList
          data={visibleLikes}
          keyExtractor={(item) => item.id}
          renderItem={renderLikeCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
                People who resonated with something on your profile.
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No likes yet</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
});

LikesScreen.displayName = 'LikesScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionHeader: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  sectionDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
  likeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E8E8ED',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  likedImageBox: {
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    margin: 20,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    height: 350,
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
  likedImage: {
    width: '100%',
    height: '100%',
  },
  promptBox: {
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    padding: 24,
    margin: 20,
    marginBottom: 16,
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
  promptBoxTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  promptBoxContent: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 26,
    letterSpacing: 0.2,
  },
  messageContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  messageBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFE5EC',
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    maxWidth: '85%',
    marginBottom: 8,
  },
  messageText: {
    fontSize: 16,
    color: '#2F2F35',
    lineHeight: 22,
  },
  messageSenderName: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  sparkButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkButtonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  dismissButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F7',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E8E8ED',
  },
  dismissButtonText: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6F6F6F',
    textAlign: 'center',
  },
});

export default LikesScreen;
