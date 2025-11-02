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
import { COLORS, SIZES } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const CreatePostScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const { addPost } = useApp();
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
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePost = () => {
    if (!image) {
      Alert.alert('No image', 'Please select an image to post');
      return;
    }

    if (!user) {
      Alert.alert('Not logged in', 'Please log in to post');
      return;
    }

    const newPost = {
      image: image,
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
          setImage(null);
          setCaption('');
          setLocation('');
          navigation.navigate('Home');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Post</Text>
        <TouchableOpacity onPress={handlePost} disabled={!image}>
          <Text style={[styles.postButton, !image && styles.postButtonDisabled]}>Post</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.imageSelector} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.selectedImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera" size={48} color={COLORS.grayDark} />
              <Text style={styles.placeholderText}>Tap to select an image</Text>
            </View>
          )}
        </TouchableOpacity>

        {image && (
          <TouchableOpacity style={styles.changeImageButton} onPress={pickImage}>
            <Text style={styles.changeImageText}>Change Image</Text>
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
