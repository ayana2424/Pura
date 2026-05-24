import GradientBackground from '@/components/GradientBackground';
import { typography } from '@/components/styles';
import { router } from 'expo-router';
import { Heart, InfoCircle, Message, MessageText1, People, SearchNormal1, Send2 } from 'iconsax-react-native';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
// ── Data ─────────────────────────────────────────────────────────────────────


const RECOMMENDED = [
  { id: '1', emoji: '🌵', name: 'Cacti Community',  members: 15, joined: false },
  { id: '2', emoji: '🌹', name: 'Roses Group',      members: 40, joined: false },
  { id: '3', emoji: '💜', name: 'Lavender Corner',  members: 55, joined: false },
  { id: '4', emoji: '🍋', name: 'Citrus Growers',   members: 32, joined: false },
];

const POSTS = [
  {
    id: '1',
    name: 'Aiana',
    initials: 'A',
    group: 'Tomato Tips',
    time: '2h ago',
    text: 'My cherry tomatoes are finally turning red! The drip irrigation setup has been a game changer 🍅',
    likes: 24,
    comments: 8,
    liked: true,
  },
  {
    id: '2',
    name: 'Mei',
    initials: 'Mei',
    group: 'Herb Garden',
    time: '5h ago',
    text: 'Just harvested my first basil batch! Key tip — keep it in partial shade during the hottest hours 🌿',
    likes: 17,
    comments: 5,
    liked: false,
  },
  {
    id: '3',
    name: 'Livia',
    initials: 'L',
    group: 'Roses Group',
    time: 'Yesterday',
    text: 'Sunflowers are blooming beautifully! Added them next to veggie beds to attract pollinators 🌻',
    likes: 31,
    comments: 12,
    liked: false,
  },
];

const QA = [
  { id: '1', question: 'Why are my basil leaves turning yellow at the edges?', answers: 12, tag: 'Herbs',    answered: true  },
  { id: '2', question: 'Best companion plants for tomatoes?',                  answers: 5,  tag: 'Tomatoes', answered: false },
  { id: '3', question: 'How often should I fertilise raised beds?',            answers: 8,  tag: 'Veggies',  answered: true  },
];

const TABS = ['Feed', 'Groups', 'Q&A'];

