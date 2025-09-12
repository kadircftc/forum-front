import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { useState } from 'react';
import { verifyEmail } from '../services/authService';

interface VerifyModalProps {
  email: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function VerifyModal({ email, isOpen, onClose, onSuccess }: VerifyModalProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await verifyEmail({ email, code: code.trim() });
      setAttemptsLeft(res.attempts_left);
      
      if (res.verified) {
        setTimeout(() => {
          onSuccess();
          onClose();
          setCode('');
          setError(null);
          setAttemptsLeft(null);
        }, 1500);
      } else {
        setError(`Hatalı kod. ${res.attempts_left} deneme hakkınız kaldı.`);
      }
    } catch (err) {
      setError('Doğrulama başarısız. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="glass-effect rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-cyan-400" />
            E-posta Doğrulama
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-zinc-800/40 rounded-lg">
          <div className="text-sm text-zinc-300 mb-1">Doğrulama kodu gönderildi:</div>
          <div className="text-cyan-400 font-medium">{email}</div>
          {attemptsLeft !== null && (
            <div className="text-xs text-zinc-400 mt-1">
              Kalan deneme hakkı: {attemptsLeft}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-300 mb-2">
              6 haneli doğrulama kodu
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              className="w-full rounded-lg bg-black border border-zinc-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none px-3 py-2 text-center text-lg tracking-widest"
              maxLength={6}
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-950/30 border border-red-900 rounded p-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

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
              disabled={loading || code.length !== 6}
              className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-60 transition"
            >
              {loading ? 'Doğrulanıyor...' : 'Doğrula'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VerifyModal;
