import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const options = ['Balcony or Patio', 'Backyard Garden', 'Indoors or Windowsill '];

export default function Onboard1() {
  const [fontsLoaded] = useFonts({
  'NataSans-Bold': require('../assets/Fonts/NataSans-Bold.ttf'),
});
if (!fontsLoaded) return null;
const [selected, setSelected] = useState('');

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
        <View style={styles.container}>

      <View style={styles.card}>
        <Text style={[styles.question, 
            { fontFamily: 'NataSans-Bold',
             color: '#595512',
             fontSize: 24, 
            }]}
             >Where do you grow your plants?
        </Text>

        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, selected === option && styles.optionSelected]}
            onPress={() => setSelected(option)}
          >
            <Text style={[styles.optionText, { color: selected === option ? '#FFFBFB' : '#FFFBFB' }]}>
            {option}</Text>
            <View style={[styles.circle, selected === option && styles.circleSelected]} />
          </TouchableOpacity>
        ))}

        {/* dots */}
        <View style={styles.dots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>

      {/* go to next question when answer is selected */}
      <TouchableOpacity
        style={[styles.next, !selected && styles.nextDisabled]}
        disabled={!selected}
        onPress={() => router.push('/onboard2')}
      >
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>

    </View>
    </LinearGradient>
);
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  unselect: { marginBottom: 20 },
  unselectText: { fontSize: 16 },
  card: {
    backgroundColor: '#FFFBFB',
    borderRadius: 20,
    padding: 24,
  },
  question: {
    fontSize: 24,
    fontFamily: 'NataSans-Bold',
    marginBottom: 20,
    color: '#595512',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#56D5CA',
    borderRadius: 30,
    padding: 14,
    marginBottom: 10,
  },
  optionSelected: {
    // borderWidth: 2,
    borderColor: '#56D5CA',
    backgroundColor: '#D4CDC9',
  },
  optionText: { color: '#FFFBFB', fontSize: 14, fontFamily: 'NataSans-Bold' },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFBFB',
    backgroundColor: 'transparent',
  },
  circleSelected: {
    backgroundColor: '#FFFBFB',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 6,
  },
  dot: {
    width: 8, height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
  },
  dotActive: { backgroundColor: '#56D5CA' },
  next: {
    marginTop: 20,
    backgroundColor: '#56D5CA',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  nextDisabled: { opacity: 0.4 },
  nextText: { color: 'white', fontSize: 16, fontFamily: 'NataSans-Bold' },
});