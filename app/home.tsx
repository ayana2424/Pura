import { homescreenStyles, typography } from '@/components/styles';
import { getWeather, WeatherType } from '@/components/weather';
import ZoneCarousel from '@/components/zoneCarousel';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

const weatherGradients: Record<WeatherType, readonly [string, string, string]> = {
  sunny:   ['#61BDFB', '#E5F4FF', '#BACC72'],
  rain:    ['#2C3E6B', '#3D5A8A', '#1a2a4a'],
  snow:    ['#B8D4E8', '#D6E8F5', '#E8F4FB'],
  thunder: ['#1a1a2e', '#2d2d4e', '#0f0f1e'],
  cloudy:  ['#6B7FA8', '#8A9BBF', '#4a5a7a'],
  mist:    ['#8BA5B8', '#A8BEC8', '#6B8EA8'],
  default: ['#61BDFB', '#E5F4FF', '#BACC72'],
};

export default function Home() {
  const [weatherType, setWeatherType] = useState<WeatherType>('default');

  useEffect(() => {
    getWeather().then(data => setWeatherType(data.weatherType));
  }, []);

  return (
    <LinearGradient
      colors={weatherGradients[weatherType]}
      style={{ flex: 1 }}
    >
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
        </View>

        <ZoneCarousel />
      </ScrollView>
    </LinearGradient>
  );
}