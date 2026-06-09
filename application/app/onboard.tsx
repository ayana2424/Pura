import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Option = {
  e?: string;
  label: string;
  sub?: string;
};

type Question = {
  question: string;
  opts: Option[];
};

const questions: Question[] = [
  {
    question: 'Where do you grow your plants?',
    opts: [
      { label: 'Balcony or Patio' },
      { label: 'Backyard Garden' },
      { label: 'Indoors or Windowsill' },
    ],
  },
  {
    question: 'How much experience do you have?',
    opts: [
      { label: 'Complete beginner' },
      { label: 'Some experience' },
      { label: "I know what I'm doing" },
    ],
  },
  {
    question: 'How often do you want reminders?',
    opts: [
      { label: 'Every day' },
      { label: 'Every few days' },
      { label: 'Once a week' },
    ],
  },
  {
    question: "What's your gardening vibe?",
    opts: [
      { e: '🌿', label: 'Zen garden',      sub: 'Calm, minimal, peaceful' },
      { e: '🥕', label: 'Veggie patch',     sub: 'Productive and practical' },
      { e: '🌸', label: 'Flower paradise',  sub: 'Colourful and creative' },
      { e: '🌵', label: 'Low maintenance',  sub: 'Easy and carefree' },
    ],
  },
  {
    question: 'Pick your spirit animal',
    opts: [
      { e: '🐝', label: 'Busy bee',      sub: 'Always tending, never stopping' },
      { e: '🐢', label: 'Slow & steady', sub: 'Patient, methodical grower' },
      { e: '🦋', label: 'Free spirit',   sub: 'Goes where the wind blows' },
      { e: '🦉', label: 'Wise owl',      sub: 'Research before planting' },
    ],
  },
  {
    question: "What's your main goal?",
    opts: [
      { e: '🥗', label: 'Grow my own food', sub: 'Fresh veggies on the table' },
      { e: '🌍', label: 'Help the planet',  sub: 'Reduce my carbon footprint' },
      { e: '🧘', label: 'Find my zen',      sub: 'Gardening as therapy' },
      { e: '💰', label: 'Save money',       sub: 'Cut the grocery bills' },
    ],
  },
];

