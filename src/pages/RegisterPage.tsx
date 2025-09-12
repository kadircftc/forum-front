import { Eye, EyeOff, Info, X } from 'lucide-react';
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
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Şifre validasyon fonksiyonları
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      isValid: minLength && hasLetter && hasNumber && hasSpecialChar,
      minLength,
      hasLetter,
      hasNumber,
      hasSpecialChar
    };
  };

  const passwordValidation = validatePassword(password);
  const passwordsMatch = password === confirmPassword;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!kvkkAccepted) {
      setError('KVKK onayı gereklidir.');
      return;
    }

    if (!passwordValidation.isValid) {
      setError('Şifre en az 8 karakter olmalı ve harf, sayı, özel karakter içermelidir.');
      return;
    }

    if (!passwordsMatch) {
      setError('Şifreler eşleşmiyor.');
      return;
    }
    
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
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className={`w-full rounded-lg bg-black border focus:ring-1 focus:ring-cyan-500 outline-none px-3 py-2 pr-10 ${
                  password && !passwordValidation.isValid 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-zinc-800 focus:border-cyan-500'
                }`}
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {/* Şifre Güçlülük Göstergesi */}
            {password && (
              <div className="mt-2 space-y-1">
                <div className="text-xs text-zinc-400">Şifre gereksinimleri:</div>
                <div className="space-y-1">
                  <div className={`flex items-center gap-2 text-xs ${passwordValidation.minLength ? 'text-green-400' : 'text-red-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${passwordValidation.minLength ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    En az 8 karakter
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${passwordValidation.hasLetter ? 'text-green-400' : 'text-red-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${passwordValidation.hasLetter ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    En az bir harf
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${passwordValidation.hasNumber ? 'text-green-400' : 'text-red-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${passwordValidation.hasNumber ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    En az bir sayı
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
                className={`w-full rounded-lg bg-black border focus:ring-1 focus:ring-cyan-500 outline-none px-3 py-2 pr-10 ${
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
          
          {/* KVKK Onayı */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="kvkk"
              checked={kvkkAccepted}
              onChange={(e) => setKvkkAccepted(e.target.checked)}
              className="mt-1 w-4 h-4 text-cyan-500 bg-black border-zinc-800 rounded focus:ring-cyan-500 focus:ring-2"
            />
            <label htmlFor="kvkk" className="text-sm text-zinc-300">
              <span 
                className="text-cyan-400 cursor-pointer hover:underline" 
                onClick={(e) => {
                  e.preventDefault();
                  setShowUserInfoModal(true);
                }}
              >
                Kişisel Verilerin Korunması Kanunu (KVKK)
              </span> kapsamında kişisel verilerimin işlenmesini kabul ediyorum.
            </label>
          </div>
          
          <button 
            type="submit" 
            disabled={loading || !kvkkAccepted} 
            className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-60 px-4 py-2"
          >
            {loading ? 'Gönderiliyor...' : 'Kayıt Ol'}
          </button>
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

        {/* Kullanıcı Bilgileri Modalı */}
        {showUserInfoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="glass-effect-enhanced rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Kişisel Verilerin Korunması Kanunu (KVKK)
                </h2>
                <button
                  onClick={() => setShowUserInfoModal(false)}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6 text-sm text-zinc-300">
                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-3">Toplanan Kişisel Veriler</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                      <Info className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                      <div>
                        <strong>E-posta Adresi:</strong> Hesap doğrulama ve iletişim için kullanılır
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                      <Info className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                      <div>
                        <strong>Kullanıcı Adı:</strong> Platform içi kimlik ve profil için kullanılır
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                      <Info className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                      <div>
                        <strong>IP Adresi:</strong> Güvenlik ve analitik amaçlı otomatik olarak toplanır
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                      <Info className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                      <div>
                        <strong>Tarayıcı Bilgileri:</strong> Platform optimizasyonu için toplanır
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-3">Veri İşleme Amaçları</h3>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Hesap oluşturma ve yönetimi</li>
                    <li>Platform güvenliğinin sağlanması</li>
                    <li>Kullanıcı deneyiminin iyileştirilmesi</li>
                    <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                    <li>Teknik destek sağlanması</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-3">Veri Güvenliği</h3>
                  <div className="p-4 bg-green-900/20 border border-green-800 rounded-lg">
                    <p className="text-green-300">
                      <strong>End-to-End Şifreleme:</strong> Tüm kişisel verileriniz şifreleme standardı ile korunmaktadır.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-3">Haklarınız</h3>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Kişisel verilerinize erişim hakkı</li>
                    <li>Yanlış verilerin düzeltilmesi hakkı</li>
                    <li>Verilerin silinmesi hakkı</li>
                    <li>Veri işlemeye itiraz hakkı</li>
                    <li>Veri taşınabilirliği hakkı</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-3">İletişim</h3>
                  <p>
                    KVKK kapsamındaki haklarınızı kullanmak için{' '}
                    <a href="mailto:kvkk@reqspark.com" className="text-cyan-400 hover:underline">
                      kvkk@reqspark.com
                    </a>{' '}
                    adresinden bizimle iletişime geçebilirsiniz.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowUserInfoModal(false)}
                  className="flex-1 rounded-lg border border-zinc-700 hover:border-cyan-500 px-4 py-2 transition-colors"
                >
                  Kapat
                </button>
                <button
                  onClick={() => {
                    setShowUserInfoModal(false);
                  }}
                  className="flex-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-4 py-2"
                >
                  Anladım
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AnimatedBackground>
  );
}

export default RegisterPage;


