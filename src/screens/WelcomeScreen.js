import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '../theme/theme';
import Button from '../components/Button';

const WelcomeScreen = () => {
  const theme = useTheme();

  const handleContinue = () => {
    console.log('Continue button pressed');
  };

  const handleLogin = () => {
    console.log('Log In button pressed');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.primaryWhite }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            Your App Name
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Designed to match you with genuine connections
          </Text>
        </View>

        <View style={styles.spacer} />

        <View style={styles.buttons}>
          <Button
            title="Continue"
            onPress={handleContinue}
            variant="primary"
            style={styles.button}
          />
          <View style={{ height: theme.spacing[3] }} />
          <Button
            title="Log In"
            onPress={handleLogin}
            variant="outline"
            style={styles.button}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
  spacer: {
    flex: 1,
    minHeight: 100,
  },
  buttons: {
    width: '100%',
    paddingBottom: 32,
  },
  button: {
    width: '100%',
  },
});

export default WelcomeScreen;

