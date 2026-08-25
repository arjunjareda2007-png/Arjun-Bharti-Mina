import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { SiteBranding } from '../../types';
import { Sparkles, Save, CheckCircle2, Globe, Layout, Copyright, Crop } from 'lucide-react';

export const BrandingTab: React.FC = () => {
  const { branding, updateBranding, openCropper } = useStore();
  const [formData, setFormData] = useState<SiteBranding>(branding);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field: keyof SiteBranding, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateBranding(formData);
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Site Branding & Visual Identity</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Customize logo, titles, meta taglines, browser headers, and copyright texts.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-60"
        >
          {savedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Branding'}</span>
            </>
          )}
        </button>
      </div>

      {/* Basic Site Titles */}
      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Core Name & Taglines
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Site Primary Name
            </label>
            <input
              type="text"
              value={formData.siteName}
              onChange={(e) => handleChange('siteName', e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Short Site Moniker / Logo Text
            </label>
            <input
              type="text"
              value={formData.shortName}
              onChange={(e) => handleChange('shortName', e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Browser Title Bar (Document Title)
            </label>
            <input
              type="text"
              value={formData.browserTitle}
              onChange={(e) => handleChange('browserTitle', e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Global Site Tagline
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Site Meta Description
            </label>
            <textarea
              rows={2}
              value={formData.siteDescription}
              onChange={(e) => handleChange('siteDescription', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Logo & Favicon Assets */}
      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Logo & Favicon URLs
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Custom Logo Image URL (Optional)
              </label>
              <button
                type="button"
                onClick={() => {
                  openCropper({
                    initialImageUrl: formData.logoUrl,
                    title: 'Crop & Refine Brand Logo',
                    aspectRatioPreset: 'free',
                    outputWidth: 512,
                    outputHeight: 512,
                    onCropComplete: (dataUrl) => {
                      handleChange('logoUrl', dataUrl);
                    }
                  });
                }}
                className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-lg border border-amber-500/20 flex items-center gap-1 transition-colors"
              >
                <Crop className="w-3.5 h-3.5" />
                <span>Crop Logo</span>
              </button>
            </div>
            <input
              type="url"
              value={formData.logoUrl}
              onChange={(e) => handleChange('logoUrl', e.target.value)}
              placeholder="https://... (Leave empty to use stylized ABM typographic logo)"
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono"
            />
            {formData.logoUrl && (
              <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl flex items-center gap-3">
                <img src={formData.logoUrl} alt="Logo preview" className="h-8 max-w-[120px] object-contain" />
                <span className="text-xs text-neutral-500">Logo preview</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Favicon URL (Optional)
              </label>
              <button
                type="button"
                onClick={() => {
                  openCropper({
                    initialImageUrl: formData.faviconUrl,
                    title: 'Crop & Refine Favicon (1:1)',
                    aspectRatioPreset: '1:1',
                    outputWidth: 256,
                    outputHeight: 256,
                    onCropComplete: (dataUrl) => {
                      handleChange('faviconUrl', dataUrl);
                    }
                  });
                }}
                className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-lg border border-amber-500/20 flex items-center gap-1 transition-colors"
              >
                <Crop className="w-3.5 h-3.5" />
                <span>Crop Favicon</span>
              </button>
            </div>
            <input
              type="url"
              value={formData.faviconUrl}
              onChange={(e) => handleChange('faviconUrl', e.target.value)}
              placeholder="https://... (Icon URL for browser tabs)"
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {/* Footer & Copyright */}
      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
          <Copyright className="w-4 h-4 text-amber-500" />
          <span>Footer & Legal Branding</span>
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Footer Description Line
            </label>
            <input
              type="text"
              value={formData.footerText}
              onChange={(e) => handleChange('footerText', e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Copyright Notice
            </label>
            <input
              type="text"
              value={formData.copyrightText}
              onChange={(e) => handleChange('copyrightText', e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
