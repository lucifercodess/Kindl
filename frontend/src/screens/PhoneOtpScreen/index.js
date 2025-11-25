import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePhoneOtp } from './hooks/usePhoneOtp';
import Button from '../../components/Button';

const PhoneOtpScreen = () => {
  const { phone, code, setCode, submitting, handleSubmit } = usePhoneOtp();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Enter verification code</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit code to {phone}. Enter it below to continue.
        </Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          maxLength={6}
          placeholder="••••••"
          value={code}
          onChangeText={setCode}
        />
      </View>
      <View style={styles.footer}>
        <Button title={submitting ? 'Verifying...' : 'Verify'} onPress={handleSubmit} disabled={submitting} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  content: {
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 20,
    letterSpacing: 4,
    textAlign: 'center',
  },
  footer: {
    marginBottom: 32,
  },
});

export default PhoneOtpScreen;


