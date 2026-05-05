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
const [selected, setSelected] = useState('');
const [currentQuestion, setCurrentQuestion] = useState(0);
const [answers, setAnswers] = useState<string[]>([]); // saves all answers
const questions = [
  {
    question: 'Where do you grow your plants?',
    options: ['Balcony or Patio', 'Backyard Garden', 'Indoors or Windowsill'],
  },
  {
    question: 'How much experience do you have?',
    options: ['Complete beginner', 'Some experience', "I know what I'm doing"],
  },
  {
    question: 'How often do you want reminders?',
    options: ['Every day', 'Every few days', 'Once a week'],
  },
];
const handleNext = () => {
  setAnswers([...answers, selected]); // save the answer
  setSelected('');                    // reset selection

  if (currentQuestion < questions.length - 1) {
    setCurrentQuestion(currentQuestion + 1); // go to next question
  } else {
    router.push('/home'); // last question → go to home
  }
};
if (!fontsLoaded) return null;


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
             >{questions[currentQuestion].question}
        </Text>

        {questions[currentQuestion].options.map((option) => (
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
  {questions.map((_, index) => (
    <View
      key={index}
      style={[styles.dot, index === currentQuestion && styles.dotActive]}
    />
  ))}
</View>
      </View>

      {/* go to next question when answer is selected */}
      <TouchableOpacity
        style={[styles.next, !selected && styles.nextDisabled]}
        disabled={!selected}
        onPress={handleNext}
      >
        <Text style={styles.nextText}>
          {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
        </Text>
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