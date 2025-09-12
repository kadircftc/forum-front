import { ExternalLink, HeadphonesIcon, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';

function HomePage() {
  return (
    <AnimatedBackground>
      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="floating-particle" style={{left: '10%', animationDelay: '0s'}}></div>
        <div className="floating-particle" style={{left: '20%', animationDelay: '2s'}}></div>
        <div className="floating-particle" style={{left: '30%', animationDelay: '4s'}}></div>
        <div className="floating-particle" style={{left: '40%', animationDelay: '6s'}}></div>
        <div className="floating-particle" style={{left: '50%', animationDelay: '1s'}}></div>
        <div className="floating-particle" style={{left: '60%', animationDelay: '3s'}}></div>
        <div className="floating-particle" style={{left: '70%', animationDelay: '5s'}}></div>
        <div className="floating-particle" style={{left: '80%', animationDelay: '7s'}}></div>
        <div className="floating-particle" style={{left: '90%', animationDelay: '1.5s'}}></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-white relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img 
              src="/reqspark_logo.png" 
              alt="Reqspark Logo" 
              className="w-40  object-contain"
            />
            <div className="inline-block relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 rounded-lg blur opacity-30 animate-pulse-slow"></div>
              <h1 className="relative text-2xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Forum
              </h1>
            </div>
          </div>
          <p className="mt-4 text-lg text-zinc-300">Toplulukla buluş, bilgi paylaş, sorular sor.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="glass-effect-enhanced rounded-2xl p-6 card-hover-effect animate-float-up" style={{animationDelay: '0.1s'}}>
            <h3 className="text-xl font-semibold mb-2">Kategorileri Keşfet</h3>
            <p className="text-zinc-400 text-sm">İlgi alanlarına göre tartışmaları keşfet.</p>
          </div>
          <div className="glass-effect-enhanced rounded-2xl p-6 card-hover-effect animate-float-up" style={{animationDelay: '0.2s'}}>
            <h3 className="text-xl font-semibold mb-2">Soru Sor</h3>
            <p className="text-zinc-400 text-sm">Topluluktan hızlı yanıtlar al.</p>
          </div>
          <div className="glass-effect-enhanced rounded-2xl p-6 card-hover-effect animate-float-up" style={{animationDelay: '0.3s'}}>
            <h3 className="text-xl font-semibold mb-2">Katkı Sağla</h3>
            <p className="text-zinc-400 text-sm">Bilgini paylaş, başkalarına yardımcı ol.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <Link 
            to="/login" 
            className="group relative rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-8 py-4 font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
          >
            <span className="relative z-10">Giriş Yap</span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
          
          <Link 
            to="/register" 
            className="group relative rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 px-8 py-4 font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
          >
            <span className="relative z-10">Kayıt Ol</span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
          
          <Link 
            to="/forum" 
            className="group relative rounded-xl bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-400 hover:to-teal-500 px-8 py-4 font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
          >
            <span className="relative z-10">Foruma Git</span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </div>

        {/* Daha Fazla Bilgi ve Destek Bölümü */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Daha Fazla Bilgi ve Destek
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-effect-enhanced rounded-2xl p-8 text-center card-hover-effect animate-float-up" style={{animationDelay: '1.4s'}}>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                <ExternalLink className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Daha Fazla Bilgi</h3>
              <p className="text-zinc-400 text-sm mb-4">
                Reqspark hakkında detaylı bilgi almak, ürün özelliklerini keşfetmek ve güncel gelişmeleri takip etmek için ana web sitemizi ziyaret edin.
              </p>
              <a 
                href="https://reqspark.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 px-6 py-3 font-medium transition-all duration-300 hover:scale-105"
              >
                <span>reqspark.com</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            
            <div className="glass-effect-enhanced rounded-2xl p-8 text-center card-hover-effect animate-float-up" style={{animationDelay: '1.5s'}}>
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-float" style={{animationDelay: '0.5s'}}>
                <HeadphonesIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Müşteri Desteği</h3>
              <p className="text-zinc-400 text-sm mb-4">
                Özel müşteri destek portalımız yakında hizmetinizde! Teknik destek, hesap yönetimi ve özel çözümler için bize ulaşın.
              </p>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-400 hover:to-teal-500 px-6 py-3 font-medium transition-all duration-300 hover:scale-105 cursor-not-allowed opacity-75">
                  <span>customer.reqspark.com</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
                <div className="text-xs text-yellow-400 bg-yellow-900/20 border border-yellow-800 rounded-lg px-3 py-2">
                  🚀 Yakında hizmetinizde!
                </div>
              </div>
            </div>
          </div>
        </div>

       

        {/* Özellikler Bölümü */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Neden Reqspark Forum?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-effect-enhanced rounded-2xl p-8 text-center card-hover-effect animate-float-up" style={{animationDelay: '0.8s'}}>
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Güvenli Platform</h3>
              <p className="text-zinc-400 text-sm">End-to-end şifreleme ile verileriniz güvende</p>
            </div>
            <div className="glass-effect-enhanced rounded-2xl p-8 text-center card-hover-effect animate-float-up" style={{animationDelay: '0.9s'}}>
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-float" style={{animationDelay: '0.5s'}}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Hızlı Yanıt</h3>
              <p className="text-zinc-400 text-sm">Gerçek zamanlı mesajlaşma ve anında bildirimler</p>
            </div>
            <div className="glass-effect-enhanced rounded-2xl p-8 text-center card-hover-effect animate-float-up" style={{animationDelay: '1.0s'}}>
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-float" style={{animationDelay: '1s'}}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Topluluk Odaklı</h3>
              <p className="text-zinc-400 text-sm">Uzman topluluk ve kaliteli içerik</p>
            </div>
          </div>
        </div>

        {/* Sosyal Medya Bölümü */}
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Bizi Sosyal Medyadan Takip Edin
          </h3>
          <div className="flex justify-center gap-4">
            <a 
              href="https://www.linkedin.com/company/reqspark/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:bg-gray-700 transition-all duration-300 hover:scale-110 social-btn animate-float-up"
              style={{animationDelay: '1.1s'}}
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a 
              href="https://x.com/reqspark" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:bg-gray-700 transition-all duration-300 hover:scale-110 social-btn animate-float-up"
              style={{animationDelay: '1.2s'}}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a 
              href="https://www.instagram.com/reqspark/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:bg-gray-700 transition-all duration-300 hover:scale-110 social-btn animate-float-up"
              style={{animationDelay: '1.3s'}}
            >
              <Instagram className="w-6 h-6" />
            </a>
          </div>
          <p className="text-zinc-400 text-sm mt-4">
            Güncel haberler, ipuçları ve topluluk etkinlikleri için bizi takip edin
          </p>
        </div>
      </div>
    </AnimatedBackground>
  );
}

export default HomePage;


