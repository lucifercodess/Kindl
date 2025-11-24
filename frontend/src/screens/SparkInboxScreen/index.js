import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useTheme } from '../../theme/theme';
import globalStyles from '../../theme/globalStyles';

/**
 * SparkInboxScreen - Inbox for received sparks
 * Structure only - UI to be built later
 */
const SparkInboxScreen = React.memo(() => {
  const theme = useTheme();

  // Placeholder data structure
  const sparks = [
    {
      id: '1',
      from: 'Alex',
      content: 'Photo',
      contentType: 'photo',
      reaction: 'This made me smile',
      note: 'Love this energy!',
      timestamp: '2h ago',
    },
    {
      id: '2',
      from: 'Jordan',
      content: 'Prompt answer text...',
      contentType: 'prompt',
      reaction: 'This feels very you',
      note: '',
      timestamp: '5h ago',
    },
  ];

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={[globalStyles.content, styles.container]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            Spark Inbox
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Your received sparks will appear here
          </Text>
        </View>

        <ScrollView style={styles.listContainer}>
          {sparks.map((spark) => (
            <View key={spark.id} style={styles.sparkCard}>
              <Text style={styles.sparkFrom}>{spark.from}</Text>
              <Text style={styles.sparkContent}>{spark.contentType}</Text>
              <Text style={styles.sparkReaction}>{spark.reaction}</Text>
              {spark.note && <Text style={styles.sparkNote}>{spark.note}</Text>}
              <Text style={styles.sparkTime}>{spark.timestamp}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
});

SparkInboxScreen.displayName = 'SparkInboxScreen';

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
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  listContainer: {
    flex: 1,
  },
  sparkCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sparkFrom: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 8,
  },
  sparkContent: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6F6F6F',
    marginBottom: 4,
  },
  sparkReaction: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111111',
    marginBottom: 8,
  },
  sparkNote: {
    fontSize: 14,
    fontWeight: '400',
    color: '#111111',
    marginBottom: 8,
  },
  sparkTime: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6F6F6F',
  },
});

export default SparkInboxScreen;

