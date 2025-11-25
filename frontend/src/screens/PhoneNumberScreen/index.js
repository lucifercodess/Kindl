import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePhoneNumber } from './hooks/usePhoneNumber';
import Button from '../../components/Button';

const PhoneNumberScreen = () => {
  const { phone, setPhone, submitting, handleSubmit } = usePhoneNumber();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Enter your mobile number</Text>
        <Text style={styles.subtitle}>
          We’ll text you a verification code. Standard SMS charges may apply.
        </Text>
        <TextInput
          style={styles.input}
          keyboardType="phone-pad"
          placeholder="+1 555 123 4567"
          value={phone}
          onChangeText={setPhone}
        />
      </View>
      <View style={styles.footer}>
        <Button title={submitting ? 'Sending...' : 'Continue'} onPress={handleSubmit} disabled={submitting} />
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
    fontSize: 16,
  },
  footer: {
    marginBottom: 32,
  },
});

export default PhoneNumberScreen;


