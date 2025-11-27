import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '../theme/theme';
import { hapticLight } from '../utils/haptics';

const REACTIONS = [
  { id: 'feels-right', label: 'Feels right', emoji: '✨' },
  { id: 'maybe-later', label: 'Maybe later', emoji: '⏰' },
  { id: 'not-vibe', label: 'Not my vibe', emoji: '💭' },
];

/**
 * MicroReactions - Small pill buttons for quick reactions
 */
const MicroReactions = React.memo(({ intentId, onReaction }) => {
  const { colors } = useTheme();
  const [selectedReaction, setSelectedReaction] = useState(null);
  const scaleAnims = useRef(
    REACTIONS.reduce((acc, r) => {
      acc[r.id] = new Animated.Value(1);
      return acc;
    }, {})
  ).current;

  const handleReaction = (reactionId) => {
    hapticLight();
    
    // Animate button press
    Animated.sequence([
      Animated.spring(scaleAnims[reactionId], {
        toValue: 0.92,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnims[reactionId], {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();

    setSelectedReaction(reactionId);
    if (onReaction) {
      onReaction(intentId, reactionId);
    }
  };

  return (
    <View style={styles.container}>
      {REACTIONS.map((reaction) => {
        const isSelected = selectedReaction === reaction.id;
        return (
          <Animated.View
            key={reaction.id}
            style={{ transform: [{ scale: scaleAnims[reaction.id] }] }}
          >
            <TouchableOpacity
              style={[
                styles.pill,
                isSelected && styles.pillSelected,
                { borderColor: colors.textSecondary },
              ]}
              onPress={() => handleReaction(reaction.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.emoji}>{reaction.emoji}</Text>
              <Text
                style={[
                  styles.label,
                  { color: colors.textSecondary },
                  isSelected && { color: colors.textPrimary },
                ]}
              >
                {reaction.label}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );
});

MicroReactions.displayName = 'MicroReactions';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  pillSelected: {
    backgroundColor: '#F8F8F8',
  },
  emoji: {
    fontSize: 14,
    marginRight: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});

export default MicroReactions;

