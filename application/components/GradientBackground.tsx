import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from "react-native";
import { useWeather } from "@/components/weatherContext";
import WeatherAnimation from '@/components/weatherAnimation';

const weatherGradients = {
  sunny:   ['#61BDFB', '#E5F4FF', '#BACC72'],
  cloudy:  ['#A8BFCF', '#C8D8E4', '#8FA8B8'],
  mist:    ['#B8C8D0', '#D0DDE4', '#9AADB8'],
  rain:    ['#4A6580', '#6B8AA8', '#2C4560'],
  thunder: ['#2E3A4E', '#404E62', '#1C2530'],
  snow:    ['#D4E8F5', '#E8F4FB', '#BDD4E8'],
  default: ['#61BDFB', '#E5F4FF', '#BACC72'],
} as const;

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function GradientBackground({ children, style }: Props) {
  const { weatherType } = useWeather();

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={weatherGradients[weatherType]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', }}
      />
      <View style={[{ flex: 1 }, style]}>
        <WeatherAnimation weatherType={weatherType} />
        {children}
      </View>
    </View>
  );
}