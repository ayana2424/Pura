import * as Location from 'expo-location';

export type WeatherType = 'rain' | 'snow' | 'sunny' | 'thunder' | 'cloudy' | 'mist' | 'default';

export interface WeatherData {
  city: string;
  temp: string;
  description: string;
  weatherType: WeatherType;
  humidity: string;
  wind: string;
}

// Open-Meteo WMO weather code → WeatherType
function getWeatherType(code: number): WeatherType {
  if ([95, 96, 99].includes(code))              return 'thunder';
  if (code >= 71 && code <= 77)                 return 'snow';
  if (code >= 51 && code <= 67)                 return 'rain';
  if (code >= 80 && code <= 82)                 return 'rain';
  if ([45, 48].includes(code))                  return 'mist';
  if (code >= 2 && code <= 3)                   return 'cloudy';
  if (code === 0 || code === 1)                 return 'sunny';
  return 'default';
}

function getDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Icy fog',
    51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
    61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
    71: 'Light snow', 73: 'Snow', 75: 'Heavy snow',
    80: 'Showers', 81: 'Rain showers', 82: 'Violent showers',
    95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Heavy thunderstorm',
  };
  return descriptions[code] ?? 'Unknown';
}

export async function getWeather(): Promise<WeatherData> {
  const { status } = await Location.requestForegroundPermissionsAsync();

  let lat = 25.0330;
  let lon = 121.5654;

  if (status === 'granted') {
   const location = await Location.getCurrentPositionAsync({});
   lat = location.coords.latitude;
   lon = location.coords.longitude;
  }

  // Reverse geocode for city name
  let city = 'Unknown';
  try {
    const [place] = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
    city = place?.city ?? place?.region ?? 'Unknown';
  } catch (_) {}

  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code` +
    `&timezone=auto`
  );
const data = await res.json();
  const current = data.current;
  console.log('coords used:', lat, lon);
  console.log('open-meteo response:', JSON.stringify(current));
  return {
    city,
    temp:        Math.round(current.temperature_2m).toString(),
    description: getDescription(current.weather_code),
    weatherType: getWeatherType(current.weather_code),
    humidity:    current.relative_humidity_2m.toString(),
    wind:        Math.round(current.wind_speed_10m).toString(),
  };
}