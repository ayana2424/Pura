// app/garden.tsx

import { cards, typography } from "@/components/styles";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import { Add, SearchNormal1 } from "iconsax-react-native";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";


const zones = [
  {
    id: "1",
    name: "Zone A",
    plant: "Tomatoes",
    image: require("../assets/images/tomato.png"),
  },
  {
    id: "2",
    name: "Zone B",
    plant: "Carrots",
    image: require("../assets/images/carrot.png"),
  },
  {
    id: "3",
    name: "Zone C",
    plant: "Potatoes",
    image: require("../assets/images/potato.png"),
  },
  {
    id: "4",
    name: "Zone D",
    plant: "Lemons",
    image: require("../assets/images/lemon.png"),
  },
];
export default function Garden() {
  const [search, setSearch] = useState("");
  const { width } = useWindowDimensions();
  const cardSize = (width - 90) / 2; // 2 columns with padding
  const router = useRouter();

  const filtered = zones.filter(
    (z) =>
      z.plant.toLowerCase().includes(search.toLowerCase()) ||
      z.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.container]}>
        <Stack.Screen options={{ headerShown: false }} />

        {/* Header */}
        <Text
          style={[typography.heading2, { color: "#fff", marginBottom: 16 }]}
        >
          My Garden
        </Text>

        {/* Search Bar */}
        <LinearGradient
          colors={["rgba(138, 200, 242, 0.28)", "rgba(206, 219, 227, 0.62)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.searchBar}
        >
          <TextInput
            style={[typography.body, styles.searchInput]}
            placeholder="Search plants or zones..."
            placeholderTextColor="#DFEFFB"
            value={search}
            onChangeText={setSearch}
          />
          <SearchNormal1 size={20} color="#ffffff" />
        </LinearGradient>

        {/* Grid */}
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.grid}>
            {/* Add New Zone Card */}
            <TouchableOpacity
              style={[
                styles.card,
                styles.addCard,
                { width: cardSize, height: cardSize },
              ]}
            >
              <View style={styles.addIconWrapper}>
                <Add size={32} color="#d3baa377" />
              </View>
            </TouchableOpacity>

            {/* Zone Cards */}
            {filtered.map((zone) => (
              <TouchableOpacity
    key={zone.id}
    style={[cards.allCard, { width: cardSize, height: cardSize }]}
    onPress={() => router.push({ pathname: "/zone-detail", params: { id: zone.id } })}
  >
                <Text
                  style={[
                    typography.body,
                    {
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "#595512",
                    },
                  ]}
                >
                  {zone.name}
                </Text>
                <Text
                  style={[
                    typography.body,
                    {
                      textAlign: "center",
                      fontWeight: "600",
                      color: "#9A9982",
                    },
                  ]}
                >
                  {zone.plant}
                </Text>
                <Image
                  source={zone.image}
                  style={styles.plantImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 56,
    paddingHorizontal: 20, // matches homepage padding
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 20,
    borderColor: "rgba(255, 255, 255, 0.77)",
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    color: "#ffffff",
    fontSize: 15,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  card: {
    borderRadius: 20,
    overflow: "hidden",
  },
  addCard: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.7)",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  addIconWrapper: {
    backgroundColor: "rgb(255, 255, 255)",
    borderRadius: 14,
    padding: 10,
  },
  plantImage: {
    width: "100%",
    flex: 1,
  },
});
