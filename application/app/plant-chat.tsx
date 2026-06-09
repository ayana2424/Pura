import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft } from 'iconsax-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// ── Types ─────────────────────────────────────────────────────────────────────
type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};


// ── Quick suggestion prompts ──────────────────────────────────────────────────
const SUGGESTIONS = [
  { emoji: '🍅', text: 'Why are my tomato leaves curling?' },
  { emoji: '💧', text: 'How often should I water succulents?' },
  { emoji: '🪲', text: 'How do I get rid of aphids?' },
  { emoji: '🌱', text: 'Best soil mix for raised beds?' },
  { emoji: '☀️', text: 'Which plants grow in low light?' },
  { emoji: '🌿', text: 'How to identify my plant?' },
];

// ── System prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are Pura AI, a friendly and knowledgeable plant care assistant inside the Pura gardening app. You help gardeners with:
- Plant care advice (watering, fertilising, pruning)
- Plant identification from descriptions
- Watering schedules tailored to plant type and environment
- Pest and disease diagnosis and treatment
- Soil, light, and temperature recommendations

Keep responses concise, warm, and practical. Use occasional plant emojis to make it friendly. Always give actionable advice. If you're unsure, say so and suggest consulting a local nursery.`;

// ── Main Component ────────────────────────────────────────────────────────────
export default function PlantChat() {
  const OLLAMA_URL =
    process.env.EXPO_PUBLIC_OLLAMA_URL ||
    'http://localhost:11434';
  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  useEffect(() => {
    // welcome message
    setMessages([{
      id: '0',
      role: 'assistant',
      text: "Hi! I'm Pura AI 🌱 Your personal plant care assistant. Ask me anything about your plants — care tips, watering schedules, pest problems, or plant identification!",
    }]);
  }, []);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages, loading]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: text.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${OLLAMA_URL}/api/chat`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'llama3.2',
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
      ...updated.map(m => ({
        role: m.role,
        content: m.text,
      })),
    ],
    stream: false,
  }),
});



const data = await response.json();

const reply =
  data.message?.content ??
  "Oops! Something went wrong 🌿";

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: reply,
      }]);
    } catch  (error) {
  console.log('OLLAMA ERROR:', error);

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: "Oops! I had trouble connecting. Please check your internet and try again 🌿",
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient colors={['#61BDFB', '#E5F4FF', '#BACC72']} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >

        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/community')} style={styles.backBtn}>
            <ArrowLeft size="24" color="#56D5CA" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <View style={styles.aiAvatar}>
              <Text style={{ fontSize: 20 }}>🌱</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>Pura AI</Text>
              <Text style={styles.headerSub}>Plant Care Assistant</Text>
            </View>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* ── Messages ── */}
        <ScrollView
          ref={scrollRef}
          style={styles.messagesWrap}
          contentContainerStyle={styles.messages}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map(msg => (
            <View
              key={msg.id}
              style={[
                styles.bubble,
                msg.role === 'user' ? styles.bubbleUser : styles.bubbleAI,
              ]}
            >
              {msg.role === 'assistant' && (
                <View style={styles.aiBubbleAvatar}>
                  <Text style={{ fontSize: 14 }}>🌱</Text>
                </View>
              )}
              <View style={[
                styles.bubbleText,
                msg.role === 'user' ? styles.bubbleTextUser : styles.bubbleTextAI,
              ]}>
                <Text style={[
                  styles.msgText,
                  msg.role === 'user' ? styles.msgTextUser : styles.msgTextAI,
                ]}>
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}

          {/* loading indicator */}
          {loading && (
            <View style={[styles.bubble, styles.bubbleAI]}>
              <View style={styles.aiBubbleAvatar}>
                <Text style={{ fontSize: 14 }}>🌱</Text>
              </View>
              <View style={[styles.bubbleText, styles.bubbleTextAI, styles.loadingBubble]}>
                <ActivityIndicator size="small" color="#56D5CA" />
                <Text style={styles.loadingText}>Pura AI is thinking...</Text>
              </View>
            </View>
          )}

          {/* suggestions — only show when no messages from user yet */}
          {messages.length === 1 && (
            <View style={styles.suggestions}>
              <Text style={styles.suggestionsLabel}>Try asking:</Text>
              <View style={styles.suggestionsGrid}>
                {SUGGESTIONS.map((s, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.suggestionChip}
                    onPress={() => sendMessage(s.text)}
                  >
                    <Text style={styles.suggestionEmoji}>{s.emoji}</Text>
                    <Text style={styles.suggestionText}>{s.text}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* ── Input ── */}
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask about your plants..."
            placeholderTextColor="rgba(89,85,18,0.4)"
            multiline
            maxLength={500}
            onSubmitEditing={() => sendMessage(input)}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
            onPress={() => sendMessage(input)}
            disabled={!input.trim() || loading}
          >
            <Text style={styles.sendIcon}>↑</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  gradient: { flex: 1 },

  // header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backBtn:      { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,251,251,0.7)', alignItems: 'center', justifyContent: 'center' },
  backText:     { fontSize: 20, color: '#595512' },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  aiAvatar:     { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,251,251,0.88)', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#56D5CA' },
  headerTitle:  { fontSize: 16, fontFamily: 'NataSans-SemiBold', color: '#595512' },
  headerSub:    { fontSize: 11, fontFamily: 'NataSans-Regular', color: 'rgba(89,85,18,0.6)' },

  // messages
  messagesWrap: { flex: 1 },
  messages:     { padding: 16, gap: 12, paddingBottom: 8 },

  bubble:       { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  bubbleUser:   { justifyContent: 'flex-end' },
  bubbleAI:     { justifyContent: 'flex-start' },

  aiBubbleAvatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,251,251,0.88)', alignItems: 'center', justifyContent: 'center', marginBottom: 2, borderWidth: 1, borderColor: 'rgba(86,213,202,0.4)' },

  bubbleText:     { maxWidth: '78%', borderRadius: 18, padding: 12 },
  bubbleTextUser: { backgroundColor: '#56D5CA', borderBottomRightRadius: 4 },
  bubbleTextAI:   { backgroundColor: 'rgba(255,251,251,0.92)', borderBottomLeftRadius: 4 },

  msgText:     { fontSize: 14, fontFamily: 'NataSans-Regular', lineHeight: 21 },
  msgTextUser: { color: '#FFFEF1' },
  msgTextAI:   { color: '#595512' },

  loadingBubble: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  loadingText:   { fontSize: 13, fontFamily: 'NataSans-Regular', color: '#9a9060' },

  // suggestions
  suggestions:      { marginTop: 8, gap: 10 },
  suggestionsLabel: { fontSize: 12, fontFamily: 'NataSans-SemiBold', color: 'rgba(89,85,18,0.5)', letterSpacing: 0.5 },
  suggestionsGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  suggestionChip:   { backgroundColor: 'rgba(255,251,251,0.88)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 0.5, borderColor: 'rgba(86,213,202,0.4)' },
  suggestionEmoji:  { fontSize: 14 },
  suggestionText:   { fontSize: 12, fontFamily: 'NataSans-Regular', color: '#595512', maxWidth: 160 },

  // input
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    backgroundColor: 'rgba(255,251,251,0.7)',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(89,85,18,0.1)',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,251,251,0.95)',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: 'NataSans-Regular',
    color: '#595512',
    maxHeight: 100,
    borderWidth: 0.5,
    borderColor: 'rgba(86,213,202,0.4)',
  },
  sendBtn:         { width: 42, height: 42, borderRadius: 21, backgroundColor: '#56D5CA', alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { backgroundColor: '#c9cad4', opacity: 0.6 },
  sendIcon:        { fontSize: 20, color: '#FFFEF1', fontWeight: '600' },
});