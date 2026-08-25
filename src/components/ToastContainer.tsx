import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toast } = useStore();

  if (!toast) return null;

  return (
    <div className="fixed bottom-24 right-4 sm:right-6 z-50 pointer-events-none animate-slideUp">
      <div 
        className={`pointer-events-auto flex items-center gap-2.5 py-2.5 px-4 rounded-xl shadow-xl backdrop-blur-md border text-xs sm:text-sm font-medium transition-all ${
          toast.type === 'error'
            ? 'bg-red-900/90 border-red-700 text-red-100'
            : toast.type === 'info'
            ? 'bg-neutral-900/90 border-neutral-700 text-neutral-100'
            : 'bg-neutral-950/90 dark:bg-neutral-900/95 border-amber-500/40 text-amber-300'
        }`}
      >
        {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
        {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400 shrink-0" />}
        {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};
