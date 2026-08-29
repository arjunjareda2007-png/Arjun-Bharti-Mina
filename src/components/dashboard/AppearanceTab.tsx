import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AppearanceConfig, ThemeMode } from '../../types';
import { THEME_PRESETS } from '../../utils/themePresets';
import { Palette, CheckCircle2, Sliders, Layers, Sparkles, Wand2 } from 'lucide-react';

export const AppearanceTab: React.FC = () => {
  const { appearance, updateAppearance, theme, setTheme } = useStore();
  const [formData, setFormData] = useState<AppearanceConfig>(appearance);

  const colors: Array<{ id: AppearanceConfig['accentColor']; name: string; bgClass: string; hex: string }> = [
    { id: 'amber', name: 'Warm Amber (Signature)', bgClass: 'bg-amber-500', hex: '#f59e0b' },
    { id: 'emerald', name: 'Emerald Green', bgClass: 'bg-emerald-500', hex: '#10b981' },
    { id: 'sky', name: 'Sky Blue', bgClass: 'bg-sky-500', hex: '#0ea5e9' },
    { id: 'rose', name: 'Rose Red', bgClass: 'bg-rose-500', hex: '#f43f5e' },
    { id: 'violet', name: 'Electric Violet', bgClass: 'bg-violet-500', hex: '#8b5cf6' },
    { id: 'orange', name: 'Sunset Orange', bgClass: 'bg-orange-500', hex: '#f97316' }
  ];

  const handleThemeChange = (mode: ThemeMode) => {
    setFormData(prev => ({ ...prev, themeMode: mode }));
    setTheme(mode);
    updateAppearance({ themeMode: mode });
  };

  const handleColorChange = (color: AppearanceConfig['accentColor']) => {
    setFormData(prev => ({ ...prev, accentColor: color }));
    updateAppearance({ accentColor: color });
  };

  const handleRadiusChange = (radius: AppearanceConfig['borderRadius']) => {
    setFormData(prev => ({ ...prev, borderRadius: radius }));
    updateAppearance({ borderRadius: radius });
  };

  const handleCardStyleChange = (style: AppearanceConfig['cardStyle']) => {
    setFormData(prev => ({ ...prev, cardStyle: style }));
    updateAppearance({ cardStyle: style });
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-500" />
            <span>Theme, Aesthetics & Layout Geometry</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Choose from curated aesthetic theme modes, ambient atmospheres, accent highlights, and surface styling.
          </p>
        </div>
      </div>

      {/* Aesthetic Theme Mode Selector */}
      <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-amber-500" />
              <span>Aesthetic Theme Modes</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Select a simple, cool atmospheric palette tailored for the portfolio and audio experience.
            </p>
          </div>
          <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 font-bold capitalize">
            Active: {THEME_PRESETS.find(t => t.id === (formData.themeMode || theme))?.name || formData.themeMode}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {THEME_PRESETS.map((preset) => {
            const isSelected = (formData.themeMode || theme) === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleThemeChange(preset.id)}
                style={{
                  backgroundColor: preset.isDark ? preset.bgHex : '#ffffff',
                  borderColor: isSelected ? preset.accentHex : (preset.isDark ? preset.borderHex : '#e5e5e5')
                }}
                className={`p-4 rounded-2xl border-2 text-left space-y-3 transition-all relative overflow-hidden group cursor-pointer hover:scale-[1.01] active:scale-[0.98] ${
                  isSelected
                    ? 'ring-3 ring-amber-500/25 shadow-lg'
                    : 'opacity-90 hover:opacity-100 shadow-xs'
                }`}
              >
                {/* Header with Name, Tag & Check */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: preset.accentHex }}
                      />
                      <h4 
                        className="font-bold text-xs font-display tracking-tight"
                        style={{ color: preset.isDark ? '#f5f5f5' : '#171717' }}
                      >
                        {preset.name}
                      </h4>
                    </div>
                    <p 
                      className="text-[10px] font-mono mt-0.5"
                      style={{ color: preset.isDark ? '#a3a3a3' : '#737373' }}
                    >
                      {preset.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span 
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${preset.badgeBg} ${preset.badgeText}`}
                    >
                      {preset.tag}
                    </span>
                    {isSelected && (
                      <CheckCircle2 
                        className="w-4 h-4 shrink-0" 
                        style={{ color: preset.accentHex }} 
                      />
                    )}
                  </div>
                </div>

                {/* Description */}
                <p 
                  className="text-[11px] leading-relaxed line-clamp-2"
                  style={{ color: preset.isDark ? '#9ca3af' : '#6b7280' }}
                >
                  {preset.desc}
                </p>

                {/* Mini Swatches Preview */}
                <div 
                  className="p-2 rounded-xl border flex items-center justify-between text-[10px] font-mono"
                  style={{
                    backgroundColor: preset.isDark ? preset.surfaceHex : '#f9fafb',
                    borderColor: preset.isDark ? preset.borderHex : '#e5e7eb',
                    color: preset.isDark ? '#d1d5db' : '#374151'
                  }}
                >
                  <span className="text-[10px] opacity-80">Atmosphere Tone</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.bgHex }} />
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.surfaceHex }} />
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.accentHex }} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accent Color Palette */}
      <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-4 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Brand Accent Highlights
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {colors.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => handleColorChange(c.id)}
              className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                formData.accentColor === c.id
                  ? 'bg-neutral-50 dark:bg-neutral-800/80 border-amber-500 ring-2 ring-amber-500/20'
                  : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full ${c.bgClass} shadow-sm`} />
                <span className="text-xs font-bold text-neutral-900 dark:text-white">{c.name}</span>
              </div>

              {formData.accentColor === c.id && (
                <CheckCircle2 className="w-4 h-4 text-amber-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Card Surface Style & Corner Radius */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card Style */}
        <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-500" />
            <span>Card Surface Style</span>
          </h3>

          <div className="grid grid-cols-2 gap-2.5">
            {[
              { id: 'glass', label: 'Frosted Glass', desc: 'Backdrop blur' },
              { id: 'solid', label: 'Solid Matte', desc: 'Flat background' },
              { id: 'minimal', label: 'Ultra Minimal', desc: 'No heavy borders' },
              { id: 'bordered', label: 'Outlined Edge', desc: 'Crisp stroke' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => handleCardStyleChange(st.id as any)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  formData.cardStyle === st.id
                    ? 'bg-neutral-100 dark:bg-neutral-800 border-amber-500 ring-2 ring-amber-500/20'
                    : 'bg-neutral-50 dark:bg-neutral-800/40 border-neutral-200 dark:border-neutral-700/60 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                <p className="text-xs font-bold text-neutral-900 dark:text-white">{st.label}</p>
                <p className="text-[10px] text-neutral-400">{st.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Border Radius Geometry */}
        <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-500" />
            <span>Corner Curvature</span>
          </h3>

          <div className="grid grid-cols-5 gap-2">
            {(['none', 'sm', 'md', 'lg', 'full'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRadiusChange(r)}
                className={`p-3 border text-xs font-semibold capitalize transition-all ${
                  r === 'none' ? 'rounded-none' : r === 'sm' ? 'rounded-md' : r === 'md' ? 'rounded-xl' : r === 'lg' ? 'rounded-2xl' : 'rounded-full'
                } ${
                  formData.borderRadius === r
                    ? 'bg-amber-500 text-neutral-950 font-bold border-transparent'
                    : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Interactive Preview Box */}
      <div className="p-6 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Live Style Preview Sample</span>
          </h4>
          <span className="text-[11px] text-neutral-400">Updates globally in real-time</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-neutral-950 font-bold">
              ABM
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-900 dark:text-white">Sample Audio Card</p>
              <p className="text-[11px] text-neutral-400">RUTBA - Arjun Meena (2026)</p>
            </div>
          </div>
          <button
            type="button"
            className="px-3.5 py-1.5 bg-amber-500 text-neutral-950 text-xs font-bold rounded-xl shadow hover:bg-amber-400 transition-colors"
          >
            Play Stream
          </button>
        </div>
      </div>
    </div>
  );
};

