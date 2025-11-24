import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  PanResponder,
  Dimensions,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/theme';
import globalStyles from '../../theme/globalStyles';
import { useNavigation } from '@react-navigation/native';
import { hapticSelection, hapticLight } from '../../utils/haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DatingPreferencesScreen = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [selectedGender, setSelectedGender] = useState('both');
  const [maxDistance, setMaxDistance] = useState(50);
  const [ageRange, setAgeRange] = useState({ min: 22, max: 35 });
  const [selectedReligion, setSelectedReligion] = useState('');
  const [selectedIntent, setSelectedIntent] = useState('');
  const [heightRange, setHeightRange] = useState({ min: 48, max: 84 }); // in inches (4'0" to 7'0")
  const [selectedSmoking, setSelectedSmoking] = useState('');
  const [selectedDrinking, setSelectedDrinking] = useState('');

  const genderOptions = ['Men', 'Women', 'Both'];
  const religionOptions = ['Any', 'Christian', 'Muslim', 'Hindu', 'Jewish', 'Buddhist', 'Atheist', 'Other'];
  const intentOptions = ['Looking for something meaningful', 'Slow Dating', 'Deep Conversations', 'Healing & Honest Energy'];
  const heightOptions = ['Any', "4'0\" - 4'11\"", "5'0\" - 5'11\"", "6'0\" - 6'11\"", "7'0\"+"];
  const smokingOptions = ['Any', 'No', 'Yes', 'Socially'];
  const drinkingOptions = ['Any', 'No', 'Yes', 'Socially'];

  // Slider refs for measuring
  const distanceSliderRef = useRef(null);
  const ageRangeSliderRef = useRef(null);
  const heightRangeSliderRef = useRef(null);

  // Helper function to calculate value from position
  const calculateDistanceValue = (locationX, width) => {
    const percentage = Math.max(0, Math.min(1, locationX / width));
    return Math.round(1 + percentage * 99);
  };

  const calculateAgeValue = (locationX, width) => {
    const percentage = Math.max(0, Math.min(1, locationX / width));
    return Math.round(18 + percentage * 42);
  };

  const calculateHeightValue = (locationX, width) => {
    const percentage = Math.max(0, Math.min(1, locationX / width));
    return Math.round(48 + percentage * 36); // 48 inches (4'0") to 84 inches (7'0")
  };

  const formatHeight = (inches) => {
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}'${remainingInches}"`;
  };

  // PanResponder for distance slider
  const distancePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const touchX = evt.nativeEvent.pageX;
        if (distanceSliderRef.current) {
          distanceSliderRef.current.measure((x, y, width, height, pageX, pageY) => {
            const relativeX = touchX - pageX;
            const value = calculateDistanceValue(relativeX, width);
            setMaxDistance(value);
            hapticLight();
          });
        }
      },
      onPanResponderMove: (evt) => {
        const touchX = evt.nativeEvent.pageX;
        if (distanceSliderRef.current) {
          distanceSliderRef.current.measure((x, y, width, height, pageX, pageY) => {
            const relativeX = touchX - pageX;
            const value = calculateDistanceValue(relativeX, width);
            setMaxDistance(value);
          });
        }
      },
      onPanResponderRelease: () => {
        hapticLight();
      },
    })
  ).current;

  // PanResponder for age range slider (both handles)
  const ageRangePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const touchX = evt.nativeEvent.pageX;
        if (ageRangeSliderRef.current) {
          ageRangeSliderRef.current.measure((x, y, width, height, pageX, pageY) => {
            const relativeX = touchX - pageX;
            const value = calculateAgeValue(relativeX, width);
            
            // Determine which thumb is closer
            const minPos = ((ageRange.min - 18) / 42) * width;
            const maxPos = ((ageRange.max - 18) / 42) * width;
            const distanceToMin = Math.abs(relativeX - minPos);
            const distanceToMax = Math.abs(relativeX - maxPos);
            
            if (distanceToMin < distanceToMax) {
              // Moving min thumb
              const newValue = Math.max(18, Math.min(ageRange.max - 1, value));
              setAgeRange({ ...ageRange, min: newValue });
            } else {
              // Moving max thumb
              const newValue = Math.max(ageRange.min + 1, Math.min(60, value));
              setAgeRange({ ...ageRange, max: newValue });
            }
            hapticLight();
          });
        }
      },
      onPanResponderMove: (evt) => {
        const touchX = evt.nativeEvent.pageX;
        if (ageRangeSliderRef.current) {
          ageRangeSliderRef.current.measure((x, y, width, height, pageX, pageY) => {
            const relativeX = touchX - pageX;
            const value = calculateAgeValue(relativeX, width);
            
            // Determine which thumb is closer
            const minPos = ((ageRange.min - 18) / 42) * width;
            const maxPos = ((ageRange.max - 18) / 42) * width;
            const distanceToMin = Math.abs(relativeX - minPos);
            const distanceToMax = Math.abs(relativeX - maxPos);
            
            if (distanceToMin < distanceToMax) {
              // Moving min thumb
              const newValue = Math.max(18, Math.min(ageRange.max - 1, value));
              setAgeRange({ ...ageRange, min: newValue });
            } else {
              // Moving max thumb
              const newValue = Math.max(ageRange.min + 1, Math.min(60, value));
              setAgeRange({ ...ageRange, max: newValue });
            }
          });
        }
      },
      onPanResponderRelease: () => {
        hapticLight();
      },
    })
  ).current;

  // PanResponder for height range slider (both handles)
  const heightRangePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const touchX = evt.nativeEvent.pageX;
        if (heightRangeSliderRef.current) {
          heightRangeSliderRef.current.measure((x, y, width, height, pageX, pageY) => {
            const relativeX = touchX - pageX;
            const value = calculateHeightValue(relativeX, width);
            
            // Determine which thumb is closer
            const minPos = ((heightRange.min - 48) / 36) * width;
            const maxPos = ((heightRange.max - 48) / 36) * width;
            const distanceToMin = Math.abs(relativeX - minPos);
            const distanceToMax = Math.abs(relativeX - maxPos);
            
            if (distanceToMin < distanceToMax) {
              // Moving min thumb
              const newValue = Math.max(48, Math.min(heightRange.max - 1, value));
              setHeightRange({ ...heightRange, min: newValue });
            } else {
              // Moving max thumb
              const newValue = Math.max(heightRange.min + 1, Math.min(84, value));
              setHeightRange({ ...heightRange, max: newValue });
            }
            hapticLight();
          });
        }
      },
      onPanResponderMove: (evt) => {
        const touchX = evt.nativeEvent.pageX;
        if (heightRangeSliderRef.current) {
          heightRangeSliderRef.current.measure((x, y, width, height, pageX, pageY) => {
            const relativeX = touchX - pageX;
            const value = calculateHeightValue(relativeX, width);
            
            // Determine which thumb is closer
            const minPos = ((heightRange.min - 48) / 36) * width;
            const maxPos = ((heightRange.max - 48) / 36) * width;
            const distanceToMin = Math.abs(relativeX - minPos);
            const distanceToMax = Math.abs(relativeX - maxPos);
            
            if (distanceToMin < distanceToMax) {
              // Moving min thumb
              const newValue = Math.max(48, Math.min(heightRange.max - 1, value));
              setHeightRange({ ...heightRange, min: newValue });
            } else {
              // Moving max thumb
              const newValue = Math.max(heightRange.min + 1, Math.min(84, value));
              setHeightRange({ ...heightRange, max: newValue });
            }
          });
        }
      },
      onPanResponderRelease: () => {
        hapticLight();
      },
    })
  ).current;

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: 4 }]}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            hapticSelection();
            navigation.goBack();
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
          Dating Preferences
        </Text>
        <View style={styles.closeButton} />
      </View>

      <ScrollView
        style={globalStyles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Who are you interested in */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Who are you interested in?
          </Text>
          <View style={styles.optionsRow}>
            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: selectedGender === option.toLowerCase() ? '#000000' : '#F8F8F8',
                    borderColor: selectedGender === option.toLowerCase() ? '#000000' : '#E8E8E8',
                  },
                ]}
                onPress={() => {
                  hapticSelection();
                  setSelectedGender(option.toLowerCase());
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    {
                      color: selectedGender === option.toLowerCase() ? '#FFFFFF' : '#111111',
                    },
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* My Location */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            My Location
          </Text>
          <TouchableOpacity
            style={[styles.inputField, { borderColor: theme.colors.border }]}
            activeOpacity={0.7}
          >
            <Text style={[styles.inputText, { color: theme.colors.textPrimary }]}>
              San Francisco, CA
            </Text>
            <Ionicons name="location-outline" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Maximum Distance */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Maximum Distance: {maxDistance} km
          </Text>
          <View style={styles.sliderContainer}>
            <Text style={[styles.sliderLabel, { color: theme.colors.textSecondary }]}>1 km</Text>
            <View
              ref={distanceSliderRef}
              style={styles.sliderWrapper}
              {...distancePanResponder.panHandlers}
            >
              <View style={[styles.sliderTrack, { backgroundColor: theme.colors.border }]}>
                <View
                  style={[
                    styles.sliderFill,
                    { width: `${((maxDistance - 1) / 99) * 100}%`, backgroundColor: '#000000' },
                  ]}
                />
              </View>
              <View
                style={[
                  styles.sliderThumb,
                  { left: `${((maxDistance - 1) / 99) * 100}%`, backgroundColor: '#000000' },
                ]}
              >
                <View style={styles.sliderThumbInner} />
              </View>
            </View>
            <Text style={[styles.sliderLabel, { color: theme.colors.textSecondary }]}>100 km</Text>
          </View>
        </View>

        {/* Age Range */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Age Range: {ageRange.min} - {ageRange.max}
          </Text>
          <View style={styles.rangeSliderContainer}>
            <Text style={[styles.rangeLabel, { color: theme.colors.textSecondary }]}>18</Text>
            <View
              ref={ageRangeSliderRef}
              style={styles.rangeSliderWrapper}
              {...ageRangePanResponder.panHandlers}
            >
              <View style={[styles.rangeSliderTrack, { backgroundColor: theme.colors.border }]}>
                <View
                  style={[
                    styles.rangeSliderFill,
                    {
                      left: `${((ageRange.min - 18) / 42) * 100}%`,
                      width: `${((ageRange.max - ageRange.min) / 42) * 100}%`,
                      backgroundColor: '#000000',
                    },
                  ]}
                />
              </View>
              <View
                style={[
                  styles.rangeSliderThumb,
                  { left: `${((ageRange.min - 18) / 42) * 100}%`, backgroundColor: '#000000' },
                ]}
              >
                <View style={styles.sliderThumbInner} />
              </View>
              <View
                style={[
                  styles.rangeSliderThumb,
                  { left: `${((ageRange.max - 18) / 42) * 100}%`, backgroundColor: '#000000' },
                ]}
              >
                <View style={styles.sliderThumbInner} />
              </View>
            </View>
            <Text style={[styles.rangeLabel, { color: theme.colors.textSecondary }]}>60</Text>
          </View>
        </View>

        {/* Religion */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Religion</Text>
          <View style={styles.optionsGrid}>
            {religionOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionChip,
                  {
                    backgroundColor: selectedReligion === option ? '#000000' : '#F8F8F8',
                    borderColor: selectedReligion === option ? '#000000' : '#E8E8E8',
                  },
                ]}
                onPress={() => {
                  hapticSelection();
                  setSelectedReligion(selectedReligion === option ? '' : option);
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionChipText,
                    {
                      color: selectedReligion === option ? '#FFFFFF' : '#111111',
                    },
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Dating Intent */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Dating Intent</Text>
          <View style={styles.optionsColumn}>
            {intentOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionChip,
                  {
                    backgroundColor: selectedIntent === option ? '#000000' : '#F8F8F8',
                    borderColor: selectedIntent === option ? '#000000' : '#E8E8E8',
                  },
                ]}
                onPress={() => {
                  hapticSelection();
                  setSelectedIntent(selectedIntent === option ? '' : option);
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionChipText,
                    {
                      color: selectedIntent === option ? '#FFFFFF' : '#111111',
                    },
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Height */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Height: {formatHeight(heightRange.min)} - {formatHeight(heightRange.max)}
          </Text>
          <View style={styles.rangeSliderContainer}>
            <Text style={[styles.rangeLabel, { color: theme.colors.textSecondary }]}>4'0"</Text>
            <View
              ref={heightRangeSliderRef}
              style={styles.rangeSliderWrapper}
              {...heightRangePanResponder.panHandlers}
            >
              <View style={[styles.rangeSliderTrack, { backgroundColor: theme.colors.border }]}>
                <View
                  style={[
                    styles.rangeSliderFill,
                    {
                      left: `${((heightRange.min - 48) / 36) * 100}%`,
                      width: `${((heightRange.max - heightRange.min) / 36) * 100}%`,
                      backgroundColor: '#000000',
                    },
                  ]}
                />
              </View>
              <View
                style={[
                  styles.rangeSliderThumb,
                  { left: `${((heightRange.min - 48) / 36) * 100}%`, backgroundColor: '#000000' },
                ]}
              >
                <View style={styles.sliderThumbInner} />
              </View>
              <View
                style={[
                  styles.rangeSliderThumb,
                  { left: `${((heightRange.max - 48) / 36) * 100}%`, backgroundColor: '#000000' },
                ]}
              >
                <View style={styles.sliderThumbInner} />
              </View>
            </View>
            <Text style={[styles.rangeLabel, { color: theme.colors.textSecondary }]}>7'0"</Text>
          </View>
        </View>

        {/* Smoking */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Smoking</Text>
          <View style={styles.optionsRow}>
            {smokingOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionChip,
                  {
                    backgroundColor: selectedSmoking === option ? '#000000' : '#F8F8F8',
                    borderColor: selectedSmoking === option ? '#000000' : '#E8E8E8',
                  },
                ]}
                onPress={() => {
                  hapticSelection();
                  setSelectedSmoking(selectedSmoking === option ? '' : option);
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionChipText,
                    {
                      color: selectedSmoking === option ? '#FFFFFF' : '#111111',
                    },
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Drinking */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Drinking</Text>
          <View style={styles.optionsRow}>
            {drinkingOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionChip,
                  {
                    backgroundColor: selectedDrinking === option ? '#000000' : '#F8F8F8',
                    borderColor: selectedDrinking === option ? '#000000' : '#E8E8E8',
                  },
                ]}
                onPress={() => {
                  hapticSelection();
                  setSelectedDrinking(selectedDrinking === option ? '' : option);
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionChipText,
                    {
                      color: selectedDrinking === option ? '#FFFFFF' : '#111111',
                    },
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionsColumn: {
    gap: 12,
  },
  optionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 100,
    alignItems: 'center',
  },
  optionButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
  optionChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  optionChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: '#F8F8F8',
  },
  inputText: {
    fontSize: 15,
    fontWeight: '400',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sliderWrapper: {
    flex: 1,
    height: 20,
    position: 'relative',
    justifyContent: 'center',
  },
  sliderTrack: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    position: 'absolute',
  },
  sliderFill: {
    height: '100%',
    borderRadius: 2,
    position: 'absolute',
    left: 0,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
    marginLeft: -10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderThumbInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  sliderTouchPoint: {
    position: 'absolute',
    width: 40,
    height: 40,
    marginLeft: -20,
    marginTop: -18,
  },
  sliderLabel: {
    fontSize: 12,
    fontWeight: '400',
    minWidth: 40,
  },
  ageRangeContainer: {
    gap: 20,
  },
  ageSliderContainer: {
    gap: 8,
  },
  ageLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  rangeSliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rangeSliderWrapper: {
    flex: 1,
    height: 20,
    position: 'relative',
    justifyContent: 'center',
  },
  rangeSliderTrack: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    position: 'absolute',
  },
  rangeSliderFill: {
    height: '100%',
    borderRadius: 2,
    position: 'absolute',
  },
  rangeSliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
    marginLeft: -10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rangeLabel: {
    fontSize: 12,
    fontWeight: '400',
    minWidth: 40,
  },
});

export default DatingPreferencesScreen;

