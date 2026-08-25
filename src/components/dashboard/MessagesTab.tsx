import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ContactMessage } from '../../types';
import { DeleteConfirmModal } from '../DeleteConfirmModal';
import { 
  Mail, 
  Trash2, 
  CheckCircle2, 
  Reply, 
  Clock, 
  Search, 
  ExternalLink,
  MailOpen
} from 'lucide-react';

export const MessagesTab: React.FC = () => {
  const { messages, markMessageRead, deleteMessage } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);

  const filteredMessages = messages.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-amber-500" />
            <span>Direct Inquiries & Collaboration Inbox</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Read and manage contact messages received from the public website inquiry form.
          </p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search inquiries by name, email, or subject..."
          className="w-full pl-10 pr-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500"
        />
      </div>

      <div className="space-y-3">
        {filteredMessages.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 text-neutral-400 text-xs">
            No inquiry messages in inbox.
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`p-5 rounded-3xl border transition-all ${
                msg.read
                  ? 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800'
                  : 'bg-amber-500/5 dark:bg-amber-500/5 border-amber-500/30 ring-1 ring-amber-500/20'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    msg.read ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500' : 'bg-amber-500 text-neutral-950'
                  }`}>
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
                      {msg.name}
                    </h3>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
                      {msg.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-neutral-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {msg.date}
                  </span>

                  <div className="flex items-center gap-1">
                    {!msg.read && (
                      <button
                        onClick={() => markMessageRead(msg.id)}
                        className="p-1.5 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 text-xs font-medium flex items-center gap-1"
                        title="Mark as Read"
                      >
                        <MailOpen className="w-3.5 h-3.5" />
                        <span>Mark Read</span>
                      </button>
                    )}

                    <a
                      href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-amber-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs flex items-center gap-1"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>Reply</span>
                    </a>

                    <button
                      onClick={() => setDeleteTarget(msg)}
                      className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-3 space-y-1">
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                  {msg.subject}
                </h4>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 whitespace-pre-line leading-relaxed">
                  {msg.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Message?"
        itemName={deleteTarget?.subject || ''}
        itemType="Inquiry Message"
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteMessage(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