export default function Onboard() {
  const [fontsLoaded] = useFonts({
    'NataSans-Bold':     require('../assets/Fonts/NataSans-Bold.ttf'),
    'NataSans-Regular':  require('../assets/Fonts/NataSans-Regular.ttf'),
    'NataSans-SemiBold': require('../assets/Fonts/NataSans-SemiBold.ttf'),
    'NataSans-Medium':   require('../assets/Fonts/NataSans-Medium.ttf'),
  });

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected]               = useState<number | null>(null);
  const [answers, setAnswers]                 = useState<number[]>([]);
  const [finished, setFinished]               = useState(false);

  if (!fontsLoaded) return null;

  const q = questions[currentQuestion];
  const hasEmoji = q.opts.some(o => o.e);

  function handleSelect(i: number) {
    setSelected(i);
    setAnswers([...answers, i]);

    // auto advance after short delay so user sees selection
    setTimeout(() => {
      setSelected(null);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setFinished(true);
      }
    }, 500);
  }

  // ── Finished Screen ──────────────────────────────────────────────────────
  if (finished) {
    return (
      <LinearGradient colors={['#61BDFB', '#E5F4FF', '#BACC72']} style={styles.gradient}>
        <Image source={require('../assets/cloud.png')} style={styles.cloud} />
        <View style={styles.centered}>
          <View style={styles.card}>
            <Text style={styles.finishEmoji}>🌱</Text>
            <Text style={[styles.finishTitle, { fontFamily: 'NataSans-SemiBold' }]}>
              You're all set!
            </Text>
            <Text style={[styles.finishSub, { fontFamily: 'NataSans-Regular' }]}>
              Pura is ready to personalise{'\n'}your garden experience
            </Text>
            <TouchableOpacity
              style={styles.finishBtn}
              onPress={() => router.replace('/home')}
            >
              <Text style={[styles.finishBtnText, { fontFamily: 'NataSans-SemiBold' }]}>
                Start growing 🌿
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  }

  // ── Question Screen ──────────────────────────────────────────────────────
  return (
    <LinearGradient colors={['#61BDFB', '#E5F4FF', '#BACC72']} style={styles.gradient}>
      <Image source={require('../assets/cloud.png')} style={styles.cloud} />

      <View style={styles.centered}>
        <View style={styles.card}>

          {/* Question number */}
          <Text style={[styles.qNum, { fontFamily: 'NataSans-Regular' }]}>
            QUESTION {currentQuestion + 1} OF {questions.length}
          </Text>

          {/* Question text */}
          <Text style={[styles.qText, { fontFamily: 'NataSans-Bold' }]}>
            {q.question}
          </Text>

          {/* Options */}
          <View style={styles.options}>
            {q.opts.map((opt, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  hasEmoji ? styles.optEmoji : styles.opt,
                  selected === i && styles.optSelected,
                ]}
                onPress={() => handleSelect(i)}
                activeOpacity={0.8}
              >
                {/* emoji style */}
                {hasEmoji ? (
                  <>
                    <Text style={styles.emoji}>{opt.e}</Text>
                    <View style={styles.optTextWrap}>
                      <Text style={[styles.optLabel, { fontFamily: 'NataSans-Medium' }]}>
                        {opt.label}
                      </Text>
                      {opt.sub && (
                        <Text style={[styles.optSub, { fontFamily: 'NataSans-Regular' }]}>
                          {opt.sub}
                        </Text>
                      )}
                    </View>
                    {selected === i && (
                      <View style={styles.checkCircle}>
                        <Text style={styles.checkMark}>✓</Text>
                      </View>
                    )}
                  </>
                ) : (
                  /* simple style */
                  <>
                    <Text style={[styles.optLabel, { fontFamily: 'NataSans-Bold', color: '#FFFBFB' }]}>
                      {opt.label}
                    </Text>
                    <View style={[styles.circle, selected === i && styles.circleSelected]} />
                  </>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Dots */}
          <View style={styles.dots}>
            {questions.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === currentQuestion && styles.dotActive]}
              />
            ))}
          </View>

        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  cloud: {
    position: 'absolute',
    width: '100%',
    height: '40%',
    top: 0,
    left: 0,
    resizeMode: 'cover',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFBFB',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },

  // question
  qNum:  { fontSize: 11, color: '#9a9060', letterSpacing: 1 },
  qText: { fontSize: 22, color: '#595512', textAlign: 'center', lineHeight: 30, marginBottom: 4 },

  // options
  options: { width: '100%', gap: 10 },

  // simple option (no emoji)
  opt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#D4CDC9',
    borderRadius: 30,
    padding: 14,
    borderWidth: 2,
    borderColor: 'transparent',
  },

  // emoji option
  optEmoji: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0ece0',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },

  optSelected: {
    backgroundColor: '#56D5CA',
    borderColor: '#56D5CA',
  },

  emoji:       { fontSize: 24, width: 32, textAlign: 'center' },
  optTextWrap: { flex: 1 },
  optLabel:    { fontSize: 14, color: '#595512' },
  optSub:      { fontSize: 11, color: '#9a9060', marginTop: 2 },

  checkCircle: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: '#56D5CA',
    alignItems: 'center', justifyContent: 'center',
  },
  checkMark: { color: 'white', fontSize: 13, fontWeight: '700' },

  // simple circle
  circle: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: '#FFFBFB',
    backgroundColor: 'transparent',
  },
  circleSelected: { backgroundColor: '#FFFBFB' },

  // dots
  dots:      { flexDirection: 'row', gap: 6, marginTop: 8 },
  dot:       { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ccc' },
  dotActive: { width: 20, backgroundColor: '#56D5CA' },

  // finish screen
  finishEmoji: { fontSize: 60, marginBottom: 8 },
  finishTitle: { fontSize: 26, color: '#595512', textAlign: 'center' },
  finishSub:   { fontSize: 14, color: '#9a9060', textAlign: 'center', lineHeight: 22 },
  finishBtn: {
    marginTop: 16,
    backgroundColor: '#56D5CA',
    paddingVertical: 14,
    borderRadius: 25,
    width: '70%',
    alignItems: 'center',
  },
  finishBtnText: { fontSize: 16, color: '#fff' },
});