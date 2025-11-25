import { useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import { Alert } from 'react-native';
import { signInWithGoogleApi } from '../../../utils/authApi';
// import { useAuth } from '../../../hooks/useAuth';

// Ensure auth-session can properly handle redirects on web/Expo Go
WebBrowser.maybeCompleteAuthSession();

/**
 * Custom hook for LaunchScreen logic
 * Separates business logic from UI components
 * 
 * @returns {Object} Handlers and state for LaunchScreen
 */
export const useLaunchScreen = () => {
  const navigation = useNavigation();
  // const { signInWithApple, signInWithGoogle, signInWithPhone } = useAuth();

  // For web (expo web), we still support the web client via Expo's proxy.
  const isWeb = typeof window !== 'undefined';

  const redirectUri = isWeb
    ? AuthSession.makeRedirectUri({ useProxy: true })
    : undefined;

  // Get client IDs from environment variables (Expo injects EXPO_PUBLIC_* at build time)
  // If you see expo/virtual/env errors, clear caches: rm -rf node_modules/.cache .expo && npx expo start --clear
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
  const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  // Check if we have the required client ID for the current platform
  const hasRequiredClientId = Platform.OS === 'ios' 
    ? !!iosClientId 
    : Platform.OS === 'android' 
    ? !!androidClientId 
    : !!webClientId;

  // Build the config object with only defined client IDs
  const googleAuthConfig = {
    // Web client for browser-based auth (optional for now).
    ...(webClientId && { webClientId }),
    // Native clients for dev/production builds - only include if defined
    ...(iosClientId && { iosClientId }),
    ...(androidClientId && { androidClientId }),
    // Use default responseType ("code") for native OAuth clients
    redirectUri,
  };

  // If we don't have the required client ID for the platform, provide a placeholder
  // This prevents the hook from throwing an error, but Google auth won't work
  if (!hasRequiredClientId) {
    if (Platform.OS === 'ios') {
      googleAuthConfig.iosClientId = 'placeholder-client-id-not-configured';
    } else if (Platform.OS === 'android') {
      googleAuthConfig.androidClientId = 'placeholder-client-id-not-configured';
    }
  }

  const [request, response, promptAsync] = Google.useAuthRequest(
    googleAuthConfig,
    { disabled: !hasRequiredClientId }
  );

  const handleAppleSignIn = useCallback(() => {
    // TODO: Implement Apple Sign In
    console.log('Sign in with Apple pressed');
    // Simulate authentication - show loading then navigate
    navigation.navigate('Loading');
    // After loading, navigate to SoftWelcome
    setTimeout(() => {
      navigation.navigate('SoftWelcome');
    }, 2000);
  }, [navigation]);

  useEffect(() => {
    const handleResponse = async () => {
      if (response?.type === 'success') {
        // With native OAuth clients, Google returns an authorization code by default.
        const { code } = response.params || {};
        if (!code) {
          Alert.alert('Error', 'No authorization code returned from Google.');
          return;
        }

        try {
          // For now, just confirm that Google sign-in worked end-to-end.
          Alert.alert('Google sign-in success', `Auth code: ${code.slice(0, 12)}…`);

          // TODO: send this code to your Go backend and exchange it for tokens
          // using Google's token endpoint, then store access/refresh tokens.
          navigation.navigate('SoftWelcome');
        } catch (err) {
          console.error('Google sign-in failed:', err);
          Alert.alert('Sign-in failed', err.message || 'Please try again.');
        }
      }
    };

    handleResponse();
  }, [response, navigation]);

  const handleGoogleSignIn = useCallback(() => {
    if (!hasRequiredClientId) {
      Alert.alert('Not Configured', 'Google Sign-In is not configured yet. Please use Phone Sign-In instead.');
      return;
    }
    if (!request) {
      Alert.alert('Error', 'Google auth is not ready yet. Please try again in a moment.');
      return;
    }
    console.log('Google auth request redirectUri:', request.redirectUri);
    promptAsync();
  }, [request, promptAsync, hasRequiredClientId]);

  const handlePhoneSignIn = useCallback(() => {
    // Navigate to phone number entry screen
    console.log('Sign in with Phone pressed');
    navigation.navigate('PhoneNumber');
  }, [navigation]);

  const handleLogin = useCallback(() => {
    // Navigate to phone number entry screen (same flow as Continue with Phone)
    console.log('Log In pressed');
    navigation.navigate('PhoneNumber');
  }, [navigation]);

  return {
    handleAppleSignIn,
    handleGoogleSignIn,
    handlePhoneSignIn,
    handleLogin,
  };
};

