import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/theme';
import globalStyles from '../../theme/globalStyles';
import KindlLogo from '../../components/KindlLogo';
import SignInButton from '../../components/SignInButton';
import GoogleIcon from '../../components/GoogleIcon';
import { useLaunchScreen } from './hooks/useLaunchScreen';

/**
 * LaunchScreen - First screen users see
 * Optimized with React.memo, useCallback, and proper separation of concerns
 */
const LaunchScreen = React.memo(() => {
  const theme = useTheme();
  const isIOS = useMemo(() => Platform.OS === 'ios', []);
  
  const {
    handleAppleSignIn,
    handleGoogleSignIn,
    handlePhoneSignIn,
    handleLogin,
  } = useLaunchScreen();

  // Memoize sign-in buttons to prevent unnecessary re-renders
  const renderSignInButtons = useMemo(() => {
    if (isIOS) {
      return (
        <>
          <SignInButton
            title="Continue with Apple"
            onPress={handleAppleSignIn}
            variant="primary"
            style={styles.button}
            icon={<FontAwesome5 name="apple" />}
          />
          <View style={globalStyles.marginTopMD} />
          <SignInButton
            title="Continue with Google"
            onPress={handleGoogleSignIn}
            variant="outline"
            style={styles.button}
            icon={<GoogleIcon />}
          />
          <View style={globalStyles.marginTopMD} />
          <SignInButton
            title="Continue with Phone"
            onPress={handlePhoneSignIn}
            variant="outline"
            style={styles.button}
            icon={<Ionicons name="call-outline" />}
          />
        </>
      );
    }
    
    return (
      <>
        <SignInButton
          title="Continue with Google"
          onPress={handleGoogleSignIn}
          variant="primary"
          style={styles.button}
          icon={<GoogleIcon />}
        />
        <View style={globalStyles.marginTopMD} />
        <SignInButton
          title="Continue with Phone"
          onPress={handlePhoneSignIn}
          variant="outline"
          style={styles.button}
          icon={<Ionicons name="call-outline" />}
        />
      </>
    );
  }, [isIOS, handleAppleSignIn, handleGoogleSignIn, handlePhoneSignIn]);

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={[globalStyles.content, styles.container]}>
        {/* Logo Section */}
        <View style={[globalStyles.alignCenter, styles.logoSection]}>
          <KindlLogo style={globalStyles.marginTopXXXL} />
          <Text style={[globalStyles.textSecondary, globalStyles.textCenter, globalStyles.marginTopMD]}>
            Made to Spark something real.
          </Text>
        </View>

        {/* Sign In Buttons Section */}
        <View style={styles.buttonsSection}>
          {renderSignInButtons}

          {/* Login option */}
          <View style={styles.loginSection}>
            <View style={[globalStyles.divider, globalStyles.marginTopXXL]} />
            <SignInButton
              title="Log In"
              onPress={handleLogin}
              variant="outline"
              style={[styles.button, globalStyles.marginTopLG]}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
});

LaunchScreen.displayName = 'LaunchScreen';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
  },
  logoSection: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 60,
  },
  buttonsSection: {
    width: '100%',
    paddingBottom: 32,
  },
  button: {
    width: '100%',
  },
  loginSection: {
    width: '100%',
  },
});

export default LaunchScreen;

