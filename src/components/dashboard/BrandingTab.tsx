import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { SiteBranding } from '../../types';
import { 
  Sparkles, 
  Save, 
  CheckCircle2, 
  Globe, 
  Layout, 
  Copyright, 
  Crop, 
  Upload, 
  Trash2, 
  Image as ImageIcon,
  ExternalLink,
  Eye
} from 'lucide-react';

export const BrandingTab: React.FC = () => {
  const { branding, updateBranding, openCropper } = useStore();
  const [formData, setFormData] = useState<SiteBranding>({
    ...branding,
    logoText: branding.logoText || 'ABM'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const faviconFileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof SiteBranding, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const rawDataUrl = uploadEvent.target?.result as string;
      if (rawDataUrl) {
        // Open Cropper immediately so owner can crop the uploaded image
        openCropper({
          initialImageUrl: rawDataUrl,
          title: 'Crop & Refine In-App Site Logo',
          aspectRatioPreset: '1:1',
          outputWidth: 512,
          outputHeight: 512,
          onCropComplete: (croppedUrl) => {
            handleChange('logoUrl', croppedUrl);
          }
        });
      }
    };
    reader.readAsDataURL(file);
    // Reset file input so user can re-select same file if needed
    e.target.value = '';
  };

  const handleFaviconFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const rawDataUrl = uploadEvent.target?.result as string;
      if (rawDataUrl) {
        openCropper({
          initialImageUrl: rawDataUrl,
          title: 'Crop & Refine Favicon (1:1)',
          aspectRatioPreset: '1:1',
          outputWidth: 256,
          outputHeight: 256,
          onCropComplete: (croppedUrl) => {
            handleChange('faviconUrl', croppedUrl);
          }
        });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateBranding(formData);
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const activeLogoText = formData.logoText?.trim() || 'ABM';

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Site Branding & Top-Left Logo</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Customize in-app site logo, monogram text 'ABM', browser title, meta description, and legal branding.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-60 cursor-pointer"
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

      {/* Top-Left In-App Site Logo & Monogram (ABM) Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800/80 pb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-amber-500" />
              <span>In-App Site Logo (Top-Left Corner)</span>
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Edit the brand emblem placed in the top-left navigation corner with text '{activeLogoText}'.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="file" 
              ref={logoFileInputRef}
              onChange={handleLogoFileUpload}
              accept="image/*" 
              className="hidden" 
            />
            <button
              type="button"
              onClick={() => logoFileInputRef.current?.click()}
              className="px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-xl border border-amber-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload & Crop File</span>
            </button>
          </div>
        </div>

        {/* Live Top-Left Logo Corner Preview */}
        <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-neutral-500 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-amber-500" />
              <span>Live Navbar Brand Preview</span>
            </span>
            <span className="text-[11px] text-neutral-400 font-mono">
              Top-Left Header Display
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            {/* Light Mode Preview */}
            <div className="p-3 rounded-xl bg-white border border-neutral-200 shadow-sm flex items-center gap-2">
              <div className="px-3 py-1.5 h-10 rounded-xl bg-white text-neutral-950 border-2 border-neutral-200 shadow-sm flex items-center justify-center gap-2">
                {formData.logoUrl ? (
                  <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center bg-neutral-100">
                    <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-md bg-neutral-950 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-4 h-4">
                      <polygon points="50,8 92,50 50,92 8,50" fill="none" stroke="currentColor" className="text-white" strokeWidth="7" />
                      <circle cx="50" cy="50" r="15" fill="currentColor" className="text-rose-500" />
                    </svg>
                  </div>
                )}
                <span className="font-display font-black tracking-widest text-sm text-neutral-950 font-mono">
                  {activeLogoText}
                </span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">Light UI</span>
            </div>

            {/* Dark Mode Preview */}
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 shadow-sm flex items-center gap-2">
              <div className="px-3 py-1.5 h-10 rounded-xl bg-neutral-900 text-white border-2 border-neutral-800 shadow-sm flex items-center justify-center gap-2">
                {formData.logoUrl ? (
                  <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center bg-neutral-800">
                    <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-4 h-4">
                      <polygon points="50,8 92,50 50,92 8,50" fill="none" stroke="currentColor" className="text-neutral-950" strokeWidth="7" />
                      <circle cx="50" cy="50" r="15" fill="currentColor" className="text-rose-500" />
                    </svg>
                  </div>
                )}
                <span className="font-display font-black tracking-widest text-sm text-white font-mono">
                  {activeLogoText}
                </span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">Dark UI</span>
            </div>
          </div>
        </div>

        {/* Inputs & Controls for Logo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Top-Left Monogram Text (Default: ABM)
            </label>
            <input
              type="text"
              value={formData.logoText || ''}
              onChange={(e) => handleChange('logoText', e.target.value)}
              placeholder="ABM"
              className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm font-bold tracking-widest focus:outline-none focus:border-amber-500 font-mono"
            />
            <p className="text-[11px] text-neutral-500 mt-1">
              The short monogram text displayed next to the logo emblem in the top-left corner.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Hosted Image URL / Link
              </label>
              {formData.logoUrl && (
                <button
                  type="button"
                  onClick={() => {
                    openCropper({
                      initialImageUrl: formData.logoUrl,
                      title: 'Crop & Refine Brand Logo',
                      aspectRatioPreset: '1:1',
                      outputWidth: 512,
                      outputHeight: 512,
                      onCropComplete: (dataUrl) => {
                        handleChange('logoUrl', dataUrl);
                      }
                    });
                  }}
                  className="text-xs text-amber-500 hover:text-amber-400 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Crop className="w-3 h-3" />
                  <span>Crop Current</span>
                </button>
              )}
            </div>
            <input
              type="url"
              value={formData.logoUrl}
              onChange={(e) => handleChange('logoUrl', e.target.value)}
              placeholder="https://... (or upload from device above)"
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono focus:outline-none focus:border-amber-500"
            />
            <div className="flex items-center justify-between gap-2 mt-1.5">
              <span className="text-[11px] text-neutral-500">
                Paste direct URL or upload a file with the button above
              </span>
              {formData.logoUrl && (
                <button
                  type="button"
                  onClick={() => handleChange('logoUrl', '')}
                  className="text-xs text-red-500 hover:text-red-400 flex items-center gap-1 cursor-pointer"
                  title="Reset to default stylized vector emblem"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Reset to Vector</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Core Name & Taglines */}
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
              Short Site Moniker
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

      {/* Favicon Settings */}
      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800/80 pb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Browser Favicon (1:1 Square)
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              The icon displayed in web browser tabs and PWA bookmarks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="file" 
              ref={faviconFileInputRef}
              onChange={handleFaviconFileUpload}
              accept="image/*" 
              className="hidden" 
            />
            <button
              type="button"
              onClick={() => faviconFileInputRef.current?.click()}
              className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-bold rounded-xl border border-neutral-300 dark:border-neutral-700 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload & Crop Favicon</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Favicon URL
              </label>
              {formData.faviconUrl && (
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
                  className="text-xs text-amber-500 hover:text-amber-400 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Crop className="w-3.5 h-3.5" />
                  <span>Crop</span>
                </button>
              )}
            </div>
            <input
              type="url"
              value={formData.faviconUrl}
              onChange={(e) => handleChange('faviconUrl', e.target.value)}
              placeholder="https://... or /logo.png"
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          {formData.faviconUrl && (
            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center gap-3 border border-neutral-200 dark:border-neutral-700">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-1 flex items-center justify-center">
                <img src={formData.faviconUrl} alt="Favicon" className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-900 dark:text-white">Active Tab Favicon</p>
                <p className="text-[11px] text-neutral-500">256x256 Recommended</p>
              </div>
            </div>
          )}
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
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500"
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
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
