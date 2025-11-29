import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Switch, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../theme/theme';
import globalStyles from '../../theme/globalStyles';
import { hapticSelection, hapticButtonPress } from '../../utils/haptics';

// Field type configurations
const FIELD_TYPES = {
  text: 'text',
  select: 'select',
  number: 'number',
};

// Options for select fields
const FIELD_OPTIONS = {
  pronouns: ['He/Him', 'She/Her', 'They/Them', 'He/They', 'She/They', 'Prefer not to say'],
  gender: ['Man', 'Woman', 'Non-binary', 'Prefer not to say'],
  interestedIn: ['Men', 'Women', 'Everyone'],
  sexuality: ['Straight', 'Gay', 'Lesbian', 'Bisexual', 'Pansexual', 'Asexual', 'Prefer not to say'],
  children: ['Want someday', 'Don\'t want', 'Have and want more', 'Have and don\'t want more', 'Prefer not to say'],
  pets: ['Love pets', 'Like pets', 'Dislike pets', 'Allergic to pets', 'Prefer not to say'],
  zodiac: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'],
  drinking: ['Never', 'Sometimes', 'Often', 'Prefer not to say'],
  smoking: ['Never', 'Sometimes', 'Often', 'Prefer not to say'],
  intentions: ['Long-term relationship', 'Short-term relationship', 'Friendship', 'Not sure yet'],
  relationshipType: ['Monogamous', 'Non-monogamous', 'Open to both', 'Prefer not to say'],
  dogs: ['Love dogs', 'Like dogs', 'Dislike dogs', 'Allergic to dogs', 'Prefer not to say'],
};

const ProfileFieldEditorScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();
  const { field } = route.params || {};
  
  const [value, setValue] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  const handleBack = () => {
    hapticSelection();
    navigation.goBack();
  };

  const handleSave = () => {
    hapticButtonPress();
    // TODO: Save field value and visibility
    console.log('Saving:', { field: field.key, value, isVisible });
    navigation.goBack();
  };

  const handleOptionSelect = (option) => {
    hapticSelection();
    setValue(option);
  };

  const options = FIELD_OPTIONS[field?.key] || [];
  const isSelectField = options.length > 0;
  const isNumberField = field?.key === 'age' || field?.key === 'height';

  return (
    <SafeAreaView style={[globalStyles.safeArea, styles.container]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="#000000" />
          </TouchableOpacity>
          
          <Text style={styles.title}>{field?.label || 'Edit'}</Text>
          
          <View style={styles.topBarRight} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Input Section */}
          {isSelectField ? (
            <View style={styles.optionsContainer}>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionItem,
                    value === option && styles.optionItemSelected
                  ]}
                  onPress={() => handleOptionSelect(option)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.optionText,
                    value === option && styles.optionTextSelected
                  ]}>
                    {option}
                  </Text>
                  {value === option && (
                    <Ionicons name="checkmark" size={20} color="#000000" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder={`Enter ${field?.label?.toLowerCase()}`}
                placeholderTextColor="rgba(0, 0, 0, 0.3)"
                value={value}
                onChangeText={setValue}
                keyboardType={isNumberField ? 'numeric' : 'default'}
                autoFocus
              />
            </View>
          )}

          {/* Visibility Toggle */}
          <View style={styles.visibilityContainer}>
            <View style={styles.visibilityHeader}>
              <Text style={styles.visibilityLabel}>Profile Visibility</Text>
              <Text style={[
                styles.visibilityStatus,
                !isVisible && styles.visibilityStatusHidden
              ]}>
                {isVisible ? 'Visible' : 'Hidden'}
              </Text>
            </View>
            <Text style={styles.visibilityDescription}>
              {isVisible 
                ? 'This will be shown on your profile'
                : 'This will be hidden from your profile'}
            </Text>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>
                {isVisible ? 'Visible in profile' : 'Hidden from profile'}
              </Text>
              <Switch
                value={isVisible}
                onValueChange={setIsVisible}
                trackColor={{ false: '#E0E0E0', true: '#000000' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </ScrollView>

        {/* Save Button */}
        <View style={styles.saveButtonContainer}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              !value && styles.saveButtonDisabled
            ]}
            onPress={handleSave}
            disabled={!value}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.saveButtonText,
              !value && styles.saveButtonTextDisabled
            ]}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 100,
  },
  inputContainer: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    marginBottom: 24,
  },
  input: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
    padding: 0,
  },
  optionsContainer: {
    gap: 1,
    marginBottom: 24,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FAFAFA',
  },
  optionItemSelected: {
    backgroundColor: '#F5F5F5',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
  },
  optionTextSelected: {
    fontWeight: '500',
  },
  visibilityContainer: {
    padding: 20,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  visibilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  visibilityLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  visibilityStatus: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.5)',
  },
  visibilityStatusHidden: {
    color: 'rgba(0, 0, 0, 0.3)',
    fontStyle: 'italic',
  },
  visibilityDescription: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.5)',
    marginBottom: 16,
    lineHeight: 18,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: '400',
    color: '#000000',
  },
  saveButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  saveButton: {
    width: '100%',
    height: 54,
    borderRadius: 27,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: '#F0F0F0',
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  saveButtonTextDisabled: {
    color: '#CCCCCC',
  },
});

export default ProfileFieldEditorScreen;

