import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


export default function Login() {
  const [fontsLoaded] = useFonts({
  'NataSans-Regular': require('../assets/Fonts/NataSans-Regular.ttf'),
  'NataSans-Bold': require('../assets/Fonts/NataSans-Bold.ttf'),
  'NataSans-SemiBold': require('../assets/Fonts/NataSans-SemiBold.ttf'),
  'NataSans-Medium': require('../assets/Fonts/NataSans-Medium.ttf'),
});
if (!fontsLoaded) return null; 
 const [inputValue, setInputValue] = useState(''); //username input state
 const [passwordValue, setPasswordValue] = useState(''); //password input state


  return (
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
      <View style={styles.card }>
      <Text style={styles.title}>Let's Grow Together!</Text>

      {/*Username Input*/}
<TextInput style={[styles.input, {
    fontFamily: 'NataSans-Regular',
    fontSize: 14,
    color: '#FFFEF1',
  }]}
  value={inputValue}
  onChangeText={setInputValue}
  placeholder="Username" 
  placeholderTextColor={'#FFFEF1'}
  autoCapitalize="none"
/>
      {/*add password*/}
<TextInput style={[styles.input, {
    fontFamily: 'NataSans-Regular',
    fontSize: 14,
    color: '#FFFEF1',
  }]}
  value={passwordValue}
  onChangeText={(text) => setPasswordValue(text.replace(/[^a-zA-Z0-9]/g, ''))}
  placeholder="Password" 
  placeholderTextColor={'#FFFEF1'}
  secureTextEntry
  autoCapitalize="none"
/>
      

      <TouchableOpacity 
       style={[styles.button, (!inputValue || !passwordValue) && styles.buttonDisabled]}
       onPress={() => router.push('/onboard1')}
       disabled={!inputValue || !passwordValue}  // it can't press if empty
      >
      <Text style={[styles.buttonText, { fontFamily: 'NataSans-Medium', fontSize: 14, color: '#FFFEF1' }]}>
       Continue
      </Text>
      </TouchableOpacity>

    <Text style={[styles.link
    ,{
      fontFamily: 'NataSans-SemiBold',
      fontSize: 12,
    }
    ]}>Have an account? Login 
    </Text>
    </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // body: {
  //   fontFamily: 'NataSans-SemiBold',
  //   fontSize: 16,
  // },
   card: {
    width: '85%',
    backgroundColor: '#FFFBFB',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
  },

  title: {
    fontSize: 48,
    fontFamily: 'NataSans-SemiBold',
    // fontWeight: 'bold',
    color: '#595512',
    textAlign: 'center',
    marginBottom: 20,
  },

  input: {
    width: '100%',
    backgroundColor: '#C6A17E',
    borderRadius: 25,
    padding: 18,
    marginVertical: 8,
    color: '#FFFEF1',
  },

  button: {
    marginTop: 15,
    backgroundColor: '#D4CDC9',
    padding: 12,
    borderRadius: 20,
    width: '60%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#D4CDC9',
    opacity: 0.6,
  },

  buttonText: {
    color: '#FFFEF1',
    fontWeight: '600',
  },

  link: {
    marginTop: 10,
    color: '#44AAA2',
    fontSize: 12,
  },
});