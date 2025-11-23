import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Alert } from 'react-native';
import { useTheme } from '../../theme/theme';
import globalStyles from '../../theme/globalStyles';
import { useAddPhotos } from './hooks/useAddPhotos';

// Dev mode flag
const __DEV__ = true;

/**
 * AddPhotosScreen - Step 5 of onboarding
 * Frictionless photo upload with 3 mandatory photos, max 6
 */
const AddPhotosScreen = React.memo(() => {
  const theme = useTheme();
  const [photos, setPhotos] = useState([]);

  const { handleContinue, handleResetToLaunch, handleAddPhoto, handleRemovePhoto } = useAddPhotos(photos, setPhotos);

  const maxPhotos = 6;
  const minPhotos = 3;
  const photoSlots = useMemo(() => {
    const slots = [];
    for (let i = 0; i < maxPhotos; i++) {
      slots.push({
        id: i,
        isRequired: i < minPhotos,
        photo: photos[i] || null,
      });
    }
    return slots;
  }, [photos]);

  const canContinue = useMemo(() => {
    return photos.length >= minPhotos;
  }, [photos.length]);

  const handlePhotoPress = useCallback((slotIndex) => {
    if (photos[slotIndex]) {
      // Photo exists - show option to remove or replace
      Alert.alert(
        'Photo Options',
        'What would you like to do?',
        [
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => handleRemovePhoto(slotIndex),
          },
          {
            text: 'Replace',
            onPress: () => handleAddPhoto(slotIndex),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } else {
      // No photo - add new one
      handleAddPhoto(slotIndex);
    }
  }, [photos, handleAddPhoto, handleRemovePhoto]);

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={[globalStyles.content, styles.container]}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
              Add Photos
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Add at least 3 photos to get started
            </Text>
          </View>

          {/* Photo Grid */}
          <View style={styles.photoGrid}>
            {photoSlots.map((slot, index) => (
              <TouchableOpacity
                key={slot.id}
                style={[
                  styles.photoSlot,
                  {
                    borderColor: theme.colors.border,
                    borderWidth: 1,
                    borderStyle: slot.photo ? 'solid' : 'dashed',
                  },
                ]}
                onPress={() => handlePhotoPress(index)}
                activeOpacity={0.7}
              >
                {slot.photo ? (
                  <>
                    <Image 
                      source={{ uri: slot.photo.uri }} 
                      style={styles.photoImage}
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleRemovePhoto(index);
                      }}
                    >
                      <Text style={styles.removeButtonText}>×</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Text style={[styles.plusIcon, { color: theme.colors.textSecondary }]}>
                      +
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Info Text */}
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            {photos.length < minPhotos 
              ? `${minPhotos - photos.length} more photo${minPhotos - photos.length > 1 ? 's' : ''} required`
              : photos.length < maxPhotos
              ? `You can add ${maxPhotos - photos.length} more photo${maxPhotos - photos.length > 1 ? 's' : ''}`
              : 'Maximum photos reached'}
          </Text>

          {/* Continue Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                {
                  backgroundColor: canContinue 
                    ? theme.colors.primaryBlack 
                    : theme.colors.border,
                  opacity: canContinue ? 1 : 0.5,
                },
              ]}
              onPress={handleContinue}
              disabled={!canContinue}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.continueButtonText,
                  {
                    color: canContinue 
                      ? theme.colors.primaryWhite 
                      : theme.colors.textSecondary,
                  },
                ]}
              >
                Continue
              </Text>
            </TouchableOpacity>
          </View>

          {/* Dev-only: Reset button */}
          {__DEV__ && (
            <TouchableOpacity
              onPress={handleResetToLaunch}
              style={styles.devResetButton}
              activeOpacity={0.7}
            >
              <Text style={[styles.devResetText, { color: theme.colors.textSecondary }]}>
                [Dev] Reset to Launch
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
});

AddPhotosScreen.displayName = 'AddPhotosScreen';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    paddingTop: 24,
    paddingBottom: 24,
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    width: '100%',
    flex: 1,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 22,
  },
  photoGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
    flex: 1,
  },
  photoSlot: {
    width: '30%',
    aspectRatio: 0.75, // 3:4 ratio
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    fontSize: 24,
    fontWeight: '300',
  },
  removeButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 18,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 0,
  },
  continueButton: {
    width: '100%',
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  devResetButton: {
    marginTop: 32,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
  },
  devResetText: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
    opacity: 0.6,
  },
});

export default AddPhotosScreen;

