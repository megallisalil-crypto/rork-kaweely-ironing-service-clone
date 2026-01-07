import React from 'react';
import { Svg, Path, Circle, Rect, Line, Polyline, Ellipse } from 'react-native-svg';

type IconProps = {
  size?: number;
  color?: string;
};

export const GarmentIconsSVG = {
  // ROW 1
  'pants': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M16 8 L20 8 L22 32 L22 60 L18 60 L18 32 L16 8 Z M44 8 L48 8 L46 32 L46 60 L42 60 L42 32 L44 8 Z M20 8 L44 8" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'scarf': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M12 20 L18 20 L18 52 M18 20 L52 20 L52 28 M52 20 L52 12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  ),
  'shirt': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M24 10 L28 14 L32 14 L36 14 L40 10 L44 18 L44 56 C44 57 43 58 42 58 L22 58 C21 58 20 57 20 56 L20 18 L24 10 Z" fill={color} opacity="0.15" />
      <Path d="M18 18 L24 10 L28 14 L32 14 L36 14 L40 10 L46 18 L46 56 L18 56 L18 18 Z" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
      <Line x1="32" y1="18" x2="32" y2="56" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'towel': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Rect x="16" y="12" width="32" height="40" stroke={color} strokeWidth="2" rx="2" />
      <Line x1="16" y1="20" x2="48" y2="20" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'hawaiian_shirt': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M18 20 L18 56 L46 56 L46 20 M24 12 L28 16 L32 16 L36 16 L40 12 M18 20 L24 12 M46 20 L40 12" stroke={color} strokeWidth="2" />
      <Circle cx="26" cy="36" r="3" stroke={color} strokeWidth="1.5" />
      <Circle cx="38" cy="36" r="3" stroke={color} strokeWidth="1.5" />
    </Svg>
  ),
  'military_shirt': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M18 20 L18 56 L46 56 L46 20 M24 12 L28 16 L32 16 L36 16 L40 12 M18 20 L24 12 M46 20 L40 12" stroke={color} strokeWidth="2" />
      <Rect x="22" y="26" width="6" height="8" stroke={color} strokeWidth="1.5" />
      <Rect x="36" y="26" width="6" height="8" stroke={color} strokeWidth="1.5" />
    </Svg>
  ),
  'polo_shirt': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M24 10 L28 14 L32 14 L36 14 L40 10 L44 18 L44 56 C44 57 43 58 42 58 L22 58 C21 58 20 57 20 56 L20 18 L24 10 Z" fill={color} opacity="0.15" />
      <Path d="M18 18 L24 10 L28 14 L32 14 L36 14 L40 10 L46 18 L46 56 L18 56 L18 18 Z" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
      <Path d="M32 18 L32 28" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <Path d="M29 19 L35 19 L35 22 L29 22 L29 19" fill={color} opacity="0.2" stroke={color} strokeWidth="1.5" />
      <Circle cx="30" cy="20" r="0.8" fill={color} />
      <Circle cx="30" cy="24" r="0.8" fill={color} />
    </Svg>
  ),
  'striped_shirt': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M18 20 L18 56 L46 56 L46 20 M24 12 L28 16 L32 16 L36 16 L40 12 M18 20 L24 12 M46 20 L40 12" stroke={color} strokeWidth="2" />
      <Line x1="20" y1="28" x2="44" y2="28" stroke={color} strokeWidth="1.5" />
      <Line x1="20" y1="36" x2="44" y2="36" stroke={color} strokeWidth="1.5" />
      <Line x1="20" y1="44" x2="44" y2="44" stroke={color} strokeWidth="1.5" />
    </Svg>
  ),
  'polo': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M18 20 L18 56 L46 56 L46 20 M24 12 L28 18 L36 18 L40 12 M18 20 L24 12 M46 20 L40 12" stroke={color} strokeWidth="2" />
      <Path d="M32 20 L32 28 M28 22 L36 22" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'shorts': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M16 16 L20 16 L20 44 L18 44 L16 16 Z M44 16 L48 16 L46 44 L44 44 L44 16 Z M20 16 L44 16" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'jersey': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M18 20 L18 56 L46 56 L46 20 M24 12 L28 16 L32 16 L36 16 L40 12 M18 20 L24 12 M46 20 L40 12" stroke={color} strokeWidth="2" />
      <Path d="M28 32 L30 36 L32 32 L34 36 L36 32" stroke={color} strokeWidth="1.5" fill="none" />
    </Svg>
  ),
  'sports_dress': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M24 12 L28 16 L32 16 L36 16 L40 12 M18 20 L24 12 M46 20 L40 12 M18 20 L18 40 L24 56 L40 56 L46 40 L46 20" stroke={color} strokeWidth="2" />
      <Path d="M26 36 L28 40 L30 36 L32 40 L34 36 L36 40 L38 36" stroke={color} strokeWidth="1.5" fill="none" />
    </Svg>
  ),
  // ROW 2
  'vest': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M20 12 L24 12 L28 20 L32 20 L36 20 L40 12 L44 12 L44 56 L20 56 L20 12" stroke={color} strokeWidth="2" />
      <Line x1="28" y1="20" x2="28" y2="56" stroke={color} strokeWidth="2" />
      <Line x1="36" y1="20" x2="36" y2="56" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'tie': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M28 8 L36 8 L36 16 L34 16 L32 52 L30 16 L28 16 L28 8" stroke={color} strokeWidth="2" fill="none" />
      <Path d="M30 16 L32 8 L34 16" stroke={color} strokeWidth="1.5" fill="none" />
    </Svg>
  ),
  'socks': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M20 8 L28 8 L28 32 C28 38 26 42 20 46 L20 8 Z" stroke={color} strokeWidth="2" />
      <Line x1="20" y1="16" x2="28" y2="16" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'stacked_socks': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M18 8 L26 8 L26 32 C26 38 24 42 18 46 L18 8 Z" stroke={color} strokeWidth="2" />
      <Path d="M30 8 L38 8 L38 32 C38 38 36 42 30 46 L30 8 Z" stroke={color} strokeWidth="2" />
      <Line x1="18" y1="14" x2="26" y2="14" stroke={color} strokeWidth="1.5" />
      <Line x1="30" y1="14" x2="38" y2="14" stroke={color} strokeWidth="1.5" />
    </Svg>
  ),
  'pajama_top': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M18 20 L18 56 L46 56 L46 20 M24 12 L28 16 L32 16 L36 16 L40 12 M18 20 L24 12 M46 20 L40 12" stroke={color} strokeWidth="2" />
      <Path d="M28 20 L28 22 L32 22 L32 20" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'leggings': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M18 8 L22 8 L22 60 M42 8 L46 8 L46 60 M22 8 L42 8" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'robe': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M16 20 L16 60 L48 60 L48 20 M22 10 L26 14 L32 14 L38 14 L42 10 M16 20 L22 10 M48 20 L42 10" stroke={color} strokeWidth="2" />
      <Path d="M28 28 L32 24 L36 28" stroke={color} strokeWidth="2" fill="none" />
    </Svg>
  ),
  'tank_top': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M22 12 L26 16 L32 16 L38 16 L42 12 M20 20 L24 12 M44 20 L40 12 M20 20 L20 56 L44 56 L44 20" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'dress_shirt': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M24 10 L28 14 L32 14 L36 14 L40 10 L44 18 L44 56 C44 57 43 58 42 58 L22 58 C21 58 20 57 20 56 L20 18 L24 10 Z" fill={color} opacity="0.15" />
      <Path d="M18 18 L24 10 L28 14 L32 14 L36 14 L40 10 L46 18 L46 56 L18 56 L18 18 Z" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
      <Line x1="32" y1="18" x2="32" y2="56" stroke={color} strokeWidth="2" />
      <Circle cx="29" cy="24" r="1.8" fill={color} />
      <Circle cx="29" cy="32" r="1.8" fill={color} />
      <Circle cx="29" cy="40" r="1.8" fill={color} />
      <Circle cx="29" cy="48" r="1.8" fill={color} />
      <Path d="M30 18 L34 18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  ),
  'nightgown': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M22 12 L28 16 L32 16 L36 16 L42 12 M18 20 L24 12 M46 20 L40 12 M18 20 L18 56 L46 56 L46 20" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'slip_dress': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M26 12 L28 14 L32 14 L36 14 L38 12 M22 16 L26 12 M42 16 L38 12 M22 16 L22 56 L42 56 L42 16" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'sleep_mask': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Ellipse cx="24" cy="32" rx="8" ry="6" stroke={color} strokeWidth="2" />
      <Ellipse cx="40" cy="32" rx="8" ry="6" stroke={color} strokeWidth="2" />
      <Path d="M8 32 L16 32 M48 32 L56 32" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'blanket': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Rect x="12" y="16" width="40" height="32" rx="2" stroke={color} strokeWidth="2" />
      <Line x1="12" y1="24" x2="52" y2="24" stroke={color} strokeWidth="1.5" />
      <Line x1="12" y1="32" x2="52" y2="32" stroke={color} strokeWidth="1.5" />
      <Line x1="12" y1="40" x2="52" y2="40" stroke={color} strokeWidth="1.5" />
    </Svg>
  ),
  'baby_swaddle': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Circle cx="32" cy="20" r="6" stroke={color} strokeWidth="2" />
      <Path d="M20 28 L32 26 L44 28 L44 52 L32 56 L20 52 L20 28" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'pillow': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Rect x="8" y="20" width="48" height="24" rx="4" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'robe_bath': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M16 20 L16 60 L48 60 L48 20 M22 10 L26 14 L32 14 L38 14 L42 10 M16 20 L22 10 M48 20 L42 10" stroke={color} strokeWidth="2" />
      <Path d="M24 32 L28 28 L32 32 M36 32 L40 28 L44 32" stroke={color} strokeWidth="2" fill="none" />
    </Svg>
  ),
  'coat': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M16 20 L16 60 L48 60 L48 20 M22 10 L26 14 L32 14 L38 14 L42 10 M16 20 L22 10 M48 20 L42 10" stroke={color} strokeWidth="2" />
      <Line x1="32" y1="20" x2="32" y2="60" stroke={color} strokeWidth="2" />
      <Rect x="20" y="28" width="4" height="6" stroke={color} strokeWidth="1.5" />
      <Rect x="40" y="28" width="4" height="6" stroke={color} strokeWidth="1.5" />
    </Svg>
  ),
  // ROW 3
  'sundress': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M26 10 L28 14 L32 14 L36 14 L38 10 M20 18 L26 10 M44 18 L38 10 M20 18 L20 40 L24 56 L40 56 L44 40 L44 18" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'apron_dress': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M24 10 L28 14 L32 14 L36 14 L40 10 M20 18 L24 10 M44 18 L40 10 M20 18 L20 56 L44 56 L44 18" stroke={color} strokeWidth="2" />
      <Rect x="26" y="28" width="12" height="8" stroke={color} strokeWidth="1.5" />
    </Svg>
  ),
  'kimono': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M12 20 L12 60 L52 60 L52 20 M20 8 L24 12 L32 12 L40 12 L44 8 M12 20 L20 8 M52 20 L44 8" stroke={color} strokeWidth="2" />
      <Path d="M28 30 L32 34 L36 30" stroke={color} strokeWidth="2" fill="none" />
    </Svg>
  ),
  'wrap_skirt': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M20 16 L20 48 L44 48 L44 16 M28 16 L36 24" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'tunic': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M18 20 L18 48 L46 48 L46 20 M24 12 L28 16 L32 16 L36 16 L40 12 M18 20 L24 12 M46 20 L40 12" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'long_dress': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M24 10 L28 14 L32 14 L36 14 L40 10 M18 20 L24 10 M46 20 L40 10 M18 20 L18 56 L46 56 L46 20" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'bodycon_dress': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M26 10 L28 14 L32 14 L36 14 L38 10 M22 18 L26 10 M42 18 L38 10 M22 18 L20 56 L44 56 L42 18" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'shift_dress': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M24 12 L28 16 L32 16 L36 16 L40 12 M20 20 L24 12 M44 20 L40 12 M20 20 L22 56 L42 56 L44 20" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'trousers': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M16 8 L20 8 L20 60 M44 8 L48 8 L48 60 M20 8 L44 8" stroke={color} strokeWidth="2" />
      <Line x1="20" y1="20" x2="44" y2="20" stroke={color} strokeWidth="1.5" />
    </Svg>
  ),
  'cargo_pants': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M16 8 L20 8 L20 60 M44 8 L48 8 L48 60 M20 8 L44 8" stroke={color} strokeWidth="2" />
      <Rect x="14" y="28" width="6" height="10" stroke={color} strokeWidth="1.5" />
      <Rect x="44" y="28" width="6" height="10" stroke={color} strokeWidth="1.5" />
    </Svg>
  ),
  'hoodie': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M18 20 L18 56 L46 56 L46 20 M24 10 L28 16 L32 16 L36 16 L40 10 M18 20 L24 10 M46 20 L40 10" stroke={color} strokeWidth="2" />
      <Path d="M24 10 C24 6 28 4 32 4 C36 4 40 6 40 10" stroke={color} strokeWidth="2" fill="none" />
    </Svg>
  ),
  'padded_jacket': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M16 20 L16 56 L48 56 L48 20 M22 10 L26 14 L32 14 L38 14 L42 10 M16 20 L22 10 M48 20 L42 10" stroke={color} strokeWidth="2" />
      <Line x1="16" y1="30" x2="48" y2="30" stroke={color} strokeWidth="1.5" />
      <Line x1="16" y1="40" x2="48" y2="40" stroke={color} strokeWidth="1.5" />
    </Svg>
  ),
  'blazer': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M18 20 L18 58 L46 58 L46 20 M24 12 L28 16 L32 16 L36 16 L40 12 M18 20 L24 12 M46 20 L40 12" stroke={color} strokeWidth="2" />
      <Line x1="32" y1="20" x2="32" y2="58" stroke={color} strokeWidth="2" />
      <Path d="M24 24 L28 28 M40 24 L36 28" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'jacket': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M16 20 L16 56 L48 56 L48 20 M22 10 L26 14 L32 14 L38 14 L42 10 M16 20 L22 10 M48 20 L42 10" stroke={color} strokeWidth="2" />
      <Line x1="32" y1="20" x2="32" y2="56" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'sweater': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M18 20 L18 56 L46 56 L46 20 M24 12 L28 16 L32 16 L36 16 L40 12 M18 20 L24 12 M46 20 L40 12" stroke={color} strokeWidth="2" />
      <Circle cx="32" cy="18" r="4" stroke={color} strokeWidth="1.5" />
    </Svg>
  ),
  'pullover': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M18 20 L18 56 L46 56 L46 20 M24 12 L28 16 L32 16 L36 16 L40 12 M18 20 L24 12 M46 20 L40 12" stroke={color} strokeWidth="2" />
      <Ellipse cx="32" cy="18" rx="6" ry="3" stroke={color} strokeWidth="1.5" />
    </Svg>
  ),
  'baby_bib': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Circle cx="32" cy="16" r="4" stroke={color} strokeWidth="2" />
      <Path d="M24 24 L24 44 L40 44 L40 24" stroke={color} strokeWidth="2" />
      <Path d="M24 24 C24 20 26 16 28 16 M40 24 C40 20 38 16 36 16" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  // Additional items from your images
  'tshirt': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M24 10 L28 14 L32 14 L36 14 L40 10 L44 18 L44 56 C44 57 43 58 42 58 L22 58 C21 58 20 57 20 56 L20 18 L24 10 Z" fill={color} opacity="0.15" />
      <Path d="M18 18 L24 10 L28 14 L32 14 L36 14 L40 10 L46 18 L46 56 L18 56 L18 18 Z" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
      <Circle cx="32" cy="18" r="4" stroke={color} strokeWidth="2" fill="none" />
    </Svg>
  ),
  'vneck': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M18 20 L18 56 L46 56 L46 20 M24 12 L28 16 L32 24 L36 16 L40 12 M18 20 L24 12 M46 20 L40 12" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'skirt': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M20 16 L20 48 L44 48 L44 16 M20 16 L44 16" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'pleated_skirt': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M20 16 L20 48 L44 48 L44 16 M20 16 L44 16" stroke={color} strokeWidth="2" />
      <Line x1="26" y1="16" x2="26" y2="48" stroke={color} strokeWidth="1.5" />
      <Line x1="32" y1="16" x2="32" y2="48" stroke={color} strokeWidth="1.5" />
      <Line x1="38" y1="16" x2="38" y2="48" stroke={color} strokeWidth="1.5" />
    </Svg>
  ),
  'hijab': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M20 12 C20 8 24 4 32 4 C40 4 44 8 44 12 L44 48 L32 52 L20 48 L20 12" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'cardigan': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M18 20 L18 56 L28 56 M36 56 L46 56 L46 20 M24 12 L28 16 L32 16 L36 16 L40 12 M18 20 L24 12 M46 20 L40 12" stroke={color} strokeWidth="2" />
      <Line x1="28" y1="20" x2="28" y2="56" stroke={color} strokeWidth="2" />
      <Line x1="36" y1="20" x2="36" y2="56" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'onesie': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M24 10 L28 14 L32 14 L36 14 L40 10 M18 18 L24 10 M46 18 L40 10 M18 18 L18 36 L20 52 L28 60 L36 60 L44 52 L46 36 L46 18" stroke={color} strokeWidth="2" />
      <Line x1="20" y1="52" x2="28" y2="60" stroke={color} strokeWidth="2" />
      <Line x1="44" y1="52" x2="36" y2="60" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'pajamas': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M18 14 L18 40 L30 40 M34 40 L46 40 L46 14 M24 8 L28 12 L32 12 L36 12 L40 8 M18 14 L24 8 M46 14 L40 8" stroke={color} strokeWidth="2" />
      <Line x1="32" y1="14" x2="32" y2="40" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'bedding_single': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Rect x="12" y="20" width="40" height="28" rx="2" stroke={color} strokeWidth="2" />
      <Line x1="12" y1="32" x2="52" y2="32" stroke={color} strokeWidth="1.5" />
    </Svg>
  ),
  'bedding_double': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Rect x="8" y="18" width="48" height="32" rx="2" stroke={color} strokeWidth="2" />
      <Line x1="8" y1="34" x2="56" y2="34" stroke={color} strokeWidth="1.5" />
      <Line x1="32" y1="18" x2="32" y2="50" stroke={color} strokeWidth="1.5" />
    </Svg>
  ),
  'pillowcase': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Rect x="10" y="22" width="44" height="20" rx="2" stroke={color} strokeWidth="2" />
      <Line x1="46" y1="22" x2="46" y2="42" stroke={color} strokeWidth="1.5" />
    </Svg>
  ),
  'curtains_small': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Line x1="12" y1="8" x2="52" y2="8" stroke={color} strokeWidth="2" />
      <Path d="M16 8 L18 56 M24 8 L26 56" stroke={color} strokeWidth="2" />
      <Path d="M40 8 L38 56 M48 8 L46 56" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'curtains_large': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Line x1="8" y1="8" x2="56" y2="8" stroke={color} strokeWidth="2" />
      <Path d="M12 8 L14 60 M20 8 L22 60 M28 8 L30 60" stroke={color} strokeWidth="2" />
      <Path d="M36 8 L34 60 M44 8 L42 60 M52 8 L50 60" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'twopiece_suit': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M18 20 L18 48 L28 48 M36 48 L46 48 L46 20 M24 12 L28 16 L32 16 L36 16 L40 12 M18 20 L24 12 M46 20 L40 12" stroke={color} strokeWidth="2" />
      <Line x1="32" y1="20" x2="32" y2="48" stroke={color} strokeWidth="2" />
      <Path d="M24 24 L28 28 M40 24 L36 28" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'threepiece_suit': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M18 20 L18 56 L28 56 M36 56 L46 56 L46 20 M24 12 L28 16 L32 16 L36 16 L40 12 M18 20 L24 12 M46 20 L40 12" stroke={color} strokeWidth="2" />
      <Rect x="26" y="24" width="12" height="16" stroke={color} strokeWidth="2" />
      <Line x1="32" y1="20" x2="32" y2="56" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'bath_mat': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Rect x="16" y="24" width="32" height="20" rx="3" stroke={color} strokeWidth="2" />
      <Line x1="20" y1="28" x2="44" y2="28" stroke={color} strokeWidth="1.5" />
      <Line x1="20" y1="32" x2="44" y2="32" stroke={color} strokeWidth="1.5" />
      <Line x1="20" y1="36" x2="44" y2="36" stroke={color} strokeWidth="1.5" />
      <Line x1="20" y1="40" x2="44" y2="40" stroke={color} strokeWidth="1.5" />
    </Svg>
  ),
  'tuxedo': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M18 20 L18 58 L28 58 M36 58 L46 58 L46 20 M24 12 L28 16 L32 16 L36 16 L40 12 M18 20 L24 12 M46 20 L40 12" stroke={color} strokeWidth="2" />
      <Path d="M24 24 L28 28 M40 24 L36 28" stroke={color} strokeWidth="2" />
      <Rect x="30" y="24" width="4" height="8" fill={color} />
    </Svg>
  ),
  'bowtie': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M20 28 L28 32 L20 36 M44 28 L36 32 L44 36" stroke={color} strokeWidth="2" fill="none" />
      <Rect x="30" y="30" width="4" height="4" fill={color} />
    </Svg>
  ),
  'thobe': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M18 20 L18 60 L46 60 L46 20 M24 12 L28 16 L32 16 L36 16 L40 12 M18 20 L24 12 M46 20 L40 12" stroke={color} strokeWidth="2" />
      <Path d="M32 20 L32 32 M28 22 L32 20 L36 22" stroke={color} strokeWidth="2" fill="none" />
    </Svg>
  ),
  'traditional_hat': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M16 28 L20 20 L32 16 L44 20 L48 28 M16 28 L48 28" stroke={color} strokeWidth="2" />
      <Ellipse cx="32" cy="28" rx="16" ry="4" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'traditional_scarf': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M16 16 L20 16 L24 48 M40 48 L44 16 L48 16 M20 16 L44 16" stroke={color} strokeWidth="2" />
      <Line x1="24" y1="48" x2="28" y2="56" stroke={color} strokeWidth="2" />
      <Line x1="40" y1="48" x2="36" y2="56" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'shirt_button': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M18 20 L18 56 L46 56 L46 20 M24 12 L28 16 L32 16 L36 16 L40 12 M18 20 L24 12 M46 20 L40 12" stroke={color} strokeWidth="2" />
      <Line x1="32" y1="20" x2="32" y2="56" stroke={color} strokeWidth="2" />
      <Rect x="20" y="26" width="4" height="6" stroke={color} strokeWidth="1.5" />
      <Circle cx="32" cy="30" r="1.5" fill={color} />
      <Circle cx="32" cy="38" r="1.5" fill={color} />
      <Circle cx="32" cy="46" r="1.5" fill={color} />
    </Svg>
  ),
  'kids_tshirt': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M20 20 L20 48 L44 48 L44 20 M26 14 L28 18 L32 18 L36 18 L38 14 M20 20 L26 14 M44 20 L38 14" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'kids_jeans': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M20 12 L24 12 L24 52 M40 12 L44 12 L44 52 M24 12 L40 12" stroke={color} strokeWidth="2" />
      <Circle cx="28" cy="18" r="1.5" fill={color} />
      <Circle cx="36" cy="18" r="1.5" fill={color} />
    </Svg>
  ),
  'kids_dress': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M26 12 L28 16 L32 16 L36 16 L38 12 M22 20 L26 12 M42 20 L38 12 M22 20 L22 48 L42 48 L42 20" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'kids_jacket': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M20 20 L20 50 L44 50 L44 20 M26 12 L28 16 L32 16 L36 16 L38 12 M20 20 L26 12 M44 20 L38 12" stroke={color} strokeWidth="2" />
      <Line x1="32" y1="20" x2="32" y2="50" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'baby_onesie': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M26 12 L28 16 L32 16 L36 16 L38 12 M22 20 L26 12 M42 20 L38 12 M22 20 L22 40 L26 52 L38 52 L42 40 L42 20" stroke={color} strokeWidth="2" />
      <Circle cx="28" cy="28" r="2" stroke={color} strokeWidth="1.5" />
      <Circle cx="36" cy="28" r="2" stroke={color} strokeWidth="1.5" />
    </Svg>
  ),
  'duvet_cover': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Rect x="12" y="16" width="40" height="32" rx="2" stroke={color} strokeWidth="2" />
      <Rect x="20" y="24" width="24" height="16" stroke={color} strokeWidth="1.5" />
    </Svg>
  ),
  'formal_shirt': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M18 20 L18 56 L46 56 L46 20 M24 12 L28 16 L32 16 L36 16 L40 12 M18 20 L24 12 M46 20 L40 12" stroke={color} strokeWidth="2" />
      <Line x1="32" y1="20" x2="32" y2="56" stroke={color} strokeWidth="2" />
      <Path d="M28 20 L28 24 L32 24 L32 20" stroke={color} strokeWidth="1.5" />
    </Svg>
  ),
  'wrap_robe': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M16 20 L16 60 L48 60 L48 20 M22 10 L26 14 L32 14 L38 14 L42 10 M16 20 L22 10 M48 20 L42 10" stroke={color} strokeWidth="2" />
      <Path d="M24 28 L32 36 L40 28" stroke={color} strokeWidth="2" fill="none" />
    </Svg>
  ),
  'cap': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M18 28 L18 24 L46 24 L46 28" stroke={color} strokeWidth="2" />
      <Ellipse cx="32" cy="28" rx="14" ry="4" stroke={color} strokeWidth="2" />
      <Path d="M20 28 L24 18 L40 18 L44 28" stroke={color} strokeWidth="2" fill="none" />
      <Path d="M48 28 L56 30" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'fedora': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Ellipse cx="32" cy="32" rx="18" ry="4" stroke={color} strokeWidth="2" />
      <Path d="M20 32 L22 20 L42 20 L44 32" stroke={color} strokeWidth="2" fill="none" />
      <Line x1="20" y1="26" x2="44" y2="26" stroke={color} strokeWidth="1.5" />
    </Svg>
  ),
  'bucket_hat': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M18 32 L22 20 L42 20 L46 32" stroke={color} strokeWidth="2" fill="none" />
      <Ellipse cx="32" cy="32" rx="14" ry="3" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'poncho': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Circle cx="32" cy="16" r="4" stroke={color} strokeWidth="2" />
      <Path d="M12 28 L32 22 L52 28 L48 52 L16 52 L12 28" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'handbag': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Rect x="16" y="24" width="32" height="28" rx="2" stroke={color} strokeWidth="2" />
      <Path d="M20 24 C20 18 24 12 32 12 C40 12 44 18 44 24" stroke={color} strokeWidth="2" fill="none" />
    </Svg>
  ),
  'backpack': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Rect x="18" y="20" width="28" height="32" rx="4" stroke={color} strokeWidth="2" />
      <Path d="M22 20 C22 14 26 10 32 10 C38 10 42 14 42 20" stroke={color} strokeWidth="2" fill="none" />
      <Rect x="24" y="28" width="16" height="8" rx="1" stroke={color} strokeWidth="1.5" />
    </Svg>
  ),
  'sneakers': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M12 36 L16 28 L28 28 L32 32 L48 32 L52 36 L52 44 L12 44 L12 36" stroke={color} strokeWidth="2" />
      <Line x1="20" y1="32" x2="20" y2="44" stroke={color} strokeWidth="1.5" />
      <Line x1="28" y1="32" x2="28" y2="44" stroke={color} strokeWidth="1.5" />
    </Svg>
  ),
  'boots': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M20 8 L24 8 L24 40 L16 44 L16 48 L40 48 L40 44 L24 40 M24 8 L28 8" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'slippers': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Ellipse cx="32" cy="36" rx="18" ry="8" stroke={color} strokeWidth="2" />
      <Path d="M20 32 L24 28 L40 28 L44 32" stroke={color} strokeWidth="2" fill="none" />
    </Svg>
  ),
  'folded_towels': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Rect x="16" y="20" width="32" height="8" stroke={color} strokeWidth="2" />
      <Rect x="16" y="30" width="32" height="8" stroke={color} strokeWidth="2" />
      <Rect x="16" y="40" width="32" height="8" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'bed': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Rect x="12" y="28" width="40" height="20" rx="2" stroke={color} strokeWidth="2" />
      <Line x1="8" y1="48" x2="8" y2="52" stroke={color} strokeWidth="2" />
      <Line x1="56" y1="48" x2="56" y2="52" stroke={color} strokeWidth="2" />
      <Circle cx="20" cy="22" r="4" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'large_rug': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Rect x="12" y="20" width="40" height="28" rx="2" stroke={color} strokeWidth="2" />
      <Rect x="16" y="24" width="32" height="20" stroke={color} strokeWidth="1.5" />
      <Line x1="12" y1="28" x2="52" y2="28" stroke={color} strokeWidth="1" />
      <Line x1="12" y1="40" x2="52" y2="40" stroke={color} strokeWidth="1" />
    </Svg>
  ),
  'sofa_cover': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Rect x="12" y="28" width="40" height="16" rx="2" stroke={color} strokeWidth="2" />
      <Rect x="10" y="24" width="6" height="20" rx="1" stroke={color} strokeWidth="2" />
      <Rect x="48" y="24" width="6" height="20" rx="1" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'chair_cover': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Rect x="20" y="12" width="24" height="24" rx="2" stroke={color} strokeWidth="2" />
      <Line x1="20" y1="36" x2="20" y2="52" stroke={color} strokeWidth="2" />
      <Line x1="44" y1="36" x2="44" y2="52" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'napkin': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M16 16 L48 16 L44 48 L20 48 L16 16" stroke={color} strokeWidth="2" />
      <Line x1="16" y1="24" x2="48" y2="24" stroke={color} strokeWidth="1.5" />
    </Svg>
  ),
  'bodysuit': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M24 10 L28 14 L32 14 L36 14 L40 10 M18 18 L24 10 M46 18 L40 10 M18 18 L18 44 L22 56 L42 56 L46 44 L46 18" stroke={color} strokeWidth="2" />
      <Path d="M26 32 L26 44 M38 32 L38 44" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'bikini': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M20 20 L24 24 L28 20 M36 20 L40 24 L44 20" stroke={color} strokeWidth="2" fill="none" />
      <Path d="M22 32 L24 28 L28 28 L30 32 M34 32 L36 28 L40 28 L42 32" stroke={color} strokeWidth="2" fill="none" />
    </Svg>
  ),
  'sports_bra': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M18 24 L22 20 L28 20 L28 32 M36 20 L42 20 L46 24 M36 32 L36 20" stroke={color} strokeWidth="2" />
      <Path d="M28 28 L32 24 L36 28" stroke={color} strokeWidth="2" fill="none" />
    </Svg>
  ),
  'tank': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M22 12 L26 16 L32 16 L38 16 L42 12 M20 20 L24 12 M44 20 L40 12 M20 20 L20 52 L44 52 L44 20" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'underwear': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M16 20 L20 20 L24 36 L40 36 L44 20 L48 20 M24 36 L24 44 M40 36 L40 44 M24 44 L40 44" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'boxers': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M16 16 L20 16 L22 44 M42 44 L44 16 L48 16 M20 16 L44 16 M22 44 L42 44" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'longjohns': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M16 12 L20 12 L20 56 M44 12 L48 12 L48 56 M20 12 L44 12" stroke={color} strokeWidth="2" />
      <Line x1="20" y1="28" x2="44" y2="28" stroke={color} strokeWidth="1.5" />
    </Svg>
  ),
  'suspenders': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M20 12 L24 28 L28 52 M36 52 L40 28 L44 12" stroke={color} strokeWidth="2" />
      <Path d="M24 28 L40 28" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'gloves': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M20 28 L20 52 L28 52 L28 36 M28 36 L28 28 M32 36 L32 24 M36 36 L36 28 M40 36 L40 32" stroke={color} strokeWidth="2" />
      <Path d="M20 52 L16 48 L16 28 L20 28" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  'beanie': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M16 32 C16 20 22 12 32 12 C42 12 48 20 48 32 L48 36 L16 36 L16 32" stroke={color} strokeWidth="2" />
      <Circle cx="32" cy="8" r="3" stroke={color} strokeWidth="1.5" />
    </Svg>
  ),
  'graduation_gown': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M16 20 L16 60 L48 60 L48 20 M22 10 L26 14 L32 14 L38 14 L42 10 M16 20 L22 10 M48 20 L42 10" stroke={color} strokeWidth="2" />
      <Path d="M12 24 L52 24" stroke={color} strokeWidth="2" />
      <Path d="M32 10 L32 4 L28 4 L32 0 L36 4 L32 4" stroke={color} strokeWidth="1.5" />
    </Svg>
  ),
  'default': ({ size = 48, color = '#000' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M18 20 L18 56 L46 56 L46 20 M24 12 L28 16 L32 16 L36 16 L40 12 M18 20 L24 12 M46 20 L40 12" stroke={color} strokeWidth="2" />
    </Svg>
  ),
};

