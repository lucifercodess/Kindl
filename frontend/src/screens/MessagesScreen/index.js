import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '../../theme/theme';
import globalStyles from '../../theme/globalStyles';

/**
 * MessagesScreen - Chat list
 * Placeholder for now
 */
const MessagesScreen = React.memo(() => {
  const theme = useTheme();

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={[globalStyles.content, styles.container]}>
        <Text style={styles.text}>Messages Screen</Text>
      </View>
    </SafeAreaView>
  );
});

MessagesScreen.displayName = 'MessagesScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: '600',
  },
});

export default MessagesScreen;

