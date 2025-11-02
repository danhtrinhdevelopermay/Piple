import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const { width } = Dimensions.get('window');
const PHOTO_SIZE = (width - 6) / 3;

const ProfileScreen = ({ navigation, route }) => {
  const { toggleFollow, posts: allPosts } = useApp();
  const { user: currentUser, logout } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const userId = route?.params?.userId || currentUser?.id;
  const isOwnProfile = userId === currentUser?.id;
  
  const [activeTab, setActiveTab] = useState('grid');

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const userData = await api.getUserById(userId);
      setProfileUser(userData);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const handleFollowToggle = async () => {
    if (!isOwnProfile && profileUser) {
      await toggleFollow(profileUser.id);
      await loadProfile();
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading || !profileUser) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const user = profileUser;
  const userPosts = allPosts.filter(p => p.user?.id === userId);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {!isOwnProfile ? (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.black} />
          </TouchableOpacity>
        ) : (
          <Text style={styles.headerTitle}>Profile</Text>
        )}
        <View style={styles.headerRight}>
          {isOwnProfile && (
            <TouchableOpacity style={styles.headerIcon} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color={COLORS.black} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="ellipsis-horizontal" size={24} color={COLORS.black} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <Image source={{ uri: user.avatar }} style={styles.coverImage} />
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          </View>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.username}>@{user.username}</Text>

          <View style={styles.bioContainer}>
            {user.bio && (
              <View style={styles.bioRow}>
                <Ionicons name="briefcase-outline" size={14} color={COLORS.grayDark} />
                <Text style={styles.bioText}>{user.bio}</Text>
              </View>
            )}
            {user.location && (
              <View style={styles.bioRow}>
                <Ionicons name="location-outline" size={14} color={COLORS.grayDark} />
                <Text style={styles.bioText}>{user.location}</Text>
              </View>
            )}
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.posts || 0}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{formatNumber(user.followers || 0)}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.following || 0}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            {!isOwnProfile && (
              <>
                <TouchableOpacity style={styles.messageButton}>
                  <Ionicons name="mail-outline" size={20} color={COLORS.black} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.followButton, user.isFollowing && styles.followingButton]}
                  onPress={handleFollowToggle}
                >
                  <Text
                    style={[
                      styles.followButtonText,
                      user.isFollowing && styles.followingButtonText,
                    ]}
                  >
                    {user.isFollowing ? 'Following' : 'Follow'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
            {isOwnProfile && (
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'grid' && styles.activeTabButton]}
            onPress={() => setActiveTab('grid')}
          >
            <Ionicons
              name="grid-outline"
              size={22}
              color={activeTab === 'grid' ? COLORS.black : COLORS.grayDark}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'reels' && styles.activeTabButton]}
            onPress={() => setActiveTab('reels')}
          >
            <Ionicons
              name="play-outline"
              size={22}
              color={activeTab === 'reels' ? COLORS.black : COLORS.grayDark}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'tagged' && styles.activeTabButton]}
            onPress={() => setActiveTab('tagged')}
          >
            <Ionicons
              name="person-outline"
              size={22}
              color={activeTab === 'tagged' ? COLORS.black : COLORS.grayDark}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.photosGrid}>
          {userPosts.map((post, index) => (
            <TouchableOpacity key={post.id} style={styles.photoContainer}>
              <Image source={{ uri: post.image }} style={styles.photo} />
              {post.likes > 0 && (
                <View style={styles.photoOverlay}>
                  <Text style={styles.photoLikes}>❤️ {formatNumber(post.likes)}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {!isOwnProfile && (
        <TouchableOpacity style={styles.floatingButton}>
          <Ionicons name="add" size={28} color={COLORS.black} />
        </TouchableOpacity>
      )}
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
    backgroundColor: COLORS.white,
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerIcon: {
    marginLeft: SIZES.lg,
  },
  profileHeader: {
    position: 'relative',
    height: 180,
  },
  coverImage: {
    width: '100%',
    height: 120,
    backgroundColor: COLORS.grayLight,
  },
  avatarContainer: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: [{ translateX: -50 }],
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  profileInfo: {
    paddingHorizontal: SIZES.xl,
    paddingTop: SIZES.md,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SIZES.xs,
  },
  username: {
    fontSize: 15,
    color: COLORS.grayDark,
    textAlign: 'center',
    marginBottom: SIZES.lg,
  },
  bioContainer: {
    marginBottom: SIZES.lg,
  },
  bioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.xs,
  },
  bioText: {
    fontSize: 13,
    color: COLORS.grayDark,
    marginLeft: SIZES.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SIZES.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.grayLight,
    marginBottom: SIZES.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SIZES.xs,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.grayDark,
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: SIZES.xl,
    gap: SIZES.md,
  },
  messageButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.grayLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
  },
  followingButton: {
    backgroundColor: COLORS.grayLight,
  },
  followingButtonText: {
    color: COLORS.black,
  },
  editButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.grayLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
    paddingHorizontal: SIZES.xl,
  },
  tabButton: {
    flex: 1,
    paddingVertical: SIZES.md,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.black,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  photoContainer: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    top: SIZES.sm,
    right: SIZES.sm,
  },
  photoLikes: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 80,
    right: SIZES.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
});

export default ProfileScreen;
