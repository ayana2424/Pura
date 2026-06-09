import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { typography } from '@/components/styles';

type Props = {
  message: string;
};

export default function AlertBanner({ message }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={[typography.subhead, styles.text]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5E6C8',
    borderRadius: 14,
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 10,
  },
  icon: {
    fontSize: 18,
  },
  text: {
    flex: 1,
    color: '#7A5C1E',
    lineHeight: 18,
  },
});