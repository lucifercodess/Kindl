import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Badge Component for Trust & Safety
 * Shows verification status with icons
 */
const Badge = React.memo(({ type }) => {
  if (!type) return null;

  return (
    <View style={[styles.badge, type === 'verified' ? styles.verifiedBadge : styles.unverifiedBadge]}>
      {type === 'verified' ? (
        <Ionicons name="checkmark-circle" size={22} color="#4A90E2" />
      ) : (
        <Ionicons name="time-outline" size={22} color="rgba(0, 0, 0, 0.35)" />
      )}
    </View>
  );
});

Badge.displayName = 'Badge';

const styles = StyleSheet.create({
  badge: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedBadge: {
    // Icon handles its own color
  },
  unverifiedBadge: {
    // Icon handles its own color
  },
});

export default Badge;

