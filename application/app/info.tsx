import {
  View, Text, ScrollView, TouchableOpacity,
  Image, FlatList, Alert, ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { cards, typography } from "@/components/styles";
import { Ionicons } from "@expo/vector-icons";
import CameraScreen from "./camera";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs, orderBy, query } from "firebase/firestore";

// ─── Firebase config (safe to have in app — read-only rules) ──────────────────
const firebaseConfig = {
  apiKey: "AIzaSyBmHeqYjp3izrbpuVU1S2APjJneHk88nbw",
  authDomain: "gardeningproject-bac4a.firebaseapp.com",
  projectId: "gardeningproject-bac4a",
  storageBucket: "gardeningproject-bac4a.firebasestorage.app",
  messagingSenderId: "1040793880454",
  appId: "1:1040793880454:web:476d5748977ac5477d4e07",
  measurementId: "G-53XVDSP22Y"
};

const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(firebaseApp);

// ─── Your computer's local IP — must be on same WiFi as phone ─────────────────
const API_URL = "http://172.20.10.2:8080/analyse";  // <-- change this

// ─── Types ────────────────────────────────────────────────────────────────────
type HealthStatus = "Healthy" | "Warning" | "Critical";

type HistoryEntry = {
  id: string;
  imageUrl: string;
  plantName: string;
  health: HealthStatus;
  description: string;
  scannedAt: string;
};

const STATUS_COLOURS: Record<HealthStatus, { bg: string; text: string; dot: string }> = {
  Healthy:  { bg: "#E6F5EC", text: "#1B6E38", dot: "#34C65F" },
  Warning:  { bg: "#FFF8E1", text: "#7A5200", dot: "#F5A623" },
  Critical: { bg: "#FDECEA", text: "#8B1A1A", dot: "#E53935" },
};

function normaliseHealth(raw: string): HealthStatus {
  const s = raw?.toLowerCase() ?? "";
  if (s.includes("healthy")) return "Healthy";
  if (s.includes("critical")) return "Critical";
  return "Warning";
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatusBadge({ health, label }: { health: HealthStatus; label?: string }) {
  const c = STATUS_COLOURS[health];
  return (
    <View style={{ flexDirection: "row", alignItems: "center", alignSelf: "flex-start",
      backgroundColor: c.bg, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, gap: 6 }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c.dot }} />
      <Text style={[typography.caption, { color: c.text, fontWeight: "600" }]}>
        {label ?? health}
      </Text>
    </View>
  );
}

function AnalysingOverlay() {
  const steps = ["Enhancing image…", "Identifying plant…", "Diagnosing health…", "Saving results…"];
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setStep((s) => (s + 1) % steps.length), 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ alignItems: "center", paddingVertical: 24, gap: 16 }}>
      <ActivityIndicator size="large" color="#5ECFBF" />
      <Text style={[typography.heading5, { color: "#ffffff" }]}>{steps[step]}</Text>
      <View style={{ flexDirection: "row", gap: 6 }}>
        {steps.map((_, i) => (
          <View key={i} style={{
            width: i === step ? 20 : 8, height: 8, borderRadius: 4,
            backgroundColor: i === step ? "#5ECFBF" : "#C4C4B0",
          }} />
        ))}
      </View>
    </View>
  );
}

function ResultCard({ entry }: { entry: HistoryEntry }) {
  const c = STATUS_COLOURS[entry.health];
  return (
    <View style={[cards.allCard, { borderLeftWidth: 4, borderLeftColor: c.dot, marginTop: 12 }]}>
      <StatusBadge health={entry.health} />
      <Text style={[typography.body, { color: "#595512", marginTop: 6 }]}>{entry.description}</Text>
    </View>
  );
}

