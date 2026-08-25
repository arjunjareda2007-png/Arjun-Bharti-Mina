import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { YouTubeSettings } from '../../types';
import { Youtube, Save, CheckCircle2, Video } from 'lucide-react';

export const YouTubeTab: React.FC = () => {
  const { youtube, updateYouTube } = useStore();
  const [formData, setFormData] = useState<YouTubeSettings>(youtube);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field: keyof YouTubeSettings, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateYouTube(formData);
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn max-w-3xl">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Youtube className="w-5 h-5 text-red-500" />
            <span>YouTube Channel Integration & Live Sync</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Configure Arjun's official YouTube channel link, subscriber count, featured video, and video playlists.
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
              <span>{isSaving ? 'Saving...' : 'Save YouTube Config'}</span>
            </>
          )}
        </button>
      </div>

      <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-4">
        <div>
          <label className="block text-xs font-semibold mb-1">YouTube Channel Name</label>
          <input
            type="text"
            value={formData.channelName}
            onChange={(e) => handleChange('channelName', e.target.value)}
            className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Channel URL</label>
          <input
            type="url"
            value={formData.channelUrl}
            onChange={(e) => handleChange('channelUrl', e.target.value)}
            className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Channel Logo / Avatar URL</label>
            <input
              type="url"
              value={formData.channelLogo}
              onChange={(e) => handleChange('channelLogo', e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Subscriber Count Display</label>
            <input
              type="text"
              value={formData.subscribersCount}
              onChange={(e) => handleChange('subscribersCount', e.target.value)}
              placeholder="e.g. 50K+ Subscribers"
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Featured Video Embed ID</label>
          <input
            type="text"
            value={formData.featuredVideoId}
            onChange={(e) => handleChange('featuredVideoId', e.target.value)}
            placeholder="e.g. dQw4w9WgXcQ"
            className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Channel Description</label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs"
          />
        </div>
      </div>
    </form>
  );
};
