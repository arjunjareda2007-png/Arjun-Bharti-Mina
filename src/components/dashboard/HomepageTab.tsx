import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { HomepageConfig } from '../../types';
import { Layout, Save, CheckCircle2, Eye, EyeOff, Sparkles, MoveVertical, Music, Disc, Play } from 'lucide-react';

export const HomepageTab: React.FC = () => {
  const { homepage, updateHomepage, songs } = useStore();
  const [formData, setFormData] = useState<HomepageConfig>(homepage);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field: keyof HomepageConfig, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectSongForAnthem = (songId: string) => {
    const selected = songs.find(s => s.id === songId);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        featuredAnthemSongId: selected.id,
        featuredAnthemTitle: `${selected.title} (${selected.year})`,
        featuredAnthemSubtitle: `${selected.genre} • ABM Studio’s`,
        featuredAnthemBadge: prev.featuredAnthemBadge || 'Featured Anthem'
      }));
    } else {
      setFormData(prev => ({ ...prev, featuredAnthemSongId: songId }));
    }
  };

  const handleSectionToggle = (sectionId: string) => {
    setFormData(prev => ({
      ...prev,
      sections: (prev.sections || []).map(s => s.id === sectionId ? { ...s, enabled: !s.enabled } : s)
    }));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...(formData.sections || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;
    newSections.forEach((s, i) => s.order = i + 1);
    setFormData(prev => ({ ...prev, sections: newSections }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateHomepage(formData);
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Layout className="w-5 h-5 text-amber-500" />
            <span>Homepage Architecture & Layout</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Configure the hero stage, action callouts, and reorder homepage showcase modules.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-60"
        >
          {isSaving ? (
            <span>Saving Layout...</span>
          ) : savedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Layout Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Homepage Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Hero Stage Copy */}
      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Hero Stage Headline & Introduction</span>
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Main Hero Heading
            </label>
            <input
              type="text"
              value={formData.heroHeading}
              onChange={(e) => handleChange('heroHeading', e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Hero Tagline / Subtitle
            </label>
            <input
              type="text"
              value={formData.heroSubtitle}
              onChange={(e) => handleChange('heroSubtitle', e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Hero Intro Paragraph
            </label>
            <textarea
              rows={3}
              value={formData.heroIntro}
              onChange={(e) => handleChange('heroIntro', e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Main Screen Featured Anthem (Hero Portrait Badge) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-2">
              <Music className="w-4 h-4 text-amber-500" />
              <span>Main Screen Featured Anthem (Hero Stage Badge)</span>
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Customize the floating vinyl anthem card displayed over the main hero portrait on the home screen.
            </p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.showFeaturedAnthem !== false}
              onChange={(e) => handleChange('showFeaturedAnthem', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-amber-500 relative"></div>
            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              {formData.showFeaturedAnthem !== false ? 'Card Visible' : 'Card Hidden'}
            </span>
          </label>
        </div>

        {formData.showFeaturedAnthem !== false && (
          <div className="space-y-6">
            {/* Song Catalog Selector */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Select Anthem Song from Catalog
              </label>
              <select
                value={formData.featuredAnthemSongId || 'rutba-2026'}
                onChange={(e) => handleSelectSongForAnthem(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500"
              >
                {songs.map((song) => (
                  <option key={song.id} value={song.id}>
                    🎵 {song.title} ({song.year}) — {song.genre}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-neutral-400 mt-1">
                Choosing a track automatically synchronizes the play action, streaming audio, and metadata.
              </p>
            </div>

            {/* Custom Overrides */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Anthem Display Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. RUTBA (2026)"
                  value={formData.featuredAnthemTitle || ''}
                  onChange={(e) => handleChange('featuredAnthemTitle', e.target.value)}
                  className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Subtitle / Credits
                </label>
                <input
                  type="text"
                  placeholder="e.g. Street Rap Anthem • ABM Studio’s"
                  value={formData.featuredAnthemSubtitle || ''}
                  onChange={(e) => handleChange('featuredAnthemSubtitle', e.target.value)}
                  className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Badge Tag
                </label>
                <input
                  type="text"
                  placeholder="e.g. Featured Anthem"
                  value={formData.featuredAnthemBadge || ''}
                  onChange={(e) => handleChange('featuredAnthemBadge', e.target.value)}
                  className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm uppercase font-mono"
                />
              </div>
            </div>

            {/* Live Preview Card */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-white space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                Live Hero Card Preview
              </span>
              <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0">
                    <Disc className="w-6 h-6 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-[10px] font-mono uppercase text-neutral-300 font-bold tracking-wider">
                        {formData.featuredAnthemBadge || 'Featured Anthem'}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-black truncate text-white mt-0.5">
                      {formData.featuredAnthemTitle || 'RUTBA (2026)'}
                    </h4>
                    <p className="text-[11px] text-neutral-400 truncate">
                      {formData.featuredAnthemSubtitle || 'Street Rap Anthem • ABM Studio’s'}
                    </p>
                  </div>
                </div>

                <div className="w-9 h-9 rounded-full bg-white text-neutral-950 flex items-center justify-center font-bold shrink-0 shadow">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Call to Action Buttons */}
      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Hero Call-to-Action (CTA) Buttons
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/60 space-y-3">
            <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">Primary CTA</h4>
            <div>
              <label className="block text-xs text-neutral-600 dark:text-neutral-400 mb-1">Button Label</label>
              <input
                type="text"
                value={formData.ctaPrimaryText}
                onChange={(e) => handleChange('ctaPrimaryText', e.target.value)}
                className="w-full px-3 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-600 dark:text-neutral-400 mb-1">Target Section / Tab</label>
              <input
                type="text"
                value={formData.ctaPrimaryLink}
                onChange={(e) => handleChange('ctaPrimaryLink', e.target.value)}
                className="w-full px-3 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-mono"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/60 space-y-3">
            <h4 className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase">Secondary CTA</h4>
            <div>
              <label className="block text-xs text-neutral-600 dark:text-neutral-400 mb-1">Button Label</label>
              <input
                type="text"
                value={formData.ctaSecondaryText}
                onChange={(e) => handleChange('ctaSecondaryText', e.target.value)}
                className="w-full px-3 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-600 dark:text-neutral-400 mb-1">Target Section / Tab</label>
              <input
                type="text"
                value={formData.ctaSecondaryLink}
                onChange={(e) => handleChange('ctaSecondaryLink', e.target.value)}
                className="w-full px-3 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section Ordering & Visibility Controls */}
      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Featured Icons & Platforms Strip</span>
          </h3>
          <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400">
            Auto-Scroll Enabled (&gt; 4 icons)
          </span>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          The horizontal strip fitted below the "Let's Collaborate & Create" section features custom icons, redirect links, and auto-scrolls horizontally in a smooth loop. You can configure icons, URLs, and logos in the dedicated Featured Icons Strip tab in the Creator Hub.
        </p>
      </div>

      {/* Section Ordering & Visibility Controls */}
      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
          <MoveVertical className="w-4 h-4 text-amber-500" />
          <span>Homepage Sections Order & Visibility</span>
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Use the arrows to reorder sections on the homepage. Toggle the eye button to show or hide a section.
        </p>

        <div className="space-y-2 pt-2">
          {(formData.sections || []).map((section, idx) => (
            <div
              key={section.id}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                section.enabled
                  ? 'bg-neutral-50 dark:bg-neutral-800/70 border-neutral-200 dark:border-neutral-700'
                  : 'bg-neutral-100/50 dark:bg-neutral-900/50 border-neutral-200/50 dark:border-neutral-800 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-mono font-bold">
                  {idx + 1}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white">
                  {section.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveSection(idx, 'up')}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-30"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    disabled={idx === (formData.sections || []).length - 1}
                    onClick={() => moveSection(idx, 'down')}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-30"
                  >
                    ▼
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleSectionToggle(section.id)}
                  className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    section.enabled
                      ? 'bg-amber-500/15 border-amber-500/30 text-amber-700 dark:text-amber-300'
                      : 'bg-neutral-200 dark:bg-neutral-700 border-transparent text-neutral-500'
                  }`}
                >
                  {section.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{section.enabled ? 'Visible' : 'Hidden'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
};
