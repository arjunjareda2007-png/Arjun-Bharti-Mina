import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Copy, Check, Share2 } from 'lucide-react';

export const ShareModal: React.FC = () => {
  const { shareData, closeShare } = useStore();
  const [copied, setCopied] = useState(false);

  if (!shareData) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareData.url || window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = encodeURIComponent(`${shareData.title} - ${shareData.text}`);
  const shareUrl = encodeURIComponent(shareData.url || window.location.href);

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareData.title,
          text: shareData.text,
          url: shareData.url || window.location.href,
        });
        closeShare();
      } catch {
        // Fallback
      }
    }
  };

  return (
    <div 
      id="share-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
      onClick={closeShare}
    >
      <div 
        id="share-modal-card"
        className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Share Content</h3>
          </div>
          <button onClick={closeShare} className="p-1 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4">
          <h4 className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">{shareData.title}</h4>
          <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2">{shareData.text}</p>
          
          {/* Quick Copy Link Box */}
          <div className="mt-4 flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 p-2 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <input 
              type="text" 
              readOnly 
              value={shareData.url || window.location.href}
              className="flex-1 bg-transparent text-xs text-neutral-600 dark:text-neutral-300 focus:outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-medium flex items-center gap-1.5 hover:bg-amber-600 transition-colors flex-shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          {/* Social Channels */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <a
              href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors text-center text-xs font-medium"
            >
              <span>WhatsApp</span>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 transition-colors text-center text-xs font-medium"
            >
              <span>X (Twitter)</span>
            </a>
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={nativeShare}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 transition-colors text-center text-xs font-medium"
              >
                <span>Device Share</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
