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

export default function Login() {
  const [fontsLoaded] = useFonts({
    'NataSans-Regular': require('../assets/Fonts/NataSans-Regular.ttf'),
    'NataSans-Bold': require('../assets/Fonts/NataSans-Bold.ttf'),
    'NataSans-SemiBold': require('../assets/Fonts/NataSans-SemiBold.ttf'),
    'NataSans-Medium': require('../assets/Fonts/NataSans-Medium.ttf'),
  });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!fontsLoaded) return null;

  const canLogin = username.length > 0 && password.length > 0;

  return (
    <LinearGradient
      colors={['#61BDFB', '#E5F4FF', '#BACC72']}
      style={styles.gradient}
    >
      {/* Cloud background image */}
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
          {/* Logo */}
          <View style={styles.logoWrapper}>
            <Image
              source={require('../assets/logop.png')}
              style={styles.logo}
            />
            <Text style={[styles.appName, { fontFamily: 'NataSans-SemiBold' }]}>
              pura
            </Text>
            <Text style={[styles.tagline, { fontFamily: 'NataSans-SemiBold' }]}>
              Welcome back 
            </Text>
          </View>

          {/* Card */}
          <View style={styles.card}>

            {/* Username */}
            <Text style={[styles.label, { fontFamily: 'NataSans-Medium' }]}>
              USERNAME
            </Text>
            <TextInput
              style={[styles.input, { fontFamily: 'NataSans-Regular' }]}
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
              placeholderTextColor="rgba(255,254,241,0.6)"
              autoCapitalize="none"
              underlineColorAndroid="transparent"
              // @ts-ignore
              outlineWidth={0}
            />

            {/* Password */}
            <Text style={[styles.label, { fontFamily: 'NataSans-Medium', marginTop: 8 }]}>
              PASSWORD
            </Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[styles.input, styles.passwordInput, { fontFamily: 'NataSans-Regular' }]}
                value={password}
                onChangeText={(text) => setPassword(text.replace(/[^a-zA-Z0-9]/g, ''))}
                placeholder="Password"
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
              <Text style={styles.eyeText}>{showPassword}</Text>
              </TouchableOpacity>
  )}
            </View>

            {/* Login Button */}
            <Pressable
              style={({ pressed }) => [
                styles.loginButton,
                !canLogin && styles.loginButtonDisabled,
                pressed && canLogin && styles.loginButtonPressed,
              ]}
              onPress={() => router.push('/onboard1')}
              disabled={!canLogin}
            >
              <Text style={[styles.loginButtonText, { fontFamily: 'NataSans-SemiBold' }]}>
                Login
              </Text>
            </Pressable>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={[styles.dividerText, { fontFamily: 'NataSans-Regular' }]}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Buttons */}
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialIcon}>G</Text>
                <Text style={[styles.socialText, { fontFamily: 'NataSans-Medium' }]}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialIcon}></Text>
                <Text style={[styles.socialText, { fontFamily: 'NataSans-Medium' }]}>Apple</Text>
              </TouchableOpacity>
            </View>

            {/* Sign up link */}
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text style={[styles.signupText, { fontFamily: 'NataSans-Regular' }]}>
                Don't have an account?{' '}
                <Text style={[styles.signupLink, { fontFamily: 'NataSans-SemiBold' }]}>
                  Sign up
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
  loginButton: {
    marginTop: 18,
    backgroundColor: '#56D5CA',
    paddingVertical: 14,
    borderRadius: 25,
    width: '70%',
    alignItems: 'center',
  },
  loginButtonPressed: {
    backgroundColor: '#3db8ae',
  },
  loginButtonDisabled: {
    backgroundColor: '#c9cad4',
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 16,
    color: '#FFFEF1',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: 'rgba(89,85,18,0.25)',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    color: '#9a9060',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 18,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(89,85,18,0.25)',
    borderRadius: 18,
    paddingVertical: 12,
  },
  socialIcon: {
    fontSize: 15,
    fontWeight: '700',
    color: '#595512',
  },
  socialText: {
    fontSize: 14,
    color: '#595512',
  },
  signupText: {
    fontSize: 13,
    color: '#44AAA2',
    textAlign: 'center',
  },
  signupLink: {
    color: '#595512',
  },
});