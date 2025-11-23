import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import * as Location from 'expo-location';
import { useTheme } from '../../theme/theme';
import globalStyles from '../../theme/globalStyles';
import { useLocationPermissions } from './hooks/useLocationPermissions';

// Dev mode flag
const __DEV__ = true;

/**
 * LocationPermissionsScreen - Step 10 of onboarding
 * Simple, clear permission requests
 */
const LocationPermissionsScreen = React.memo(() => {
  const theme = useTheme();
  const [locationGranted, setLocationGranted] = useState(false);
  const { handleContinue, handleResetToLaunch } = useLocationPermissions(locationGranted);

  const handleRequestLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationGranted(true);
      } else {
        Alert.alert(
          'Location Permission',
          'Location helps us show you nearby matches. You can enable it later in settings.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      Alert.alert('Error', 'Failed to request location permission. Please try again.');
    }
  }, []);

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={[globalStyles.content, globalStyles.centeredContent, styles.container]}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
              Location & Permissions
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              We'll only use your location to show nearby sparks.
            </Text>
          </View>

          {/* Location Permission */}
          <View style={styles.permissionSection}>
            <TouchableOpacity
              style={[
                styles.permissionCard,
                {
                  borderColor: locationGranted 
                    ? theme.colors.primaryBlack 
                    : theme.colors.border,
                  borderWidth: locationGranted ? 2 : 1,
                  backgroundColor: locationGranted 
                    ? theme.colors.primaryBlack 
                    : theme.colors.primaryWhite,
                },
              ]}
              onPress={handleRequestLocation}
              activeOpacity={0.7}
            >
              <Text style={[styles.permissionIcon, { color: locationGranted ? theme.colors.primaryWhite : theme.colors.textPrimary }]}>
                📍
              </Text>
              <Text
                style={[
                  styles.permissionText,
                  {
                    color: locationGranted 
                      ? theme.colors.primaryWhite 
                      : theme.colors.textPrimary,
                    fontWeight: locationGranted ? '600' : '400',
                  },
                ]}
              >
                {locationGranted ? 'Location Enabled' : 'Enable Location'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Info Text */}
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            Notifications can be enabled later in settings
          </Text>

          {/* Continue Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                {
                  backgroundColor: theme.colors.primaryBlack,
                },
              ]}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.continueButtonText,
                  {
                    color: theme.colors.primaryWhite,
                  },
                ]}
              >
                Continue
              </Text>
            </TouchableOpacity>
          </View>

          {/* Dev-only: Reset button */}
          {__DEV__ && (
            <TouchableOpacity
              onPress={handleResetToLaunch}
              style={styles.devResetButton}
              activeOpacity={0.7}
            >
              <Text style={[styles.devResetText, { color: theme.colors.textSecondary }]}>
                [Dev] Reset to Launch
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
});

LocationPermissionsScreen.displayName = 'LocationPermissionsScreen';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 32,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  permissionSection: {
    width: '100%',
    marginBottom: 24,
  },
  permissionCard: {
    width: '100%',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  permissionIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
  infoText: {
    fontSize: 13,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.6,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 8,
  },
  continueButton: {
    width: '100%',
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  devResetButton: {
    marginTop: 32,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
  },
  devResetText: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
    opacity: 0.6,
  },
});

export default LocationPermissionsScreen;

