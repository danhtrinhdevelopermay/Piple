import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import StoryItem from '../components/StoryItem';
import PostItem from '../components/PostItem';

const HomeScreen = ({ navigation }) => {
  const { posts, stories, toggleLike, toggleSave } = useApp();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState('Home');

  const handleStoryPress = (story) => {
    if (story.isYourStory) {
      navigation.navigate('CreateStory');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>P.</Text>
          </View>
          <Text style={styles.appName}>Piple</Text>
        </View>

        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.black} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="mail-outline" size={24} color={COLORS.black} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>5</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.storiesContainer}
              contentContainerStyle={styles.storiesContent}
            >
              {stories.filter(s => s.isYourStory).length === 0 && (
                <StoryItem 
                  key="your-story" 
                  story={{ 
                    id: 'your-story',
                    user: user,
                    isYourStory: true,
                    isLive: false,
                    isSeen: false
                  }} 
                  onPress={handleStoryPress}
                />
              )}
              {stories.map((story) => (
                <StoryItem key={story.id} story={story} onPress={handleStoryPress} />
              ))}
            </ScrollView>

            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'Home' && styles.activeTab]}
                onPress={() => setActiveTab('Home')}
              >
                <Text style={[styles.tabText, activeTab === 'Home' && styles.activeTabText]}>
                  Home
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'For you' && styles.activeTab]}
                onPress={() => setActiveTab('For you')}
              >
                <Text style={[styles.tabText, activeTab === 'For you' && styles.activeTabText]}>
                  For you
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuButton}>
                <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.black} />
              </TouchableOpacity>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <PostItem
            post={item}
            onLike={() => toggleLike(item.id)}
            onComment={() => {}}
            onSave={() => toggleSave(item.id)}
            onShare={() => {}}
            onUserPress={() => navigation.navigate('Profile', { user: item.user })}
          />
        )}
      />
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
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: SIZES.sm,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: SIZES.lg,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: COLORS.pink,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  storiesContainer: {
    paddingVertical: SIZES.md,
    backgroundColor: COLORS.white,
  },
  storiesContent: {
    paddingHorizontal: SIZES.lg,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  tab: {
    marginRight: SIZES.xl,
    paddingBottom: SIZES.sm,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.black,
  },
  tabText: {
    fontSize: 15,
    color: COLORS.grayDark,
  },
  activeTabText: {
    color: COLORS.black,
    fontWeight: '600',
  },
  menuButton: {
    marginLeft: 'auto',
  },
});

export default HomeScreen;
