import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { FeaturedIcon } from '../types';
import { 
  X, 
  Plus, 
  ExternalLink, 
  Image as ImageIcon, 
  Sparkles, 
  Trash2, 
  Save, 
  Globe, 
  Check, 
  Upload,
  Layers,
  Tag
} from 'lucide-react';
import { hapticMedium, hapticLight } from '../utils/haptics';

interface AddEditFeaturedIconModalProps {
  isOpen: boolean;
  onClose: () => void;
  iconToEdit?: FeaturedIcon | null;
}

// Popular platform presets with clean icon URLs and default labels
export const ICON_PRESETS = [
  {
    title: 'Spotify',
    iconImage: 'https://cdn.simpleicons.org/spotify/1DB954',
    defaultUrl: 'https://open.spotify.com/artist/',
    subtitle: 'Stream Music',
    badge: 'Music',
    category: 'Streaming'
  },
  {
    title: 'Apple Music',
    iconImage: 'https://cdn.simpleicons.org/applemusic/FA243C',
    defaultUrl: 'https://music.apple.com/artist/',
    subtitle: 'Spatial Audio',
    badge: 'Lossless',
    category: 'Streaming'
  },
  {
    title: 'YouTube',
    iconImage: 'https://cdn.simpleicons.org/youtube/FF0000',
    defaultUrl: 'https://youtube.com/@',
    subtitle: 'Official Channel',
    badge: 'Videos',
    category: 'Visuals'
  },
  {
    title: 'JioSaavn',
    iconImage: 'https://cdn.simpleicons.org/jiosaavn/2BC5B4',
    defaultUrl: 'https://jiosaavn.com/artist/',
    subtitle: 'Desi Grooves',
    badge: 'Verified',
    category: 'Streaming'
  },
  {
    title: 'Play Books',
    iconImage: 'https://cdn.simpleicons.org/googleplay/0086F8',
    defaultUrl: 'https://play.google.com/store/books/author?id=',
    subtitle: 'Published Books',
    badge: 'Author',
    category: 'Literature'
  },
  {
    title: 'Instagram',
    iconImage: 'https://cdn.simpleicons.org/instagram/E4405F',
    defaultUrl: 'https://instagram.com/',
    subtitle: 'Stories & Drops',
    badge: 'Social',
    category: 'Community'
  },
  {
    title: 'GitHub',
    iconImage: 'https://cdn.simpleicons.org/github/FFFFFF',
    defaultUrl: 'https://github.com/',
    subtitle: 'Code Projects',
    badge: 'Dev',
    category: 'Tech'
  },
  {
    title: 'LinkedIn',
    iconImage: 'https://cdn.simpleicons.org/linkedin/0A66C2',
    defaultUrl: 'https://linkedin.com/in/',
    subtitle: 'Professional Bio',
    badge: 'Career',
    category: 'Career'
  },
  {
    title: 'Amazon Music',
    iconImage: 'https://cdn.simpleicons.org/amazon/FF9900',
    defaultUrl: 'https://music.amazon.in/artists/',
    subtitle: 'HD Streaming',
    badge: 'HD',
    category: 'Streaming'
  },
  {
    title: 'SoundCloud',
    iconImage: 'https://cdn.simpleicons.org/soundcloud/FF5500',
    defaultUrl: 'https://soundcloud.com/',
    subtitle: 'Demos & Cyphers',
    badge: 'Audio',
    category: 'Music'
  },
  {
    title: 'X (Twitter)',
    iconImage: 'https://cdn.simpleicons.org/x/FFFFFF',
    defaultUrl: 'https://x.com/',
    subtitle: 'Thoughts & Drops',
    badge: 'Active',
    category: 'Community'
  },
  {
    title: 'Discord',
    iconImage: 'https://cdn.simpleicons.org/discord/5865F2',
    defaultUrl: 'https://discord.gg/',
    subtitle: 'Fan Community',
    badge: 'Chat',
    category: 'Community'
  },
  {
    title: 'WhatsApp',
    iconImage: 'https://cdn.simpleicons.org/whatsapp/25D366',
    defaultUrl: 'https://whatsapp.com/channel/',
    subtitle: 'Direct Broadcasts',
    badge: 'VIP',
    category: 'Community'
  },
  {
    title: 'Behance',
    iconImage: 'https://cdn.simpleicons.org/behance/1769FF',
    defaultUrl: 'https://behance.net/',
    subtitle: 'Design Folio',
    badge: 'Design',
    category: 'Portfolio'
  }
];

