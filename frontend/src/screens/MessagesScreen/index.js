import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/theme';
import globalStyles from '../../theme/globalStyles';

/**
 * MessagesScreen - Shows list of spark conversations
 */
const MessagesScreen = React.memo(() => {
  const { colors, spacing } = useTheme();
  const [showArchived, setShowArchived] = useState(false);
  const navigation = useNavigation();

  const matches = useMemo(
    () => [
      {
        id: '1',
        name: 'Maya',
        lastMessage: 'Still grinning over that rooftop sunset you mentioned.',
        timestamp: '2m ago',
        accentColor: '#FFE5EC',
        avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
        isUnread: true,
        lastMessageFrom: 'them',
      },
      {
        id: '2',
        name: 'Noah',
        lastMessage: 'Booked tickets for that pop-up art show. Want to join?',
        timestamp: '1h ago',
        accentColor: '#E4F5E7',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
        isUnread: false,
        lastMessageFrom: 'me',
      },
      {
        id: '3',
        name: 'Amelia',
        lastMessage: 'The playlist you sent has been on repeat all morning.',
        timestamp: 'Yesterday',
        accentColor: '#E2E8FF',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
        isUnread: true,
        lastMessageFrom: 'them',
      },
    ],
    []
  );

  const archivedMatches = useMemo(
    () => [
      {
        id: 'a1',
        name: 'Lena',
        lastMessage: 'Beach season is over but I still owe you that surf lesson.',
        timestamp: 'Aug 12',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
      },
      {
        id: 'a2',
        name: 'Ravi',
        lastMessage: 'Sending the cocktail recipe in a sec.',
        timestamp: 'Jul 03',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      },
    ],
    []
  );

  const renderMessageRow = ({ item }) => {
    const previewStyle = [
      styles.preview,
      item.lastMessageFrom === 'me' && styles.previewSelf,
      item.lastMessageFrom === 'them' && styles.previewIncoming,
      item.isUnread && item.lastMessageFrom === 'them' && styles.previewUnread,
    ];

    return (
      <TouchableOpacity
        style={styles.messageRow}
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('Conversation', {
            participant: {
              name: item.name,
              avatar: item.avatar,
              status: item.isUnread ? 'Active now' : 'Last seen recently',
            },
          })
        }
      >
        <View style={[styles.avatarWrapper, { shadowColor: item.accentColor }]}>
          <Image source={{ uri: item.avatar }} style={styles.avatarImage} />
        </View>
        <View style={styles.messageContent}>
          <View style={styles.rowHeader}>
            <Text style={[styles.name, { color: colors.textPrimary }]}>
              {item.name}
            </Text>
            <Text
              style={[
                styles.timestamp,
                item.isUnread ? styles.timestampActive : styles.timestampMuted,
              ]}
            >
              {item.timestamp}
            </Text>
          </View>
          <Text style={previewStyle} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>
        {item.isUnread && (
          <View
            style={[styles.unreadDot, { backgroundColor: item.accentColor || '#1F1F1F' }]}
          />
        )}
      </TouchableOpacity>
    );
  };

  const renderArchivedSection = () => (
    <View style={styles.archivedSection}>
      <TouchableOpacity
        style={styles.archivedHeader}
        onPress={() => setShowArchived((prev) => !prev)}
        activeOpacity={0.85}
      >
        <Text style={styles.archivedLabel}>Archived</Text>
        <Text
          style={[
            styles.archivedChevron,
            showArchived && styles.archivedChevronOpen,
          ]}
        >
          ⌄
        </Text>
      </TouchableOpacity>

      {showArchived && (
        <View style={styles.archivedList}>
          {archivedMatches.map((chat) => (
            <TouchableOpacity
              key={chat.id}
              style={styles.archivedRow}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('Conversation', {
                  participant: {
                    name: chat.name,
                    avatar: chat.avatar,
                    status: 'Archived · Tap to unarchive',
                  },
                })
              }
            >
              <View style={styles.archivedAvatarWrapper}>
                <Image source={{ uri: chat.avatar }} style={styles.archivedAvatarImage} />
              </View>
              <View style={styles.archivedMessageContent}>
                <View style={styles.archivedRowHeader}>
                  <Text style={styles.archivedName}>{chat.name}</Text>
                  <Text style={styles.archivedTimestamp}>{chat.timestamp}</Text>
                </View>
                <Text style={styles.archivedPreview} numberOfLines={1}>
                  {chat.lastMessage}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={[globalStyles.content, styles.container]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Sparks
          </Text>
        
        </View>

        <FlatList
          data={matches}
          keyExtractor={(item) => item.id}
          renderItem={renderMessageRow}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: spacing[6] },
          ]}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderArchivedSection}
        />
      </View>
    </SafeAreaView>
  );
});

MessagesScreen.displayName = 'MessagesScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '400',
  },
  listContent: {
    paddingBottom: 40,
    paddingTop: 4,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    shadowColor: '#080808',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  avatarWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginRight: 16,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  messageContent: {
    flex: 1,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  preview: {
    fontSize: 15,
    fontWeight: '400',
    color: '#727272',
  },
  previewSelf: {
    color: '#A1A1A8',
  },
  previewIncoming: {
    color: '#4C4C53',
  },
  previewUnread: {
    fontWeight: '600',
    color: '#212126',
  },
  timestamp: {
    fontSize: 13,
    fontWeight: '500',
  },
  timestampActive: {
    color: '#1C1C1F',
  },
  timestampMuted: {
    color: '#9C9C9C',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 12,
  },
  archivedSection: {
    marginTop: 32,
  },
  archivedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  archivedLabel: {
    fontSize: 13,
    letterSpacing: 1,
    color: '#B0B0B8',
    textTransform: 'uppercase',
  },
  archivedChevron: {
    fontSize: 16,
    color: '#B0B0B8',
  },
  archivedChevronOpen: {
    transform: [{ rotate: '180deg' }],
  },
  archivedList: {
    marginTop: 12,
  },
  archivedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F4F4F5',
    marginBottom: 10,
    opacity: 0.82,
  },
  archivedAvatarWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    marginRight: 14,
    opacity: 0.9,
  },
  archivedAvatarImage: {
    width: '100%',
    height: '100%',
  },
  archivedMessageContent: {
    flex: 1,
  },
  archivedRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  archivedName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5F5F68',
  },
  archivedTimestamp: {
    fontSize: 12,
    color: '#A3A3AA',
  },
  archivedPreview: {
    fontSize: 14,
    color: '#7E7E86',
  },
});

export default MessagesScreen;

