import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

const StoryItem = ({ story, onPress }) => {
  const { user, isYourStory, isLive, isSeen } = story;

  if (!user) return null;

  return (
    <TouchableOpacity onPress={() => onPress(story)} style={styles.container}>
      <View style={styles.avatarContainer}>
        <View
          style={[
            styles.avatarBorder,
            isSeen && !isYourStory && styles.seenBorder,
            isLive && styles.liveBorder,
          ]}
        >
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        </View>
        {isYourStory && (
          <View style={styles.addButton}>
            <Ionicons name="add" size={16} color={COLORS.white} />
          </View>
        )}
        {isLive && (
          <View style={styles.liveBadge}>
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}
      </View>
      <Text style={styles.username} numberOfLines={1}>
        {isYourStory ? 'Your story' : user.username}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: SIZES.md,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarBorder: {
    padding: 3,
    borderRadius: 35,
    borderWidth: 2.5,
    borderColor: COLORS.primary,
  },
  seenBorder: {
    borderColor: COLORS.grayDark,
  },
  liveBorder: {
    borderColor: COLORS.pink,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  addButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  liveBadge: {
    position: 'absolute',
    bottom: -2,
    left: '50%',
    transform: [{ translateX: -18 }],
    backgroundColor: COLORS.pink,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  liveText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: 'bold',
  },
  username: {
    marginTop: SIZES.xs,
    fontSize: 11,
    color: COLORS.black,
    maxWidth: 70,
  },
});

export default StoryItem;
