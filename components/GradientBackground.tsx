import { View, StyleProp, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from 'react';

// components/GradientBackground.tsx



type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function GradientBackground({ children, style }: Props) {
  return (
    <View style={{ flex: 1 }}>
      {/* Gradient stretches behind everything including NavBar */}
      <LinearGradient
        colors={['#61BDFB', '#E5F4FF', '#BACC72']} 
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
        }}
      />
      {/* Content sits on top */}
      <View style={[{ flex: 1 }, style]}>
        {children}
      </View>
    </View>
  );
}
