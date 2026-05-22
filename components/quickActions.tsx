import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { typography } from '@/components/styles';
import { cards } from '@/components/styles';
import { ArrowUp2, Bucket, Camera } from "iconsax-react-native";

type Props = {
  onWaterNow?: () => void;
  onOpenRoof?: () => void;
  onCheckPlant?: () => void;
};

export default function QuickActions({
  onWaterNow = () => {},
  onOpenRoof = () => {},
  onCheckPlant = () => {},
}: Props) {
  const actions = [
    { label: 'Water now',   icon: Bucket,   onPress: onWaterNow   },
    { label: 'Open Roof',   icon: ArrowUp2, onPress: onOpenRoof   },
    { label: 'Check Plant', icon: Camera,   onPress: onCheckPlant },
  ];

  return (
    <View style={[cards.allCard, styles.wrapper]}>
      <Text style={[typography.heading5, styles.title]}>Quick Actions</Text>
      <View style={styles.buttonRow}>
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <TouchableOpacity
              key={action.label}
              style={styles.button}
              onPress={action.onPress}
              activeOpacity={0.75}
            >
              <Icon size={28} color="#fff" variant="Bold"/>
              <Text style={[typography.subhead, styles.buttonLabel]}>
                {action.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 24,
    backgroundColor: '#fffbfbd4',
  },
  title: {
    color: '#3A3A2A',
    marginBottom: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#5AD5CB',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonLabel: {
    color: '#fff',
    textAlign: 'center',
  },
});