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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

const { width, height } = Dimensions.get('window');
const STORY_DURATION = 5000;

const StoryViewerScreen = ({ route, navigation }) => {
  const { stories, initialIndex = 0 } = route.params;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress] = useState(new Animated.Value(0));
  const [isPaused, setIsPaused] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const animationRef = useRef(null);

  useEffect(() => {
    progress.setValue(0);
    
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
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="paper-plane-outline" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
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
});

export default StoryViewerScreen;
