import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/theme';
import globalStyles from '../../theme/globalStyles';
import { hapticSelection } from '../../utils/haptics';

const PollPromptScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  const handleBack = () => {
    hapticSelection();
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[globalStyles.safeArea, styles.container]}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#000000" />
        </TouchableOpacity>
        
        <Text style={styles.title}>Poll Prompt</Text>
        
        <View style={styles.topBarRight} />
      </View>

      <View style={styles.content}>
        <Text style={styles.placeholderText}>Poll prompt coming soon</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: -0.3,
    color: '#000000',
  },
  topBarRight: {
    width: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  placeholderText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#888888',
  },
});

export default PollPromptScreen;

