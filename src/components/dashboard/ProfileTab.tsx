import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { UserProfile } from '../../types';
import { calculateAge } from '../../utils/helpers';
import { 
  User, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Mail, 
  Phone, 
  Globe, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Save,
  CheckCircle2,
  Image as ImageIcon,
  GraduationCap,
  Crop
} from 'lucide-react';

export const ProfileTab: React.FC = () => {
  const { profile, updateProfile, openCropper } = useStore();
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const dynamicAge = calculateAge(formData.dob);

  const handleChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEducationChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      education: {
        ...prev.education,
        [field]: value
      }
    }));
  };

  const handleStatsChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [field]: value
      }
    }));
  };

  const handlePrivacyToggle = (field: keyof NonNullable<UserProfile['privacy']>) => {
    setFormData(prev => ({
      ...prev,
      privacy: {
        showDOB: true,
        showBirthplace: true,
        showLocation: true,
        showEmail: true,
        showWhatsapp: true,
        showEducation: true,
        ...prev.privacy,
        [field]: !prev.privacy?.[field]
      }
    }));
  };

  const handleExtendedBioChange = (index: number, text: string) => {
    const updated = [...(formData.extendedBio || [])];
    updated[index] = text;
    setFormData(prev => ({ ...prev, extendedBio: updated }));
  };

  const addExtendedBioParagraph = () => {
    setFormData(prev => ({
      ...prev,
      extendedBio: [...(prev.extendedBio || []), '']
    }));
  };

  const removeExtendedBioParagraph = (index: number) => {
    setFormData(prev => ({
      ...prev,
      extendedBio: prev.extendedBio.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfile(formData);
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn max-w-4xl">
      {/* Header with Save Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-amber-500" />
            <span>Creator Profile Management</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Configure your personal identity, bio, credentials, and visibility controls.
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
              <span>Saved to Firestore!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </>
          )}
        </button>
      </div>

      {/* Profile Visuals & Live Previews */}
      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-amber-500" />
          <span>Visual Imagery & Brand Assets</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Photo */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Profile Photo URL
              </label>
              <button
                type="button"
                onClick={() => {
                  openCropper({
                    initialImageUrl: formData.profileImage,
                    title: 'Crop & Refine Profile Photo',
                    aspectRatioPreset: '1:1',
                    outputWidth: 800,
                    outputHeight: 800,
                    onCropComplete: (dataUrl) => {
                      handleChange('profileImage', dataUrl);
                    }
                  });
                }}
                className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-lg border border-amber-500/20 flex items-center gap-1 transition-colors"
              >
                <Crop className="w-3.5 h-3.5" />
                <span>Crop / Adjust Image</span>
              </button>
            </div>
            <input
              type="url"
              value={formData.profileImage}
              onChange={(e) => handleChange('profileImage', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-mono"
              placeholder="https://..."
            />
            <div className="flex items-center gap-4 pt-2">
              <img
                src={formData.profileImage}
                alt="Profile Preview"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/40 shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400';
                }}
              />
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">Live Preview (1:1 Ratio)</span>
                <p className="text-[11px] mt-0.5">Click "Crop / Adjust Image" to zoom, rotate, crop, or upload a custom file.</p>
              </div>
            </div>
          </div>

          {/* Hero Banner Image */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Hero Banner Image URL
              </label>
              <button
                type="button"
                onClick={() => {
                  openCropper({
                    initialImageUrl: formData.heroImage,
                    title: 'Crop & Refine Hero Banner',
                    aspectRatioPreset: '16:9',
                    outputWidth: 1600,
                    outputHeight: 900,
                    onCropComplete: (dataUrl) => {
                      handleChange('heroImage', dataUrl);
                    }
                  });
                }}
                className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-lg border border-amber-500/20 flex items-center gap-1 transition-colors"
              >
                <Crop className="w-3.5 h-3.5" />
                <span>Crop / Adjust Banner</span>
              </button>
            </div>
            <input
              type="url"
              value={formData.heroImage}
              onChange={(e) => handleChange('heroImage', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-mono"
              placeholder="https://..."
            />
            <div className="h-16 w-full rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700 relative">
              <img
                src={formData.heroImage}
                alt="Hero Banner Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                <span className="text-[10px] text-white/90 font-medium">Hero Background (16:9 Ratio)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Identity & Basic Information */}
      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Personal & Professional Identity
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Full Legal Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={formData.displayName || formData.name}
              onChange={(e) => handleChange('displayName', e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Artist / Short Moniker
            </label>
            <input
              type="text"
              value={formData.shortName}
              onChange={(e) => handleChange('shortName', e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Brand Acronym
            </label>
            <input
              type="text"
              value={formData.brandName}
              onChange={(e) => handleChange('brandName', e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Creator Username / Handle
            </label>
            <input
              type="text"
              value={formData.username || 'arjunbhartimina'}
              onChange={(e) => handleChange('username', e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Verification Badge Status
            </label>
            <button
              type="button"
              onClick={() => handleChange('isVerified', !formData.isVerified)}
              className={`w-full px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-colors ${
                formData.isVerified
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400'
                  : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-500'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{formData.isVerified ? 'Official Verified Creator' : 'Unverified'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Age Calculation & DOB */}
        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/60 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-500" />
                <span>Date of Birth & Dynamic Age Calculator</span>
              </label>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Age is calculated automatically based on system date.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono font-bold text-xs">
                Current Age: {dynamicAge} Years Old
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                Date of Birth (YYYY-MM-DD)
              </label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => handleChange('dob', e.target.value)}
                className="w-full px-3.5 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                Birthplace
              </label>
              <input
                type="text"
                value={formData.birthplace}
                onChange={(e) => handleChange('birthplace', e.target.value)}
                className="w-full px-3.5 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                Current Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full px-3.5 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Tagline & Subtitle */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Professional Tagline (Full)
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Short Hero Sub-Tagline
            </label>
            <input
              type="text"
              value={formData.subTagline}
              onChange={(e) => handleChange('subTagline', e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Bio & Long Biography */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Short Introduction Bio
            </label>
            <textarea
              rows={2}
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Extended Biography (Paragraphs)
              </label>
              <button
                type="button"
                onClick={addExtendedBioParagraph}
                className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline"
              >
                + Add Paragraph
              </button>
            </div>
            <div className="space-y-3">
              {formData.extendedBio?.map((para, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-xs font-mono text-neutral-400 mt-3">{idx + 1}.</span>
                  <textarea
                    rows={3}
                    value={para}
                    onChange={(e) => handleExtendedBioChange(idx, e.target.value)}
                    className="flex-1 px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  />
                  {(formData.extendedBio?.length ?? 0) > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExtendedBioParagraph(idx)}
                      className="text-xs text-red-500 hover:text-red-600 mt-3 p-1"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Education Credentials */}
      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-amber-500" />
          <span>Academic & Engineering Degree</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Degree Title
            </label>
            <input
              type="text"
              value={formData.education.degree}
              onChange={(e) => handleEducationChange('degree', e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Field of Specialization
            </label>
            <input
              type="text"
              value={formData.education.field}
              onChange={(e) => handleEducationChange('field', e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              College / Institute
            </label>
            <input
              type="text"
              value={formData.education.college}
              onChange={(e) => handleEducationChange('college', e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Tenure Period
            </label>
            <input
              type="text"
              value={formData.education.period}
              onChange={(e) => handleEducationChange('period', e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Status
            </label>
            <input
              type="text"
              value={formData.education.status}
              onChange={(e) => handleEducationChange('status', e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Contact & Platform Statistics */}
      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Contact Channels & Platform Stats
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Public Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              WhatsApp Channel / Number
            </label>
            <input
              type="text"
              value={formData.whatsappNumber}
              onChange={(e) => handleChange('whatsappNumber', e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Website URL
            </label>
            <input
              type="text"
              value={formData.website || ''}
              onChange={(e) => handleChange('website', e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm font-mono"
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Monthly Listeners Stat
            </label>
            <input
              type="text"
              value={formData.stats.monthlyListeners || ''}
              onChange={(e) => handleStatsChange('monthlyListeners', e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm"
              placeholder="25.4K+"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Total Streams Stat
            </label>
            <input
              type="text"
              value={formData.stats.totalStreams || ''}
              onChange={(e) => handleStatsChange('totalStreams', e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm"
              placeholder="380K+"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              YouTube Subscribers Stat
            </label>
            <input
              type="text"
              value={formData.stats.youtubeSubs || ''}
              onChange={(e) => handleStatsChange('youtubeSubs', e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm"
              placeholder="12.8K+"
            />
          </div>
        </div>
      </div>

      {/* Privacy & Visibility Controls */}
      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-500" />
          <span>Public Privacy & Visibility Toggles</span>
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Choose which sensitive identity elements are visible to public visitors versus hidden.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          {[
            { key: 'showDOB', label: 'Show DOB & Age' },
            { key: 'showBirthplace', label: 'Show Birthplace' },
            { key: 'showLocation', label: 'Show Location' },
            { key: 'showEmail', label: 'Show Email' },
            { key: 'showWhatsapp', label: 'Show WhatsApp' },
            { key: 'showEducation', label: 'Show Education' }
          ].map((item) => {
            const isVisible = formData.privacy?.[item.key as keyof NonNullable<UserProfile['privacy']>] !== false;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handlePrivacyToggle(item.key as keyof NonNullable<UserProfile['privacy']>)}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-colors ${
                  isVisible
                    ? 'bg-amber-500/10 border-amber-500/30 text-neutral-900 dark:text-white'
                    : 'bg-neutral-50 dark:bg-neutral-800/40 border-neutral-200 dark:border-neutral-800 text-neutral-400'
                }`}
              >
                <span>{item.label}</span>
                {isVisible ? (
                  <Eye className="w-4 h-4 text-amber-500" />
                ) : (
                  <EyeOff className="w-4 h-4 text-neutral-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </form>
  );
};
