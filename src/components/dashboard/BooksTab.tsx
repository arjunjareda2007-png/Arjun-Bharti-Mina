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
  X
} from 'lucide-react';

const EMPTY_BOOK: BookItem = {
  id: '',
  title: '',
  subtitle: 'Poetry & Philosophy Collection',
  author: 'Arjun Bharti Mina',
  publicationYear: 2026,
  cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800',
  description: '',
  longSynopsis: '',
  googlePlayUrl: 'https://play.google.com/store/books',
  pages: 140,
  language: 'Hindi / Urdu / English',
  genre: 'Poetry / Philosophy',
  featured: true
};

export const BooksTab: React.FC = () => {
  const { books, addBook, updateBook, deleteBook } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBook, setEditingBook] = useState<BookItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BookItem | null>(null);

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.genre && b.genre.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenAdd = () => {
    setEditingBook({
      ...EMPTY_BOOK,
      id: `book-${Date.now()}`
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: BookItem) => {
    setEditingBook({ ...b });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook || !editingBook.title.trim()) return;

    const exists = books.some(b => b.id === editingBook.id);
    if (exists) {
      await updateBook(editingBook);
    } else {
      await addBook(editingBook);
    }
    setIsModalOpen(false);
    setEditingBook(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <span>Books & Literary Publications</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Manage your published poetry books, philosophical writings, and Google Play Books purchase links.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Book</span>
        </button>
      </div>

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
                className="w-20 h-28 object-cover rounded-xl shadow-md shrink-0 border border-neutral-200 dark:border-neutral-700"
              />
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-semibold">
                  {book.genre}
                </span>
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
              {book.googlePlayUrl && (
                <a
                  href={book.googlePlayUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>Google Play Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(book)}
                  className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteTarget(book)}
                  className="p-1 text-red-500 hover:text-red-600"
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
          <div className="relative w-full max-w-lg max-h-[90vh] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-2xl overflow-y-auto space-y-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-neutral-400"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              {books.some(b => b.id === editingBook.id) ? 'Edit Book Record' : 'Add New Book'}
            </h3>

            <form onSubmit={handleSaveModal} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Book Title *</label>
                <input
                  type="text"
                  required
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Genre</label>
                  <input
                    type="text"
                    value={editingBook.genre || ''}
                    onChange={(e) => setEditingBook({ ...editingBook, genre: e.target.value })}
                    className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Publication Year</label>
                  <input
                    type="number"
                    value={editingBook.publicationYear}
                    onChange={(e) => setEditingBook({ ...editingBook, publicationYear: Number(e.target.value) || 2026 })}
                    className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Pages</label>
                  <input
                    type="number"
                    value={editingBook.pages}
                    onChange={(e) => setEditingBook({ ...editingBook, pages: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Language</label>
                  <input
                    type="text"
                    value={editingBook.language || ''}
                    onChange={(e) => setEditingBook({ ...editingBook, language: e.target.value })}
                    className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={editingBook.cover}
                  onChange={(e) => setEditingBook({ ...editingBook, cover: e.target.value })}
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Google Play Books Link</label>
                <input
                  type="url"
                  value={editingBook.googlePlayUrl || ''}
                  onChange={(e) => setEditingBook({ ...editingBook, googlePlayUrl: e.target.value })}
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Description & Synopsis</label>
                <textarea
                  rows={3}
                  value={editingBook.description}
                  onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-1.5 text-xs text-neutral-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl"
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
