import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

const { width, height } = Dimensions.get('window');
const STORY_DURATION = 5000;

const StoryViewerScreen = ({ route, navigation }) => {
  const { stories, initialIndex = 0 } = route.params;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress] = useState(new Animated.Value(0));

  useEffect(() => {
    progress.setValue(0);
    
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: STORY_DURATION,
      useNativeDriver: false,
    });

    animation.start(({ finished }) => {
      if (finished) {
        handleNext();
      }
    });

    return () => animation.stop();
  }, [currentIndex]);

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

  const handlePress = (evt) => {
    const x = evt.nativeEvent.locationX;
    if (x < width / 2) {
      handlePrevious();
    } else {
      handleNext();
    }
  };

  const currentStory = stories[currentIndex];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <Image source={{ uri: currentStory.image }} style={styles.storyImage} />
      
      <View style={styles.overlay}>
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
            <Text style={styles.username}>{currentStory.user.name}</Text>
            <Text style={styles.time}>{currentStory.timeAgo}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
              <Ionicons name="close" size={28} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={1}
          onPress={handlePress}
          style={styles.touchArea}
        />
      </View>
    </View>
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
    resizeMode: 'contain',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: SIZES.lg,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: SIZES.md,
  },
  progressBarContainer: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.white,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  username: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: SIZES.sm,
  },
  time: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginLeft: SIZES.sm,
  },
  closeButton: {
    marginLeft: 'auto',
  },
  touchArea: {
    flex: 1,
  },
});

export default StoryViewerScreen;
