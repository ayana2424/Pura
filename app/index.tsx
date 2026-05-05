import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';


export default function App() {
  

  const [fontsLoaded] = useFonts({
  'Afacad-Regular': require('../assets/Fonts/Afacad-Regular.ttf'),
  // 'NataSans-Bold': require('../assets/Fonts/NataSans-Bold.ttf'),
  // 'NataSans-SemiBold': require('../assets/Fonts/NataSans-SemiBold.ttf'),  
});
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
    
      <Text style={{ fontFamily: 'Afacad-Regular', fontSize: 48 , color: '#439D82' }}>pura</Text>
      
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
    color: '#439D82', // text color
    fontSize: 24,
  },
});

// import { useEffect } from 'react';

// useEffect(() => {
//   const timer = setTimeout(() => {
//     router.replace('/login');
//   }, 2000);

//   return () => clearTimeout(timer);
// }, []); later if you want to automatically navigate to the login screen after a delay (e.g., 2 seconds) without user interaction.
