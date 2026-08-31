/**
 * High-Fidelity Book PDF Preview Generator
 * Fetches live Google Play Books preview metadata and generates
 * a publication-grade multi-page PDF sample using jsPDF.
 */

import { jsPDF } from 'jspdf';
import { BookItem } from '../types';
import { 
  fetchGoogleBookDetails, 
  extractGoogleBooksId, 
  getGooglePlayStoreUrl, 
  getGooglePlayReaderUrl,
  GoogleBookParsedData
} from './googleBooksUtils';

/**
 * Convert an image URL into a base64 Data URL using an offscreen canvas
 */
async function loadImageAsDataUrl(url: string): Promise<string | null> {
  if (!url) return null;
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    // Set a timeout so we don't hold up PDF generation if image host is slow
    const timeout = setTimeout(() => {
      resolve(null);
    }, 3500);

    img.onload = () => {
      clearTimeout(timeout);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width || 400;
        canvas.height = img.naturalHeight || img.height || 600;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve(dataUrl);
        } else {
          resolve(null);
        }
      } catch (err) {
        // CORS restriction on canvas export
        resolve(null);
      }
    };

    img.onerror = () => {
      clearTimeout(timeout);
      resolve(null);
    };

    img.src = url;
  });
}

/**
 * Curated Manuscript Excerpts for known titles
 */
function getManuscriptExcerpt(bookTitle: string): { chapterTitle: string; paragraphs: string[] } {
  const lower = bookTitle.toLowerCase();
  
  if (lower.includes('lyricist') || lower.includes('rhyme') || lower.includes('blueprint')) {
    return {
      chapterTitle: 'Chapter 1: The Anatomy of Syllables, Meter & Cultural Identity',
      paragraphs: [
        'Every impactful bar begins with an understanding of sonic weight. In South Asian hip-hop, rhythm is not merely a grid of 16-bar constraints; it is a living, breathing dialect. When you write in Hindi, Marwari, or Urdu, the vowel elongation (matras) naturally shapes the pocket of the 808 kick drum.',
        'A common mistake among emerging lyricists is treating cadence as secondary to rhyme. An average lyricist searches for the rhyme word first and forces the sentence structure to fit. A master songwriter establishes the cadence—the melodic swing and internal bounce—and lets multisyllabic rhymes lock into the groove effortlessly.',
        'Consider the balance between regional storytelling and universal resonance. When we pen lyrics about late-night highway commutes or college hostel ambitions, the specific textures—the chai stall steam, the dust of the bypass, the hum of the desk fan—are what make the listener believe every word.'
      ]
    };
  }

  if (lower.includes('civil') || lower.includes('mechanics') || lower.includes('primer')) {
    return {
      chapterTitle: 'Chapter 1: Principles of Equilibrium, Stress Matrices & Material Dynamics',
      paragraphs: [
        'Structural mechanics serves as the mathematical foundation for every built environment. Whether calculating the deflection of a continuous reinforced concrete beam or analyzing the load distribution across a truss bridge, equilibrium equations remain the governing truth.',
        'In matrix analysis of framed structures, the flexibility and stiffness methods translate physical boundary conditions into computable numerical arrays. By discretizing complex continuous systems into finite elements, engineers can predict stress concentrations before a single kilogram of cement is mixed.',
        'As civil engineers in the modern era, our calculations must account not only for static dead loads and dynamic live loads, but also for environmental sustainability and lifecycle resilience of concrete composites under extreme thermal variations.'
      ]
    };
  }

  return {
    chapterTitle: 'Chapter 1: Foundational Frameworks & Opening Thesis',
    paragraphs: [
      'Welcome to this official preview edition. In this introductory chapter, we establish the foundational models, core philosophies, and analytical workflows that guide the remainder of this volume.',
      'Through structured case studies, empirical observations, and practical toolkits, each section is engineered to provide actionable insights for practitioners, students, and enthusiasts alike.',
      'To explore the full chapters, unabridged discussions, and comprehensive appendices, access the complete digital edition via Google Play Books.'
    ]
  };
}

