import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Login Failed', result.error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>P.</Text>
          </View>
          <Text style={styles.appName}>Piple</Text>
        </View>

        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Login to your account</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color={COLORS.grayDark}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.black} />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signupText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    paddingHorizontal: SIZES.xl,
    paddingTop: 60,
    paddingBottom: SIZES.lg,
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.xl * 2,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.xxxl,
  },
  logo: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: SIZES.md,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: SIZES.sm,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.grayDark,
    marginBottom: SIZES.xxxl,
  },
  inputContainer: {
    marginBottom: SIZES.xl,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: SIZES.sm,
    color: COLORS.black,
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.grayLight,
    borderRadius: 12,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    fontSize: 15,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.grayLight,
    borderRadius: 12,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
  },
  passwordInput: {
    flex: 1,
    fontSize: 15,
  },
  forgotPassword: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    textAlign: 'right',
    marginBottom: SIZES.xxxl,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.lg,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
    color: COLORS.grayDark,
  },
  signupText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
  },
});

export default LoginScreen;
