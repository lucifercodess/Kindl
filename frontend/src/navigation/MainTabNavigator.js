import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import CustomTabBar from '../components/CustomTabBar';

// Screens
import ProfileScreen from '../screens/ProfileScreen';
import IntentFeedsScreen from '../screens/IntentFeedsScreen';
import HomeScreen from '../screens/HomeScreen';
import LikesScreen from '../screens/LikesScreen';
import MessagesScreen from '../screens/MessagesScreen';

const Tab = createBottomTabNavigator();

/**
 * MainTabNavigator - Bottom tab navigation for main app
 * Premium glass morphism with smooth animations
 */
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* 1. Profile */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />

      {/* 2. Rooms (Intent Feeds) */}
      <Tab.Screen
        name="Rooms"
        component={IntentFeedsScreen}
      />

      {/* 3. Home (K Logo - Center) */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />

      {/* 4. Likes (Activity) */}
      <Tab.Screen
        name="Likes"
        component={LikesScreen}
      />

      {/* 5. Messages */}
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;

