import GradientBackground from "@/components/GradientBackground";
import NavBar from "@/components/NavBar";
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from "react-native";
import 'react-native-reanimated';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();

  const [fontsLoaded] = useFonts({
    'NataSans-Bold':     require('../assets/Fonts/NataSans-Bold.ttf'),
    'NataSans-Medium':   require('../assets/Fonts/NataSans-Medium.ttf'),
    'NataSans-Regular':  require('../assets/Fonts/NataSans-Regular.ttf'),
    'NataSans-SemiBold': require('../assets/Fonts/NataSans-SemiBold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  const hideNavBar = ['/', '/logo', '/login', '/signup', '/onboard'].includes(pathname);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1, backgroundColor: '#62C8F5' }}>
        <GradientBackground>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: 'transparent' },
            }}
          >
            {/* ← only your actual pages, no (tabs) or modal */}
            <Stack.Screen name="index"       />
            <Stack.Screen name="logo"        />
            <Stack.Screen name="login"       />
            <Stack.Screen name="signup"      />
            <Stack.Screen name="onboard"     />
            <Stack.Screen name="home"        />
            <Stack.Screen name="garden"      />
            <Stack.Screen name="profile"     />
            <Stack.Screen name="zone-detail" />
          </Stack>
          {!hideNavBar && <NavBar />}
        </GradientBackground>
      </View>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}