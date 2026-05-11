import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Signup() {
  const [fontsLoaded] = useFonts({
    'NataSans-Regular': require('../assets/Fonts/NataSans-Regular.ttf'),
    'NataSans-Bold': require('../assets/Fonts/NataSans-Bold.ttf'),
    'NataSans-SemiBold': require('../assets/Fonts/NataSans-SemiBold.ttf'),
    'NataSans-Medium': require('../assets/Fonts/NataSans-Medium.ttf'),
  });

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);

  if (!fontsLoaded) return null;

  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;
  const canSignUp = username.length > 0 && email.length > 0 && password.length > 0 && passwordsMatch && agreed;

  return (
    <LinearGradient
      colors={['#61BDFB', '#E5F4FF', '#BACC72']}
      style={styles.gradient}
    >
      <Image
        source={require('../assets/cloud.png')}
        style={styles.cloud}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.logoWrapper}>
            <Image
              source={require('../assets/logop.png')}
              style={styles.logo}
            />
            <Text style={[styles.appName, { fontFamily: 'NataSans-SemiBold' }]}>
              pura
            </Text>
            <Text style={[styles.tagline, { fontFamily: 'NataSans-SemiBold' }]}>
              Start your green journey 
            </Text>
          </View>

          {/* Card */}
          <View style={styles.card}>

            {/* Username */}
            <Text style={[styles.label, { fontFamily: 'NataSans-Medium' }]}>USERNAME</Text>
            <TextInput
              style={[styles.input, { fontFamily: 'NataSans-Regular' }]}
              value={username}
              onChangeText={setUsername}
              placeholder="Choose a username"
              placeholderTextColor="rgba(255,254,241,0.6)"
              autoCapitalize="none"
              underlineColorAndroid="transparent"
              // @ts-ignore
              outlineWidth={0}
            />

            {/* Email */}
            <Text style={[styles.label, { fontFamily: 'NataSans-Medium', marginTop: 8 }]}>EMAIL</Text>
            <TextInput
              style={[styles.input, { fontFamily: 'NataSans-Regular' }]}
              value={email}
              onChangeText={setEmail}
              placeholder="Your email address"
              placeholderTextColor="rgba(255,254,241,0.6)"
              keyboardType="email-address"
              autoCapitalize="none"
              underlineColorAndroid="transparent"
              // @ts-ignore
              outlineWidth={0}
            />

            {/* Password */}
            <Text style={[styles.label, { fontFamily: 'NataSans-Medium', marginTop: 8 }]}>PASSWORD</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[styles.input, styles.passwordInput, { fontFamily: 'NataSans-Regular' }]}
                value={password}
                onChangeText={(text) => setPassword(text.replace(/[^a-zA-Z0-9]/g, ''))}
                placeholder="Create a password"
                placeholderTextColor="rgba(255,254,241,0.6)"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                underlineColorAndroid="transparent"
                // @ts-ignore
                outlineWidth={0}
              />
              {password.length > 0 && (
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Confirm Password */}
            <Text style={[styles.label, { fontFamily: 'NataSans-Medium', marginTop: 8 }]}>CONFIRM PASSWORD</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[
                  styles.input,
                  styles.passwordInput,
                  { fontFamily: 'NataSans-Regular' },
                  passwordMismatch && styles.inputError,
                  passwordsMatch && styles.inputSuccess,
                ]}
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text.replace(/[^a-zA-Z0-9]/g, ''))}
                placeholder="Repeat your password"
                placeholderTextColor="rgba(255,254,241,0.6)"
                secureTextEntry={!showConfirm}
                autoCapitalize="none"
                underlineColorAndroid="transparent"
                // @ts-ignore
                outlineWidth={0}
              />
              {confirmPassword.length > 0 && (
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirm(!showConfirm)}
                >
                  <Text style={styles.eyeText}>{showConfirm ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Password match feedback */}
            {passwordMismatch && (
              <Text style={[styles.feedbackText, { fontFamily: 'NataSans-Regular', color: '#e05c5c' }]}>
                Passwords don't match
              </Text>
            )}
            {passwordsMatch && (
              <Text style={[styles.feedbackText, { fontFamily: 'NataSans-Regular', color: '#56D5CA' }]}>
                Passwords match ✓
              </Text>
            )}

            {/* Terms & Conditions */}
            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => setAgreed(!agreed)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                {agreed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={[styles.termsText, { fontFamily: 'NataSans-Regular' }]}>
                I agree to the{' '}
                <Text style={[styles.termsLink, { fontFamily: 'NataSans-SemiBold' }]}>
                  Terms & Conditions
                </Text>
              </Text>
            </TouchableOpacity>

            {/* Sign Up Button */}
            <Pressable
              style={({ pressed }) => [
                styles.signupButton,
                !canSignUp && styles.signupButtonDisabled,
                pressed && canSignUp && styles.signupButtonPressed,
              ]}
              onPress={() => router.push('/onboard')}
              disabled={!canSignUp}
            >
              <Text style={[styles.signupButtonText, { fontFamily: 'NataSans-SemiBold' }]}>
                Create Account
              </Text>
            </Pressable>

            {/* Login link */}
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={[styles.loginText, { fontFamily: 'NataSans-Regular' }]}>
                Already have an account?{' '}
                <Text style={[styles.loginLink, { fontFamily: 'NataSans-SemiBold' }]}>
                  Login
                </Text>
              </Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  cloud: {
    position: 'absolute',
    width: '100%',
    height: '40%',
    top: 0,
    left: 0,
    resizeMode: 'cover',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 64,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 3,
  },
  appName: {
    fontSize: 32,
    color: '#439D82',
    marginBottom: 3,
  },
  tagline: {
    fontSize: 15,
    color: '#595512',
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255,251,251,0.88)',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 11,
    color: '#595512',
    letterSpacing: 0.8,
    marginBottom: 6,
    marginLeft: 12,
  },
  input: {
    width: '100%',
    backgroundColor: '#C6A17E',
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 14,
    color: '#FFFEF1',
    marginBottom: 4,
  },
  inputError: {
    backgroundColor: '#c97e7e',
  },
  inputSuccess: {
    backgroundColor: '#7ebc9e',
  },
  passwordWrapper: {
    width: '100%',
    position: 'relative',
    marginBottom: 4,
  },
  passwordInput: {
    paddingRight: 52,
    marginBottom: 0,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 12,
  },
  eyeText: {
    fontSize: 16,
  },
  feedbackText: {
    alignSelf: 'flex-start',
    fontSize: 12,
    marginLeft: 12,
    marginBottom: 6,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 12,
    marginBottom: 4,
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#C6A17E',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#56D5CA',
    borderColor: '#56D5CA',
  },
  checkmark: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
  },
  termsText: {
    fontSize: 13,
    color: '#595512',
  },
  termsLink: {
    color: '#44AAA2',
  },
  signupButton: {
    marginTop: 18,
    backgroundColor: '#56D5CA',
    paddingVertical: 14,
    borderRadius: 25,
    width: '70%',
    alignItems: 'center',
  },
  signupButtonPressed: {
    backgroundColor: '#3db8ae',
  },
  signupButtonDisabled: {
    backgroundColor: '#c9cad4',
    opacity: 0.6,
  },
  signupButtonText: {
    fontSize: 16,
    color: '#FFFEF1',
  },
  loginText: {
    marginTop: 14,
    fontSize: 13,
    color: '#44AAA2',
    textAlign: 'center',
  },
  loginLink: {
    color: '#595512',
  },
});