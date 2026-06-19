import { View, Text, FlatList, Image } from "react-native";
import { useRef, useState } from "react";
import { cards, typography } from "@/components/styles";

// TODO: replace with real zone data from your backend/context
const zones = [
  {
    id: '1',
    name: 'Zone A - Cherry Tomatoes',
    image: require('@/assets/images/roof_placeholder.png'), // swap with your actual image paths
    lastWatered: '22mins',
    soilMoisture: '85%',
    roofCondition: 'Closed',
  },
  {
    id: '2',
    name: 'Zone B - Basil',
    image: require('@/assets/images/roof_placeholder.png'),
    lastWatered: '41mins',
    soilMoisture: '60%',
    roofCondition: 'Open',
  },
  {
    id: '3',
    name: 'Zone C - Lettuce',
    image: require('@/assets/images/roof_placeholder.png'),
    lastWatered: '15mins',
    soilMoisture: '90%',
    roofCondition: 'Closed',
  },
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
      style={[cards.allCard, { marginBottom: 12 }]}
      onLayout={(e) => setSlideWidth(e.nativeEvent.layout.width - 40)}
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

            {/* Zone name */}
            <Text style={[typography.heading5, { color: '#595512', marginBottom: 12 }]}>
              {item.name}
            </Text>

            {/* Zone image */}
            <Image
              source={item.image}
              style={{
                width: '100%',
                height: 160,
                resizeMode: 'contain',
                marginBottom: 16,
              }}
            />

            {/* Stats — column layout */}
            <View style={[cards.flexRow, { justifyContent: 'space-between' }]}>
              <View style={cards.flexColumn}>
                <Text style={[typography.caption, { color: '#9A9982' }]}>Last Watered</Text>
                <Text style={[typography.heading5, { color: '#595512' }]}>{item.lastWatered}</Text>
              </View>
              <View style={cards.flexColumn}>
                <Text style={[typography.caption, { color: '#9A9982' }]}>Soil Moisture</Text>
                <Text style={[typography.heading5, { color: '#595512' }]}>{item.soilMoisture}</Text>
              </View>
              <View style={cards.flexColumn}>
                <Text style={[typography.caption, { color: '#9A9982' }]}>Roof Condition</Text>
                <Text style={[typography.heading5, { color: '#595512' }]}>{item.roofCondition}</Text>
              </View>
            </View>

          </View>
        )}
      />

      {/* Pagination dots */}
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