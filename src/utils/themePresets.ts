import React from 'react';
import { ThemeMode } from '../types';

export interface ThemePreset {
  id: ThemeMode;
  name: string;
  subtitle: string;
  tag: string;
  isDark: boolean;
  accentHex: string;
  bgHex: string;
  surfaceHex: string;
  borderHex: string;
  badgeBg: string;
  badgeText: string;
  desc: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'dark',
    name: 'Onyx Minimal',
    subtitle: 'Pure Studio Dark',
    tag: 'Classic',
    isDark: true,
    accentHex: '#f59e0b',
    bgHex: '#0a0a0a',
    surfaceHex: '#141414',
    borderHex: '#262626',
    badgeBg: 'bg-neutral-800',
    badgeText: 'text-neutral-200',
    desc: 'Deep pitch-black canvas with high-contrast monochrome studio typography.'
  },
  {
    id: 'light',
    name: 'Editorial Paper',
    subtitle: 'Clean High-Contrast',
    tag: 'Minimal',
    isDark: false,
    accentHex: '#d97706',
    bgHex: '#fafafa',
    surfaceHex: '#ffffff',
    borderHex: '#e5e5e5',
    badgeBg: 'bg-neutral-100',
    badgeText: 'text-neutral-800',
    desc: 'Stark white editorial canvas with crisp obsidian ink typography.'
  },
  {
    id: 'midnight',
    name: 'Cyber Midnight',
    subtitle: 'Deep Slate & Ice Cyan',
    tag: 'Cool Tech',
    isDark: true,
    accentHex: '#38bdf8',
    bgHex: '#0b1120',
    surfaceHex: '#0f172a',
    borderHex: '#1e293b',
    badgeBg: 'bg-sky-950/60',
    badgeText: 'text-sky-300',
    desc: 'Deep space slate navy with luminescence of icy cyan and electric cobalt.'
  },
  {
    id: 'emerald',
    name: 'Forest Noir',
    subtitle: 'Deep Pine & Mint',
    tag: 'Organic',
    isDark: true,
    accentHex: '#10b981',
    bgHex: '#06140e',
    surfaceHex: '#0a1f16',
    borderHex: '#123326',
    badgeBg: 'bg-emerald-950/60',
    badgeText: 'text-emerald-300',
    desc: 'Dark evergreen obsidian tones with soothing mint and champagne highlights.'
  },
  {
    id: 'amber',
    name: 'Analog Sepia',
    subtitle: 'Vintage Vinyl & Warm Gold',
    tag: 'Vintage',
    isDark: true,
    accentHex: '#f59e0b',
    bgHex: '#140e0a',
    surfaceHex: '#1d1510',
    borderHex: '#33231a',
    badgeBg: 'bg-amber-950/60',
    badgeText: 'text-amber-300',
    desc: 'Warm analog tape and acoustic studio vibes with rich amber and dark roast warmth.'
  },
  {
    id: 'nordic',
    name: 'Nordic Titanium',
    subtitle: 'Matte Graphite & Platinum',
    tag: 'Architectural',
    isDark: true,
    accentHex: '#94a3b8',
    bgHex: '#111317',
    surfaceHex: '#181b22',
    borderHex: '#252a35',
    badgeBg: 'bg-slate-800',
    badgeText: 'text-slate-200',
    desc: 'Cool Scandinavian industrial matte gray with sleek brushed platinum edges.'
  },
  {
    id: 'cyber',
    name: 'Neon Horizon',
    subtitle: 'Abyss Violet & Magenta',
    tag: 'Synthwave',
    isDark: true,
    accentHex: '#a855f7',
    bgHex: '#0d091a',
    surfaceHex: '#140e2b',
    borderHex: '#26184a',
    badgeBg: 'bg-purple-950/60',
    badgeText: 'text-purple-300',
    desc: 'Futuristic nocturnal violet with glowing magenta and electric purple accents.'
  },
  {
    id: 'sunset',
    name: 'Coral Dusk',
    subtitle: 'Espresso Twilight & Rose',
    tag: 'Atmospheric',
    isDark: true,
    accentHex: '#f43f5e',
    bgHex: '#150a10',
    surfaceHex: '#200e18',
    borderHex: '#361528',
    badgeBg: 'bg-rose-950/60',
    badgeText: 'text-rose-300',
    desc: 'Twilight sky mood with velvet espresso backdrop and radiant coral rose accents.'
  },
  {
    id: 'cherry',
    name: 'Cherry Red',
    subtitle: 'Crimson Noir & Vivid Ruby',
    tag: 'Bold Crimson',
    isDark: true,
    accentHex: '#e11d48',
    bgHex: '#0d0407',
    surfaceHex: '#18070d',
    borderHex: '#300c19',
    badgeBg: 'bg-rose-950/60',
    badgeText: 'text-rose-300',
    desc: 'Intense crimson velvet dark canvas with fiery ruby and cherry red highlights.'
  },
  {
    id: 'blossom',
    name: 'Cherry Blossom',
    subtitle: 'Sakura Petal & Rose Gold',
    tag: 'Sakura',
    isDark: true,
    accentHex: '#f472b6',
    bgHex: '#120810',
    surfaceHex: '#1c0e1a',
    borderHex: '#33162e',
    badgeBg: 'bg-pink-950/60',
    badgeText: 'text-pink-300',
    desc: 'Delicate sakura petal atmosphere with deep floral twilight and soft pink glow.'
  },
  {
    id: 'system',
    name: 'System Sync',
    subtitle: 'Automatic Device Match',
    tag: 'Adaptive',
    isDark: false,
    accentHex: '#f59e0b',
    bgHex: 'var(--bg-system)',
    surfaceHex: 'var(--surface-system)',
    borderHex: 'var(--border-system)',
    badgeBg: 'bg-neutral-200 dark:bg-neutral-800',
    badgeText: 'text-neutral-700 dark:text-neutral-300',
    desc: 'Seamlessly mirrors your operating system or device dark/light mode preference.'
  }
];

export const getThemePreset = (themeId: ThemeMode): ThemePreset => {
  return THEME_PRESETS.find(t => t.id === themeId) || THEME_PRESETS[0];
};
