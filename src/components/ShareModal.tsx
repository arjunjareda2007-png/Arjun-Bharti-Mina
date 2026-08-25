import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  Download, 
  FileText, 
  FileCode, 
  Music, 
  Image as ImageIcon, 
  Radio, 
  Video, 
  ExternalLink,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { 
  downloadImage, 
  downloadTextFile, 
  generateLyricsPDF, 
  generateLyricsWordDoc, 
  shareFileOrLink 
} from '../utils/shareUtils';

export const ShareModal: React.FC = () => {
  const { shareData, closeShare, showToast } = useStore();
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  if (!shareData) return null;

  const targetUrl = shareData.url || window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    showToast('Link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyFormattedCard = () => {
    let fullText = `${shareData.title}\n${shareData.text}\n\n`;

    if (shareData.type === 'song' && shareData.streamingLinks) {
      fullText += `🎵 Listen across streaming platforms:\n`;
      if (shareData.streamingLinks.spotify) fullText += `• Spotify: ${shareData.streamingLinks.spotify}\n`;
      if (shareData.streamingLinks.youtube) fullText += `• YouTube Music: ${shareData.streamingLinks.youtube}\n`;
      if (shareData.streamingLinks.jiosaavn) fullText += `• JioSaavn: ${shareData.streamingLinks.jiosaavn}\n`;
      if (shareData.streamingLinks.gaana) fullText += `• Gaana: ${shareData.streamingLinks.gaana}\n`;
      if (shareData.streamingLinks.appleMusic) fullText += `• Apple Music: ${shareData.streamingLinks.appleMusic}\n`;
      fullText += `\n`;
    }

    if (shareData.type === 'lyrics' && shareData.lyricsText) {
      fullText += `📝 Lyrics:\n\n${shareData.lyricsText}\n\n`;
    }

    fullText += `Official ABM Hub: ${targetUrl}`;

    navigator.clipboard.writeText(fullText);
    setActionSuccess('card_copied');
    showToast('Full content card copied with all links!', 'success');
    setTimeout(() => setActionSuccess(null), 2500);
  };

  const handleDownloadImage = async () => {
    if (!shareData.imageUrl) return;
    setDownloading(true);
    const filename = shareData.downloadFilename || `${shareData.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_poster.jpg`;
    await downloadImage(shareData.imageUrl, filename);
    setDownloading(false);
    showToast('Image downloaded successfully!', 'success');
  };

  const handleDownloadLyricsPDF = () => {
    generateLyricsPDF({
      title: shareData.title,
      artist: shareData.artist || 'Arjun Bharti Mina',
      genre: shareData.genre,
      year: shareData.year,
      lyrics: shareData.lyricsText || shareData.text,
      meaning: shareData.meaning
    });
    showToast('Lyrics PDF generated & downloaded!', 'success');
  };

  const handleDownloadLyricsWord = () => {
    generateLyricsWordDoc({
      title: shareData.title,
      artist: shareData.artist || 'Arjun Bharti Mina',
      genre: shareData.genre,
      year: shareData.year,
      lyrics: shareData.lyricsText || shareData.text,
      meaning: shareData.meaning
    });
    showToast('Lyrics Word document (.doc) downloaded!', 'success');
  };

  const handleDownloadLyricsTxt = () => {
    const filename = `${shareData.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_lyrics.txt`;
    const content = `${shareData.title}\nArtist: ${shareData.artist || 'Arjun Bharti Mina'}\n\n${shareData.lyricsText || shareData.text}\n\n---\nExplore official tracks at: ${targetUrl}`;
    downloadTextFile(content, filename);
    showToast('Lyrics TXT file downloaded!', 'success');
  };

  const handleNativeDeviceShare = async () => {
    const shared = await shareFileOrLink({
      title: shareData.title,
      text: shareData.text,
      url: targetUrl,
      imageUrl: shareData.imageUrl,
      filename: shareData.downloadFilename || 'abm_share.jpg'
    });
    if (shared) {
      closeShare();
    }
  };

  // Build WhatsApp formatted message
  let waMessage = `*${shareData.title}*\n${shareData.text}\n\n`;
  if (shareData.type === 'song' && shareData.streamingLinks) {
    if (shareData.streamingLinks.spotify) waMessage += `🎧 Spotify: ${shareData.streamingLinks.spotify}\n`;
    if (shareData.streamingLinks.youtube) waMessage += `▶️ YouTube: ${shareData.streamingLinks.youtube}\n`;
    if (shareData.streamingLinks.jiosaavn) waMessage += `🎶 JioSaavn: ${shareData.streamingLinks.jiosaavn}\n`;
    waMessage += `\n`;
  }
  waMessage += `🔗 Explore: ${targetUrl}`;

  const shareTextEncoded = encodeURIComponent(waMessage);
  const shareUrlEncoded = encodeURIComponent(targetUrl);

  return (
    <div 
      id="share-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in"
      onClick={closeShare}
    >
      <div 
        id="share-modal-card"
        className="w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-950/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Share {shareData.type ? shareData.type.charAt(0).toUpperCase() + shareData.type.slice(1) : 'Content'}
              </h3>
              <p className="text-[10px] text-neutral-400 font-mono">Arjun Bharti Mina Hub</p>
            </div>
          </div>
          <button 
            onClick={closeShare} 
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Preview Card */}
          <div className="flex gap-4 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
            {shareData.imageUrl && (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-neutral-900 shrink-0 border border-neutral-200 dark:border-neutral-800">
                <img 
                  src={shareData.imageUrl} 
                  alt={shareData.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              {shareData.genre && (
                <span className="text-[10px] font-mono font-semibold uppercase text-amber-500">
                  {shareData.genre} {shareData.year ? `• ${shareData.year}` : ''}
                </span>
              )}
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white line-clamp-1">
                {shareData.title}
              </h4>
              {shareData.artist && (
                <p className="text-xs text-neutral-500 line-clamp-1">
                  By {shareData.artist}
                </p>
              )}
              <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">
                {shareData.text}
              </p>
            </div>
          </div>

          {/* Quick Copy Link Box */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-neutral-400 uppercase font-semibold block">
              Web & App Link
            </label>
            <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800/80 p-2 rounded-xl border border-neutral-200 dark:border-neutral-700/80">
              <input 
                type="text" 
                readOnly 
                value={targetUrl}
                className="flex-1 bg-transparent text-xs text-neutral-700 dark:text-neutral-300 focus:outline-none truncate font-mono px-1"
              />
              <button
                onClick={handleCopyLink}
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Type-Specific Smart Action Bars */}
          
          {/* 1. LYRICS ACTIONS: PDF / WORD / TXT */}
          {shareData.type === 'lyrics' && (
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Export & Share Full Lyrics</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={handleDownloadLyricsPDF}
                  className="px-3 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm"
                >
                  <FileText className="w-4 h-4 text-red-500" />
                  <span>Download PDF</span>
                </button>

                <button
                  onClick={handleDownloadLyricsWord}
                  className="px-3 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <FileCode className="w-4 h-4" />
                  <span>Word Document</span>
                </button>

                <button
                  onClick={handleDownloadLyricsTxt}
                  className="px-3 py-2.5 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Text (.txt)</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. IMAGE ACTIONS: Download / Share Image File */}
          {shareData.imageUrl && (
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-3">
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
                <span>Image & Artwork Tools</span>
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleDownloadImage}
                  disabled={downloading}
                  className="px-3 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloading ? 'Saving...' : 'Save JPG Image'}</span>
                </button>

                <button
                  onClick={handleCopyFormattedCard}
                  className="px-3 py-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                >
                  {actionSuccess === 'card_copied' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{actionSuccess === 'card_copied' ? 'Card Copied!' : 'Copy Caption'}</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. SONG STREAMING PLATFORMS LINKS */}
          {shareData.type === 'song' && shareData.streamingLinks && Object.values(shareData.streamingLinks).some(Boolean) && (
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block font-semibold">
                Included Streaming Platform Links
              </span>
              <div className="flex flex-wrap gap-2">
                {shareData.streamingLinks.spotify && (
                  <a
                    href={shareData.streamingLinks.spotify}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-[#1DB954]/10 text-[#1DB954] text-[11px] font-semibold flex items-center gap-1 hover:bg-[#1DB954]/20"
                  >
                    <Radio className="w-3 h-3" />
                    <span>Spotify</span>
                  </a>
                )}
                {shareData.streamingLinks.youtube && (
                  <a
                    href={shareData.streamingLinks.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-red-600/10 text-red-500 text-[11px] font-semibold flex items-center gap-1 hover:bg-red-600/20"
                  >
                    <Video className="w-3 h-3" />
                    <span>YouTube Music</span>
                  </a>
                )}
                {shareData.streamingLinks.jiosaavn && (
                  <a
                    href={shareData.streamingLinks.jiosaavn}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-emerald-600/10 text-emerald-500 text-[11px] font-semibold flex items-center gap-1 hover:bg-emerald-600/20"
                  >
                    <span>JioSaavn</span>
                  </a>
                )}
                {shareData.streamingLinks.gaana && (
                  <a
                    href={shareData.streamingLinks.gaana}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-rose-600/10 text-rose-500 text-[11px] font-semibold flex items-center gap-1 hover:bg-rose-600/20"
                  >
                    <span>Gaana</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Social Channels Share Grid */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-neutral-400 uppercase font-semibold block">
              Share Direct to Apps
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              <a
                href={`https://api.whatsapp.com/send?text=${shareTextEncoded}`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors text-center text-xs font-semibold border border-emerald-500/20"
              >
                <span>WhatsApp</span>
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.title)}&url=${shareUrlEncoded}`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 transition-colors text-center text-xs font-semibold border border-sky-500/20"
              >
                <span>X (Twitter)</span>
              </a>

              <a
                href={`https://t.me/share/url?url=${shareUrlEncoded}&text=${encodeURIComponent(shareData.title)}`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors text-center text-xs font-semibold border border-blue-500/20"
              >
                <span>Telegram</span>
              </a>

              <button
                onClick={handleNativeDeviceShare}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 transition-colors text-center text-xs font-semibold border border-amber-500/20"
              >
                <div className="flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Device</span>
                </div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