function HistoryCard({ entry }: { entry: HistoryEntry }) {
  return (
    <View style={[cards.allCard, { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 }]}>
      <Image source={{ uri: entry.imageUrl }}
        style={{ width: 56, height: 56, borderRadius: 10, backgroundColor: "#E8E8DC" }} />
      <View style={{ flex: 1 }}>
        <Text style={[typography.heading5, { color: "#595512" }]}>{entry.plantName}</Text>
        <StatusBadge health={entry.health} />
      </View>
      <Text style={[typography.caption, { color: "#9A9982", fontSize: 11 }]}>{entry.scannedAt}</Text>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function PlantDoctorScreen() {
  const [image, setImage]           = useState<string | null>(null);
  const [loading, setLoading]       = useState(false);
  const [result, setResult]         = useState<HistoryEntry | null>(null);
  const [history, setHistory]       = useState<HistoryEntry[]>([]);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => { fetchHistory(); }, []);

  async function fetchHistory() {
    try {
      const q = query(collection(db, "plant_scans"), orderBy("timestamp", "desc"));
      const snap = await getDocs(q);
      const entries: HistoryEntry[] = snap.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          imageUrl: d.image_url ?? "",
          plantName: d.plant_name ?? "Unknown plant",
          health: normaliseHealth(d.health),
          description: d.description ?? "",
          scannedAt: new Date(d.timestamp * 1000).toLocaleDateString(),
        };
      });
      setHistory(entries);
    } catch (e) {
      console.warn("Firestore fetch error:", e);
    }
  }

  async function pickFromGallery() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission required", "Allow access to your photo library in Settings.");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8,
    });
    if (!res.canceled) handleImage(res.assets[0].uri);
  }

  function handlePhotoCaptured(uri: string) {
    setShowCamera(false);
    handleImage(uri);
  }

  async function handleImage(uri: string) {
    setImage(uri);
    setResult(null);
    setLoading(true);
    try {
      // Build multipart form and POST to Flask
      const formData = new FormData();
      formData.append("image", { uri, name: "plant.jpg", type: "image/jpeg" } as any);

      const response = await fetch(API_URL, { method: "POST", body: formData });
      if (!response.ok) throw new Error(`Server error ${response.status}`);
      const data = await response.json();

      const entry: HistoryEntry = {
        id: data.timestamp.toString(),
        imageUrl: data.image_url,
        plantName: data.plant_name ?? "Unknown plant",
        health: normaliseHealth(data.health),
        description: data.description ?? "",
        scannedAt: new Date(data.timestamp * 1000).toLocaleDateString(),
      };
      setResult(entry);
      setHistory((prev) => [entry, ...prev]);
    } catch (e: any) {
      Alert.alert("Analysis failed", e.message ?? "Could not analyse the image.");
    } finally {
      setLoading(false);
    }
  }

  function resetScan() { setImage(null); setResult(null); }

  if (showCamera) {
    return <CameraScreen onPhotoCaptured={handlePhotoCaptured} />;
  }

  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}>

      <Text style={[typography.heading2, { color: "#ffffff", marginBottom: 4, paddingTop:72 }]}>Plant Doctor</Text>
      <Text style={[typography.caption, { color: "#ffffff", marginBottom: 20 }]}>
        Take a pic and learn more about your plant
      </Text>

      <View style={[cards.allCard, { marginBottom: 12 }]}>
        <Text style={[typography.heading4, { color: "#595512", textAlign: "center", marginBottom: 6 }]}>
          Analyse your plant
        </Text>
        <Text style={[typography.caption, { color: "#9A9982", textAlign: "center", marginBottom: 16 }]}>
          Upload or take a photo and our AI will diagnose its health in seconds.
        </Text>

        {/* Image preview */}
        <TouchableOpacity onPress={pickFromGallery}
          style={{ width: "100%", height: 180, borderRadius: 14, backgroundColor: "#F0F0E8",
            alignItems: "center", justifyContent: "center", marginBottom: 14, overflow: "hidden" }}
          activeOpacity={0.85}>
          {image ? (
            <Image source={{ uri: image }} style={{ width: "100%", height: "100%" }} />
          ) : (
            <View style={{ alignItems: "center", gap: 8 }}>
              <Ionicons name="camera-outline" size={48} color="#C4C4B0" />
              <Text style={[typography.caption, { color: "#C4C4B0" }]}>Tap to upload from gallery</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Loading animation */}
        {loading && <AnalysingOverlay />}

        {/* Take photo button */}
        {!loading && (
          <TouchableOpacity onPress={() => setShowCamera(true)}
            style={{ backgroundColor: "#5ECFBF", borderRadius: 30,
              paddingVertical: 14, alignItems: "center", marginBottom: 8 }}
            activeOpacity={0.85}>
            <Text style={[typography.heading5, { color: "#fff" }]}>Take a Photo</Text>
          </TouchableOpacity>
        )}

        {!loading && (
          <Text style={[typography.caption, { color: "#9A9982", textAlign: "center" }]}>
            or upload from your gallery
          </Text>
        )}

        {/* Result */}
        {result && !loading && (
          <>
            <ResultCard entry={result} />
            <TouchableOpacity onPress={resetScan} style={{ alignItems: "center", marginTop: 12 }}>
              <Text style={[typography.caption, { color: "#5ECFBF" }]}>Scan another plant →</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* History */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
        <Text style={[typography.heading4, { color: "#ffffff" }]}>History</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={fetchHistory}>
            <Text style={[typography.caption, { color: "#ffffff", fontWeight: "600" }]}>Refresh</Text>
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
        <View style={[cards.allCard, { alignItems: "center", paddingVertical: 32, gap: 10 }]}>
          <Ionicons name="refresh-circle-outline" size={40} color="#C4C4B0" />
          <Text style={[typography.caption, { color: "#9A9982", textAlign: "center" }]}>
            Your past plant analyses will{"\n"}appear here after your first scan.
          </Text>
        </View>
      ) : (
        <FlatList data={history} keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HistoryCard entry={item} />}
          scrollEnabled={false} />
      )}
    </ScrollView>
  );
}