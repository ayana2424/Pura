import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { typography } from '@/components/styles';
import { cards } from '@/components/styles';

const MOCK_DATA = [
  { day: 'S', value: 55 },
  { day: 'M', value: 70 },
  { day: 'T', value: 50 },
  { day: 'W', value: 65 },
  { day: 'T', value: 60 },
  { day: 'F', value: 80 },
  { day: 'S', value: 45 },
];

const BAR_MAX_HEIGHT = 80;
const MAX_VALUE = 100;

type Props = {
  data?: { day: string; value: number }[];
  onSeeMore?: () => void;
};

export default function MoistureTrend({ data = MOCK_DATA, onSeeMore }: Props) {
  return (
    <View style={[cards.allCard, styles.wrapper]}>
      <View style={styles.headerRow}>
        <Text style={[typography.heading5, styles.title]}>Moisture Trend</Text>
        <TouchableOpacity onPress={onSeeMore} activeOpacity={0.7}>
          <Text style={styles.seeMore}>See More</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chartRow}>
        {data.map((item, index) => {
          const barHeight = Math.round((item.value / MAX_VALUE) * BAR_MAX_HEIGHT);
          return (
            <View key={index} style={styles.barCol}>
              <View style={[styles.bar, { height: barHeight }]} />
              <Text style={[typography.caption, styles.dayLabel]}>{item.day}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#3A3A2A',
  },
  seeMore: {
    fontSize: 13,
    color: '#3EA99F',
    fontFamily: 'NataSans-SemiBold',
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: BAR_MAX_HEIGHT + 24,
    gap: 6,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
  bar: {
    width: '100%',
    borderRadius: 6,
    backgroundColor: '#87CEEB',
  },
  dayLabel: {
    color: '#888',
    textAlign: 'center',
  },
});