import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text } from 'react-native';
// import { router } from 'expo-router';

export default function Login() {
  return (
    <LinearGradient
          colors={['#61BDFB','#E5F4FF', '#BACC72']} // gradient background colors
          // start={{ x: 0, y: 0 }}
          // end={{ x: 1, y: 1 }} // in case if you want to change position of the gradient
          style={styles.container}
        >
    
      <Text>Login Page</Text>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});