import { Mail, Send, X } from 'lucide-react';
import { useState } from 'react';
import { forgotPassword } from '../services/authService';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('E-posta adresi gerekli');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      await forgotPassword(email);
      setMessage('Şifre sıfırlama linki e-posta adresinize gönderildi. Lütfen e-posta kutunuzu kontrol edin.');
      setEmail('');
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error 
        : 'Bir hata oluştu. Lütfen tekrar deneyin.';
      setError(errorMessage || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="glass-effect-enhanced rounded-2xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Şifremi Unuttum
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <p className="text-zinc-300 text-sm">
            E-posta adresinizi girin, size şifre sıfırlama linki gönderelim.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-300 mb-1">E-posta Adresi</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  disabled={loading}
                  className="w-full text-white rounded-lg bg-black border border-zinc-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none px-3 py-2 pl-10"
                  required
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading || !email}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-2 font-medium transition-all duration-300"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Linki Gönder'}
            </button>
          </form>
          
          {message && (
            <div className="text-sm text-green-400 bg-green-950/30 border border-green-900 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                {message}
              </div>
            </div>
          )}
          
          {error && (
            <div className="text-sm text-red-400 bg-red-950/30 border border-red-900 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                {error}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordModal;
