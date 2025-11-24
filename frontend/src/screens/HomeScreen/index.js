import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '../../theme/theme';
import globalStyles from '../../theme/globalStyles';
import ProfileCard from '../../components/ProfileCard';

/**
 * HomeScreen - Main profile discovery feed
 * Full vertical scrollable profile cards
 */
const HomeScreen = React.memo(() => {
  const theme = useTheme();

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ProfileCard />
    </SafeAreaView>
  );
});

HomeScreen.displayName = 'HomeScreen';

export default HomeScreen;

