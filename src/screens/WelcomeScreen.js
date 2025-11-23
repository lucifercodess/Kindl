import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '../theme/theme';
import globalStyles from '../theme/globalStyles';
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
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={[globalStyles.content, globalStyles.paddedContainerXXXL, globalStyles.justifyCenter]}>
        <View style={globalStyles.alignCenter}>
          <Text style={[globalStyles.h1, globalStyles.textCenter, globalStyles.marginBottomMD]}>
            Your App Name
          </Text>
          <Text style={[globalStyles.textSecondary, globalStyles.textCenter]}>
            Designed to match you with genuine connections
          </Text>
        </View>

        <View style={globalStyles.marginTopXXXL} />

        <View style={[globalStyles.fullWidth, globalStyles.paddingBottomXXXL]}>
          <Button
            title="Continue"
            onPress={handleContinue}
            variant="primary"
            style={globalStyles.fullWidth}
          />
          <View style={globalStyles.marginTopMD} />
          <Button
            title="Log In"
            onPress={handleLogin}
            variant="outline"
            style={globalStyles.fullWidth}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Minimal custom styles if needed
  // Most styles now come from globalStyles
});

export default WelcomeScreen;

