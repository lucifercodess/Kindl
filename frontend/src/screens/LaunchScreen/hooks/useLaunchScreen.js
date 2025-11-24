import { useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
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

  const [request, response, promptAsync] = Google.useAuthRequest({
    // Web client for browser-based auth (optional for now).
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    // Native clients for dev/production builds.
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    // Use default responseType ("code") for native OAuth clients
    redirectUri,
  });

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
    if (!request) {
      Alert.alert('Error', 'Google auth is not ready yet. Please try again in a moment.');
      return;
    }
    console.log('Google auth request redirectUri:', request.redirectUri);
    promptAsync();
  }, [request, promptAsync]);

  const handlePhoneSignIn = useCallback(() => {
    // TODO: Implement Phone Sign In
    console.log('Sign in with Phone pressed');
    // Simulate authentication - show loading then navigate
    navigation.navigate('Loading');
    // After loading, navigate to SoftWelcome
    setTimeout(() => {
      navigation.navigate('SoftWelcome');
    }, 2000);
  }, [navigation]);

  const handleLogin = useCallback(() => {
    // TODO: Navigate to Login screen (for existing users)
    console.log('Log In pressed');
    // navigation.navigate('Login');
  }, []);

  return {
    handleAppleSignIn,
    handleGoogleSignIn,
    handlePhoneSignIn,
    handleLogin,
  };
};

