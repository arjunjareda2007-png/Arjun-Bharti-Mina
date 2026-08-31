import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { BookItem } from '../../types';
import { DeleteConfirmModal } from '../DeleteConfirmModal';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  X,
  Sparkles,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Star,
  FileText,
  Eye,
  Link2,
  HardDrive,
  Upload,
  BookMarked
} from 'lucide-react';
import { 
  fetchUniversalBookDetails, 
  extractGoogleBooksId,
  BookLinkType
} from '../../utils/googleBooksUtils';
import { hapticLight, hapticSuccess } from '../../utils/haptics';

const EMPTY_BOOK: BookItem = {
  id: '',
  title: '',
  subtitle: 'Poetry & Philosophy Collection',
  author: 'Arjun Bharti Mina',
  publisher: 'ABM Media & Literary Press',
  publicationYear: 2026,
  cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800',
  description: '',
  longSynopsis: '',
  googlePlayUrl: 'https://play.google.com/store/books/details?id=M71vDwAAQBAJ',
  playStoreUrl: 'https://play.google.com/store/books/details?id=M71vDwAAQBAJ',
  googleBooksVolumeId: 'M71vDwAAQBAJ',
  isbn: '9789388302198',
  pages: 140,
  language: 'Hindi / English',
  genre: 'Music & Lyricism',
  category: 'Music & Lyricism',
  featured: true,
  published: true
};

