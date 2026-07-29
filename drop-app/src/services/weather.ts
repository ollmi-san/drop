import type { IconName } from '../components/ui/Icon';

// Wetterdienst: Open-Meteo (kostenlos, ohne API-Key, CORS-frei).
// Das Briefing nennt OpenWeatherMap – sobald ein API-Key existiert, wird nur
// diese Datei getauscht; die App liest ausschließlich WeatherData.
export interface ForecastDay {
  day: string;
  icon: IconName;
  high: number;
  low: number;
}

export interface WeatherData {
  city: string;
  temp: number;
  condition: string;
  icon: IconName;
  high: number;
  low: number;
  wind: number;
  uv: number;
  forecast: ForecastDay[];
}

// WMO-Wettercode → deutsche Beschreibung + Icon
function describe(code: number): { condition: string; icon: IconName } {
  if (code === 0) return { condition: 'Klar', icon: 'sun' };
  if (code === 1) return { condition: 'Überwiegend klar', icon: 'sun' };
  if (code === 2) return { condition: 'Teils bewölkt', icon: 'cloud-sun' };
  if (code === 3) return { condition: 'Bedeckt', icon: 'cloud' };
  if (code === 45 || code === 48) return { condition: 'Nebel', icon: 'cloud' };
  if (code >= 51 && code <= 57) return { condition: 'Nieselregen', icon: 'rain' };
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return { condition: 'Regen', icon: 'rain' };
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return { condition: 'Schnee', icon: 'snow' };
  if (code >= 95) return { condition: 'Gewitter', icon: 'storm' };
  return { condition: 'Wechselhaft', icon: 'cloud-sun' };
}

// Berlin als fester Standort (wie im Mockup); Geolocation folgt später.
const API_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.405' +
  '&current=temperature_2m,weather_code,wind_speed_10m' +
  '&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max' +
  '&timezone=Europe%2FBerlin&forecast_days=4';

export async function fetchWeather(): Promise<WeatherData> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`Wetterdienst antwortet mit ${res.status}`);
  const data = await res.json();
  const current = describe(data.current.weather_code);
  const dayName = (iso: string) =>
    new Date(`${iso}T12:00:00`).toLocaleDateString('de-DE', { weekday: 'short' }).replace('.', '');
  return {
    city: 'Berlin, DE',
    temp: Math.round(data.current.temperature_2m),
    condition: current.condition,
    icon: current.icon,
    high: Math.round(data.daily.temperature_2m_max[0]),
    low: Math.round(data.daily.temperature_2m_min[0]),
    wind: Math.round(data.current.wind_speed_10m),
    uv: Math.round(data.daily.uv_index_max[0]),
    forecast: [1, 2, 3].map((i) => ({
      day: dayName(data.daily.time[i]),
      icon: describe(data.daily.weather_code[i]).icon,
      high: Math.round(data.daily.temperature_2m_max[i]),
      low: Math.round(data.daily.temperature_2m_min[i]),
    })),
  };
}
