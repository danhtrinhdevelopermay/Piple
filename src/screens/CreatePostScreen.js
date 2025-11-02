import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Video } from 'expo-av';
import { COLORS, SIZES } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const CreatePostScreen = ({ navigation }) => {
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const { addPost } = useApp();
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
      aspect: [1, 1],
      quality: 1,
      videoMaxDuration: 60,
    });

    if (!result.canceled) {
      setMedia(result.assets[0].uri);
      setMediaType(result.assets[0].type);
    }
  };

  const handlePost = async () => {
    if (!media) {
      Alert.alert('No media', 'Please select an image or video to post');
      return;
    }

    if (!user) {
      Alert.alert('Not logged in', 'Please log in to post');
      return;
    }

    try {
      const base64 = await FileSystem.readAsStringAsync(media, {
        encoding: 'base64',
      });
      
      const base64Data = `data:${mediaType === 'video' ? 'video/mp4' : 'image/jpeg'};base64,${base64}`;

      const response = await fetch('https://5f85e1a1-6900-4a2c-b86a-b62f5a3ff15e-00-713c2lm9s4b9.pike.replit.dev:3000/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          file: base64Data,
          type: mediaType 
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      const newPost = {
        image: data.url,
        mediaType: mediaType,
        caption: caption || 'New post',
        comments: 0,
        isLiked: false,
        isSaved: false,
        location: location || 'Unknown',
        timeAgo: 'Just now',
        likedBy: [],
      };

      addPost(newPost);
      Alert.alert('Success', 'Your post has been created!', [
        {
          text: 'OK',
          onPress: () => {
            setMedia(null);
            setMediaType(null);
            setCaption('');
            setLocation('');
            navigation.navigate('Home');
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create post: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Post</Text>
        <TouchableOpacity onPress={handlePost} disabled={!media}>
          <Text style={[styles.postButton, !media && styles.postButtonDisabled]}>Post</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 90 }}>
        <TouchableOpacity style={styles.imageSelector} onPress={pickMedia}>
          {media ? (
            mediaType === 'video' ? (
              <Video
                source={{ uri: media }}
                style={styles.selectedImage}
                useNativeControls
                resizeMode="cover"
                isLooping
              />
            ) : (
              <Image source={{ uri: media }} style={styles.selectedImage} />
            )
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="images" size={48} color={COLORS.grayDark} />
              <Text style={styles.placeholderText}>Tap to select image or video</Text>
            </View>
          )}
        </TouchableOpacity>

        {media && (
          <TouchableOpacity style={styles.changeImageButton} onPress={pickMedia}>
            <Text style={styles.changeImageText}>Change Media</Text>
          </TouchableOpacity>
        )}

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Caption</Text>
            <TextInput
              style={styles.captionInput}
              placeholder="Write a caption..."
              value={caption}
              onChangeText={setCaption}
              multiline
              maxLength={500}
            />
            <Text style={styles.characterCount}>{caption.length}/500</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Location</Text>
            <View style={styles.locationInput}>
              <Ionicons name="location-outline" size={20} color={COLORS.grayDark} />
              <TextInput
                style={styles.locationTextInput}
                placeholder="Add location"
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </View>

          <View style={styles.options}>
            <TouchableOpacity style={styles.option}>
              <Ionicons name="people-outline" size={22} color={COLORS.black} />
              <Text style={styles.optionText}>Tag People</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option}>
              <Ionicons name="musical-notes-outline" size={22} color={COLORS.black} />
              <Text style={styles.optionText}>Add Music</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option}>
              <Ionicons name="happy-outline" size={22} color={COLORS.black} />
              <Text style={styles.optionText}>Add Mood</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingTop: 60,
    paddingBottom: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  postButton: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  postButtonDisabled: {
    color: COLORS.grayDark,
  },
  imageSelector: {
    margin: SIZES.lg,
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: 400,
  },
  imagePlaceholder: {
    width: '100%',
    height: 400,
    backgroundColor: COLORS.grayLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    marginTop: SIZES.md,
    fontSize: 15,
    color: COLORS.grayDark,
  },
  changeImageButton: {
    alignSelf: 'center',
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.xl,
    borderRadius: 20,
    backgroundColor: COLORS.grayLight,
    marginBottom: SIZES.lg,
  },
  changeImageText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
  },
  form: {
    paddingHorizontal: SIZES.lg,
  },
  inputContainer: {
    marginBottom: SIZES.xl,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: SIZES.sm,
    color: COLORS.black,
  },
  captionInput: {
    borderWidth: 1.5,
    borderColor: COLORS.grayLight,
    borderRadius: 12,
    padding: SIZES.lg,
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: COLORS.grayDark,
    textAlign: 'right',
    marginTop: SIZES.xs,
  },
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.grayLight,
    borderRadius: 12,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
  },
  locationTextInput: {
    flex: 1,
    marginLeft: SIZES.sm,
    fontSize: 15,
  },
  options: {
    marginTop: SIZES.lg,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  optionText: {
    marginLeft: SIZES.lg,
    fontSize: 15,
    color: COLORS.black,
  },
});

export default CreatePostScreen;
