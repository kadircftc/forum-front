import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { createThreadWithMessage } from '../services/threadService';
import type { ThreadDto } from '../types';

interface ThreadCreateModalProps {
  categoryId: number;
  categoryName: string;
  isOpen: boolean;
  onClose: () => void;
  onCreated: (thread: ThreadDto) => void;
}

function ThreadCreateModal({ categoryId, categoryName, isOpen, onClose, onCreated }: ThreadCreateModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || submitting) return;
    
    setSubmitting(true);
    setError(null);
    
    try {
      const res = await createThreadWithMessage({ 
        category_id: categoryId, 
        title: title.trim(), 
        content: content.trim() 
      });
      onCreated(res.thread);
      onClose();
      setTitle('');
      setContent('');
    } catch {
      setError('Thread oluşturulamadı. Lütfen tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      onClose();
      setTitle('');
      setContent('');
      setError(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="glass-effect rounded-xl p-6 max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-cyan-400" />
            Yeni Thread Oluştur
          </h3>
          <button
            onClick={handleClose}
            disabled={submitting}
            className="text-zinc-400 hover:text-white transition disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-zinc-800/40 rounded-lg">
          <div className="text-sm text-zinc-300">Kategori: <span className="text-cyan-400 font-medium">{categoryName}</span></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-300 mb-2">
              Thread Başlığı
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Thread başlığını girin..."
              className="w-full rounded-lg bg-black border text-white border-zinc-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none px-3 py-2"
              required
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-300 mb-2">
              İlk Mesaj
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Thread'iniz için ilk mesajınızı yazın..."
              rows={4}
              className="w-full rounded-lg bg-black border text-white border-zinc-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none px-3 py-2"
              required
              disabled={submitting}
            />
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-950/30 border border-red-900 rounded p-2">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="flex-1 px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:border-zinc-600 transition disabled:opacity-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={submitting || !title.trim() || !content.trim()}
              className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-60 transition"
            >
              {submitting ? 'Oluşturuluyor...' : 'Thread Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ThreadCreateModal;