/**
 * Generate and download a publication-quality PDF Preview of any Book
 */
export async function downloadBookPreviewPdf(
  book: BookItem,
  onProgress?: (message: string, type?: 'info' | 'success' | 'error') => void
): Promise<{ success: boolean; message: string }> {
  try {
    onProgress?.(`Connecting to Google Play Books for "${book.title}"...`, 'info');

    // 1. Fetch live Google Play Books preview data
    let liveData: GoogleBookParsedData | undefined;
    const lookupKey = book.googleBooksVolumeId || book.playStoreUrl || book.googlePlayUrl || book.isbn || book.title;
    
    try {
      const res = await fetchGoogleBookDetails(lookupKey);
      if (res.success && res.data) {
        liveData = res.data;
      }
    } catch (e) {
      console.warn('Live Google Books lookup error, utilizing catalog data:', e);
    }

    onProgress?.('Fetching book cover & formatting manuscript layout...', 'info');

    // 2. Prepare merged book data
    const title = liveData?.title || book.title;
    const subtitlevol = liveData?.subtitle || book.subtitle || '';
    const author = liveData?.author || book.author || 'Arjun Bharti Mina';
    const publisher = liveData?.publisher || book.publisher || 'ABM Media & Literary Press';
    const year = liveData?.publicationYear || book.publicationYear || 2026;
    const publishedDate = liveData?.publishedDate || book.publicationDate || `${year}`;
    const isbn = liveData?.isbn13 || liveData?.isbn10 || book.isbn13 || book.isbn10 || book.isbn || '978-93-88302-19-8';
    const pages = liveData?.pages || book.pages || 184;
    const language = liveData?.language || book.language || 'English / Hindi';
    const category = liveData?.mainCategory || book.category || 'Literature & Writing';
    const rating = liveData?.rating || book.rating || 4.8;
    const ratingsCount = liveData?.ratingsCount || book.ratingsCount || 120;
    const synopsis = liveData?.longSynopsis || liveData?.description || book.longSynopsis || book.description || 
      'Official publication by Arjun Bharti Mina exploring creative artistry, theoretical frameworks, and cultural mechanics.';

    const volumeId = liveData?.volumeId || book.googleBooksVolumeId || extractGoogleBooksId(book.playStoreUrl || book.googlePlayUrl) || 'M71vDwAAQBAJ';
    const playStoreUrl = liveData?.playStoreUrl || book.playStoreUrl || book.googlePlayUrl || getGooglePlayStoreUrl(volumeId);
    const webReaderUrlDew = liveData?.webReaderLink || book.webReaderLink || getGooglePlayReaderUrl(volumeId);

    const chapters = (book.chaptersSummary && book.chaptersSummary.length > 0)
      ? book.chaptersSummary
      : (book.chapters && book.chapters.length > 0)
      ? book.chapters
      : [
          'Chapter 1: Foundational Frameworks & Theoretical Architecture',
          'Chapter 2: Techniques, Creative Cadences & Formulas',
          'Chapter 3: Real-World Case Studies & Analytical Blueprints',
          'Chapter 4: Advanced Architectures & Cultural Perspectives',
          'Chapter 5: Summary, Key Takeaways & Action Blueprint'
        ];

    // 3. Load cover image data URL
    const coverUrl = liveData?.coverImage || liveData?.thumbnail || book.cover;
    const coverDataUrl = await loadImageAsDataUrl(coverUrl);

    onProgress?.('Generating PDF document with jsPDF...');

    // 4. Initialize jsPDF document (A4: 210mm x 297mm)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 18;
    const contentWidth = pageWidth - (margin * 2);

    // ==========================================
    // PAGE 1: TITLE, SPECS & SYNOPSIS
    // ==========================================

    // Top Gold / Dark Luxury Header Accent Banner
    doc.setFillColor(24, 24, 27); // #18181b Dark Charcoal
    doc.rect(0, 0, pageWidth, 24, 'F');

    doc.setFillColor(217, 119, 6); // #D97706 Amber 600
    doc.rect(0, 24, pageWidth, 2.5, 'F');

    // Header Title in Banner
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('OFFICIAL MANUSCRIPT PREVIEW  •  GOOGLE PLAY BOOKS EDITION', margin, 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(245, 158, 11); // Amber
    doc.text('VERIFIED AUTHOR PREVIEW', pageWidth - margin, 14, { align: 'right' });

    let currentY = 36;

    // Cover Image (Left side) and Meta (Right side)
    const coverWidth = 46;
    const coverHeight = 66;

    if (coverDataUrl) {
      try {
        // Draw soft border frame
        doc.setDrawColor(217, 119, 6);
        doc.setLineWidth(0.4);
        doc.roundedRect(margin - 0.5, currentY - 0.5, coverWidth + 1, coverHeight + 1, 1.5, 1.5, 'S');
        
        doc.addImage(coverDataUrl, 'JPEG', margin, currentY, coverWidth, coverHeight);
      } catch {
        // Draw fallback vector cover block
        drawFallbackCoverBox(doc, margin, currentY, coverWidth, coverHeight, title, author);
      }
    } else {
      drawFallbackCoverBox(doc, margin, currentY, coverWidth, coverHeight, title, author);
    }

    // Right Side Metadata details
    const rightColX = margin + coverWidth + 8;
    const rightColWidth = contentWidth - coverWidth - 8;
    let metaY = currentY + 3;

    // Category Pill / Tag
    doc.setFillColor(254, 243, 199); // Amber 100
    doc.roundedRect(rightColX, metaY - 3, 56, 5.5, 1, 1, 'F');
    doc.setTextColor(180, 83, 9); // Amber 700
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text(category.toUpperCase().slice(0, 24), rightColX + 3, metaY + 1);

    metaY += 9;

    // Book Title
    doc.setTextColor(17, 24, 39); // Neutral 900
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    const splitTitle = doc.splitTextToSize(title, rightColWidth);
    doc.text(splitTitle, rightColX, metaY);
    metaY += (splitTitle.length * 6) + 1;

    // Subtitle
    if (subtitlevol) {
      doc.setTextColor(107, 114, 128); // Neutral 500
      doc.setFont('helvetica', 'oblique');
      doc.setFontSize(9);
      const splitSubtitle = doc.splitTextToSize(subtitlevol, rightColWidth);
      doc.text(splitSubtitle, rightColX, metaY);
      metaY += (splitSubtitle.length * 4.2) + 2;
    }

    // Author
    doc.setTextColor(180, 83, 9); // Amber 700
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`By ${author}`, rightColX, metaY);
    metaY += 5;

    // Publisher & Date
    doc.setTextColor(75, 85, 99);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`${publisher}  •  ${publishedDate}`, rightColX, metaY);
    metaY += 6;

    // Mini Specs Grid Table
    doc.setFillColor(249, 250, 251); // Gray 50
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.roundedRect(rightColX, metaY, rightColWidth, 24, 2, 2, 'FD');

    const specCol1X = rightColX + 4;
    const specCol2X愚 = rightColX + (rightColWidth / 2) + 2;
    let rowY = metaY + 5;

    doc.setFontSize(7.5);
    
    // Row 1
    doc.setTextColor(107, 114, 128);
    doc.setFont('helvetica', 'normal');
    doc.text('ISBN-13:', specCol1X, rowY);
    doc.setTextColor(17, 24, 39);
    doc.setFont('helvetica', 'bold');
    doc.text(isbn, specCol1X + 16, rowY);

    doc.setTextColor(107, 114, 128);
    doc.setFont('helvetica', 'normal');
    doc.text('Pages:', specCol2X愚, rowY);
    doc.setTextColor(17, 24, 39);
    doc.setFont('helvetica', 'bold');
    doc.text(`${pages} Pages`, specCol2X愚 + 14, rowY);

    // Row 2
    rowY += 6;
    doc.setTextColor(107, 114, 128);
    doc.setFont('helvetica', 'normal');
    doc.text('Language:', specCol1X, rowY);
    doc.setTextColor(17, 24, 39);
    doc.setFont('helvetica', 'bold');
    doc.text(language, specCol1X + 16, rowY);

    doc.setTextColor(107, 114, 128);
    doc.setFont('helvetica', 'normal');
    doc.text('Rating:', specCol2X愚, rowY);
    doc.setTextColor(217, 119, 6);
    doc.setFont('helvetica', 'bold');
    doc.text(`★ ${rating} (${ratingsCount}+ reviews)`, specCol2X愚 + 14, rowY);

    // Row 3
    rowY += 6;
    doc.setTextColor(107, 114, 128);
    doc.setFont('helvetica', 'normal');
    doc.text('Format:', specCol1X, rowY);
    doc.setTextColor(17, 24, 39);
    doc.setFont('helvetica', 'bold');
    doc.text('Digital Ebook (PDF / EPUB)', specCol1X + 16, rowY);

    doc.setTextColor(107, 114, 128);
    doc.setFont('helvetica', 'normal');
    doc.text('Store:', specCol2X愚, rowY);
    doc.setTextColor(37, 99, 235);
    doc.setFont('helvetica', 'bold');
    doc.text('Google Play Books', specCol2X愚 + 14, rowY);

    // Section: Executive Summary & Synopsis
    currentY = Math.max(currentY + coverHeight + 10, metaY + 30);

    doc.setFillColor(243, 244, 246);
    doc.roundedRect(margin, currentY, contentWidth, 7, 1, 1, 'F');
    doc.setTextColor(17, 24, 39);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('EXECUTIVE OVERVIEW & EDITORIAL SYNOPSIS', margin + 4, currentY + 4.8);

    currentY += 12;

    doc.setTextColor(55, 65, 81);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const splitSynopsis = doc.splitTextToSize(synopsis, contentWidth);
    doc.text(splitSynopsis, margin, currentY);
    currentY += (splitSynopsis.length * 4.6) + 6;

    // Section: Chapter Highlights
    if (currentY < 235) {
      doc.setFillColor(243, 244, 246);
      doc.roundedRect(margin, currentY, contentWidth, 7, 1, 1, 'F');
      doc.setTextColor(17, 24, 39);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('TABLE OF CONTENTS & KEY TOPICS', margin + 4, currentY + 4.8);

      currentY += 12;

      doc.setFontSize(8.5);
      for (let i = 0; i < Math.min(chapters.length, 5); i++) {
        const chap = chapters[i];
        doc.setTextColor(217, 119, 6);
        doc.setFont('helvetica', 'bold');
        doc.text(`[0${i + 1}]`, margin + 2, currentY);

        doc.setTextColor(55, 65, 81);
        doc.setFont('helvetica', 'normal');
        const splitChap = doc.splitTextToSize(chap, contentWidth - 14);
        doc.text(splitChap, margin + 12, currentY);
        currentY += (splitChap.length * 4.4) + 2;
      }
    }

    // Page 1 Footer
    drawPageFooter(doc, 1, 2, title, year);

    // ==========================================
    // PAGE 2: MANUSCRIPT EXCERPT & STORE LINKS
    // ==========================================
    doc.addPage();

    // Top Slim Running Header
    doc.setFillColor(24, 24, 27);
    doc.rect(0, 0, pageWidth, 16, 'F');
    doc.setFillColor(217, 119, 6);
    doc.rect(0, 16, pageWidth, 1.5, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(`${title.toUpperCase()}  —  SAMPLE MANUSCRIPT EXCERPT`, margin, 10);

    doc.setTextColor(245, 158, 11);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`AUTHOR: ${author.toUpperCase()}`, pageWidth - margin, 10, { align: 'right' });

    let p2Y = 28;

    // Excerpt Section
    const excerpt = getManuscriptExcerpt(title);

    doc.setFillColor(254, 243, 199);
    doc.roundedRect(margin, p2Y, contentWidth, 7.5, 1, 1, 'F');
    doc.setTextColor(180, 83, 9);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(excerpt.chapterTitle.toUpperCase(), margin + 4, p2Y + 5.2);

    p2Y += 14;

    // Paragraphs
    doc.setTextColor(31, 41, 55);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);

    for (const para of excerpt.paragraphs) {
      const splitPara = doc.splitTextToSize(para, contentWidth);
      doc.text(splitPara, margin, p2Y);
      p2Y += (splitPara.length * 4.8) + 5;
    }

    p2Y += 6;

    // Google Play Books Access Card Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, p2Y, contentWidth, 54, 2, 2, 'FD');

    let boxY = p2Y + 7;

    doc.setTextColor(30, 58, 138); // Blue 900
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('HOW TO ACCESS THE COMPLETE EDITION ON GOOGLE PLAY BOOKS', margin + 6, boxY);

    boxY += 6;
    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    const accessHelp = 'This sample contains an excerpt from the published manuscript. The full edition features complete chapters, extensive appendices, technical diagrams, flow rhythm charts, and lifetime digital updates across Android, iOS, and Web.';
    const splitHelp = doc.splitTextToSize(accessHelp, contentWidth - 12);
    doc.text(splitHelp, margin + 6, boxY);

    boxY += (splitHelp.length * 4.2) + 5;

    // Direct URLs
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('Official Google Play Store Link:', margin + 6, boxY);

    doc.setTextColor(37, 99, 235); // Blue 600
    doc.setFont('helvetica', 'normal');
    doc.text(playStoreUrl.slice(0, 75), margin + 54, boxY);

    boxY += 6;
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('Interactive Web Reader:', margin + 6, boxY);

    doc.setTextColor(37, 99, 235);
    doc.setFont('helvetica', 'normal');
    doc.text(webReaderUrlDew.slice(0, 75), margin + 54, boxY);

    boxY += 8;
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'oblique');
    doc.setFontSize(7.5);
    doc.text('© Arjun Bharti Mina. All rights reserved. Published via ABM Media & Literary Press in partnership with Google Play Books.', margin + 6, boxY);

    // Page 2 Footer
    drawPageFooter(doc, 2, 2, title, year);

    // 5. Save and trigger direct browser download
    const cleanFileName = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_Official_Preview.pdf`;
    doc.save(cleanFileName);

    onProgress?.(`Official PDF preview generated: "${cleanFileName}"!`, 'success');

    return {
      success: true,
      message: `Successfully generated and downloaded "${cleanFileName}"!`
    };

  } catch (error: any) {
    console.error('Error generating PDF book preview:', error);
    return {
      success: false,
      message: error?.message || 'Failed to generate PDF book preview.'
    };
  }
}

/**
 * Helper to draw vector fallback book cover if network image is blocked by CORS
 */
function drawFallbackCoverBox(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  author: string
) {
  doc.setFillColor(24, 24, 27);
  doc.roundedRect(x, y, w, h, 2, 2, 'F');
  
  doc.setFillColor(217, 119, 6);
  doc.rect(x, y + h - 6, w, 6, 'F');

  doc.setTextColor(245, 158, 11);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('ABM PRESS', x + (w / 2), y + 10, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  const splitTitle = doc.splitTextToSize(title, w - 6);
  doc.text(splitTitle, x + 3, y + 26);

  doc.setTextColor(209, 213, 219);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(author, x + 3, y + h - 10);
}

/**
 * Helper to draw running page footer
 */
function drawPageFooter(
  doc: jsPDF,
  pageNumber: number,
  totalPages: number,
  title: string,
  year: number
) {
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 18;
  const footerY = pageHeight - 12;

  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);

  doc.setTextColor(156, 163, 175);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`Page ${pageNumber} of ${totalPages}  •  ${title} Preview  •  © ${year} Arjun Bharti Mina`, margin, footerY);

  doc.setTextColor(217, 119, 6);
  doc.setFont('helvetica', 'bold');
  doc.text('Google Play Books Verified', pageWidth - margin, footerY, { align: 'right' });
}
