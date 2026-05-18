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
  View,
} from 'react-native';

const { height: H } = Dimensions.get('window');

export default function Logo() {
  const [fontsLoaded] = useFonts({
    'NataSans-SemiBold': require('../assets/Fonts/NataSans-SemiBold.ttf'),
  });

  const dropY       = useRef(new Animated.Value(0)).current;
  const dropScale   = useRef(new Animated.Value(1)).current;
  const dropOpacity = useRef(new Animated.Value(1)).current;
  const textOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!fontsLoaded) return;

    Animated.sequence([

      // show logo + text for 1.2 seconds
      Animated.delay(1200),

      // text fades out
      Animated.timing(textOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),

      Animated.delay(200),

      // bounce 1 — up then down
      Animated.sequence([
        Animated.timing(dropY, {
          toValue: -50,
          duration: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(dropY, {
          toValue: 0,
          duration: 250,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
      ]),

      // bounce 2 — smaller
      Animated.sequence([
        Animated.timing(dropY, {
          toValue: -25,
          duration: 160,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(dropY, {
          toValue: 0,
          duration: 200,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
      ]),

      Animated.delay(100),

      // drop goes down and off screen
      Animated.parallel([
        Animated.timing(dropY, {
          toValue: H,
          duration: 600,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(dropOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),

    ]).start(() => {
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

      <Image
        source={require('../assets/cloud.png')}
        style={styles.cloud}
      />

      <Animated.View style={[styles.logoWrap, {
        opacity: dropOpacity,
        transform: [{ translateY: dropY }, { scale: dropScale }],
      }]}>
        <Image
          source={require('../assets/logop.png')}
          style={styles.logo}
        />
        <Animated.Text style={[styles.appName, { opacity: textOpacity }]}>
          pura
        </Animated.Text>
      </Animated.View>

    </View>
  );
}

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
    gap: 12,
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