// ── Component ─────────────────────────────────────────────────────────────────
export default function Community() {
  const [search, setSearch]         = useState('');
  const [activeTab, setActiveTab]   = useState('Feed');
  const [likedPosts, setLikedPosts] = useState<string[]>(['1']);
  const [joined, setJoined]         = useState<string[]>([]);

  function toggleLike(id: string) {
    setLikedPosts(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  }

  function toggleJoin(id: string) {
    setJoined(prev => prev.includes(id) ? prev.filter(j => j !== id) : [...prev, id]);
  }

  const filteredPosts = POSTS.filter(p =>
    p.text.toLowerCase().includes(search.toLowerCase()) ||
    p.group.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <GradientBackground> 

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={[typography.heading3, { color: '#fff' }]}>Garden Summary </Text>
            <Text style={styles.subtitle}>Read about your plant or chat with the community!</Text>
          </View>
          <TouchableOpacity style={styles.chatBtn} onPress={() => router.push('/plant-chat' as any)}>
            <MessageText1 size={22} color="#595512" variant="Bold" />
          </TouchableOpacity>
        </View>

        {/* ── Search ── */}
        <View style={styles.searchWrap}>
          <TextInput
            style={styles.searchInput}
            placeholder="Cactus Expert..."
            placeholderTextColor="rgba(89,85,18,0.4)"
            value={search}
            onChangeText={setSearch}
          />
          <SearchNormal1 size={20} color="rgba(89,85,18,0.4)" />
        </View>

        {/* ── Featured carousel ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredWrap}>
  {[1, 2, 3].map(i => (
    <TouchableOpacity key={i} style={styles.featuredCard}>
      
    </TouchableOpacity>
  ))}
</ScrollView>

        {/* ── Tabs ── */}
        <View style={styles.tabs}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── FEED tab ── */}
        {activeTab === 'Feed' && (
          <>
            {filteredPosts.map(post => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{post.initials}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.postName}>{post.name}</Text>
                    <Text style={styles.postMeta}>{post.group} · {post.time}</Text>
                  </View>
                </View>
                <Text style={styles.postText}>{post.text}</Text>
                <View style={styles.postActions}>
                  <TouchableOpacity style={styles.action} onPress={() => toggleLike(post.id)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
    <Heart
      size={18}
      color={likedPosts.includes(post.id) ? '#56D5CA' : '#9a9060'}
      variant={likedPosts.includes(post.id) ? 'Bold' : 'Linear'}
    />
    <Text style={styles.actionText}>
      {likedPosts.includes(post.id) ? post.likes + 1 : post.likes}
    </Text>
  </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.action}>
                    <Message size={18} color="#9a9060" variant="Linear" />
<Text style={styles.actionText}> {post.comments}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.action}>
                    <Send2 size={18} color="#9a9060" variant="Linear" />
<Text style={styles.actionText}> Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        {/* ── GROUPS tab ── */}
        {activeTab === 'Groups' && (
          <View style={styles.recommendedCard}>
            <Text style={styles.recommendedTitle}>Recommended</Text>
            {RECOMMENDED.map(group => (
              <View key={group.id} style={styles.groupRow}>
                <View style={styles.groupAvatar}>
                  <People size={24} color="#439D82" variant="Bold" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.groupName}>{group.name}</Text>
                  <Text style={styles.groupMembers}>{group.members} members</Text>
                </View>
                <TouchableOpacity
                  style={[styles.joinBtn, joined.includes(group.id) && styles.joinBtnJoined]}
                  onPress={() => toggleJoin(group.id)}
                >
                  <Text style={[styles.joinBtnText, joined.includes(group.id) && styles.joinBtnTextJoined]}>
                    {joined.includes(group.id) ? 'Joined ✓' : 'Join'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* ── Q&A tab ── */}
        {activeTab === 'Q&A' && (
          <>
            <TouchableOpacity style={styles.askBtn}>
              <Text style={styles.askBtnText}>+ Ask a question</Text>
            </TouchableOpacity>
            {QA.map(item => (
              <View key={item.id} style={styles.qaCard}>
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
  <InfoCircle size={16} color="#56D5CA" variant="Bold" />
  <Text style={styles.qaQ}>{item.question}</Text>
</View>
                <View style={styles.qaMeta}>
                  <Text style={styles.qaCount}>{item.answers} answers</Text>
                  <View style={styles.qaTag}>
                    <Text style={styles.qaTagText}>{item.tag}</Text>
                  </View>
                  {item.answered && (
                    <View style={[styles.qaTag, { backgroundColor: 'rgba(86,213,202,0.2)' }]}>
                      <Text style={styles.qaTagText}>Answered ✓</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* ── FAB ── */}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      </GradientBackground>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  gradient: { flex: 1 },
  cloud: {
    position: 'absolute', top: 0, left: 0,
    width: '100%', height: '35%', resizeMode: 'cover',
  },
  scroll: { padding: 20, paddingTop: 56 },

  // header
  header:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  title:    { fontSize: 26, fontFamily: 'NataSans-SemiBold', color: '#595512' },
  subtitle: { fontSize: 12, fontFamily: 'NataSans-Regular', color: 'rgba(89,85,18,0.7)', marginTop: 3, maxWidth: '85%' },
  chatBtn:  { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,251,251,0.88)', alignItems: 'center', justifyContent: 'center' },

  // search
  searchWrap:  { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,251,251,0.88)', borderRadius: 25, paddingHorizontal: 16, paddingVertical: 10, marginBottom: 16 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: 'NataSans-Regular', color: '#595512' },
  searchIcon:  { fontSize: 18 },

  // featured
  featuredWrap: { marginBottom: 16 },
  featuredTitle:   { fontSize: 13, fontFamily: 'NataSans-SemiBold', color: '#595512', textAlign: 'center' },
  featuredMembers: { fontSize: 11, fontFamily: 'NataSans-Regular', color: 'rgba(89,85,18,0.6)' },

  featuredCard: {
  width: 350,
  height: 200,
  borderRadius: 20,
  marginRight: 12,
  backgroundColor: 'rgba(255,251,251,0.88)', // ← white frosted
},

  // tabs
  tabs:        { flexDirection: 'row', gap: 8, marginBottom: 14 },
  tab:         { flex: 1, paddingVertical: 8, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.4)', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.6)' },
  tabActive:   { backgroundColor: '#56D5CA', borderColor: '#56D5CA' },
  tabText:     { fontSize: 13, fontFamily: 'NataSans-Medium', color: '#595512' },
  tabTextActive: { color: '#FFFEF1' },

  // posts
  postCard:    { backgroundColor: 'rgba(255,251,251,0.88)', borderRadius: 20, padding: 14, marginBottom: 10 },
  postHeader:  { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  avatar:      { width: 38, height: 38, borderRadius: 19, backgroundColor: '#56D5CA', alignItems: 'center', justifyContent: 'center' },
  avatarText:  { fontSize: 12, fontFamily: 'NataSans-SemiBold', color: '#FFFEF1' },
  postName:    { fontSize: 13, fontFamily: 'NataSans-SemiBold', color: '#595512' },
  postMeta:    { fontSize: 11, fontFamily: 'NataSans-Regular', color: '#9a9060', marginTop: 1 },
  postText:    { fontSize: 13, fontFamily: 'NataSans-Regular', color: '#595512', lineHeight: 20, marginBottom: 10 },
  postActions: { flexDirection: 'row', gap: 16, paddingTop: 10, borderTopWidth: 0.5, borderTopColor: 'rgba(89,85,18,0.1)', alignItems: 'center' },
  action:      {flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionText:  { fontSize: 13, fontFamily: 'NataSans-Regular', color: '#9a9060' },

  // groups
  recommendedCard:  { backgroundColor: 'rgba(86,213,202,0.15)', borderRadius: 24, padding: 20 },
  recommendedTitle: { fontSize: 20, fontFamily: 'NataSans-SemiBold', color: '#595512', marginBottom: 14 },
  groupRow:         { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(255,251,251,0.9)', borderRadius: 16, padding: 12, marginBottom: 8 },
  groupAvatar:      { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(86,213,202,0.2)', alignItems: 'center', justifyContent: 'center' },
  groupName:        { fontSize: 14, fontFamily: 'NataSans-SemiBold', color: '#595512' },
  groupMembers:     { fontSize: 11, fontFamily: 'NataSans-Regular', color: '#9a9060', marginTop: 2 },
  joinBtn:          { backgroundColor: '#56D5CA', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 7 },
  joinBtnJoined:    { backgroundColor: 'rgba(86,213,202,0.2)', borderWidth: 1, borderColor: '#56D5CA' },
  joinBtnText:      { fontSize: 13, fontFamily: 'NataSans-SemiBold', color: '#FFFEF1' },
  joinBtnTextJoined:{ color: '#439D82' },

  // q&a
  askBtn:     { backgroundColor: '#56D5CA', borderRadius: 20, padding: 12, alignItems: 'center', marginBottom: 12 },
  askBtnText: { fontSize: 14, fontFamily: 'NataSans-SemiBold', color: '#FFFEF1' },
  qaCard:     { backgroundColor: 'rgba(255,251,251,0.88)', borderRadius: 16, padding: 14, marginBottom: 8 },
  qaQ:        { fontSize: 13, fontFamily: 'NataSans-SemiBold', color: '#595512', lineHeight: 20, marginBottom: 8 },
  qaMeta:     { flexDirection: 'row', gap: 6, alignItems: 'center' },
  qaCount:    { fontSize: 11, fontFamily: 'NataSans-Regular', color: '#9a9060' },
  qaTag:      { backgroundColor: 'rgba(86,213,202,0.15)', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2, borderWidth: 0.5, borderColor: 'rgba(86,213,202,0.4)' },
  qaTagText:  { fontSize: 10, fontFamily: 'NataSans-Regular', color: '#439D82' },

  // fab
  fab:     { position: 'absolute', bottom: 24, right: 20, width: 50, height: 50, borderRadius: 25, backgroundColor: '#56D5CA', alignItems: 'center', justifyContent: 'center' },
  fabText: { fontSize: 28, color: '#FFFEF1', lineHeight: 32 },
});