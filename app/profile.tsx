import GradientBackground from '@/components/GradientBackground';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";


type SettingRowProps = {
  label: string;
  value?: string;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (v: boolean) => void;
  onPress?: () => void;
  danger?: boolean;
};

function SettingRow({ label, value, toggle, toggleValue, onToggle, onPress, danger }: SettingRowProps) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={toggle ? 1 : 0.7}>
      <Text style={[styles.rowLabel, danger && { color: "#ff6b6b" }]}>{label}</Text>
      {toggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: "rgba(255,255,255,0.2)", true: "#56D5CA" }}
          thumbColor="#fff"
        />
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {value ? <Text style={styles.rowValue}>{value}</Text> : null}
          <Text style={styles.rowArrow}>›</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function Profile() {
  const [notifications, setNotifications] = useState(true);
  const [waterReminders, setWaterReminders] = useState(true);
  const [darkMode, setDarkMode]             = useState(false);

  async function handleLogout() {
  Alert.alert("Logout", "Are you sure?", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Logout",
      style: "destructive",
      onPress: async () => {
        await AsyncStorage.removeItem('isLoggedIn'); // ← clear saved login
        await AsyncStorage.removeItem('username');
        router.replace('/login');
      }
    }
  ]);
}

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Avatar ── */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>🌱</Text>
          </View>
          <Text style={styles.name}>User111</Text>
          <Text style={styles.email}>aiana@email.com</Text>

          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* ── Garden Stats ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Garden Stats</Text>
          <View style={styles.statsGrid}>
            {[
              { value: "4",    label: "Zones" },
              { value: "12",   label: "Plants" },
              { value: "120l", label: "Water Saved" },
              { value: "32",   label: "Days Active" },
            ].map((s, i) => (
              <View key={i} style={styles.statItem}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Notifications ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notifications</Text>
          <SettingRow label="Push Notifications"  toggle toggleValue={notifications}   onToggle={setNotifications} />
          <View style={styles.divider} />
          <SettingRow label="Watering Reminders"  toggle toggleValue={waterReminders}  onToggle={setWaterReminders} />
        </View>

        {/* ── App Settings ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>App Settings</Text>
          <SettingRow label="Language"   value="English" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow label="Dark Mode"  toggle toggleValue={darkMode} onToggle={setDarkMode} />
          <View style={styles.divider} />
          <SettingRow label="Units"      value="Metric"  onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow label="Privacy Policy"              onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow label="Terms of Service"            onPress={() => {}} />
        </View>

        {/* ── Logout ── */}
        <View style={styles.card}>
          <SettingRow label="Logout" danger onPress={handleLogout} />
        </View>

        <Text style={styles.version}>Pura v1.0.0</Text>

      </ScrollView>
     </GradientBackground>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scroll:   { padding: 20, paddingTop: 60, paddingBottom: 100 },

  avatarSection: { alignItems: "center", marginBottom: 24 },
  avatar:        { width: 90, height: 90, borderRadius: 45, backgroundColor: "rgba(255,255,255,0.3)", alignItems: "center", justifyContent: "center", marginBottom: 12, borderWidth: 2, borderColor: "rgba(255,255,255,0.6)" },
  avatarEmoji:   { fontSize: 40 },
  name:          { fontSize: 24, fontFamily: "NataSans-SemiBold", color: "#595512" },
  email:         { fontSize: 14, fontFamily: "NataSans-Regular",  color: "rgba(89,85,18,0.7)", marginTop: 4 },
  editBtn:       { marginTop: 12, backgroundColor: "#56D5CA", paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
  editBtnText:   { fontSize: 14, fontFamily: "NataSans-SemiBold", color: "#fff" },

  card:      { backgroundColor: "rgba(255,251,251,0.88)", borderRadius: 20, padding: 20, marginBottom: 16 },
  cardTitle: { fontSize: 14, fontFamily: "NataSans-SemiBold", color: "#595512", marginBottom: 16, letterSpacing: 0.5 },

  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  statItem:  { width: "45%", backgroundColor: "rgba(86,213,202,0.12)", borderRadius: 14, padding: 14, alignItems: "center", borderWidth: 1, borderColor: "rgba(86,213,202,0.3)" },
  statValue: { fontSize: 22, fontFamily: "NataSans-SemiBold", color: "#439D82" },
  statLabel: { fontSize: 12, fontFamily: "NataSans-Regular",  color: "#595512", marginTop: 2 },

  row:      { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 4 },
  rowLabel: { fontSize: 15, fontFamily: "NataSans-Regular", color: "#595512" },
  rowValue: { fontSize: 14, fontFamily: "NataSans-Regular", color: "rgba(89,85,18,0.5)" },
  rowArrow: { fontSize: 20, color: "rgba(89,85,18,0.4)" },
  divider:  { height: 0.5, backgroundColor: "rgba(89,85,18,0.15)", marginVertical: 10 },

  version: { textAlign: "center", fontSize: 12, fontFamily: "NataSans-Regular", color: "rgba(89,85,18,0.4)", marginTop: 8 },
});