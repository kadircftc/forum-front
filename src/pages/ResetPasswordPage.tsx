import { AlertCircle, ArrowLeft, CheckCircle, Eye, EyeOff, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import { resetPassword, verifyResetToken } from '../services/authService';

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(false);
  const [email, setEmail] = useState('');
  const [verifying, setVerifying] = useState(true);

  const token = searchParams.get('token');

  // Şifre validasyon fonksiyonları
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar,
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar
    };
  };

  const passwordValidation = validatePassword(newPassword);
  const passwordsMatch = newPassword === confirmPassword;

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setError('Geçersiz token');
      setVerifying(false);
    }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const verifyToken = async () => {
    try {
      const data = await verifyResetToken(token!);
      if (data.valid) {
        setTokenValid(true);
        setEmail(data.email);
      } else {
        setError('Geçersiz veya süresi dolmuş token');
      }
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error 
        : 'Token doğrulanamadı';
      setError(errorMessage || 'Token doğrulanamadı');
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      setError('Tüm alanları doldurun');
      return;
    }

    if (!passwordValidation.isValid) {
      setError('Şifre gereksinimleri karşılanmıyor');
      return;
    }

    if (!passwordsMatch) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      await resetPassword(token!, newPassword);
      setMessage('Şifreniz başarıyla sıfırlandı. 3 saniye sonra giriş sayfasına yönlendirileceksiniz.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error 
        : 'Şifre sıfırlanamadı';
      setError(errorMessage || 'Şifre sıfırlanamadı');
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <AnimatedBackground>
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white">
          <div className="glass-effect-enhanced rounded-2xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Token Doğrulanıyor</h2>
            <p className="text-zinc-400">Lütfen bekleyin...</p>
          </div>
        </div>
      </AnimatedBackground>
    );
  }

  if (!tokenValid) {
    return (
      <AnimatedBackground>
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white">
          <div className="glass-effect-enhanced rounded-2xl p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-red-400">Geçersiz Token</h2>
            <p className="text-zinc-400 mb-6">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-6 py-2 font-medium transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Giriş Sayfasına Dön
            </button>
          </div>
        </div>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground>
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white">
        <div className="mb-8">
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Giriş Sayfasına Dön
          </button>
        </div>

        <div className="glass-effect-enhanced rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
              Şifre Sıfırlama
            </h1>
            <p className="text-zinc-400">
              Merhaba! <span className="text-cyan-400">{email}</span> için yeni şifrenizi belirleyin.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="text-sm text-red-400 bg-red-950/30 border border-red-900 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  {error}
                </div>
              </div>
            )}

            {message && (
              <div className="text-sm text-green-400 bg-green-950/30 border border-green-900 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {message}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm text-zinc-300 mb-1">Yeni Şifre</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="En az 8 karakter"
                  disabled={loading}
                  className={`w-full text-white rounded-lg bg-black border focus:ring-1 focus:ring-cyan-500 outline-none px-3 py-2 pr-10 ${
                    newPassword && !passwordValidation.isValid 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-zinc-800 focus:border-cyan-500'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-300"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Şifre Güçlülük Göstergesi */}
              {newPassword && (
                <div className="mt-3 space-y-2">
                  <div className="text-xs text-zinc-400">Şifre gereksinimleri:</div>
                  <div className="space-y-1">
                    <div className={`flex items-center gap-2 text-xs ${passwordValidation.minLength ? 'text-green-400' : 'text-red-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${passwordValidation.minLength ? 'bg-green-400' : 'bg-red-400'}`}></div>
                      En az 8 karakter
                    </div>
                    <div className={`flex items-center gap-2 text-xs ${passwordValidation.hasUpperCase ? 'text-green-400' : 'text-red-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${passwordValidation.hasUpperCase ? 'bg-green-400' : 'bg-red-400'}`}></div>
                      En az bir büyük harf (A-Z)
                    </div>
                    <div className={`flex items-center gap-2 text-xs ${passwordValidation.hasLowerCase ? 'text-green-400' : 'text-red-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${passwordValidation.hasLowerCase ? 'bg-green-400' : 'bg-red-400'}`}></div>
                      En az bir küçük harf (a-z)
                    </div>
                    <div className={`flex items-center gap-2 text-xs ${passwordValidation.hasNumber ? 'text-green-400' : 'text-red-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${passwordValidation.hasNumber ? 'bg-green-400' : 'bg-red-400'}`}></div>
                      En az bir sayı (0-9)
                    </div>
                    <div className={`flex items-center gap-2 text-xs ${passwordValidation.hasSpecialChar ? 'text-green-400' : 'text-red-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${passwordValidation.hasSpecialChar ? 'bg-green-400' : 'bg-red-400'}`}></div>
                      En az bir özel karakter (!@#$%^&*)
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm text-zinc-300 mb-1">Şifre Tekrar</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Şifreyi tekrar girin"
                  disabled={loading}
                  className={`w-full text-white rounded-lg bg-black border focus:ring-1 focus:ring-cyan-500 outline-none px-3 py-2 pr-10 ${
                    confirmPassword && !passwordsMatch 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-zinc-800 focus:border-cyan-500'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Şifre Eşleşme Göstergesi */}
              {confirmPassword && (
                <div className="mt-2">
                  <div className={`flex items-center gap-2 text-xs ${passwordsMatch ? 'text-green-400' : 'text-red-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${passwordsMatch ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    {passwordsMatch ? 'Şifreler eşleşiyor' : 'Şifreler eşleşmiyor'}
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !passwordValidation.isValid || !passwordsMatch}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-400 hover:to-teal-500 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-3 font-medium transition-all duration-300"
            >
              <Lock className="w-4 h-4" />
              {loading ? 'Sıfırlanıyor...' : 'Şifremi Sıfırla'}
            </button>
          </form>
        </div>
      </div>
    </AnimatedBackground>
  );
}

export default ResetPasswordPage;
