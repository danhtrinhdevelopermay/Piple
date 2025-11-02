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
import { COLORS, SIZES } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const CreateStoryScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addStory } = useApp();
  const { user } = useAuth();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to your photo library');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleShare = async () => {
    if (!image) {
      Alert.alert('No image', 'Please select an image for your story');
      return;
    }

    if (!user) {
      Alert.alert('Not logged in', 'Please log in to share story');
      return;
    }

    setLoading(true);
    
    const result = await addStory({
      userId: user.id,
      image: image,
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
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Story</Text>
        <TouchableOpacity onPress={handleShare} disabled={!image || loading}>
          <Text style={[styles.shareButton, (!image || loading) && styles.shareButtonDisabled]}>
            {loading ? 'Sharing...' : 'Share'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {image ? (
          <Image source={{ uri: image }} style={styles.selectedImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="camera" size={64} color={COLORS.white} />
            <Text style={styles.placeholderText}>Tap below to select an image</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        {image && (
          <TouchableOpacity style={styles.changeImageButton} onPress={pickImage}>
            <Ionicons name="images" size={24} color={COLORS.white} />
            <Text style={styles.changeImageText}>Change Image</Text>
          </TouchableOpacity>
        )}
        
        {!image && (
          <TouchableOpacity style={styles.selectImageButton} onPress={pickImage}>
            <Ionicons name="add-circle" size={24} color={COLORS.white} />
            <Text style={styles.selectImageText}>Select Image</Text>
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