export const BooksTab: React.FC = () => {
  const { books, addBook, updateBook, deleteBook, openBookReader, showToast } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBook, setEditingBook] = useState<BookItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BookItem | null>(null);

  // Universal Auto-Fetch state inside modal
  const [fetchInput, setFetchInput] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [detectedSource, setDetectedSource] = useState<BookLinkType | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [fetchSuccessMsg, setFetchSuccessMsg] = useState<string | null>(null);

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.genre && b.genre.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (b.isbn && b.isbn.includes(searchTerm)) ||
    (b.author && b.author.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenAdd = () => {
    setEditingBook({
      ...EMPTY_BOOK,
      id: `book-${Date.now()}`
    });
    setFetchInput('');
    setDetectedSource(null);
    setFetchError(null);
    setFetchSuccessMsg(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: BookItem) => {
    setEditingBook({ ...b });
    setFetchInput(b.googlePlayUrl || b.pdfUrl || b.driveUrl || b.isbn || b.googleBooksVolumeId || '');
    setDetectedSource(null);
    setFetchError(null);
    setFetchSuccessMsg(null);
    setIsModalOpen(true);
  };

  const handleUniversalAutoFetch = async () => {
    const query = fetchInput.trim() || (editingBook ? (editingBook.googlePlayUrl || editingBook.pdfUrl || editingBook.driveUrl || editingBook.title) : '');
    if (!query) {
      setFetchError('Please enter any link (Google Play, PDF link, Google Drive link, OpenLibrary, ISBN, or Title).');
      return;
    }

    setIsFetching(true);
    setFetchError(null);
    setFetchSuccessMsg(null);

    try {
      const result = await fetchUniversalBookDetails(query);
      setIsFetching(false);
      setDetectedSource(result.sourceType);

      if (result.success && result.data && editingBook) {
        const merged: BookItem = {
          ...editingBook,
          ...result.data,
          id: editingBook.id || `book-${Date.now()}`
        };
        setEditingBook(merged);
        setFetchSuccessMsg(result.message || `Successfully auto-fetched metadata!`);
        hapticSuccess();
        showToast(result.message || 'Book metadata auto-extracted!', 'success');
      } else {
        setFetchError(result.error || 'Could not extract metadata from this link. You can still input the fields manually.');
        showToast('Link auto-fetch failed', 'error');
      }
    } catch {
      setIsFetching(false);
      setFetchError('Connection error while extracting book data.');
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook || !editingBook.title.trim()) return;

    // Ensure volume ID and Google Play links are properly normalized
    const cleanVolumeId = editingBook.googleBooksVolumeId || extractGoogleBooksId(editingBook.googlePlayUrl || editingBook.playStoreUrl) || undefined;
    const finalBook: BookItem = {
      ...editingBook,
      googleBooksVolumeId: cleanVolumeId,
      googlePlayUrl: editingBook.googlePlayUrl || (cleanVolumeId ? `https://play.google.com/store/books/details?id=${cleanVolumeId}` : undefined),
      playStoreUrl: editingBook.playStoreUrl || editingBook.googlePlayUrl || (cleanVolumeId ? `https://play.google.com/store/books/details?id=${cleanVolumeId}` : undefined),
      previewEmbedUrl: editingBook.previewEmbedUrl || (cleanVolumeId ? `https://books.google.com/books?id=${cleanVolumeId}&printsec=frontcover&output=embed` : undefined)
    };

    const exists = books.some(b => b.id === finalBook.id);
    if (exists) {
      await updateBook(finalBook);
      showToast('Book updated successfully', 'success');
    } else {
      await addBook(finalBook);
      showToast('New book added to library', 'success');
    }
    setIsModalOpen(false);
    setEditingBook(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <span>Books & Literary Publications</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Add and manage published poetry collections, tech primers, and ebooks by Google Play link, PDF URL, Google Drive, or ISBN.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Book by Link / PDF</span>
        </button>
      </div>

      {/* Search filter & Library Metrics */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Filter books by title, genre, ISBN, author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 dark:text-neutral-400">
          <span>{books.length} Books in Library</span>
          <span>•</span>
          <span>{books.filter(b => b.pdfUrl || b.driveUrl).length} Direct PDFs</span>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBooks.map((book) => {
          const isPdf = Boolean(book.pdfUrl || book.sourceType === 'pdf');
          const isDrive = Boolean(book.driveUrl || book.sourceType === 'drive');
          const hasPlay = Boolean(book.googlePlayUrl || book.playStoreUrl || book.googleBooksVolumeId);

          return (
            <div
              key={book.id}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-4 shadow-xs flex flex-col justify-between space-y-3 hover:border-amber-500/40 transition-all group"
            >
              <div className="flex gap-3.5">
                <img
                  src={book.cover}
                  alt={book.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800';
                  }}
                  className="w-20 h-28 object-cover rounded-xl shadow-md shrink-0 border border-neutral-200 dark:border-neutral-700 bg-neutral-950"
                />
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-semibold">
                      {book.genre || book.category || 'Literature'}
                    </span>
                    {isPdf && (
                      <span className="px-1.5 py-0.5 rounded-md bg-red-500/10 text-red-500 text-[10px] font-mono font-bold flex items-center gap-0.5">
                        <FileText className="w-2.5 h-2.5" />
                        <span>PDF</span>
                      </span>
                    )}
                    {isDrive && (
                      <span className="px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-500 text-[10px] font-mono font-bold flex items-center gap-0.5">
                        <HardDrive className="w-2.5 h-2.5" />
                        <span>Drive</span>
                      </span>
                    )}
                    {book.rating && (
                      <span className="text-[10px] font-mono text-yellow-600 dark:text-yellow-400 flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        <span>{book.rating}</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white line-clamp-1 group-hover:text-amber-500 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                    {book.description}
                  </p>
                  <div className="text-[11px] text-neutral-400 font-mono">
                    {book.pages || 140} pages • {book.publicationYear}
                  </div>
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      hapticLight();
                      openBookReader(book.id);
                    }}
                    className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                    title="Launch Full Reading Mode"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Test Reader</span>
                  </button>

                  {hasPlay && (
                    <a
                      href={book.googlePlayUrl || book.playStoreUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                    >
                      <span>Play</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(book)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                    title="Edit Book Record"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(book)}
                    className="p-1.5 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Delete Book Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Universal Add / Edit Modal */}
      {isModalOpen && editingBook && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-2xl overflow-y-auto space-y-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-500" />
              <span>{books.some(b => b.id === editingBook.id) ? 'Edit Book Record' : 'Add New Book by Link / Source'}</span>
            </h3>

            {/* Smart Universal Auto-Fetch Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/25 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    Smart Universal Link Auto-Fetcher
                  </span>
                </div>
                {detectedSource && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-neutral-950 font-mono text-[10px] font-bold uppercase">
                    {detectedSource.replace('_', ' ')}
                  </span>
                )}
              </div>
              
              <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Paste <strong>any type of link or identifier</strong> — Google Play Books URL, direct PDF URL (<code className="text-amber-500 font-mono">.pdf</code>), Google Drive share link, OpenLibrary URL, ISBN, or Book Title. We'll automatically fetch the title, genre, page count, cover thumbnail, and reader config!
              </p>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Link2 className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Paste link: https://play.google.com/..., https://...book.pdf, Google Drive, or ISBN"
                    value={fetchInput}
                    onChange={(e) => setFetchInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleUniversalAutoFetch();
                      }
                    }}
                    className="w-full pl-8 pr-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleUniversalAutoFetch}
                  disabled={isFetching}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50 cursor-pointer shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
                  <span>{isFetching ? 'Auto-Fetching...' : 'Auto-Fetch'}</span>
                </button>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[10px] text-neutral-400 font-medium">Quick Presets:</span>
                <button
                  type="button"
                  onClick={() => {
                    setFetchInput('The Lyricist’s Blueprint Arjun Bharti Mina');
                  }}
                  className="px-2 py-0.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-amber-500/20 text-[10px] text-neutral-600 dark:text-neutral-300 transition-colors"
                >
                  The Lyricist's Blueprint
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFetchInput('https://play.google.com/store/books/details?id=M71vDwAAQBAJ');
                  }}
                  className="px-2 py-0.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-amber-500/20 text-[10px] text-neutral-600 dark:text-neutral-300 transition-colors"
                >
                  Google Play Sample
                </button>
              </div>

              {fetchError && (
                <div className="p-2.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{fetchError}</span>
                </div>
              )}

              {fetchSuccessMsg && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{fetchSuccessMsg}</span>
                </div>
              )}
            </div>

            {/* Book Details Form */}
            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Book Title *</label>
                <input
                  type="text"
                  required
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                  placeholder="e.g. The Lyricist's Blueprint"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Subtitle / Tagline</label>
                <input
                  type="text"
                  value={editingBook.subtitle || ''}
                  onChange={(e) => setEditingBook({ ...editingBook, subtitle: e.target.value })}
                  placeholder="e.g. Rhyme, Rhythm & Indian Hip-Hop"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Author</label>
                  <input
                    type="text"
                    value={editingBook.author || ''}
                    onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                    placeholder="Arjun Bharti Mina"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Publisher</label>
                  <input
                    type="text"
                    value={editingBook.publisher || ''}
                    onChange={(e) => setEditingBook({ ...editingBook, publisher: e.target.value })}
                    placeholder="ABM Media & Literary Press"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Genre / Category</label>
                  <input
                    type="text"
                    value={editingBook.genre || editingBook.category || ''}
                    onChange={(e) => setEditingBook({ ...editingBook, genre: e.target.value, category: e.target.value })}
                    placeholder="Music & Lyricism / Engineering / Poetry"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Publication Year</label>
                  <input
                    type="number"
                    value={editingBook.publicationYear}
                    onChange={(e) => setEditingBook({ ...editingBook, publicationYear: Number(e.target.value) || 2026 })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Pages Count</label>
                  <input
                    type="number"
                    value={editingBook.pages}
                    onChange={(e) => setEditingBook({ ...editingBook, pages: Number(e.target.value) || 100 })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">ISBN Number</label>
                  <input
                    type="text"
                    value={editingBook.isbn || ''}
                    onChange={(e) => setEditingBook({ ...editingBook, isbn: e.target.value })}
                    placeholder="e.g. 9789388302198"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Cover Artwork URL */}
              <div>
                <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Cover Thumbnail / Artwork URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={editingBook.cover}
                    onChange={(e) => setEditingBook({ ...editingBook, cover: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-amber-500"
                  />
                  {editingBook.cover && (
                    <img 
                      src={editingBook.cover} 
                      alt="Cover Preview" 
                      referrerPolicy="no-referrer"
                      className="w-9 h-11 object-cover rounded-lg border border-neutral-300 dark:border-neutral-700 shrink-0" 
                    />
                  )}
                </div>
              </div>

              {/* Links Configuration: Google Play / PDF / Google Drive */}
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 space-y-3">
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-amber-500" />
                  <span>Reader & External Links</span>
                </h4>

                <div>
                  <label className="block text-[11px] font-semibold mb-1 text-neutral-600 dark:text-neutral-400">Google Play Books Link</label>
                  <input
                    type="url"
                    value={editingBook.googlePlayUrl || editingBook.playStoreUrl || ''}
                    onChange={(e) => setEditingBook({ 
                      ...editingBook, 
                      googlePlayUrl: e.target.value,
                      playStoreUrl: e.target.value,
                      googleBooksVolumeId: extractGoogleBooksId(e.target.value) || editingBook.googleBooksVolumeId
                    })}
                    placeholder="https://play.google.com/store/books/details?id=..."
                    className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold mb-1 text-neutral-600 dark:text-neutral-400">Direct PDF Document URL</label>
                    <input
                      type="url"
                      value={editingBook.pdfUrl || ''}
                      onChange={(e) => setEditingBook({ ...editingBook, pdfUrl: e.target.value, pdfPreviewUrl: e.target.value })}
                      placeholder="https://.../manuscript.pdf"
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold mb-1 text-neutral-600 dark:text-neutral-400">Google Drive Document URL</label>
                    <input
                      type="url"
                      value={editingBook.driveUrl || ''}
                      onChange={(e) => setEditingBook({ ...editingBook, driveUrl: e.target.value })}
                      placeholder="https://drive.google.com/file/d/..."
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Description & Synopsis</label>
                <textarea
                  rows={3}
                  value={editingBook.description}
                  onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value, longSynopsis: e.target.value })}
                  placeholder="Enter book description, outline, or themes..."
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              {/* Published & Featured Checkboxes */}
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingBook.published !== false}
                    onChange={(e) => setEditingBook({ ...editingBook, published: e.target.checked })}
                    className="w-4 h-4 rounded-sm text-amber-500 focus:ring-amber-500"
                  />
                  <span>Published on Website</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingBook.featured)}
                    onChange={(e) => setEditingBook({ ...editingBook, featured: e.target.checked })}
                    className="w-4 h-4 rounded-sm text-amber-500 focus:ring-amber-500"
                  />
                  <span>Featured Book of the Month</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
                >
                  Save Book to Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Book Record?"
        itemName={deleteTarget?.title || ''}
        itemType="Book"
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteBook(deleteTarget.id);
            setDeleteTarget(null);
            showToast('Book removed', 'info');
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
