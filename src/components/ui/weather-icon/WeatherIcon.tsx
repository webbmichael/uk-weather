import { createElement } from 'react'
import { Sun, Cloud, CloudFog, CloudRain, CloudSnow, CloudLightning, type LucideIcon } from 'lucide-react'
import { weatherLabel } from '../../../features/forecast/format'


const WEATHER_ICONS: Record<number, LucideIcon> = {
  0: Sun,
  1: Cloud, 2: Cloud, 3: Cloud,
  45: CloudFog, 48: CloudFog,
  51: CloudRain, 53: CloudRain, 55: CloudRain, 56: CloudRain, 57: CloudRain,
  61: CloudRain, 63: CloudRain, 65: CloudRain, 66: CloudRain, 67: CloudRain,
  80: CloudRain, 81: CloudRain, 82: CloudRain,
  71: CloudSnow, 73: CloudSnow, 75: CloudSnow, 77: CloudSnow,
  85: CloudSnow, 86: CloudSnow,
  95: CloudLightning, 96: CloudLightning, 99: CloudLightning,
}

interface WeatherIconProps {
  code: number
  className?: string
}

export const WeatherIcon = ({ code, className }: WeatherIconProps) =>
  createElement(WEATHER_ICONS[code] ?? Cloud, { className, role: 'img', 'aria-label': weatherLabel(code) })
