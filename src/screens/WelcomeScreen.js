import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>P.</Text>
        </View>
        <Text style={styles.appName}>Piple</Text>
        <TouchableOpacity style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.illustrationContainer}>
        <View style={styles.illustration}>
          <View style={styles.pinkShape1} />
          <View style={styles.pinkShape2} />
          <View style={styles.circleDecor1} />
          <View style={styles.circleDecor2} />
          <View style={styles.circleDecor3} />
          <View style={styles.circleDecor4} />
          <View style={styles.starDecor1}>
            <Text style={styles.starText}>✨</Text>
          </View>
          <View style={styles.starDecor2}>
            <Text style={styles.starText}>⚡</Text>
          </View>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Best Social App to Make{'\n'}New Friends</Text>
        <Text style={styles.subtitle}>
          With Piple you will find new friends from various countries and regions of the world
        </Text>

        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => navigation.navigate('MainTabs')}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  logoContainer: {
    paddingHorizontal: SIZES.xl,
    paddingTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: SIZES.sm,
  },
  skipButton: {
    marginLeft: 'auto',
  },
  skipText: {
    fontSize: 15,
    color: COLORS.grayDark,
  },
  illustrationContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  illustration: {
    width: 280,
    height: 280,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinkShape1: {
    position: 'absolute',
    width: 140,
    height: 200,
    backgroundColor: COLORS.pink,
    transform: [{ rotate: '15deg' }],
    borderRadius: 10,
    top: 40,
    left: 70,
  },
  pinkShape2: {
    position: 'absolute',
    width: 100,
    height: 140,
    backgroundColor: COLORS.pink,
    transform: [{ rotate: '-10deg' }],
    borderRadius: 10,
    top: 80,
    right: 100,
    zIndex: 2,
  },
  circleDecor1: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.cyan,
    opacity: 0.3,
    top: 20,
    left: 20,
  },
  circleDecor2: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.yellow,
    bottom: 80,
    left: 40,
  },
  circleDecor3: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.purple,
    bottom: 60,
    right: 30,
  },
  circleDecor4: {
    position: 'absolute',
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: COLORS.orange,
    top: 100,
    right: 40,
  },
  starDecor1: {
    position: 'absolute',
    top: 30,
    right: 20,
  },
  starDecor2: {
    position: 'absolute',
    bottom: 30,
    right: 60,
  },
  starText: {
    fontSize: 20,
  },
  contentContainer: {
    paddingHorizontal: SIZES.xl * 2,
    paddingBottom: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SIZES.lg,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.grayDark,
    textAlign: 'center',
    marginBottom: SIZES.xxxl,
    lineHeight: 20,
  },
  getStartedButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.lg,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  getStartedText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
  },
  loginText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.black,
    textAlign: 'center',
  },
});

export default WelcomeScreen;
