import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

const { width } = Dimensions.get('window');

const PostItem = ({ post, onLike, onComment, onSave, onShare, onUserPress }) => {
  if (!post || !post.user) return null;
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onUserPress} style={styles.userInfo}>
          <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
          <View style={styles.userDetails}>
            <Text style={styles.username}>{post.user.username}</Text>
            <View style={styles.locationContainer}>
              <Text style={styles.location}>{post.location}</Text>
              <Text style={styles.dot}> • </Text>
              <Text style={styles.timeAgo}>{post.timeAgo}</Text>
              <Ionicons name="earth" size={12} color={COLORS.grayDark} style={{ marginLeft: 4 }} />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color={COLORS.black} />
        </TouchableOpacity>
      </View>

      <Image source={{ uri: post.image }} style={styles.postImage} />

      <View style={styles.footer}>
        <View style={styles.actions}>
          <TouchableOpacity onPress={onLike} style={styles.actionButton}>
            <Ionicons
              name={post.isLiked ? 'heart' : 'heart-outline'}
              size={26}
              color={post.isLiked ? COLORS.pink : COLORS.black}
            />
            <Text style={styles.actionText}>{post.likes} Likes</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onComment} style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={24} color={COLORS.black} />
            <Text style={styles.actionText}>{post.comments} Comments</Text>
          </TouchableOpacity>

          <View style={{ flex: 1 }} />

          <TouchableOpacity onPress={onShare} style={styles.iconButton}>
            <Ionicons name="share-outline" size={24} color={COLORS.black} />
          </TouchableOpacity>

          <TouchableOpacity onPress={onSave} style={styles.iconButton}>
            <Ionicons
              name={post.isSaved ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={COLORS.black}
            />
          </TouchableOpacity>
        </View>

        {post.likedBy && (
          <View style={styles.likedByContainer}>
            <Text style={styles.likedByText}>
              <Text style={styles.emoji}>👍😂 </Text>
              <Text style={styles.bold}>{post.likedBy[0]}</Text>
              {post.likedBy.length > 1 && (
                <Text> and {post.likedBy.length > 2 ? 'others' : post.likedBy[1]}</Text>
              )}
            </Text>
          </View>
        )}

        <View style={styles.captionContainer}>
          <Text style={styles.username}>{post.user.username}</Text>
          <Text style={styles.caption}> {post.caption}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    marginBottom: SIZES.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  userDetails: {
    marginLeft: SIZES.md,
  },
  username: {
    fontWeight: '600',
    fontSize: 14,
    color: COLORS.black,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 12,
    color: COLORS.grayDark,
  },
  dot: {
    color: COLORS.grayDark,
  },
  timeAgo: {
    fontSize: 12,
    color: COLORS.grayDark,
  },
  postImage: {
    width: width,
    height: width,
    backgroundColor: COLORS.grayLight,
  },
  footer: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SIZES.lg,
  },
  actionText: {
    marginLeft: SIZES.xs,
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.black,
  },
  iconButton: {
    marginLeft: SIZES.md,
  },
  likedByContainer: {
    marginBottom: SIZES.xs,
  },
  likedByText: {
    fontSize: 13,
    color: COLORS.black,
  },
  emoji: {
    fontSize: 13,
  },
  bold: {
    fontWeight: '600',
  },
  captionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  caption: {
    fontSize: 13,
    color: COLORS.black,
  },
});

export default PostItem;
