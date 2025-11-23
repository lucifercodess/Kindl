import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

/**
 * Custom hook for AddPhotosScreen logic
 * 
 * @param {Array} photos - Current photos array
 * @param {Function} setPhotos - Setter for photos state
 * @returns {Object} Handlers for AddPhotosScreen
 */
export const useAddPhotos = (photos, setPhotos) => {
  const navigation = useNavigation();

  const handleAddPhoto = useCallback(async (index) => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to add photos!');
        return;
      }

      // Launch image picker with editing enabled
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newPhotos = [...photos];
        newPhotos[index] = {
          uri: result.assets[0].uri,
          width: result.assets[0].width,
          height: result.assets[0].height,
        };
        setPhotos(newPhotos);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Failed to pick image. Please try again.');
    }
  }, [photos, setPhotos]);

  const handleRemovePhoto = useCallback((index) => {
    const newPhotos = [...photos];
    // Remove photo at index and shift remaining photos
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  }, [photos, setPhotos]);

  const handleContinue = useCallback(() => {
    if (photos.length < 3) return;
    
    // TODO: Upload photos to server and save to user profile
    console.log('Photos to upload:', photos);
    
    // Navigate to Step 6: How do you connect?
    navigation.navigate('HowDoYouConnect');
  }, [photos, navigation]);

  // Dev-only: Reset to Launch screen
  const handleResetToLaunch = useCallback(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Launch' }],
      })
    );
  }, [navigation]);

  return {
    handleAddPhoto,
    handleRemovePhoto,
    handleContinue,
    handleResetToLaunch,
  };
};

