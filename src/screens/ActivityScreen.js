import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const ActivityScreen = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    if (!user) return;
    try {
      const data = await api.getNotifications(user.id);
      setNotifications(data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.markNotificationRead(notificationId, user.id);
      loadNotifications();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 90 }}>
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <TouchableOpacity 
              key={notification.id} 
              style={[
                styles.notificationItem,
                !notification.isRead && styles.unreadNotification
              ]}
              onPress={() => handleMarkAsRead(notification.id)}
            >
              {notification.actor && (
                <Image source={{ uri: notification.actor.avatar }} style={styles.avatar} />
              )}
              <View style={styles.notificationContent}>
                <Text style={styles.notificationText}>
                  {notification.actor && (
                    <Text style={styles.username}>{notification.actor.name}</Text>
                  )}
                  {notification.type === 'like' && ' liked your post'}
                  {notification.type === 'follow' && ' started following you'}
                  {notification.type === 'comment' && ' commented on your post'}
                </Text>
                <Text style={styles.time}>{notification.timeAgo}</Text>
              </View>
              {notification.postId && (
                <View style={styles.postThumbnail} />
              )}
              {notification.type === 'follow' && (
                <TouchableOpacity style={styles.followButton}>
                  <Text style={styles.followButtonText}>Follow</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
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
  unreadNotification: {
    backgroundColor: '#f8f8f8',
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
    backgroundColor: COLORS.grayLight,
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
  emptyState: {
    padding: SIZES.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.grayDark,
  },
});

export default ActivityScreen;
