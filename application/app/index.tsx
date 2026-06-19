import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  StyleSheet,
  View
} from 'react-native';

const { height: H } = Dimensions.get('window');

// ── Main Component ────────────────────────────────────────────────────────────
export default function Logo() {
  const [fontsLoaded] = useFonts({
    'NataSans-SemiBold': require('../assets/Fonts/NataSans-SemiBold.ttf'),
  });

  const logoY       = useRef(new Animated.Value(0)).current;
  const logoScaleX  = useRef(new Animated.Value(1)).current;
  const logoScaleY  = useRef(new Animated.Value(1)).current;
  const logoOpacity = useRef(new Animated.Value(1)).current;
  const textOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!fontsLoaded) return;

    Animated.sequence([

      // ── показываем 1 секунду ──────────────────────────────────────────────
      Animated.delay(1000),

      // ── текст исчезает ────────────────────────────────────────────────────
      Animated.timing(textOpacity, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),

      Animated.delay(150),

      // ── BOUNCE 1 — большой ───────────────────────────────────────────────
      Animated.sequence([
        // вверх + растягивается
        Animated.parallel([
          Animated.timing(logoY, {
            toValue: -50,
            duration: 180,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(logoScaleY, {
            toValue: 1.08,
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.timing(logoScaleX, {
            toValue: 0.93,
            duration: 180,
            useNativeDriver: true,
          }),
        ]),
        // вниз
        Animated.parallel([
          Animated.timing(logoY, {
            toValue: 0,
            duration: 220,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(logoScaleY, { toValue: 1, duration: 220, useNativeDriver: true }),
          Animated.timing(logoScaleX, { toValue: 1, duration: 220, useNativeDriver: true }),
        ]),
      ]),

      // сквиш при приземлении
      Animated.parallel([
        Animated.timing(logoScaleX, { toValue: 1.22, duration: 80, useNativeDriver: true }),
        Animated.timing(logoScaleY, { toValue: 0.78, duration: 80, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(logoScaleX, { toValue: 1, duration: 140, easing: Easing.out(Easing.back(2)), useNativeDriver: true }),
        Animated.timing(logoScaleY, { toValue: 1, duration: 140, easing: Easing.out(Easing.back(2)), useNativeDriver: true }),
      ]),

      Animated.delay(80),

      // ── BOUNCE 2 — меньший ───────────────────────────────────────────────
      Animated.sequence([
        Animated.parallel([
          Animated.timing(logoY, {
            toValue: -26,
            duration: 140,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(logoScaleY, { toValue: 1.05, duration: 140, useNativeDriver: true }),
          Animated.timing(logoScaleX, { toValue: 0.96, duration: 140, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(logoY, {
            toValue: 0,
            duration: 170,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(logoScaleY, { toValue: 1, duration: 170, useNativeDriver: true }),
          Animated.timing(logoScaleX, { toValue: 1, duration: 170, useNativeDriver: true }),
        ]),
      ]),

      // маленький сквиш
      Animated.parallel([
        Animated.timing(logoScaleX, { toValue: 1.10, duration: 70, useNativeDriver: true }),
        Animated.timing(logoScaleY, { toValue: 0.90, duration: 70, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(logoScaleX, { toValue: 1, duration: 120, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
        Animated.timing(logoScaleY, { toValue: 1, duration: 120, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
      ]),

      Animated.delay(200),

      // ── ПАДАЕТ ВНИЗ ───────────────────────────────────────────────────────
      Animated.parallel([
        Animated.timing(logoY, {
          toValue: H,
          duration: 550,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(logoScaleX, { toValue: 0.85, duration: 550, useNativeDriver: true }),
        Animated.timing(logoScaleY, { toValue: 1.15, duration: 550, useNativeDriver: true }),
        Animated.timing(logoOpacity, {
          toValue: 0,
          duration: 400,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),

    ]).start(() => {
      // переходим на логин сразу, без волны
      router.replace('/login');
    });

  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#61BDFB', '#E5F4FF', '#BACC72']}
        style={StyleSheet.absoluteFill}
      />

      <Image source={require('../assets/cloud.png')} style={styles.cloud} />

      {/* Логотип */}
      <Animated.View
        style={[
          styles.logoWrap,
          {
            opacity: logoOpacity,
            transform: [
              { translateY: logoY },
              { scaleX: logoScaleX },
              { scaleY: logoScaleY },
            ],
          },
        ]}
      >
        <Image source={require('../assets/logop.png')} style={styles.logo} />
      </Animated.View>

      {/* Текст pura */}
      <Animated.Text style={[styles.appName, { opacity: textOpacity }]}>
        pura
      </Animated.Text>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cloud: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '40%',
    resizeMode: 'cover',
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 12,
  },
  logo: {
    width: 110,
    height: 140,
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 48,
    color: '#439D82',
    fontFamily: 'NataSans-SemiBold',
    letterSpacing: 2,
  },
});