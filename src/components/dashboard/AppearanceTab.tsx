import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AppearanceConfig } from '../../types';
import { Palette, Sun, Moon, Monitor, CheckCircle2 } from 'lucide-react';

export const AppearanceTab: React.FC = () => {
  const { appearance, updateAppearance } = useStore();
  const [formData, setFormData] = useState<AppearanceConfig>(appearance);

  const colors: Array<{ id: AppearanceConfig['accentColor']; name: string; bgClass: string; ringClass: string }> = [
    { id: 'amber', name: 'Warm Amber (Signature)', bgClass: 'bg-amber-500', ringClass: 'ring-amber-500' },
    { id: 'emerald', name: 'Emerald Green', bgClass: 'bg-emerald-500', ringClass: 'ring-emerald-500' },
    { id: 'sky', name: 'Sky Blue', bgClass: 'bg-sky-500', ringClass: 'ring-sky-500' },
    { id: 'rose', name: 'Rose Red', bgClass: 'bg-rose-500', ringClass: 'ring-rose-500' },
    { id: 'violet', name: 'Electric Violet', bgClass: 'bg-violet-500', ringClass: 'ring-violet-500' },
    { id: 'orange', name: 'Sunset Orange', bgClass: 'bg-orange-500', ringClass: 'ring-orange-500' }
  ];

  const handleThemeChange = (mode: 'dark' | 'light' | 'system') => {
    setFormData(prev => ({ ...prev, themeMode: mode }));
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

  return (
    <div className="space-y-8 animate-fadeIn max-w-3xl">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-500" />
            <span>Theme & Visual Styling Settings</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Real-time customization of dark/light modes, accent highlights, and rounded card geometry.
          </p>
        </div>
      </div>

      {/* Theme Mode Selector */}
      <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Interface Color Mode
        </h3>

        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleThemeChange('dark')}
            className={`p-4 rounded-2xl border text-left space-y-2 transition-all ${
              formData.themeMode === 'dark'
                ? 'bg-neutral-950 text-white border-amber-500 ring-2 ring-amber-500/20'
                : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-400'
            }`}
          >
            <Moon className="w-5 h-5 text-amber-500" />
            <div>
              <p className="font-bold text-xs">Dark Mode</p>
              <p className="text-[11px] opacity-75">Studio dark aesthetic</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleThemeChange('light')}
            className={`p-4 rounded-2xl border text-left space-y-2 transition-all ${
              formData.themeMode === 'light'
                ? 'bg-white text-neutral-900 border-amber-500 ring-2 ring-amber-500/20 shadow-md'
                : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-400'
            }`}
          >
            <Sun className="w-5 h-5 text-amber-500" />
            <div>
              <p className="font-bold text-xs">Light Mode</p>
              <p className="text-[11px] opacity-75">Clean paper aesthetic</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleThemeChange('system')}
            className={`p-4 rounded-2xl border text-left space-y-2 transition-all ${
              formData.themeMode === 'system'
                ? 'bg-neutral-100 dark:bg-neutral-800 border-amber-500 ring-2 ring-amber-500/20'
                : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-400'
            }`}
          >
            <Monitor className="w-5 h-5 text-amber-500" />
            <div>
              <p className="font-bold text-xs">System Auto</p>
              <p className="text-[11px] opacity-75">Matches OS setting</p>
            </div>
          </button>
        </div>
      </div>

      {/* Accent Color Palette */}
      <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Brand Accent Color
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

      {/* Border Radius Geometry */}
      <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Component Corner Geometry
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
  );
};
