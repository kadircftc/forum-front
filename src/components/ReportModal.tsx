import { Flag, X } from 'lucide-react';
import { useState } from 'react';
import { createReport } from '../services/reportService';
import type { MessageDto } from '../types';

interface ReportModalProps {
  message: MessageDto | null;
  isOpen: boolean;
  onClose: () => void;
}

function ReportModal({ message, isOpen, onClose }: ReportModalProps) {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !message) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await createReport({ message_id: message.id, reason: reason.trim() || undefined });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setReason('');
      }, 1500);
    } catch (error) {
      console.error('Report failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="glass-effect rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Flag className="w-5 h-5 text-red-400" />
            Mesajı Raporla
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="text-center py-4">
            <div className="text-green-400 font-medium">Rapor başarıyla gönderildi!</div>
          </div>
        ) : (
          <>
            <div className="mb-4 p-3 bg-zinc-800/40 rounded-lg">
              <div className="text-sm text-zinc-300 mb-2">Raporlanacak mesaj:</div>
              <div className="text-xs text-zinc-400 whitespace-pre-wrap line-clamp-3">
                {message.content}
              </div>
              <div className="text-[10px] text-zinc-500 mt-1">
                #{message.id} • {message.username || 'Bilinmeyen kullanıcı'}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-300 mb-2">
                  Rapor nedeni (opsiyonel)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Mesajın neden uygunsuz olduğunu açıklayın..."
                  rows={3}
                  className="w-full rounded-lg bg-black border border-zinc-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none px-3 py-2 text-sm"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:border-zinc-600 transition"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 disabled:opacity-60 transition"
                >
                  {submitting ? 'Gönderiliyor...' : 'Raporla'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ReportModal;
