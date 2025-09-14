import { ArrowLeft, LogIn } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/authService';

function LoginPage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ email, password });
      // Login başarılı olduktan sonra kullanıcı bilgilerini API'den al
      await refreshUser();
      navigate('/forum');
    } catch {
      setError('Giriş başarısız. Bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedBackground>
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mt-10 transition-colors duration-300">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ana Sayfaya Dön
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Giriş Yap
        </h1>

        <form onSubmit={handleSubmit} className="glass-effect rounded-xl p-6 space-y-4">
          {error && (
            <div className="text-sm text-red-400 bg-red-950/30 border border-red-900 rounded p-2">{error}</div>
          )}

          <div>
            <label className="block text-sm text-zinc-300 mb-1">E-posta</label>
            <input
              type="email"
              className="w-full rounded-lg bg-black border border-zinc-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none px-3 py-2"
              placeholder="ornek@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-300 mb-1">Şifre</label>
            <input
              type="password"
              className="w-full rounded-lg bg-black border border-zinc-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none px-3 py-2"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-2 font-medium"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        {/* Şifremi Unuttum Linki */}
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors duration-300 hover:underline"
          >
            Şifremi Unuttum
          </button>
        </div>

        {/* Kayıt Ol Linki */}
        <div className="text-center mt-6">
          <p className="text-zinc-400 text-sm">
            Hesabınız yok mu?{' '}
            <Link to="/register" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 hover:underline">
              Kayıt Ol
            </Link>
          </p>
        </div>
      </div>

      {/* Şifremi Unuttum Modalı */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </AnimatedBackground>
  );
}

export default LoginPage;


