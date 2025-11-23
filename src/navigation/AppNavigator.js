import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LaunchScreen from '../screens/LaunchScreen';

const Stack = createStackNavigator();

/**
 * AppNavigator - Main navigation container
 * Uses React Navigation Stack Navigator
 */
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#FFFFFF' },
          // Performance optimizations
          animationEnabled: true,
          gestureEnabled: true,
        }}
      >
        <Stack.Screen 
          name="Launch" 
          component={LaunchScreen}
          options={{
            // Prevent unnecessary re-renders
            freezeOnBlur: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

