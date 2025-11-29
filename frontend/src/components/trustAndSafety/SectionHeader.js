import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * SectionHeader Component for Trust & Safety
 * Displays section titles with premium spacing
 */
const SectionHeader = React.memo(({ title }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
});

SectionHeader.displayName = 'SectionHeader';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: -0.3,
    color: '#000000',
  },
});

export default SectionHeader;

