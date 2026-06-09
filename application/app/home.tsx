import { homescreenStyles, typography } from '@/components/styles';
import { useWeather } from '@/components/weatherContext';
import ZoneCarousel from '@/components/zoneCarousel';
import GradientBackground from '@/components/GradientBackground';
import AlertBanner from '@/components/alertBanner';
import MoistureTrend from '@/components/moistureTrend';
import QuickActions from '@/components/quickActions';
import { Stack } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

export default function Home() {
  const { weather } = useWeather();
  const temp = weather?.temp;

  // TODO: replace with real alert data from your backend/context
  const alert = {
    message: 'Rain forecast tomorrow, consider skipping watering',
  };

  return (
    <GradientBackground>
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
                weekday: 'long', day: 'numeric', month: 'short',
              })}
            </Text>
          </View>
          <View style={{
            width: 68, height: 68, borderRadius: 34,
            borderWidth: 2, borderColor: 'rgba(255,255,255,0.6)',
            backgroundColor: 'rgba(255,255,255,0.25)',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={[typography.heading4, { color: '#fff' }]}>
              {temp ?? '--'}°C
            </Text>
          </View>
        </View>

        {/* Alert banner — only renders when there's an active alert */}
        {alert && <AlertBanner message={alert.message} />}

        {/* Zone card(s) */}
        <ZoneCarousel />

        {/* Moisture trend chart */}
        <MoistureTrend />

        {/* Quick action buttons */}
        <QuickActions />

      </ScrollView>
    </GradientBackground>
  );
}