import { useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import VerifyModal from '../components/VerifyModal';
import { register } from '../services/authService';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({ username, email, password });
      setRegisteredEmail(email);
      setShowVerifyModal(true);
    } catch {
      setError('Kayıt başarısız. Bilgileri kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedBackground>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Kayıt Ol</h1>
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300">Giriş</Link>
        </div>

        <form onSubmit={submit} className="glass-effect rounded-xl p-6 space-y-4">
          {error && <div className="text-sm text-red-400 bg-red-950/30 border border-red-900 rounded p-2">{error}</div>}
          <div>
            <label className="block text-sm text-zinc-300 mb-1">Kullanıcı Adı</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded-lg bg-black border border-zinc-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm text-zinc-300 mb-1">E-posta</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg bg-black border border-zinc-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm text-zinc-300 mb-1">Şifre</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg bg-black border border-zinc-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none px-3 py-2" required />
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-60 px-4 py-2">{loading ? 'Gönderiliyor...' : 'Kayıt Ol'}</button>
        </form>

        <VerifyModal
          email={registeredEmail}
          isOpen={showVerifyModal}
          onClose={() => {
            setShowVerifyModal(false);
            setRegisteredEmail('');
          }}
          onSuccess={() => {
            // Doğrulama başarılı, login sayfasına yönlendir
            window.location.href = '/login';
          }}
        />
      </div>
    </AnimatedBackground>
  );
}

export default RegisterPage;


