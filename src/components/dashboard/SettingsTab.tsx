import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Settings, 
  Download, 
  Upload, 
  RotateCcw, 
  Database, 
  ShieldCheck, 
  FileJson, 
  AlertTriangle,
  CheckCircle2,
  Lock,
  Check,
  Sparkles,
  Shield
} from 'lucide-react';
import { isClerkKeyConfigured } from '../../clerkConfig';

export const SettingsTab: React.FC = () => {
  const { 
    exportWebsiteData, 
    importWebsiteData, 
    resetAllData, 
    authUser, 
    isOwner, 
    showToast 
  } = useStore();

  const [importJsonText, setImportJsonText] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleExport = () => {
    const jsonString = exportWebsiteData();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arjun-bharti-mina-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Exported complete website backup JSON file');
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importWebsiteData(content);
      }
    };
    reader.readAsText(file);
  };

  const handleTextImport = () => {
    if (!importJsonText.trim()) return;
    const success = importWebsiteData(importJsonText);
    if (success) {
      setImportJsonText('');
    }
  };

  const isClerkActive = isClerkKeyConfigured();

  return (
    <div className="space-y-8 animate-fadeIn max-w-3xl">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-500" />
            <span>Settings, Security & System Backups</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Export JSON backups, restore archives, manage database connection, and creator access.
          </p>
        </div>
      </div>

      {/* Cloud & Security Status Card */}
      <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
          <Database className="w-4 h-4 text-amber-500" />
          <span>Cloud Database & Account Status</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 space-y-1">
            <div className="text-[11px] text-neutral-500 font-semibold">Active Session</div>
            <div className="text-xs font-mono font-bold text-neutral-900 dark:text-white truncate">
              {authUser?.email || authUser?.fullName || 'Guest User'}
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium pt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Owner Access Level: {isOwner ? 'Full Administrative Rights' : 'Visitor Read-Only'}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 space-y-1">
            <div className="text-[11px] text-neutral-500 font-semibold">Firestore Cloud Sync</div>
            <div className="text-xs font-mono font-bold text-neutral-900 dark:text-white">
              Project: first-bucksaw-p5xj8
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium pt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Real-Time Cloud Persistence Connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Authentication System */}
      <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>Identity & Access Security</span>
          </h3>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
            isClerkActive 
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
          }`}>
            {isClerkActive ? '● Clerk Production Secure' : '○ Standalone Auth'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/60 space-y-1">
            <div className="text-neutral-400 text-[11px] font-mono">Sign-In Verification Strategy</div>
            <div className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span>Password Authentication</span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 pt-0.5">
              Direct sign-in using account passwords. Email verification codes are only required when creating new accounts.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/60 space-y-1">
            <div className="text-neutral-400 text-[11px] font-mono">Creator Whitelist Protection</div>
            <div className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-500" />
              <span>Restricted Owner Emails</span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 pt-0.5 font-mono">
              arjunjareda1355@gmail.com, arjunjareda2007@gmail.com
            </p>
          </div>
        </div>
      </div>

      {/* Export / Import Section */}
      <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-6">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
            <FileJson className="w-4 h-4 text-amber-500" />
            <span>Complete Website JSON Backup & Restore</span>
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Download a complete snapshot of all songs, lyrics, gallery photos, projects, and site settings.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleExport}
            className="flex-1 py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 font-bold text-xs rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Export Complete JSON Backup</span>
          </button>

          <label className="flex-1 py-3 px-4 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-neutral-800 dark:text-neutral-200 font-semibold text-xs rounded-2xl border border-neutral-300 dark:border-neutral-700 flex items-center justify-center gap-2 cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            <span>Restore from File (.json)</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>
        </div>

        <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            Or Paste JSON Backup String Directly:
          </label>
          <textarea
            rows={3}
            value={importJsonText}
            onChange={(e) => setImportJsonText(e.target.value)}
            placeholder='{"version": "2.0.0", "profile": { ... }}'
            className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono"
          />
          <button
            onClick={handleTextImport}
            disabled={!importJsonText.trim()}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl disabled:opacity-40"
          >
            Import JSON Data
          </button>
        </div>
      </div>

      {/* Danger Zone: Factory Reset */}
      <div className="p-6 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-3xl space-y-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-red-900 dark:text-red-300">
              Factory Reset Website Data
            </h3>
            <p className="text-xs text-red-700/80 dark:text-red-400/80">
              Reset all discography, images, biography, and settings back to Arjun's initial master templates.
            </p>
          </div>
        </div>

        {showResetConfirm ? (
          <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-red-300 dark:border-red-800 space-y-3">
            <p className="text-xs font-bold text-neutral-900 dark:text-white">
              Are you absolutely sure you want to reset all content back to factory defaults?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  resetAllData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl"
              >
                Yes, Reset Everything
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2.5 bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white border border-red-600/30 text-xs font-bold rounded-xl transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Content to Factory Defaults</span>
          </button>
        )}
      </div>
    </div>
  );
};
