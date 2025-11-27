import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/theme';
import globalStyles from '../../theme/globalStyles';

/**
 * IntentFeedDetailScreen - Placeholder for intent feed detail
 * Shows "Coming soon" message
 */
const IntentFeedDetailScreen = React.memo(() => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const intentName = route.params?.intentName || 'Intent Feed';

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={[globalStyles.content, styles.container]}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            {intentName}
          </Text>
          <View style={styles.backButton} />
        </View>

        {/* Coming Soon Content */}
        <View style={styles.content}>
          <Text style={[styles.comingSoonTitle, { color: colors.textPrimary }]}>
            Coming Soon
          </Text>
          <Text style={[styles.comingSoonText, { color: colors.textSecondary }]}>
            This intent feed is being curated with care.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
});

IntentFeedDetailScreen.displayName = 'IntentFeedDetailScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  comingSoonTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  comingSoonText: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 24,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});

export default IntentFeedDetailScreen;

