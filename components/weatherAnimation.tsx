import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Dimensions } from 'react-native';
import Svg, { Ellipse, Rect } from 'react-native-svg';
import { WeatherType } from '@/components/weather';
import { BlurView } from 'expo-blur';

const { width: W, height: H } = Dimensions.get('window');

// ─── Cloud ───────────────────────────────────────────

function Cloud({ size = 1, speed = 12000, delay = 0, y = 60, opacity = 0.85 }) {
  const x = useRef(new Animated.Value(Math.random() * W)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(x, {
          toValue: W + 140 * size,
          duration: speed,
          useNativeDriver: true,
        }),
        Animated.timing(x, {
          toValue: -140 * size,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  const w = 140 * size;
  const h = 55 * size;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: y,
        transform: [{ translateX: x }],
        width: w,
        height: h,
      }}
    >
      {/* Each ellipse is its own blurred pill — matches Figma layer blur */}
<CloudPill w={w * 0.9} h={h * 0.55} top={h * 0.45} left={0}        opacity={opacity} blur={10} />
<CloudPill w={w * 0.55} h={h * 0.7}  top={h * 0.1}  left={w * 0.08} opacity={opacity} blur={9} />
<CloudPill w={w * 0.45} h={h * 0.6}  top={h * 0.2}  left={w * 0.45} opacity={opacity} blur={8} />
    </Animated.View>
  );
}

// Each puff = a blurred pill shape (matches Figma's layer blur on ellipses)
function CloudPill({ w, h, top, left, opacity, blur }) {
  return (
    <View
      style={{
        position: 'absolute',
        top,
        left,
        width: w,
        height: h,
        borderRadius: h / 2,   // pill shape
        overflow: 'hidden',
      }}
    >
      {/* White base */}
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: `rgba(255,255,255,${opacity})`,
        }}
      />
      {/* Blur applied inside the pill clip */}
      <BlurView
        intensity={blur}
        tint="light"
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  );
}

// ─── Rain streak ─────────────────────────────────────
function RainStreak({ x: startX, delay = 0, speed = 900, opacity = 0.5 }) {
  const y = useRef(new Animated.Value(-60)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(y, {
        toValue: H + 60,
        duration: speed,
        delay,
        useNativeDriver: true,
      })
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: startX,
        transform: [{ translateY: y }, { rotate: '-15deg' }],
        width: 1.5,
        height: 28,
        backgroundColor: `rgba(180,220,255,${opacity})`,
        borderRadius: 2,
      }}
    />
  );
}

// ─── Wind streak ─────────────────────────────────────
function WindStreak({ y: startY, delay = 0, length = 60, opacity = 0.18 }) {
  const x = useRef(new Animated.Value(-length - 40)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(x, {
        toValue: W + length,
        duration: 1800 + Math.random() * 800,
        delay,
        useNativeDriver: true,
      })
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: startY,
        width: length,
        height: 1,
        backgroundColor: `rgba(255,255,255,${opacity})`,
        borderRadius: 1,
        transform: [{ translateX: x }],
      }}
    />
  );
}

// ─── Main component ──────────────────────────────────
interface Props {
  weatherType: WeatherType;
}

export default function WeatherAnimation({ weatherType }: Props) {
  const showClouds = ['cloudy', 'rain', 'thunder', 'mist', 'default'].includes(weatherType);
  const showRain   = ['rain', 'thunder'].includes(weatherType);
  const showWind   = weatherType === 'rain' || weatherType === 'cloudy';

  // Pre-generate random rain positions (stable across renders)
  const rainStreaks = useRef(
    Array.from({ length: 35 }, (_, i) => ({
      x:       Math.random() * W,
      delay:   Math.random() * 1200,
      speed:   750 + Math.random() * 400,
      opacity: 0.3 + Math.random() * 0.4,
    }))
  ).current;

  const windStreaks = useRef(
    Array.from({ length: 12 }, (_, i) => ({
      y:      60 + Math.random() * (H * 0.6),
      delay:  Math.random() * 2000,
      length: 40 + Math.random() * 80,
    }))
  ).current;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Cloud layer — parallax: bigger/lower clouds move faster */}
  {showClouds && (
  <>
<Cloud size={0.7} speed={10000} delay={0}     y={55}  opacity={0.15} />
<Cloud size={0.5} speed={8000} delay={0}  y={85}  opacity={0.1}  />
<Cloud size={0.6} speed={12000} delay={0}  y={30}  opacity={0.05}  />
<Cloud size={0.4} speed={16000} delay={0}  y={110} opacity={0.55} />
<Cloud size={0.55} speed={17000} delay={0} y={70}  opacity={0.65} />
  </>
)}

      {/* Rain layer */}
      {showRain && rainStreaks.map((s, i) => (
        <RainStreak key={i} x={s.x} delay={s.delay} speed={s.speed} opacity={s.opacity} />
      ))}

      {/* Wind layer */}
      {showWind && windStreaks.map((s, i) => (
        <WindStreak key={i} y={s.y} delay={s.delay} length={s.length} />
      ))}
    </View>
  );
}