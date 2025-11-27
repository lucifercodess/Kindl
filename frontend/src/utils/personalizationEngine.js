import behaviorTracker from './behaviorTracker';

// Vibe tags mapping for recommendations
const VIBE_TAG_MAPPING = {
  'Slow & Intentional': ['thoughtful', 'reflective', 'intentional', 'meaningful'],
  'Meaningful Connection': ['deep', 'authentic', 'genuine', 'lasting'],
  'Deep Conversations': ['philosophical', 'emotional', 'vulnerable', 'honest'],
  'Creative Energy': ['artistic', 'expressive', 'imaginative', 'inspiring'],
  'Outdoors & Active': ['adventurous', 'energetic', 'nature-loving', 'active'],
  'Food & Coffee Dates': ['cozy', 'relaxed', 'social', 'comfortable'],
  'Spiritual & Calm': ['mindful', 'peaceful', 'compassionate', 'grounded'],
};

// Ambient vibe tags for each intent
const AMBIENT_VIBES = {
  'Slow & Intentional': ['Thoughtful', 'Reflective', 'Honest', 'Warm'],
  'Meaningful Connection': ['Deep', 'Authentic', 'Genuine', 'Lasting'],
  'Deep Conversations': ['Philosophical', 'Emotional', 'Vulnerable', 'Real'],
  'Creative Energy': ['Artistic', 'Expressive', 'Imaginative', 'Inspiring'],
  'Outdoors & Active': ['Adventurous', 'Energetic', 'Nature-loving', 'Active'],
  'Food & Coffee Dates': ['Cozy', 'Relaxed', 'Social', 'Comfortable'],
  'Spiritual & Calm': ['Mindful', 'Peaceful', 'Compassionate', 'Grounded'],
};

/**
 * PersonalizationEngine - Generates personalized recommendations
 */
class PersonalizationEngine {
  /**
   * Get ambient vibe tags for an intent (randomized)
   */
  getAmbientVibes(intentTitle) {
    const vibes = AMBIENT_VIBES[intentTitle] || [];
    // Shuffle and return 3-4 random vibes
    const shuffled = [...vibes].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(3 + Math.floor(Math.random() * 2), vibes.length));
  }

  /**
   * Get time-based contextual micro-copy
   */
  getTimeBasedCopy() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      return 'Start your day with meaningful connections.';
    } else if (hour >= 12 && hour < 17) {
      return 'Afternoon moments of genuine connection.';
    } else if (hour >= 17 && hour < 21) {
      return 'Unwind with thoughtful souls tonight.';
    } else {
      return 'Late night conversations that matter.';
    }
  }

  /**
   * Get recommended intents based on user behavior
   */
  getRecommendedIntents(allIntents, userVibeTags = [], limit = 3) {
    // Get user's most viewed intents
    const recentlyViewed = behaviorTracker.getRecentlyViewed(5);
    const viewedScores = recentlyViewed.reduce((acc, id) => {
      const intent = allIntents.find((i) => i.id === id);
      if (intent) {
        acc[id] = behaviorTracker.getIntentScore(id);
      }
      return acc;
    }, {});

    // Score intents based on:
    // 1. User's vibe tags from onboarding
    // 2. Past behavior
    // 3. Reaction patterns
    const scored = allIntents.map((intent) => {
      let score = 0;

      // Vibe tag matching
      const intentVibes = VIBE_TAG_MAPPING[intent.title] || [];
      const matchingVibes = userVibeTags.filter((tag) =>
        intentVibes.some((iv) => iv.toLowerCase().includes(tag.toLowerCase()))
      );
      score += matchingVibes.length * 15;

      // Behavior score
      score += viewedScores[intent.id] || 0;

      // Positive reactions boost
      const reactions = behaviorTracker.data.reactions[intent.id] || {};
      score += reactions['feels-right'] * 10;

      return { intent, score };
    });

    // Sort by score and return top recommendations
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.intent);
  }

  /**
   * Create blended intent recommendations (combining 2-3 vibes)
   */
  getBlendedRecommendations(userVibeTags = [], allIntents) {
    if (userVibeTags.length < 2) return [];

    // Find intents that match multiple vibe tags
    const blended = allIntents
      .map((intent) => {
        const intentVibes = VIBE_TAG_MAPPING[intent.title] || [];
        const matchingCount = userVibeTags.filter((tag) =>
          intentVibes.some((iv) => iv.toLowerCase().includes(tag.toLowerCase()))
        ).length;

        return {
          intent,
          matchCount: matchingCount,
          score: matchingCount * 20 + behaviorTracker.getIntentScore(intent.id),
        };
      })
      .filter((item) => item.matchCount >= 2)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map((item) => item.intent);

    return blended;
  }

  /**
   * Get time-of-day background tint
   */
  getTimeBasedBackground() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      return '#FFFCF8'; // Morning - warmer white
    } else if (hour >= 12 && hour < 18) {
      return '#FFFFFF'; // Afternoon - pure white
    } else if (hour >= 18 && hour < 22) {
      return '#FBF8F4'; // Evening - soft blush
    } else {
      return '#F6F6F6'; // Night - off-white gray
    }
  }
}

const personalizationEngine = new PersonalizationEngine();

export default personalizationEngine;