export const AddEditFeaturedIconModal: React.FC<AddEditFeaturedIconModalProps> = ({
  isOpen,
  onClose,
  iconToEdit
}) => {
  const { addFeaturedIcon, updateFeaturedIcon, deleteFeaturedIcon, featuredIcons, openCropper } = useStore();

  const [title, setTitle] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [iconImage, setIconImage] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [badge, setBadge] = useState('');
  const [category, setCategory] = useState('Streaming');
  const [openInNewTab, setOpenInNewTab] = useState(true);
  const [visible, setVisible] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (iconToEdit) {
      setTitle(iconToEdit.title || '');
      setRedirectUrl(iconToEdit.redirectUrl || '');
      setIconImage(iconToEdit.iconImage || '');
      setSubtitle(iconToEdit.subtitle || '');
      setBadge(iconToEdit.badge || '');
      setCategory(iconToEdit.category || 'Streaming');
      setOpenInNewTab(iconToEdit.openInNewTab !== false);
      setVisible(iconToEdit.visible !== false);
    } else {
      setTitle('');
      setRedirectUrl('https://');
      setIconImage('https://cdn.simpleicons.org/spotify/1DB954');
      setSubtitle('Stream Music');
      setBadge('Featured');
      setCategory('Streaming');
      setOpenInNewTab(true);
      setVisible(true);
    }
    setImgError(false);
  }, [iconToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: typeof ICON_PRESETS[0]) => {
    hapticLight();
    setTitle(preset.title);
    setIconImage(preset.iconImage);
    if (!redirectUrl || redirectUrl === 'https://' || redirectUrl.length < 10) {
      setRedirectUrl(preset.defaultUrl);
    }
    setSubtitle(preset.subtitle);
    setBadge(preset.badge);
    setCategory(preset.category);
    setImgError(false);
  };

  const handleUploadImage = () => {
    openCropper({
      initialImageUrl: iconImage,
      title: 'Crop & Optimize Icon Image',
      aspectRatioPreset: '1:1',
      outputWidth: 256,
      outputHeight: 256,
      onCropComplete: (dataUrl) => {
        setIconImage(dataUrl);
        setImgError(false);
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !redirectUrl.trim()) return;

    setIsSubmitting(true);
    hapticMedium();

    const finalIcon: FeaturedIcon = {
      id: iconToEdit?.id || `feat-icon-${Date.now()}`,
      title: title.trim(),
      redirectUrl: redirectUrl.trim(),
      iconImage: iconImage.trim() || 'https://cdn.simpleicons.org/safari/000000',
      subtitle: subtitle.trim(),
      badge: badge.trim(),
      category: category.trim(),
      displayOrder: iconToEdit?.displayOrder || featuredIcons.length + 1,
      openInNewTab,
      visible
    };

    if (iconToEdit) {
      await updateFeaturedIcon(finalIcon);
    } else {
      await addFeaturedIcon(finalIcon);
    }

    setIsSubmitting(false);
    onClose();
  };

  const handleDelete = async () => {
    if (!iconToEdit) return;
    if (window.confirm(`Are you sure you want to remove the "${iconToEdit.title}" featured icon?`)) {
      hapticMedium();
      await deleteFeaturedIcon(iconToEdit.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 text-white rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight font-display text-white">
                {iconToEdit ? 'Edit Featured Icon' : 'Add New Featured Icon'}
              </h3>
              <p className="text-xs text-neutral-400">
                Configure icon image and destination redirect link
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets Picker */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold flex items-center justify-between">
            <span>Quick 1-Click Platform Presets</span>
            <span className="text-[10px] text-amber-400">Tap to autofill</span>
          </label>
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-neutral-950/60 border border-neutral-800/80 rounded-2xl">
            {ICON_PRESETS.map((preset) => (
              <button
                key={preset.title}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  title === preset.title
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white'
                }`}
              >
                <img 
                  src={preset.iconImage} 
                  alt={preset.title} 
                  className="w-3.5 h-3.5 object-contain"
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
                <span>{preset.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Platform / Icon Title <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Spotify, Apple Music"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Category Tag
              </label>
              <input
                type="text"
                placeholder="e.g. Streaming, Literature, Tech"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-neutral-300 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Redirect Destination URL */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1 flex items-center justify-between">
              <span>Redirect Link (Opens in New Tab) <span className="text-amber-400">*</span></span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
            </label>
            <input
              type="url"
              required
              placeholder="https://..."
              value={redirectUrl}
              onChange={(e) => setRedirectUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm font-mono text-amber-300 focus:outline-none focus:border-amber-500"
            />
            <p className="text-[11px] text-neutral-400 mt-1">
              When visitors click this icon on your homepage, they will immediately be taken to this link.
            </p>
          </div>

          {/* Icon Image URL & Upload */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-neutral-300">
              Icon Image URL or Upload Custom Logo
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://... or image link"
                value={iconImage}
                onChange={(e) => {
                  setIconImage(e.target.value);
                  setImgError(false);
                }}
                className="flex-1 px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-neutral-300 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleUploadImage}
                className="px-3.5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors border border-neutral-700"
                title="Crop & Upload Custom Image"
              >
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Upload</span>
              </button>
            </div>
          </div>

          {/* Subtitle & Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Subtitle / Description (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Stream Vault, Listen Free"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-300 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Badge / Tag (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Verified, Official, HD"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs uppercase font-mono text-neutral-300 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="p-3.5 bg-neutral-950 rounded-2xl border border-neutral-800/80 space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
              Live Preview in Strip
            </span>
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900 border border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700/80 p-2 flex items-center justify-center shrink-0">
                  {iconImage && !imgError ? (
                    <img 
                      src={iconImage} 
                      alt={title || 'Icon'} 
                      className="w-full h-full object-contain filter drop-shadow"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <Globe className="w-5 h-5 text-amber-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {title || 'Icon Title'}
                    </span>
                    {badge && (
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    {subtitle || redirectUrl || 'https://...'}
                  </p>
                </div>
              </div>

              <div className="w-7 h-7 rounded-lg bg-neutral-800 text-neutral-400 flex items-center justify-center">
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              </div>
            </div>
          </div>

          {/* Visibility toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
            <div>
              <span className="text-xs font-semibold text-neutral-200 block">Show on Homepage Strip</span>
              <span className="text-[10px] text-neutral-400">Toggle whether this icon is active on the homepage</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={visible} 
                onChange={(e) => setVisible(e.target.checked)} 
                className="sr-only peer" 
              />
              <div className="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-neutral-800">
            {iconToEdit ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/60 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-neutral-700 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{iconToEdit ? 'Update Icon' : 'Save & Add Icon'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
