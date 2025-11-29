import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SectionHeader from './SectionHeader';
import SafetyCard from './SafetyCard';

/**
 * TrustAndSafetyScreen Component
 * Premium Trust & Safety section with all safety features
 */
const TrustAndSafetyScreen = React.memo(() => {
  const handleCardPress = (screenName) => {
    // TODO: Navigate to specific screens
    console.log(`Navigate to ${screenName}`);
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Section 1: Identity & Authenticity */}
      <SectionHeader title="Identity & Authenticity" />
      
      <SafetyCard
        title="Selfie Verification"
        subtitle="Confirm you're really you with a quick selfie check."
        icon={<Ionicons name="camera-outline" size={22} color="#000000" />}
        badge="verified"
        onPress={() => handleCardPress('SelfieVerification')}
      />
      
      <SafetyCard
        title="ID Verification"
        subtitle="Add a government ID for extra authenticity."
        icon={<Ionicons name="shield-outline" size={22} color="#000000" />}
        badge="unverified"
        onPress={() => handleCardPress('IDVerification')}
      />

      {/* Section 2: Safety Tools */}
      <SectionHeader title="Safety Tools" />
      
      <SafetyCard
        subtitle="View and manage who you've blocked."
        icon={<Ionicons name="remove-circle-outline" size={22} color="#000000" />}
        onPress={() => handleCardPress('BlockedProfiles')}
      />
      
      <SafetyCard
        subtitle="Learn how Kindl handles safety reports."
        icon={<Ionicons name="flag-outline" size={22} color="#000000" />}
        onPress={() => handleCardPress('ReportCentre')}
      />
      
      <SafetyCard
        subtitle="Filter content you don't want to see."
        icon={<Ionicons name="chatbubble-ellipses-outline" size={22} color="#000000" />}
        onPress={() => handleCardPress('HiddenWords')}
      />

      {/* Section 3: Privacy & Security */}
      <SectionHeader title="Privacy & Security" />
      
      <SafetyCard
        subtitle="Control what you share and manage privacy."
        icon={<Ionicons name="lock-closed-outline" size={22} color="#000000" />}
        onPress={() => handleCardPress('AccountPrivacy')}
      />
      
      <SafetyCard
        subtitle="Review where your account is active."
        icon={<Ionicons name="phone-portrait-outline" size={22} color="#000000" />}
        onPress={() => handleCardPress('LoggedInDevices')}
      />
      
      <SafetyCard
        subtitle="Add an extra layer of security."
        icon={<Ionicons name="key-outline" size={22} color="#000000" />}
        onPress={() => handleCardPress('TwoFactorAuth')}
      />

      {/* Section 4: Wellbeing Resources */}
      <SectionHeader title="Wellbeing Resources" />
      
      <SafetyCard
        subtitle="How our community stays respectful and intentional."
        icon={<Ionicons name="leaf-outline" size={22} color="#000000" />}
        onPress={() => handleCardPress('CommunityValues')}
      />
      
      <SafetyCard
        subtitle="Support if you ever feel uncomfortable or unsafe."
        icon={<Ionicons name="heart-outline" size={22} color="#000000" />}
        onPress={() => handleCardPress('WellbeingResources')}
      />
      
      <SafetyCard
        subtitle="Direct access to help if you need it."
        icon={<Ionicons name="help-circle-outline" size={22} color="#000000" />}
        onPress={() => handleCardPress('CrisisSupport')}
      />

      {/* Bottom padding */}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
});

TrustAndSafetyScreen.displayName = 'TrustAndSafetyScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  bottomPadding: {
    height: 20,
  },
});

export default TrustAndSafetyScreen;

