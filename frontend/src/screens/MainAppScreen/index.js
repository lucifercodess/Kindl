import React from 'react';
import MainTabNavigator from '../../navigation/MainTabNavigator';

/**
 * MainAppScreen - Main app screen after onboarding/login
 * Contains the bottom tab navigation
 */
const MainAppScreen = React.memo(() => {
  return <MainTabNavigator />;
});

MainAppScreen.displayName = 'MainAppScreen';

export default MainAppScreen;

