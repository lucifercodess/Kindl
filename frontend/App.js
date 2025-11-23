import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './src/theme/theme';
import AppNavigator from './src/navigation/AppNavigator';
import 'react-native-gesture-handler';

export default function App() {
  return (
    <ThemeProvider>
      <StatusBar style="dark" />
      <AppNavigator />
    </ThemeProvider>
  );
}

