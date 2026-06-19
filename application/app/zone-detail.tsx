// app/zone-detail.tsx

import { typography } from "@/components/styles";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "iconsax-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { getApp, getApps, initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore, limit, orderBy, query } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBmHeqYjp3izrbpuVU1S2APjJneHk88nbw",
  authDomain: "gardeningproject-bac4a.firebaseapp.com",
  projectId: "gardeningproject-bac4a",
  storageBucket: "gardeningproject-bac4a.firebasestorage.app",
  messagingSenderId: "1040793880454",
  appId: "1:1040793880454:web:476d5748977ac5477d4e07",
  measurementId: "G-53XVDSP22Y"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);

const zoneData: Record<string, {
  name: string; plant: string; plantStatus: string; statusSub: string;
  growthPct: number; lastWatered: string; soilMoisture: string; summary: string;
}> = {
  "1": { name: "Zone A", plant: "Tomatoes", plantStatus: "Your plant is fruiting!", statusSub: "Time to grab your fruits", growthPct: 100, lastWatered: "3h 55m ago", soilMoisture: "65%", summary: "Overall your plant is healthy. It is currently growing at a steady rate. Keep it up!" },
  "2": { name: "Zone B", plant: "Carrots", plantStatus: "Growing steadily", statusSub: "Roots are developing well", growthPct: 60, lastWatered: "1h 20m ago", soilMoisture: "72%", summary: "Your carrots are developing nicely underground." },
  "3": { name: "Zone C", plant: "Potatoes", plantStatus: "Just sprouted!", statusSub: "Early growth phase", growthPct: 30, lastWatered: "5h 10m ago", soilMoisture: "50%", summary: "Your potatoes have just sprouted. Make sure to hill the soil." },
  "4": { name: "Zone D", plant: "Lemons", plantStatus: "Flowering phase", statusSub: "Blossoms detected", growthPct: 75, lastWatered: "2h 30m ago", soilMoisture: "58%", summary: "Your lemon tree is in the flowering phase. Avoid overwatering." },
};

function parseGemmaDiagnosis(raw: string): { name?: string; health?: string; description?: string } {
  try {
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch {
    return {};
  }
}

export default function ZoneDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const zone = zoneData[id ?? "1"];

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiHealth, setAiHealth] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatestScan() {
      try {
        const q = query(collection(db, "leaf_auto_saves"), orderBy("timestamp", "desc"), limit(1));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const doc = snapshot.docs[0].data();
          const diagnosis = parseGemmaDiagnosis(doc.gemma_diagnosis ?? "");
          if (diagnosis.description) setAiSummary(diagnosis.description);
          if (diagnosis.health) setAiHealth(diagnosis.health);
          if (doc.storage_path) {
            const url = await getDownloadURL(ref(storage, doc.storage_path));
            setImageUrl(url);
          }
        }
      } catch (err) {
        console.error("Failed to fetch latest scan:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLatestScan();
  }, []);

  if (!zone) return null;

  const displaySummary = aiSummary ?? zone.summary;
  const displayStatus = aiHealth ?? zone.plantStatus;

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={[typography.heading2, { color: "#fff" }]}>{zone.name}</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>{displayStatus}</Text>
          <Text style={styles.heroSub}>{zone.statusSub}</Text>

          {loading ? (
            <View style={styles.imagePlaceholder}>
              <ActivityIndicator size="large" color="#2BC0A8" />
            </View>
          ) : imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.heroImage} resizeMode="cover" />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={{ color: "#aaa", fontSize: 13 }}>No image available</Text>
            </View>
          )}

          <View style={styles.progressTrack}>
            <LinearGradient
              colors={["#4DD9C0", "#2BC0A8"]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${zone.growthPct}%` }]}
            />
            <Text style={styles.progressLabel}>{zone.growthPct}%</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { marginRight: 8 }]}>
            <Text style={styles.statLabel}>Last Watered</Text>
            <Text style={styles.statValue}>{zone.lastWatered}</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See All Data →</Text></TouchableOpacity>
          </View>
          <View style={[styles.statCard, { marginLeft: 8 }]}>
            <Text style={styles.statLabel}>Soil Moisture</Text>
            <Text style={styles.statValue}>{zone.soilMoisture}</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See All Data →</Text></TouchableOpacity>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Plant Summary</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#2BC0A8" style={{ marginVertical: 8 }} />
          ) : (
            <Text style={styles.summaryBody}>{displaySummary}</Text>
          )}
          <TouchableOpacity style={styles.askBtn} activeOpacity={0.85}>
            <LinearGradient
              colors={["#4DD9C0", "#2BC0A8"]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.askBtnGradient}
            >
              <Text style={styles.askBtnText}>Ask More</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 60, paddingBottom: 12, paddingHorizontal: 20 },
  backBtn: { width: 38, height: 38, alignItems: "center", justifyContent: "center" },
  scroll: { paddingHorizontal: 20, paddingBottom: 48, gap: 14 },
  heroCard: { backgroundColor: "rgba(255,255,255,0.88)", borderRadius: 24, padding: 20, alignItems: "center" },
  heroTitle: { fontSize: 20, fontWeight: "700", color: "#2D2D2D", textAlign: "center", marginBottom: 4 },
  heroSub: { fontSize: 14, color: "#7A7A7A", textAlign: "center", marginBottom: 12 },
  heroImage: { width: "85%", height: 220, marginBottom: 16, borderRadius: 16 },
  imagePlaceholder: { width: "85%", height: 220, marginBottom: 16, borderRadius: 16, backgroundColor: "#F0F0F0", alignItems: "center", justifyContent: "center" },
  progressTrack: { width: "100%", height: 28, backgroundColor: "#E8E8E8", borderRadius: 14, overflow: "hidden", justifyContent: "center" },
  progressFill: { position: "absolute", left: 0, top: 0, bottom: 0, borderRadius: 14 },
  progressLabel: { textAlign: "center", fontSize: 13, fontWeight: "700", color: "#fff", zIndex: 1 },
  statsRow: { flexDirection: "row" },
  statCard: { flex: 1, backgroundColor: "rgba(255,255,255,0.88)", borderRadius: 20, padding: 16, gap: 4 },
  statLabel: { fontSize: 13, color: "#9A9982", fontWeight: "500", marginBottom: 2 },
  statValue: { fontSize: 22, fontWeight: "700", color: "#2D2D2D", marginBottom: 8 },
  seeAll: { fontSize: 13, color: "#2BC0A8", fontWeight: "600" },
  summaryCard: { backgroundColor: "rgba(255,255,255,0.88)", borderRadius: 24, padding: 20, gap: 8 },
  summaryTitle: { fontSize: 17, fontWeight: "700", color: "#2D2D2D" },
  summaryBody: { fontSize: 14, color: "#6B6B6B", lineHeight: 21, marginBottom: 8 },
  askBtn: { borderRadius: 30, overflow: "hidden" },
  askBtnGradient: { paddingVertical: 14, alignItems: "center", borderRadius: 30 },
  askBtnText: { color: "#fff", fontSize: 16, fontWeight: "700", letterSpacing: 0.3 },
});