import { typography } from '@/components/styles';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { router, Stack } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';


export default function Index() {
  

  const [fontsLoaded] = useFonts({
  'Afacad-Regular': require('../assets/Fonts/Afacad-Regular.ttf'),
  // 'NataSans-Bold': require('../assets/Fonts/NataSans-Bold.ttf'),
  // 'NataSans-SemiBold': require('../assets/Fonts/NataSans-SemiBold.ttf'),  
  
});
  useEffect(() => {
  const timer = setTimeout(() => {
    router.replace('/login');
  }, 5000);

  return () => clearTimeout(timer);
}, []);

if (!fontsLoaded) return null; 

  return (
   <TouchableOpacity
   style={{ flex: 1 }}
   onPress={() => router.push('/login')} //router.replace('/login') to prevent going back to the splash screen
   activeOpacity={1}>

    <LinearGradient
      colors={['#61BDFB','#E5F4FF', '#BACC72']} // gradient background colors
      // start={{ x: 0, y: 0 }}
      // end={{ x: 1, y: 1 }} // in case if you want to change position of the gradient
      style={styles.container}
    >
            <Stack.Screen options={{ headerShown: false }} />

      <Image
    source={require('../assets/cloud.png')}
    style={{ 
      position: 'absolute',
      width: '100%', 
      height: '40%',
      top: 0,   
      left: 0,
      resizeMode: 'cover',
    }}
  />
  <Image
    source={require('../assets/LOGOBG.png')}
    style={{ 
      position: 'absolute',
      width: 300, 
      height: 400,
      // bottom: 50,
    }}
  />
      <Image
      source={require('../assets/logop.png')}
      style={{ width: 150, height: 200 }}
    />
    
      <Text style={[typography.heading1, { color: '#439D82' }]}>pura</Text> 
      
    </LinearGradient>
    </TouchableOpacity>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#439D82',
    fontSize: 24,
  },
});
