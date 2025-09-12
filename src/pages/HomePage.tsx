import { Link } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';

function HomePage() {
  return (
    <AnimatedBackground>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-white">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img 
              src="/reqspark_logo.png" 
              alt="Reqspark Logo" 
              className="w-40  object-contain"
            />
            <div className="inline-block relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 rounded-lg blur opacity-30 animate-pulse-slow"></div>
              <h1 className="relative text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Forum
              </h1>
            </div>
          </div>
          <p className="mt-4 text-lg text-zinc-300">Toplulukla buluş, bilgi paylaş, sorular sor.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="glass-effect rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-2">Kategorileri Keşfet</h3>
            <p className="text-zinc-400 text-sm">İlgi alanlarına göre tartışmaları keşfet.</p>
          </div>
          <div className="glass-effect rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-2">Soru Sor</h3>
            <p className="text-zinc-400 text-sm">Topluluktan hızlı yanıtlar al.</p>
          </div>
          <div className="glass-effect rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-2">Katkı Sağla</h3>
            <p className="text-zinc-400 text-sm">Bilgini paylaş, başkalarına yardımcı ol.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/login" className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-5 py-2 font-medium">Giriş Yap</Link>
          <Link to="/register" className="rounded-lg border border-zinc-700 hover:border-cyan-500 px-5 py-2 font-medium">Kayıt Ol</Link>
          <Link to="/forum" className="rounded-lg border border-zinc-700 hover:border-cyan-500 px-5 py-2 font-medium">Foruma Git</Link>
        </div>
      </div>
    </AnimatedBackground>
  );
}

export default HomePage;


