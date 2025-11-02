import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  PanResponder,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

const API_URL = 'https://cb4955db-6863-4613-88d5-eff4a06b72ab-00-3cuasoe1bctos.sisko.replit.dev:3000/api';

const { width, height } = Dimensions.get('window');
const STORY_DURATION = 5000;

const StoryViewerScreen = ({ route, navigation }) => {
  const { stories, initialIndex = 0 } = route.params;
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress] = useState(new Animated.Value(0));
  const [isPaused, setIsPaused] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [showViewers, setShowViewers] = useState(false);
  const animationRef = useRef(null);
  const [viewers, setViewers] = useState([]);

  useEffect(() => {
    progress.setValue(0);
    trackStoryView();
    
    if (!isPaused) {
      const animation = Animated.timing(progress, {
        toValue: 1,
        duration: STORY_DURATION,
        useNativeDriver: false,
      });
      
      animationRef.current = animation;
      animation.start(({ finished }) => {
        if (finished && !isPaused) {
          handleNext();
        }
      });

      return () => animation.stop();
    }
  }, [currentIndex, isPaused]);

  useEffect(() => {
    const currentStory = stories[currentIndex];
    if (user && currentStory.user.id === user.id) {
      fetchViewers();
    }
  }, [currentIndex]);

  const trackStoryView = async () => {
    if (!user) return;
    
    const currentStory = stories[currentIndex];
    if (currentStory.user.id === user.id) return;
    
    try {
      await fetch(`${API_URL}/stories/${currentStory.id}/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
    } catch (error) {
      console.error('Failed to track story view:', error);
    }
  };

  const fetchViewers = async () => {
    const currentStory = stories[currentIndex];
    try {
      const response = await fetch(`${API_URL}/stories/${currentStory.id}/viewers`);
      const data = await response.json();
      setViewers(data);
    } catch (error) {
      console.error('Failed to fetch viewers:', error);
    }
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.goBack();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handlePressIn = () => {
    setIsPaused(true);
    if (animationRef.current) {
      animationRef.current.stop();
    }
  };

  const handlePressOut = () => {
    setIsPaused(false);
  };

  const handlePress = (evt) => {
    const x = evt.nativeEvent.locationX;
    if (x < width / 2) {
      handlePrevious();
    } else {
      handleNext();
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 20;
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 50) {
          handlePrevious();
        } else if (gestureState.dx < -50) {
          handleNext();
        }
      },
    })
  ).current;

  const currentStory = stories[currentIndex];
  const isOwnStory = user && currentStory.user.id === user.id;

  const renderViewerItem = ({ item }) => (
    <View style={styles.viewerItem}>
      <Image source={{ uri: item.avatar }} style={styles.viewerAvatar} />
      <View style={styles.viewerInfo}>
        <Text style={styles.viewerName}>{item.name}</Text>
        <Text style={styles.viewerTime}>{item.time}</Text>
      </View>
      {item.isVerified && (
        <Ionicons name="checkmark-circle" size={16} color="#3897f0" />
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="black" />
      
      <Image source={{ uri: currentStory.image }} style={styles.storyImage} />
      
      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'transparent', 'transparent', 'rgba(0,0,0,0.6)']}
        locations={[0, 0.2, 0.8, 1]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.progressContainer}>
            {stories.map((_, index) => (
              <View key={index} style={styles.progressBarContainer}>
                <Animated.View
                  style={[
                    styles.progressBar,
                    {
                      width:
                        index === currentIndex
                          ? progress.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0%', '100%'],
                            })
                          : index < currentIndex
                          ? '100%'
                          : '0%',
                    },
                  ]}
                />
              </View>
            ))}
          </View>

          <View style={styles.userInfo}>
            <Image source={{ uri: currentStory.user.avatar }} style={styles.avatar} />
            <View style={styles.userTextContainer}>
              <Text style={styles.username}>{currentStory.user.name}</Text>
              <Text style={styles.time}>{currentStory.timeAgo}</Text>
            </View>
            {isOwnStory && (
              <TouchableOpacity style={styles.moreButton} onPress={() => {}}>
                <Ionicons name="ellipsis-horizontal" size={24} color={COLORS.white} />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
              <Ionicons name="close" size={30} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={1}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.touchArea}
          {...panResponder.panHandlers}
        />

        <View style={styles.footer}>
          {isOwnStory ? (
            <TouchableOpacity 
              style={styles.viewersButton}
              onPress={() => setShowViewers(!showViewers)}
            >
              <Ionicons name="eye-outline" size={20} color={COLORS.white} />
              <Text style={styles.viewersText}>{viewers.length} views</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.replyContainer}>
              <TouchableOpacity 
                style={styles.replyInput}
                onPress={() => setShowReply(!showReply)}
              >
                <Ionicons name="chatbubble-outline" size={20} color={COLORS.white} />
                <Text style={styles.replyPlaceholder}>Reply...</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="heart-outline" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </LinearGradient>

      {isOwnStory && showViewers && (
        <View style={styles.viewersModal}>
          <View style={styles.viewersHeader}>
            <Text style={styles.viewersTitle}>Viewers</Text>
            <TouchableOpacity onPress={() => setShowViewers(false)}>
              <Ionicons name="close" size={24} color={COLORS.black} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={viewers}
            renderItem={renderViewerItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.viewersList}
          />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  storyImage: {
    width: width,
    height: height,
    resizeMode: 'cover',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 12,
  },
  progressBarContainer: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  userTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  username: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
  },
  time: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    marginTop: 2,
  },
  closeButton: {
    padding: 5,
  },
  touchArea: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 12,
    paddingBottom: 30,
  },
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  replyInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    gap: 8,
  },
  replyPlaceholder: {
    color: COLORS.white,
    fontSize: 15,
    opacity: 0.8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  moreButton: {
    padding: 5,
    marginRight: 10,
  },
  viewersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    gap: 8,
  },
  viewersText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
  },
  viewersModal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.6,
    paddingBottom: 20,
  },
  viewersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  viewersTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.black,
  },
  viewersList: {
    paddingHorizontal: 20,
  },
  viewerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  viewerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  viewerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  viewerName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.black,
  },
  viewerTime: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
});

export default StoryViewerScreen;
