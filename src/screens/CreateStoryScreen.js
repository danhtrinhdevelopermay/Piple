import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import { COLORS, SIZES } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const CreateStoryScreen = ({ navigation }) => {
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addStory } = useApp();
  const { user } = useAuth();

  const pickMedia = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to your media library');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
      videoMaxDuration: 60,
    });

    if (!result.canceled) {
      setMedia(result.assets[0].uri);
      setMediaType(result.assets[0].type);
    }
  };

  const handleShare = async () => {
    if (!media) {
      Alert.alert('No media', 'Please select an image or video for your story');
      return;
    }

    if (!user) {
      Alert.alert('Not logged in', 'Please log in to share story');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('https://piple-server-api.onrender.com/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          file: media,
          type: mediaType 
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      const result = await addStory({
        userId: user.id,
        image: data.url,
        mediaType: mediaType,
        isLive: false,
      });

      setLoading(false);

      if (result.success) {
        Alert.alert('Success', 'Your story has been shared!', [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('Home');
            },
          },
        ]);
      } else {
        Alert.alert('Error', result.error || 'Failed to share story');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to share story: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Story</Text>
        <TouchableOpacity onPress={handleShare} disabled={!media || loading}>
          <Text style={[styles.shareButton, (!media || loading) && styles.shareButtonDisabled]}>
            {loading ? 'Sharing...' : 'Share'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {media ? (
          mediaType === 'video' ? (
            <Video
              source={{ uri: media }}
              style={styles.selectedImage}
              useNativeControls
              resizeMode="contain"
              isLooping
            />
          ) : (
            <Image source={{ uri: media }} style={styles.selectedImage} />
          )
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="camera" size={64} color={COLORS.white} />
            <Text style={styles.placeholderText}>Tap below to select media</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        {media && (
          <TouchableOpacity style={styles.changeImageButton} onPress={pickMedia}>
            <Ionicons name="images" size={24} color={COLORS.white} />
            <Text style={styles.changeImageText}>Change Media</Text>
          </TouchableOpacity>
        )}
        
        {!media && (
          <TouchableOpacity style={styles.selectImageButton} onPress={pickMedia}>
            <Ionicons name="add-circle" size={24} color={COLORS.white} />
            <Text style={styles.selectImageText}>Select Media</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingTop: 60,
    paddingBottom: SIZES.md,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
  },
  shareButton: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  shareButtonDisabled: {
    color: COLORS.grayDark,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    marginTop: SIZES.lg,
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.7,
  },
  footer: {
    paddingHorizontal: SIZES.lg,
    paddingBottom: 40,
  },
  selectImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.lg,
    borderRadius: 30,
  },
  selectImageText: {
    marginLeft: SIZES.sm,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  changeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: SIZES.lg,
    borderRadius: 30,
  },
  changeImageText: {
    marginLeft: SIZES.sm,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CreateStoryScreen;
