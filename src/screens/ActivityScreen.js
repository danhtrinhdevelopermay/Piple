import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

const ActivityScreen = () => {
  const notifications = [
    {
      id: 1,
      user: { name: 'Sarah Johnson', avatar: 'https://i.pravatar.cc/150?img=5' },
      type: 'like',
      post: 'https://images.unsplash.com/photo-1581349485608-9469926a8e5e?w=100',
      time: '2m ago',
    },
    {
      id: 2,
      user: { name: 'Mike Chen', avatar: 'https://i.pravatar.cc/150?img=13' },
      type: 'follow',
      time: '15m ago',
    },
    {
      id: 3,
      user: { name: 'Emma Davis', avatar: 'https://i.pravatar.cc/150?img=9' },
      type: 'comment',
      post: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100',
      time: '1h ago',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {notifications.map((notification) => (
          <TouchableOpacity key={notification.id} style={styles.notificationItem}>
            <Image source={{ uri: notification.user.avatar }} style={styles.avatar} />
            <View style={styles.notificationContent}>
              <Text style={styles.notificationText}>
                <Text style={styles.username}>{notification.user.name}</Text>
                {notification.type === 'like' && ' liked your post'}
                {notification.type === 'follow' && ' started following you'}
                {notification.type === 'comment' && ' commented on your post'}
              </Text>
              <Text style={styles.time}>{notification.time}</Text>
            </View>
            {notification.post && (
              <Image source={{ uri: notification.post }} style={styles.postThumbnail} />
            )}
            {notification.type === 'follow' && (
              <TouchableOpacity style={styles.followButton}>
                <Text style={styles.followButtonText}>Follow</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))}
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
    paddingHorizontal: SIZES.lg,
    paddingTop: 60,
    paddingBottom: SIZES.md,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  notificationContent: {
    flex: 1,
    marginLeft: SIZES.md,
  },
  notificationText: {
    fontSize: 14,
    marginBottom: SIZES.xs,
  },
  username: {
    fontWeight: '600',
  },
  time: {
    fontSize: 12,
    color: COLORS.grayDark,
  },
  postThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  followButton: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.sm,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
  },
});

export default ActivityScreen;
