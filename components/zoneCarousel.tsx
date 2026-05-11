// components/ZoneCarousel.tsx

import { View, Text, FlatList } from "react-native";
import { useRef, useState } from "react";
import CircularProgress from "react-native-circular-progress-indicator";
import { cards, typography } from "@/components/styles";

const zones = [
  { id: '1', name: 'Zone A - Cherry Tomatoes', health: 85, soilMoisture: 85, temperature: 22 },
  { id: '2', name: 'Zone B - Basil',           health: 70, soilMoisture: 60, temperature: 24 },
  { id: '3', name: 'Zone C - Lettuce',          health: 90, soilMoisture: 90, temperature: 20 },
];

export default function ZoneCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onScroll = (e: any) => {
    if (slideWidth === 0) return;
    const index = Math.round(e.nativeEvent.contentOffset.x / slideWidth);
    setActiveIndex(index);
  };

  return (
    <View
      style={cards.allCard}
      onLayout={(e) => setSlideWidth(e.nativeEvent.layout.width - 40)} // subtract horizontal padding
    >
      <FlatList
        ref={flatListRef}
        data={zones}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ width: slideWidth }}>
            <Text style={[typography.heading5, { color: '#595512', marginBottom: 12 }]}>
              {item.name}
            </Text>

            <View style={[cards.flexRow, { gap: 20, alignItems: 'center' }]}>
              {/* Circle */}
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress
                  value={item.health}
                  radius={60}
                  activeStrokeColor={'#5ECFBF'}
                  inActiveStrokeColor={'#E8EDCF'}
                  showProgressValue={false}
                />
                <Text style={{
                  position: 'absolute',
                  fontSize: 28,
                  fontWeight: '700',
                  color: '#595512',
                }}>
                  {item.health}%
                </Text>
              </View>

              {/* Stats */}
              <View style={[cards.flexColumn, { gap: 8 }]}>
                <View>
                  <Text style={[typography.body, { color: '#9A9982', fontWeight: '600' }]}>Soil Moisture</Text>
                  <Text style={[typography.heading4, { color: '#595512' }]}>{item.soilMoisture}%</Text>
                </View>
                <View>
                  <Text style={[typography.body, { color: '#9A9982', fontWeight: '600' }]}>Temperature</Text>
                  <Text style={[typography.heading4, { color: '#595512' }]}>{item.temperature}°C</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      />

      {/* Pagination Dots */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 16 }}>
        {zones.map((_, i) => (
          <View key={i} style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: i === activeIndex ? '#5ECFBF' : '#C4C4C4',
          }} />
        ))}
      </View>
    </View>
  );
}