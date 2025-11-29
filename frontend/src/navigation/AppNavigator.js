import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LaunchScreen from '../screens/LaunchScreen';
import LoadingScreen from '../components/LoadingScreen';
import PhoneNumberScreen from '../screens/PhoneNumberScreen';
import OTPScreen from '../screens/OTPScreen';
import SoftWelcomeScreen from '../screens/SoftWelcomeScreen';
import WhatBringsYouScreen from '../screens/WhatBringsYouScreen';
import WhoAreYouScreen from '../screens/WhoAreYouScreen';
import WhoDoYouWantToMeetScreen from '../screens/WhoDoYouWantToMeetScreen';
import AddPhotosScreen from '../screens/AddPhotosScreen';
import HowDoYouConnectScreen from '../screens/HowDoYouConnectScreen';
import LifestyleBasicsScreen from '../screens/LifestyleBasicsScreen';
import InterestsScreen from '../screens/InterestsScreen';
import FinalTouchScreen from '../screens/FinalTouchScreen';
import PhoneOtpScreen from '../screens/PhoneOtpScreen';
import MainAppScreen from '../screens/MainAppScreen';
import ConversationScreen from '../screens/ConversationScreen';
import AnimatedTransition from '../components/AnimatedTransition';
import DatingPreferencesScreen from '../screens/DatingPreferencesScreen';
import IntentFeedDetailScreen from '../screens/IntentFeedDetailScreen';
import BlindDatingScreen from '../screens/BlindDatingScreen';
import ProfileCraftingScreen from '../screens/ProfileCraftingScreen';
import PromptsThemeScreen from '../screens/PromptsThemeScreen';
import PromptEditorScreen from '../screens/PromptEditorScreen';
import VoicePromptScreen from '../screens/VoicePromptScreen';
import VideoPromptScreen from '../screens/VideoPromptScreen';
import PollPromptScreen from '../screens/PollPromptScreen';
import ProfileFieldEditorScreen from '../screens/ProfileFieldEditorScreen';

const Stack = createStackNavigator();

// Wrapper component for animated transition that navigates after animation
const AnimatedTransitionScreen = ({ navigation, route }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const nextScreen = route.params?.nextScreen || 'FinalTouch';
      navigation.replace(nextScreen);
    }, 2000); // 2 second animation

    return () => clearTimeout(timer);
  }, [navigation, route]);

  return <AnimatedTransition />;
};

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
        <Stack.Screen 
          name="Loading" 
          component={LoadingScreen}
          options={{
            gestureEnabled: false,
            animationEnabled: false,
          }}
        />
        <Stack.Screen 
          name="PhoneNumber" 
          component={PhoneNumberScreen}
          options={{
            freezeOnBlur: true,
            gestureEnabled: true,
          }}
        />
        <Stack.Screen 
          name="OTP" 
          component={OTPScreen}
          options={{
            freezeOnBlur: true,
            gestureEnabled: true,
          }}
        />
        <Stack.Screen 
          name="SoftWelcome" 
          component={SoftWelcomeScreen}
          options={{
            freezeOnBlur: true,
          }}
        />
        <Stack.Screen 
          name="WhatBringsYou" 
          component={WhatBringsYouScreen}
          options={{
            freezeOnBlur: true,
          }}
        />
        <Stack.Screen 
          name="WhoAreYou" 
          component={WhoAreYouScreen}
          options={{
            freezeOnBlur: true,
          }}
        />
        <Stack.Screen 
          name="WhoDoYouWantToMeet" 
          component={WhoDoYouWantToMeetScreen}
          options={{
            freezeOnBlur: true,
          }}
        />
        <Stack.Screen 
          name="AddPhotos" 
          component={AddPhotosScreen}
          options={{
            freezeOnBlur: true,
          }}
        />
        <Stack.Screen 
          name="HowDoYouConnect" 
          component={HowDoYouConnectScreen}
          options={{
            freezeOnBlur: true,
          }}
        />
        <Stack.Screen 
          name="LifestyleBasics" 
          component={LifestyleBasicsScreen}
          options={{
            freezeOnBlur: true,
          }}
        />
        <Stack.Screen 
          name="Interests" 
          component={InterestsScreen}
          options={{
            freezeOnBlur: true,
          }}
        />
        <Stack.Screen 
          name="PhoneOtp" 
          component={PhoneOtpScreen}
          options={{
            freezeOnBlur: true,
          }}
        />
        <Stack.Screen 
          name="AnimatedTransition" 
          component={AnimatedTransitionScreen}
          options={{
            headerShown: false,
            gestureEnabled: false,
            animationEnabled: false,
          }}
        />
        <Stack.Screen 
          name="FinalTouch" 
          component={FinalTouchScreen}
          options={{
            freezeOnBlur: true,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen 
          name="MainApp" 
          component={MainAppScreen}
          options={{
            freezeOnBlur: true,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Conversation"
          component={ConversationScreen}
          options={{
            headerShown: false,
            gestureEnabled: true,
          }}
        />
        <Stack.Screen 
          name="DatingPreferences" 
          component={DatingPreferencesScreen}
          options={{
            freezeOnBlur: true,
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="IntentFeedDetail"
          component={IntentFeedDetailScreen}
          options={{
            headerShown: false,
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="BlindDating"
          component={BlindDatingScreen}
          options={{
            headerShown: false,
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="ProfileCrafting"
          component={ProfileCraftingScreen}
          options={{
            headerShown: false,
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="PromptsTheme"
          component={PromptsThemeScreen}
          options={{
            headerShown: false,
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="PromptEditor"
          component={PromptEditorScreen}
          options={{
            headerShown: false,
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="VoicePrompt"
          component={VoicePromptScreen}
          options={{
            headerShown: false,
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="VideoPrompt"
          component={VideoPromptScreen}
          options={{
            headerShown: false,
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="PollPrompt"
          component={PollPromptScreen}
          options={{
            headerShown: false,
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="ProfileFieldEditor"
          component={ProfileFieldEditorScreen}
          options={{
            headerShown: false,
            gestureEnabled: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

