import { homescreenStyles, typography } from '@/components/styles';
import { getWeather, WeatherData, WeatherType } from '@/components/weather';
import ZoneCarousel from '@/components/zoneCarousel';
import GradientBackground from '@/components/GradientBackground';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';


export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    getWeather().then(setWeather);
  }, []);

  const weatherType = weather?.weatherType ?? 'default';
  const temp = weather?.temp;

  return (
  <GradientBackground >
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        contentContainerStyle={homescreenStyles.scroll}
        style={{ backgroundColor: 'transparent' }}
      >
        {/* Header */}
        <View style={homescreenStyles.header}>
          <View>
            <Text style={[typography.heading3, { color: '#fff' }]}>
              Garden Summary
            </Text>
            <Text style={[typography.heading5, { color: '#fff' }]}>
              {new Date().toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'short',
              })}
            </Text>
          </View>
          <View
          style={{
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
            <Text style={[typography.heading4, { color: '#fff' }]}>
              {temp}°C
            </Text>
          </View>
        </View>

        <ZoneCarousel />
      </ScrollView>
    </GradientBackground>
  );
}