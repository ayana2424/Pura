// context/WeatherContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getWeather, WeatherData, WeatherType } from '@/components/weather';

type WeatherContextType = {
  weather: WeatherData | null;
  weatherType: WeatherType;
};

const WeatherContext = createContext<WeatherContextType>({
  weather: null,
  weatherType: 'default',
});

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    getWeather().then(setWeather);
  }, []);

  return (
    <WeatherContext.Provider value={{
      weather,
      weatherType: weather?.weatherType ?? 'default',
    }}>
      {children}
    </WeatherContext.Provider>
  );
}

export const useWeather = () => useContext(WeatherContext);