const garmentNameMap: Record<string, keyof typeof GarmentIconsSVG> = {
  // All 200 garments mapped
  'Dress Shirt': 'dress_shirt',
  'Casual Shirt': 'formal_shirt',
  'T-Shirt': 'tshirt',
  'Polo Shirt': 'polo_shirt',
  'Trousers': 'trousers',
  'Jeans': 'kids_jeans',
  'Shorts': 'shorts',
  'Jacket': 'jacket',
  'Sweater': 'sweater',
  'Hoodie': 'hoodie',
  'Dress': 'long_dress',
  'Blouse': 'shirt',
  'Skirt': 'skirt',
  'Abaya': 'kimono',
  'Hijab': 'hijab',
  'Scarf': 'scarf',
  'Cardigan': 'cardigan',
  'Pants': 'pants',
  'Leggings': 'leggings',
  'Evening Gown': 'long_dress',
  'Kids T-Shirt': 'kids_tshirt',
  'Kids Pants': 'kids_jeans',
  'Kids Dress': 'kids_dress',
  'Kids Jacket': 'kids_jacket',
  'Baby Onesie': 'baby_onesie',
  'Kids Pajamas': 'pajamas',
  'Bed Sheets (Single)': 'bedding_single',
  'Bed Sheets (Double)': 'bedding_double',
  'Duvet Cover': 'duvet_cover',
  'Pillow Case': 'pillowcase',
  'Curtains (Small)': 'curtains_small',
  'Curtains (Large)': 'curtains_large',
  'Table Cloth': 'napkin',
  'Towels': 'towel',
  'Bath Mat': 'bath_mat',
  'Blanket': 'blanket',
  'Suit (2-Piece)': 'twopiece_suit',
  'Suit (3-Piece)': 'threepiece_suit',
  'Blazer': 'blazer',
  'Tuxedo': 'tuxedo',
  'Vest': 'vest',
  'Bow Tie': 'bowtie',
  'Necktie': 'tie',
  'Thobe': 'thobe',
  'Bisht': 'kimono',
  'Ghutra': 'traditional_scarf',
  'Shemagh': 'traditional_scarf',
  'Kaftan': 'kimono',
  'Jalabiya': 'long_dress',
  'Traditional Dress': 'long_dress',
  'Tank Top': 'tank_top',
  'Henley Shirt': 'shirt',
  'Flannel Shirt': 'striped_shirt',
  'Denim Jacket': 'jacket',
  'Chinos': 'trousers',
  'Cargo Pants': 'cargo_pants',
  'Tracksuit Pants': 'leggings',
  'Sweatpants': 'leggings',
  'Bomber Jacket': 'jacket',
  'Parka': 'padded_jacket',
  'Maxi Dress': 'long_dress',
  'Midi Dress': 'shift_dress',
  'Mini Skirt': 'skirt',
  'Pencil Skirt': 'skirt',
  'Pleated Skirt': 'pleated_skirt',
  'Tunic': 'tunic',
  'Camisole': 'tank_top',
  'Crop Top': 'tank_top',
  'Palazzo Pants': 'pants',
  'Culottes': 'shorts',
  'Trench Coat': 'coat',
  'Peacoat': 'coat',
  'Windbreaker': 'jacket',
  'Raincoat': 'coat',
  'Poncho': 'poncho',
  'Swimsuit (Men)': 'bodysuit',
  'Swimsuit (Women)': 'bodysuit',
  'Bikini': 'bikini',
  'Sports Bra': 'sports_bra',
  'Gym Tank': 'tank',
  'Running Shorts': 'shorts',
  'Yoga Pants': 'leggings',
  'Compression Wear': 'bodysuit',
  'Track Jacket': 'jacket',
  'Jersey (Sports)': 'jersey',
  'Pajama Set (Men)': 'pajamas',
  'Pajama Set (Women)': 'pajamas',
  'Nightgown': 'nightgown',
  'Bathrobe': 'robe',
  'Sleep Shorts': 'shorts',
  'Bra': 'sports_bra',
  'Underwear': 'underwear',
  'Boxers': 'boxers',
  'Briefs': 'underwear',
  'Thermal Underwear': 'longjohns',
  'Undershirt': 'tank_top',
  'Belt': 'suspenders',
  'Suspenders': 'suspenders',
  'Gloves (Winter)': 'gloves',
  'Beanie': 'beanie',
  'Baseball Cap': 'cap',
  'Fedora': 'fedora',
  'Bucket Hat': 'bucket_hat',
  'Shawl': 'scarf',
  'Handbag': 'handbag',
  'Backpack': 'backpack',
  'Canvas Shoes': 'sneakers',
  'Sneakers': 'sneakers',
  'Boots': 'boots',
  'Slippers': 'slippers',
  'Comforter (Single)': 'bedding_single',
  'Comforter (Double)': 'bedding_double',
  'Mattress Cover': 'bedding_single',
  'Throw Pillow': 'pillow',
  'Cushion Cover': 'pillowcase',
  'Rug (Small)': 'large_rug',
  'Rug (Large)': 'large_rug',
  'Sofa Cover': 'sofa_cover',
  'Chair Cover': 'chair_cover',
  'Napkin Set': 'napkin',
  'School Uniform Shirt': 'formal_shirt',
  'School Uniform Pants': 'trousers',
  'Kids Hoodie': 'hoodie',
  'Kids Sweater': 'sweater',
  'Kids Shorts': 'shorts',
  'Baby Romper': 'onesie',
  'Baby Bib': 'baby_bib',
  'Kids Skirt': 'skirt',
  'Kids Leggings': 'leggings',
  'Kids Polo': 'polo',
  'Button-Up Shirt': 'shirt_button',
  'Oxford Shirt': 'dress_shirt',
  'V-Neck Sweater': 'vneck',
  'Turtleneck': 'pullover',
  'Overalls': 'bodysuit',
  'Wrap Dress': 'sundress',
  'Shift Dress': 'shift_dress',
  'Bodycon Dress': 'bodycon_dress',
  'Jumpsuit': 'bodysuit',
  'Romper': 'onesie',
  'Peplum Top': 'shirt',
  'Off-Shoulder Top': 'tank_top',
  'Corset Top': 'bodysuit',
  'Dinner Jacket': 'blazer',
  'Cummerbund': 'suspenders',
  'Pocket Square': 'scarf',
  'Agal': 'beanie',
  'Dishdasha': 'thobe',
  'Sirwal': 'pants',
  'Embroidered Shawl': 'scarf',
  'Linen Shirt': 'shirt',
  'Hawaiian Shirt': 'hawaiian_shirt',
  'Work Shirt': 'shirt',
  'Rugby Shirt': 'polo',
  'Baseball Jersey': 'jersey',
  'Cycling Jersey': 'jersey',
  'Golf Polo': 'polo',
  'Soccer Shorts': 'shorts',
  'Basketball Jersey': 'jersey',
  'Tennis Skirt': 'skirt',
  'Cocktail Dress': 'long_dress',
  'Sun Dress': 'sundress',
  'Kimono': 'kimono',
  'Saree': 'long_dress',
  'Salwar Kameez': 'tunic',
  'Cheongsam': 'long_dress',
  'Dashiki': 'shirt',
  'Hanbok': 'kimono',
  'Shalwar': 'pants',
  'Nehru Jacket': 'blazer',
  'Duffle Coat': 'coat',
  'Cape': 'poncho',
  'Anorak': 'jacket',
  'Fur Coat': 'coat',
  'Down Jacket': 'padded_jacket',
  'Vest Jacket': 'vest',
  'Leather Jacket': 'jacket',
  'Suede Jacket': 'jacket',
  'Blazer (Women)': 'blazer',
  'Pant Suit': 'twopiece_suit',
  'Smoking Jacket': 'blazer',
  'Morning Coat': 'coat',
  'Ascot Tie': 'tie',
  'Cufflinks Set': 'suspenders',
  'Socks (Dress)': 'socks',
  'Socks (Athletic)': 'socks',
  'Socks (Wool)': 'socks',
  'Stockings': 'socks',
  'Tights': 'leggings',
  'Leg Warmers': 'socks',
  'Bathing Robe': 'robe_bath',
  'Silk Pajamas': 'pajamas',
  'Nightshirt': 'pajama_top',
  'Chemise': 'nightgown',
  'Sleep Mask': 'sleep_mask',
  'Baby Blanket': 'blanket',
  'Swaddle Blanket': 'baby_swaddle',
  'Receiving Blanket': 'blanket',
  'Kids Bathrobe': 'robe',
  'Graduation Gown': 'graduation_gown',
};

export function getGarmentIcon(garmentName: string): keyof typeof GarmentIconsSVG {
  const icon = garmentNameMap[garmentName];
  return icon || 'default';
}
