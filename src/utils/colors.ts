import { ThemeColors, ThemeMode } from '@/types';

export const RAINBOW_STOPS: readonly [string, string, ...string[]] = [
  '#FF2D55', // Red-Pink
  '#FF5E3A', // Coral-Orange
  '#FFA500', // Gold-Orange
  '#FFD700', // Yellow
  '#2ECC71', // Emerald-Green
  '#00C9FF', // Cyan-Blue
  '#8A2387', // Violet
] as const;

export const RAINBOW_GRADIENT_PAIRS: [string, string][] = [
  ['#FF3B30', '#FF9500'],
  ['#FF9500', '#FFCC00'],
  ['#FFCC00', '#34C759'],
  ['#34C759', '#00C7BE'],
  ['#00C7BE', '#007AFF'],
  ['#007AFF', '#AF52DE'],
  ['#AF52DE', '#FF2D55'],
];

export const DARK_THEME: ThemeColors = {
  background: '#09090B',
  surface: '#121216',
  surfaceHover: '#1A1A22',
  surfaceBorder: '#272732',
  card: '#16161C',
  cardBorder: '#2A2A38',
  text: '#F4F4F5',
  textSecondary: '#A1A1AA',
  textMuted: '#52525B',
  accent: '#FFFFFF',
  frozenText: '#71717A',
  frozenBg: '#131317',
  frozenBorder: '#27272A',
  rainbow: RAINBOW_STOPS,
};

export const LIGHT_THEME: ThemeColors = {
  background: '#FFFFFF',
  surface: '#F8F9FA',
  surfaceHover: '#F1F3F5',
  surfaceBorder: '#E5E7EB',
  card: '#FFFFFF',
  cardBorder: '#E2E8F0',
  text: '#09090B',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  accent: '#000000',
  frozenText: '#94A3B8',
  frozenBg: '#F1F5F9',
  frozenBorder: '#E2E8F0',
  rainbow: RAINBOW_STOPS,
};

export function getThemeColors(mode: ThemeMode): ThemeColors {
  return mode === 'dark' ? DARK_THEME : LIGHT_THEME;
}

/**
 * Returns a rainbow color based on progress (0.0 to 1.0)
 */
export function getProgressColor(progress: number): string {
  if (progress <= 0) return '#71717A'; // muted grey
  if (progress < 0.25) return '#FF5E3A'; // orange
  if (progress < 0.5) return '#FFD700'; // yellow
  if (progress < 0.75) return '#00C9FF'; // cyan/blue
  if (progress < 1.0) return '#2ECC71'; // green
  return '#AF52DE'; // 100% purple-pink full glory
}
