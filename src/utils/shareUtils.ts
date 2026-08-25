import { jsPDF } from 'jspdf';
import { Song, LyricItem, GalleryItem, VideoItem, ProjectItem, BookItem } from '../types';

/**
 * Downloads a text content as a file with the specified filename and MIME type.
 */
export function downloadTextFile(content: string, filename: string, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads an image from a URL or Blob.
 */
export async function downloadImage(imageUrl: string, filename: string) {
  try {
    const res = await fetch(imageUrl, { mode: 'cors' });
    if (!res.ok) throw new Error('Fetch failed');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.jpg') || filename.endsWith('.png') ? filename : `${filename}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch {
    // Direct link fallback
    const link = document.createElement('a');
    link.href = imageUrl;
    link.target = '_blank';
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return false;
  }
}

/**
 * Generates and downloads a polished PDF document for Song Lyrics.
 */
export function generateLyricsPDF(lyric: LyricItem | { title: string; artist: string; year?: number; genre?: string; lyrics: string; meaning?: string }) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  // Background Header Banner
  doc.setFillColor(15, 15, 15);
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Accent Line
  doc.setFillColor(245, 158, 11); // Amber-500
  doc.rect(0, 42, pageWidth, 2, 'F');

  // Header Typography
  doc.setTextColor(245, 158, 11);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('ARJUN BHARTI MINA  •  OFFICIAL LYRIC SHEET', margin, 16);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text(lyric.title || 'Untitled Track', margin, 26);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(200, 200, 200);
  const subtitle = `Artist & Lyricist: ${lyric.artist || 'Arjun Bharti Mina'}   |   Genre: ${lyric.genre || 'Desi Hip-Hop'}   |   Year: ${lyric.year || new Date().getFullYear()}`;
  doc.text(subtitle, margin, 34);

  let currentY = 54;

  // Song Meaning / Concept Box
  if (lyric.meaning) {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    const meaningLines = doc.splitTextToSize(`Concept & Notes: ${lyric.meaning}`, contentWidth - 10);
    const boxHeight = (meaningLines.length * 5) + 8;
    doc.roundedRect(margin, currentY, contentWidth, boxHeight, 3, 3, 'FD');
    
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(meaningLines, margin + 5, currentY + 6);
    currentY += boxHeight + 8;
  }

  // Section: Official Lyrics
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('LYRICS', margin, currentY);
  currentY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);

  const rawLyrics = lyric.lyrics || 'No lyrics available.';
  const blocks = rawLyrics.split('\n\n');

  for (const block of blocks) {
    const lines = doc.splitTextToSize(block, contentWidth);
    const blockHeight = lines.length * 5.5;

    // Page break handling
    if (currentY + blockHeight > pageHeight - 25) {
      // Add footer to current page
      addFooter(doc, pageWidth, pageHeight);
      doc.addPage();
      currentY = 25;
    }

    doc.text(lines, margin, currentY);
    currentY += blockHeight + 6;
  }

  // Final Footer
  addFooter(doc, pageWidth, pageHeight);

  // Save the PDF
  const cleanTitle = (lyric.title || 'lyrics').toLowerCase().replace(/[^a-z0-9]/g, '_');
  doc.save(`${cleanTitle}_lyrics_ABM.pdf`);
}

function addFooter(doc: jsPDF, pageWidth: number, pageHeight: number) {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.setDrawColor(226, 232, 240);
  doc.line(20, pageHeight - 14, pageWidth - 20, pageHeight - 14);
  doc.text('© Arjun Bharti Mina Archive. All rights reserved.', 20, pageHeight - 9);
  doc.text('Listen & Explore: https://arjunbhartimina.com', pageWidth - 20, pageHeight - 9, { align: 'right' });
}

/**
 * Generates and downloads a formatted Microsoft Word document (.doc) for Lyrics.
 */
export function generateLyricsWordDoc(lyric: LyricItem | { title: string; artist: string; year?: number; genre?: string; lyrics: string; meaning?: string }) {
  const cleanTitle = lyric.title || 'Song Lyrics';
  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${cleanTitle} - Lyrics</title>
      <style>
        body { font-family: 'Calibri', 'Arial', sans-serif; margin: 40px; color: #1e293b; line-height: 1.6; }
        .header { border-bottom: 2px solid #f59e0b; padding-bottom: 12px; margin-bottom: 20px; }
        .brand { font-size: 11pt; font-weight: bold; color: #f59e0b; text-transform: uppercase; letter-spacing: 1px; }
        h1 { font-size: 22pt; margin: 6px 0; color: #0f172a; }
        .meta { font-size: 10pt; color: #64748b; margin-bottom: 16px; }
        .meaning-box { background: #f8fafc; border-left: 4px solid #f59e0b; padding: 12px; margin: 16px 0; font-style: italic; font-size: 10pt; }
        .lyrics-section { font-size: 11pt; line-height: 1.8; margin-top: 20px; }
        .verse { margin-bottom: 16px; }
        .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 10px; font-size: 9pt; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="brand">Arjun Bharti Mina • Official Archive</div>
        <h1>${cleanTitle}</h1>
        <div class="meta">
          <strong>Artist / Lyricist:</strong> ${lyric.artist || 'Arjun Bharti Mina'} &nbsp;|&nbsp; 
          <strong>Genre:</strong> ${lyric.genre || 'Desi Hip-Hop'} &nbsp;|&nbsp; 
          <strong>Year:</strong> ${lyric.year || new Date().getFullYear()}
        </div>
      </div>

      ${lyric.meaning ? `<div class="meaning-box"><strong>Concept & Meaning:</strong> ${lyric.meaning}</div>` : ''}

      <h3>Official Lyrics</h3>
      <div class="lyrics-section">
        ${(lyric.lyrics || '')
          .split('\n\n')
          .map(verse => `<div class="verse">${verse.replace(/\n/g, '<br/>')}</div>`)
          .join('')}
      </div>

      <div class="footer">
        <p>© ${new Date().getFullYear()} Arjun Bharti Mina. All rights reserved.</p>
        <p>Explore more music and official releases at <a href="${window.location.origin}">${window.location.origin}</a></p>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword;charset=utf-8'
  });

  const fileSlug = cleanTitle.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileSlug}_lyrics_ABM.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Native file share helper for Web Share API Level 2 (files sharing).
 */
export async function shareFileOrLink(options: {
  title: string;
  text: string;
  url: string;
  imageUrl?: string;
  filename?: string;
}) {
  const { title, text, url, imageUrl, filename = 'abm_media.jpg' } = options;

  // Try file sharing if imageUrl is present and supported
  if (imageUrl && navigator.canShare && typeof File !== 'undefined') {
    try {
      const res = await fetch(imageUrl, { mode: 'cors' });
      if (res.ok) {
        const blob = await res.blob();
        const file = new File([blob], filename, { type: blob.type || 'image/jpeg' });
        
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title,
            text: `${title}\n\n${text}\n\nApp: ${url}`,
            files: [file]
          });
          return true;
        }
      }
    } catch (e) {
      console.log('File sharing skipped, falling back to URL share:', e);
    }
  }

  // Fallback to standard navigator.share
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url
      });
      return true;
    } catch {
      return false;
    }
  }

  return false;
}
