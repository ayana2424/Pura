import * as Location from 'expo-location';

const API_KEY = '3c781afde8a9e2f003cf8349f9338493'; // openweathermap.org

export type WeatherType = 'rain' | 'snow' | 'sunny' | 'thunder' | 'cloudy' | 'mist' | 'default';

export interface WeatherData {
  city: string;
  temp: string;
  description: string;
  weatherType: WeatherType;
  humidity: string;
  wind: string;
}

function getWeatherType(main: string): WeatherType {
  const m = main.toLowerCase();
  if (m.includes('rain') || m.includes('drizzle')) return 'rain';
  if (m.includes('thunder'))                        return 'thunder';
  if (m.includes('snow'))                           return 'snow';
  if (m.includes('cloud'))                          return 'cloudy';
  if (m.includes('mist') || m.includes('fog'))      return 'mist';
  if (m.includes('clear'))                          return 'sunny';
  return 'default';
}

export async function getWeather(): Promise<WeatherData> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    return { city: 'Unknown', temp: '--', description: '', weatherType: 'default', humidity: '--', wind: '--' };
  }

  const loc  = await Location.getCurrentPositionAsync({});
  const res  = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${loc.coords.latitude}&lon=${loc.coords.longitude}&appid=${API_KEY}&units=metric`
  );
  const data = await res.json();

  return {
    city:        data.name,
    temp:        Math.round(data.main.temp).toString(),
    description: data.weather[0].description,
    weatherType: getWeatherType(data.weather[0].main),
    humidity:    data.main.humidity.toString(),
    wind:        Math.round(data.wind.speed).toString(),
  };
}