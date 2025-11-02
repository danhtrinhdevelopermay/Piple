import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

const BrowseScreen = () => {
  const categories = [
    { id: 1, name: 'Art', icon: 'brush', color: COLORS.pink },
    { id: 2, name: 'Fashion', icon: 'shirt', color: COLORS.purple },
    { id: 3, name: 'Food', icon: 'restaurant', color: COLORS.orange },
    { id: 4, name: 'Travel', icon: 'airplane', color: COLORS.cyan },
    { id: 5, name: 'Music', icon: 'musical-notes', color: COLORS.yellow },
    { id: 6, name: 'Sports', icon: 'basketball', color: COLORS.primary },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Browse</Text>
        <TouchableOpacity>
          <Ionicons name="search-outline" size={24} color={COLORS.black} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Explore Categories</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity key={category.id} style={styles.categoryCard}>
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  <Ionicons name={category.icon} size={32} color={COLORS.white} />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    padding: SIZES.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: SIZES.lg,
    marginTop: SIZES.lg,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    alignItems: 'center',
    padding: SIZES.xl,
    backgroundColor: COLORS.grayLight,
    borderRadius: 16,
    marginBottom: SIZES.lg,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.md,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '600',
  },
  trendingContainer: {
    marginBottom: SIZES.xl,
  },
  trendingCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: SIZES.lg,
  },
  trendingImage: {
    width: '100%',
    height: 200,
  },
  trendingOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SIZES.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  trendingText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BrowseScreen;
