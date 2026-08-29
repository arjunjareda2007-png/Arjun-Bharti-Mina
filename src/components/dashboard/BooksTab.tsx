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
  Download
} from 'lucide-react';
import { 
  fetchGoogleBookDetails, 
  extractGoogleBooksId, 
  applyGoogleBookDataToBook 
} from '../../utils/googleBooksUtils';

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
  const { books, addBook, updateBook, deleteBook, showToast } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBook, setEditingBook] = useState<BookItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BookItem | null>(null);

  // Google Play Books fetch state inside modal
  const [fetchInput, setFetchInput] = useState('');
  const [isFetchingGoogle, setIsFetchingGoogle] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [fetchSuccessMsg, setFetchSuccessMsg] = useState<string | null>(null);

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.genre && b.genre.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (b.isbn && b.isbn.includes(searchTerm))
  );

  const handleOpenAdd = () => {
    setEditingBook({
      ...EMPTY_BOOK,
      id: `book-${Date.now()}`
    });
    setFetchInput('');
    setFetchError(null);
    setFetchSuccessMsg(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: BookItem) => {
    setEditingBook({ ...b });
    setFetchInput(b.googlePlayUrl || b.playStoreUrl || b.googleBooksVolumeId || b.isbn || '');
    setFetchError(null);
    setFetchSuccessMsg(null);
    setIsModalOpen(true);
  };

  const handleFetchFromGooglePlay = async () => {
    const query = fetchInput.trim() || (editingBook ? (editingBook.googlePlayUrl || editingBook.title) : '');
    if (!query) {
      setFetchError('Please enter a Google Play Books link, Volume ID, ISBN, or Book Title.');
      return;
    }

    setIsFetchingGoogle(true);
    setFetchError(null);
    setFetchSuccessMsg(null);

    const result = await fetchGoogleBookDetails(query);
    setIsFetchingGoogle(false);

    if (result.success && result.data && editingBook) {
      const updated = applyGoogleBookDataToBook(editingBook, result.data);
      setEditingBook(updated);
      setFetchSuccessMsg(`Successfully fetched "${result.data.title}" from Google Play Books!`);
      showToast(`Book metadata auto-filled from Google Play Books`, 'success');
    } else {
      setFetchError(result.error || 'Could not fetch book details. Please check the URL or connection.');
      showToast('Google Play Books lookup failed', 'error');
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
      previewEmbedUrl: cleanVolumeId ? `https://books.google.com/books?id=${cleanVolumeId}&printsec=frontcover&output=embed` : editingBook.previewEmbedUrl
    };

    const exists = books.some(b => b.id === finalBook.id);
    if (exists) {
      await updateBook(finalBook);
    } else {
      await addBook(finalBook);
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
            Manage your published poetry books, technical primers, and Google Play Books purchase links & embeds.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Book</span>
        </button>
      </div>

      {/* Search filter */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Filter books by title, genre, ISBN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-4 shadow-sm flex flex-col justify-between space-y-3"
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
                  {book.rating && (
                    <span className="text-[10px] font-mono text-yellow-600 dark:text-yellow-400 flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <span>{book.rating}</span>
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white line-clamp-1">
                  {book.title}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                  {book.description}
                </p>
                <div className="text-[11px] text-neutral-400 font-mono">
                  {book.pages} pages • {book.publicationYear}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              {(book.googlePlayUrl || book.playStoreUrl) ? (
                <a
                  href={book.googlePlayUrl || book.playStoreUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Google Play Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-[11px] text-neutral-400">No Play link</span>
              )}

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
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingBook && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-xl max-h-[90vh] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-2xl overflow-y-auto space-y-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-500" />
              <span>{books.some(b => b.id === editingBook.id) ? 'Edit Book Record' : 'Add New Book'}</span>
            </h3>

            {/* Google Play Books Auto-Fill Section */}
            <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 space-y-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  Auto-Fill from Google Play Books
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Paste any Google Play Books URL, Google Books link, ISBN (e.g. 9789388302198), or volume ID to automatically extract title, synopsis, pages, cover artwork, and publisher info.
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. https://play.google.com/store/books/details?id=M71vDwAAQBAJ"
                  value={fetchInput}
                  onChange={(e) => setFetchInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleFetchFromGooglePlay}
                  disabled={isFetchingGoogle}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isFetchingGoogle ? 'animate-spin' : ''}`} />
                  <span>{isFetchingGoogle ? 'Fetching...' : 'Fetch'}</span>
                </button>
              </div>

              {fetchError && (
                <div className="p-2.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{fetchError}</span>
                </div>
              )}

              {fetchSuccessMsg && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{fetchSuccessMsg}</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveModal} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Book Title *</label>
                <input
                  type="text"
                  required
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Subtitle / Tagline</label>
                <input
                  type="text"
                  value={editingBook.subtitle || ''}
                  onChange={(e) => setEditingBook({ ...editingBook, subtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Author</label>
                  <input
                    type="text"
                    value={editingBook.author || ''}
                    onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Publisher</label>
                  <input
                    type="text"
                    value={editingBook.publisher || ''}
                    onChange={(e) => setEditingBook({ ...editingBook, publisher: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Genre / Category</label>
                  <input
                    type="text"
                    value={editingBook.genre || editingBook.category || ''}
                    onChange={(e) => setEditingBook({ ...editingBook, genre: e.target.value, category: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Publication Year</label>
                  <input
                    type="number"
                    value={editingBook.publicationYear}
                    onChange={(e) => setEditingBook({ ...editingBook, publicationYear: Number(e.target.value) || 2026 })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Pages</label>
                  <input
                    type="number"
                    value={editingBook.pages}
                    onChange={(e) => setEditingBook({ ...editingBook, pages: Number(e.target.value) || 100 })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">ISBN Number</label>
                  <input
                    type="text"
                    value={editingBook.isbn || ''}
                    onChange={(e) => setEditingBook({ ...editingBook, isbn: e.target.value })}
                    placeholder="e.g. 9789388302198"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Cover Image URL</label>
                <input
                  type="url"
                  value={editingBook.cover}
                  onChange={(e) => setEditingBook({ ...editingBook, cover: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Google Play Books Store Link</label>
                <input
                  type="url"
                  value={editingBook.googlePlayUrl || editingBook.playStoreUrl || ''}
                  onChange={(e) => setEditingBook({ 
                    ...editingBook, 
                    googlePlayUrl: e.target.value,
                    playStoreUrl: e.target.value,
                    googleBooksVolumeId: extractGoogleBooksId(e.target.value) || editingBook.googleBooksVolumeId
                  })}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Description & Synopsis</label>
                <textarea
                  rows={3}
                  value={editingBook.description}
                  onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value, longSynopsis: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
                >
                  Save Book
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
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
