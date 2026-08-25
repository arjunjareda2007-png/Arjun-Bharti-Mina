import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { SEOConfig } from '../../types';
import { Search, Save, CheckCircle2 } from 'lucide-react';

export const SEOTab: React.FC = () => {
  const { seo, updateSEO } = useStore();
  const [formData, setFormData] = useState<SEOConfig>(seo);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field: keyof SEOConfig, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateSEO(formData);
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn max-w-3xl">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-amber-500" />
            <span>Search Engine Optimization (SEO) & Social Graph</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Optimize how Arjun's site appears on Google Search, WhatsApp preview cards, and Twitter/X.
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
              <span>{isSaving ? 'Saving...' : 'Save SEO'}</span>
            </>
          )}
        </button>
      </div>

      <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-4">
        <div>
          <label className="block text-xs font-semibold mb-1">Global Site Title</label>
          <input
            type="text"
            value={formData.siteTitle}
            onChange={(e) => handleChange('siteTitle', e.target.value)}
            className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Meta Description</label>
          <textarea
            rows={3}
            value={formData.metaDescription}
            onChange={(e) => handleChange('metaDescription', e.target.value)}
            className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Target Keywords</label>
          <input
            type="text"
            value={formData.keywords}
            onChange={(e) => handleChange('keywords', e.target.value)}
            placeholder="Arjun Bharti Mina, Desi Hip Hop, Indian Rapper, Civil Engineer, RUTBA"
            className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Open Graph / Social Card Image URL</label>
          <input
            type="url"
            value={formData.ogImageUrl}
            onChange={(e) => handleChange('ogImageUrl', e.target.value)}
            className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono"
          />
          {formData.ogImageUrl && (
            <div className="mt-3 aspect-[1200/630] max-w-sm rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700">
              <img src={formData.ogImageUrl} alt="Social Card Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Twitter / X Creator Handle</label>
          <input
            type="text"
            value={formData.twitterHandle}
            onChange={(e) => handleChange('twitterHandle', e.target.value)}
            className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono"
          />
        </div>
      </div>
    </form>
  );
};
