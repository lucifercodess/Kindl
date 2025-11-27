/**
 * BehaviorTracker - Tracks user behavior for personalization
 * Uses in-memory storage (can be upgraded to AsyncStorage later for persistence)
 */
class BehaviorTracker {
  constructor() {
    this.data = {
      intentViews: {}, // { intentId: { count, lastViewed, totalTimeSpent, scrollDepth } }
      reactions: {}, // { intentId: { 'feels-right': count, 'maybe-later': count, 'not-vibe': count } }
      profileViews: {}, // { profileId: { count, timeSpent } }
      sessionStart: Date.now(),
    };
    // Load from memory (in future, can load from AsyncStorage here)
    this.loadData();
  }

  loadData() {
    // In-memory storage - data persists during app session
    // TODO: Add AsyncStorage for cross-session persistence
    try {
      // For now, data is already in memory
      // In future: const stored = await AsyncStorage.getItem('@kindl:user_behavior');
    } catch (error) {
      console.error('Error loading behavior data:', error);
    }
  }

  saveData() {
    // In-memory storage - no async save needed
    // TODO: Add AsyncStorage for cross-session persistence
    try {
      // In future: await AsyncStorage.setItem('@kindl:user_behavior', JSON.stringify(this.data));
    } catch (error) {
      console.error('Error saving behavior data:', error);
    }
  }

  trackIntentView(intentId) {
    if (!this.data.intentViews[intentId]) {
      this.data.intentViews[intentId] = {
        count: 0,
        lastViewed: null,
        totalTimeSpent: 0,
        scrollDepth: 0,
      };
    }
    this.data.intentViews[intentId].count += 1;
    this.data.intentViews[intentId].lastViewed = Date.now();
    this.saveData();
  }

  trackIntentTimeSpent(intentId, timeSpent) {
    if (!this.data.intentViews[intentId]) {
      this.data.intentViews[intentId] = {
        count: 0,
        lastViewed: null,
        totalTimeSpent: 0,
        scrollDepth: 0,
      };
    }
    this.data.intentViews[intentId].totalTimeSpent += timeSpent;
    this.saveData();
  }

  trackScrollDepth(intentId, depth) {
    if (!this.data.intentViews[intentId]) {
      this.data.intentViews[intentId] = {
        count: 0,
        lastViewed: null,
        totalTimeSpent: 0,
        scrollDepth: 0,
      };
    }
    this.data.intentViews[intentId].scrollDepth = Math.max(
      this.data.intentViews[intentId].scrollDepth,
      depth
    );
    this.saveData();
  }

  trackReaction(intentId, reactionId) {
    if (!this.data.reactions[intentId]) {
      this.data.reactions[intentId] = {
        'feels-right': 0,
        'maybe-later': 0,
        'not-vibe': 0,
      };
    }
    this.data.reactions[intentId][reactionId] += 1;
    this.saveData();
  }

  getRecentlyViewed(limit = 2) {
    const views = Object.entries(this.data.intentViews)
      .map(([intentId, data]) => ({
        intentId,
        ...data,
      }))
      .sort((a, b) => (b.lastViewed || 0) - (a.lastViewed || 0))
      .slice(0, limit);
    return views.map((v) => v.intentId);
  }

  getIntentScore(intentId) {
    const view = this.data.intentViews[intentId] || {
      count: 0,
      lastViewed: null,
      totalTimeSpent: 0,
      scrollDepth: 0,
    };
    const reactions = this.data.reactions[intentId] || {
      'feels-right': 0,
      'maybe-later': 0,
      'not-vibe': 0,
    };

    // Calculate score based on multiple factors
    const viewScore = view.count * 10;
    const timeScore = Math.min(view.totalTimeSpent / 1000, 50); // Max 50 points
    const depthScore = view.depth * 5;
    const reactionScore =
      reactions['feels-right'] * 20 -
      reactions['not-vibe'] * 10 +
      reactions['maybe-later'] * 5;
    const recencyScore = view.lastViewed
      ? Math.max(0, 30 - (Date.now() - view.lastViewed) / (1000 * 60 * 60 * 24))
      : 0; // Decay over days

    return viewScore + timeScore + depthScore + reactionScore + recencyScore;
  }

  getOrderedIntents(intentIds) {
    return intentIds.sort((a, b) => {
      const scoreA = this.getIntentScore(a);
      const scoreB = this.getIntentScore(b);
      return scoreB - scoreA; // Higher score first
    });
  }
}

// Singleton instance
const behaviorTracker = new BehaviorTracker();

export default behaviorTracker;

