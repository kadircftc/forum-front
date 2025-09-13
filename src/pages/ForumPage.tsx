import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import { useAuth } from '../context/AuthContext';
import { listAdminCategories } from '../services/adminCategoryService';
import { listAdminThreadMessages, listAdminThreadsByCategory } from '../services/adminThreadService';
import { listCategories } from '../services/categoryService';
import { createMessage, listMessagesByThread } from '../services/messageService';
import socketService from '../services/socketService';
import { deleteThread, listThreadsByCategory, searchThreads } from '../services/threadService';
import type { AdminCategoryDto, AdminMessageDto, AdminThreadDto, CategoryDto, MessageDto, ThreadDto, ThreadSearchResponseDto } from '../types';

function ForumPage() {
  const { isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [adminCategories, setAdminCategories] = useState<AdminCategoryDto[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedAdminCategoryId, setSelectedAdminCategoryId] = useState<number | null>(null);
  const [threads, setThreads] = useState<ThreadDto[]>([]);
  const [adminThreads, setAdminThreads] = useState<AdminThreadDto[]>([]);
  const [selectedThread, setSelectedThread] = useState<ThreadDto | null>(null);
  const [selectedAdminThread, setSelectedAdminThread] = useState<AdminThreadDto | null>(null);
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [adminMessages, setAdminMessages] = useState<AdminMessageDto[]>([]);
  const [messagesPage, setMessagesPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [reportModal, setReportModal] = useState<{ isOpen: boolean; message: MessageDto | null }>({ isOpen: false, message: null });
  const [threadCreateModal, setThreadCreateModal] = useState<{ isOpen: boolean; categoryId: number; categoryName: string }>({ isOpen: false, categoryId: 0, categoryName: '' });
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const justAppendedRef = useRef(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchInfo, setSearchInfo] = useState<Pick<ThreadSearchResponseDto, 'page' | 'limit' | 'total' | 'has_more'> | null>(null);
  const [currentSearchPage, setCurrentSearchPage] = useState(1);
  const [newMessageThreads, setNewMessageThreads] = useState<Set<number>>(new Set());
  const [threadMessageCounts, setThreadMessageCounts] = useState<Map<number, number>>(new Map());

  useEffect(() => {
    (async () => {
      const res = await listCategories();
      setCategories(res.categories);
      
      // Admin kategorileri de yükle
      try {
        const adminRes = await listAdminCategories({ page: 1, limit: 50 });
        setAdminCategories(adminRes.items);
      } catch (error) {
        console.error('Admin kategorileri yüklenirken hata:', error);
      }
    })();
  }, []);

  // Socket bağlantısı ve mesaj dinleyicisi
  useEffect(() => {
    if (user) {
      // Socket bağlantısını kur
      socketService.connect();
      
      // Kullanıcı ID'sini socket'e ayarla
      socketService.setUser(user.id);

      // Yeni mesaj dinleyicisi
      const handleNewMessage = (message: MessageDto & { 
        is_mine: boolean; 
        align: 'left' | 'right'; 
        username?: string; 
        thread_title?: string; 
        category_name?: string; 
        category_id?: number;
      }) => {
        // Eğer kullanıcı mesajın geldiği thread'de ise mesajı direkt ekle
        if (selectedThread && message.thread_id === selectedThread.id) {
          setMessages(prev => {
            justAppendedRef.current = true;
            return [...prev, message];
          });
        } else {
          // Değilse thread'i yanıp sönen listeye ekle ve mesaj sayısını artır
          setNewMessageThreads(prev => new Set(prev).add(message.thread_id));
          
          // Mesaj sayısını artır
          setThreadMessageCounts(prev => {
            const newMap = new Map(prev);
            const currentCount = newMap.get(message.thread_id) || 0;
            newMap.set(message.thread_id, currentCount + 1);
            return newMap;
          });

          // 5 saniye sonra yanıp sönme efektini kaldır
          setTimeout(() => {
            setNewMessageThreads(prev => {
              const newSet = new Set(prev);
              newSet.delete(message.thread_id);
              return newSet;
            });
          }, 5000);
        }
      };

      socketService.onNewMessage(handleNewMessage);

      return () => {
        socketService.offNewMessage(handleNewMessage);
        socketService.disconnect();
      };
    }
  }, [user, selectedThread, navigate]);

  useEffect(() => {
    if (!selectedCategoryId) return;
    (async () => {
      setLoading(true);
      try {
        const res = await listThreadsByCategory({ category_id: selectedCategoryId });
        console.log('Backend\'den gelen thread\'ler:', res.threads);
        setThreads(res.threads);
        setSelectedThread(null);
        setMessages([]);
        // Admin verilerini temizle
        setSelectedAdminCategoryId(null);
        setSelectedAdminThread(null);
        setAdminThreads([]);
        setAdminMessages([]);
        navigate(`/forum/${selectedCategoryId}`, { replace: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedCategoryId]);

  // Normal kategori seçimi
  const selectNormalCategory = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    // Admin verilerini temizle
    setSelectedAdminCategoryId(null);
    setSelectedAdminThread(null);
    setAdminThreads([]);
    setAdminMessages([]);
  };

  // Admin kategori seçimi
  const selectAdminCategory = async (categoryId: number) => {
    setSelectedAdminCategoryId(categoryId);
    setSelectedCategoryId(null);
    setSelectedThread(null);
    setSelectedAdminThread(null);
    setMessages([]);
    setAdminMessages([]);
    
    // URL'yi güncelle
    navigate(`/forum/a-${categoryId}`, { replace: true });
    
    try {
      setLoading(true);
      const res = await listAdminThreadsByCategory({ admin_category_id: categoryId });
      setAdminThreads(res.threads);
      setThreads([]);
    } catch (error) {
      console.error('Admin threadleri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };


  // Admin thread seçimi
  const selectAdminThread = async (thread: AdminThreadDto) => {
    setSelectedAdminThread(thread);
    setSelectedThread(null);
    setMessages([]);
    
    // URL'yi güncelle
    if (selectedAdminCategoryId) {
      navigate(`/forum/a-${selectedAdminCategoryId}/${thread.id}`, { replace: true });
    }
    
    try {
      setLoading(true);
      const res = await listAdminThreadMessages({ admin_thread_id: thread.id, page: 1 });
      setAdminMessages(res.messages);
      setMessages([]);
    } catch (error) {
      console.error('Admin mesajları yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize from URL
  useEffect(() => {
    const categoryId = params.categoryId ? Number(params.categoryId) : null;
    const adminCategoryId = params.adminCategoryId ? Number(params.adminCategoryId) : null;
    const threadId = params.threadId ? Number(params.threadId) : null;
    
    // Normal kategori seçimi
    if (categoryId && categoryId !== selectedCategoryId) {
      setSelectedCategoryId(categoryId);
      setSelectedAdminCategoryId(null);
      setSelectedThread(null);
      setSelectedAdminThread(null);
      setMessages([]);
      setAdminMessages([]);
    }
    
    // Admin kategori seçimi
    if (adminCategoryId && adminCategoryId !== selectedAdminCategoryId) {
      selectAdminCategory(adminCategoryId);
    }
    
    // Thread seçimi
    if (threadId) {
      if (selectedCategoryId && threads.length) {
        const t = threads.find((x) => x.id === threadId);
        if (t) {
          setSelectedThread(t);
          (async () => {
            const res = await listMessagesByThread({ thread_id: t.id, page: 1 });
            setMessages(res.messages);
            setMessagesPage(1);
            setHasMoreMessages(res.messages.length > 0);
            justAppendedRef.current = true;
          })();
        }
      } else if (selectedAdminCategoryId && adminThreads.length) {
        const t = adminThreads.find((x) => x.id === threadId);
        if (t) {
          selectAdminThread(t);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.categoryId, params.adminCategoryId, params.threadId, threads.length, adminThreads.length]);

  const canDeleteThread = useMemo(() => {
    return (t: ThreadDto) => isAdmin || (user && t.user_id === user.id);
  }, [isAdmin, user]);

  const runSearch = async (page: number) => {
    if (!selectedCategoryId && !query) return;
    setLoading(true);
    try {
      const res = await searchThreads({ q: query || undefined, category_id: selectedCategoryId || undefined, page, limit: 50 });
      setThreads(res.items);
      setSearchInfo({ page: res.page, limit: res.limit, total: res.total, has_more: res.has_more });
      setSelectedThread(null);
      setMessages([]);
      setCurrentSearchPage(page);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await runSearch(1);
  };

  // Optimize: dinle ama sadece temizlendiğinde (debounce) kategori threadlerini geri yükle
  useEffect(() => {
    const trimmed = query.trim();
    // Yalnızca bir arama yapıldıktan sonra (searchInfo doluyken) ve input temizlenince geri yükle
    if (trimmed !== '' || !selectedCategoryId || !searchInfo) return;
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await listThreadsByCategory({ category_id: selectedCategoryId });
        setThreads(res.threads);
        setSelectedThread(null);
        setMessages([]);
        setSearchInfo(null);
        setCurrentSearchPage(1);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [query, selectedCategoryId, searchInfo]);

  const openThread = async (t: ThreadDto) => {
    setSelectedThread(t);
    const res = await listMessagesByThread({ thread_id: t.id, page: 1 });
    setMessages(res.messages);
    setMessagesPage(1);
    setHasMoreMessages(res.messages.length > 0);
    justAppendedRef.current = true;
    navigate(`/forum/${t.category_id}/${t.id}`);
  };

  // Mesajlar yüklendiğinde/eklediğinde alta kaydır
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    if (justAppendedRef.current) {
      container.scrollTop = container.scrollHeight; // direkt alta atla
      justAppendedRef.current = false;
      return;
    }
    // default: değişiklik olduysa yine alta yakın tut
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'auto', block: 'end' });
    }
  }, [messages]);

  // Sonsuza scroll: üstteyken bir önceki sayfayı getir ve ÜSTE ekle
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el || !selectedThread) return;
    const onScroll = async () => {
      if (el.scrollTop <= 0 && hasMoreMessages && !loadingMore) {
        setLoadingMore(true);
        const nextPage = messagesPage + 1;
        const prevHeight = el.scrollHeight;
        try {
          const res = await listMessagesByThread({ thread_id: selectedThread.id, page: nextPage });
          if (res.messages.length === 0) {
            setHasMoreMessages(false);
          } else {
            // Üste ekle (eski mesajlar)
            setMessages((prev) => [...res.messages, ...prev]);
            setMessagesPage(nextPage);
            // Scroll pozisyonunu koru
            requestAnimationFrame(() => {
              const newHeight = el.scrollHeight;
              el.scrollTop = newHeight - prevHeight;
            });
          }
        } finally {
          setLoadingMore(false);
        }
      }
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, [messagesPage, hasMoreMessages, loadingMore, selectedThread]);

  const removeThread = async (t: ThreadDto) => {
    if (!canDeleteThread(t)) return;
    await deleteThread({ id: t.id });
    if (selectedCategoryId) {
      const list = await listThreadsByCategory({ category_id: selectedCategoryId });
      setThreads(list.threads);
      if (selectedThread?.id === t.id) {
        setSelectedThread(null);
        setMessages([]);
      }
    }
  };

  return (
    <AnimatedBackground>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
        {/* Header with logout */}
        <div className="flex items-center justify-between mb-6 p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-600/10 to-purple-600/10 backdrop-blur-md border border-white/20 shadow-xl">
          <div className="flex items-center gap-3">
            {isAdmin ? (
              // Admin kullanıcı için logo ve yönetici yazısı
              <div className="flex items-center gap-3">
                <div className="text-sm text-white/80 font-medium">
                  <div className="text-orange-300 font-bold">👑 Yönetici</div>
                  <div className="text-xs text-white/60">{user?.username}</div>
                </div>
              </div>
            ) : (
              // Normal kullanıcı için avatar
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="text-sm text-white/80 font-medium">
                  {user ? `Hoş geldin, ${user.username}` : 'Misafir'}
                </div>
              </div>
            )}
            
            {/* Socket Bağlantı Durumu */}
            <div className="flex items-center gap-2">
              {socketService.isSocketConnected() ? (
                <div className="flex items-center gap-1 text-green-400 text-xs">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Bağlı</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-400 text-xs">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span>Bağlantı Kesildi</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => navigate('/admin/general')}
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 text-orange-300 hover:from-orange-400/30 hover:to-red-400/30 hover:border-orange-300/50 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-orange-500/20 text-sm"
                >
                  Genel Yönetim
                </button>
                <button
                  onClick={() => navigate('/admin/categories')}
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-400/30 text-purple-300 hover:from-purple-400/30 hover:to-indigo-400/30 hover:border-purple-300/50 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-purple-500/20 text-sm"
                >
                  Admin Kategoriler
                </button>
                <button
                  onClick={() => navigate('/admin/threads')}
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 text-green-300 hover:from-green-400/30 hover:to-emerald-400/30 hover:border-green-300/50 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-green-500/20 text-sm"
                >
                  Admin Threadler
                </button>
              </div>
            )}
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 text-red-300 hover:from-red-400/30 hover:to-pink-400/30 hover:border-red-300/50 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-red-500/20"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Çıkış Yap
              </span>
            </button>
          </div>
        </div>
        {/* Normal Categories row */}
        <div className="mb-4">
          <h3 className="text-sm text-zinc-400 mb-2">Normal Kategoriler</h3>
          <div className="flex items-center gap-3 overflow-x-auto pb-3">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => selectNormalCategory(c.id)}
                className={`px-3 py-1 rounded-full border ${selectedCategoryId === c.id ? 'border-cyan-500 text-cyan-400' : 'border-zinc-700 text-zinc-300'} bg-black/40 hover:border-cyan-500 transition`}
                title={c.description}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Admin Categories row */}
        {adminCategories.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm text-zinc-400 mb-2">Admin Kategoriler</h3>
            <div className="flex items-center gap-3 overflow-x-auto pb-3">
              {adminCategories.map((c) => (
                <button
                  key={`admin-${c.id}`}
                  onClick={() => selectAdminCategory(c.id)}
                  className={`px-3 py-1 rounded-full border admin-category-sparkle ${selectedAdminCategoryId === c.id ? 'border-orange-500 text-orange-400' : 'border-zinc-700 text-zinc-300'} bg-black/40 hover:border-orange-500 transition-all duration-300`}
                  title={c.description}
                >
                  <span className="relative z-10">✨ {c.name} ✨</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search and Create Thread */}
        <form onSubmit={handleSearch} className="mb-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Thread ara..."
            className="w-full rounded-lg bg-black border border-zinc-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none px-3 py-2"
          />
        </form>
        {searchInfo && (
          <div className="mb-3 flex items-center justify-between">
            <div className="text-xs text-zinc-400">Sonuçlar: {searchInfo.total} • Sayfa: {searchInfo.page}</div>
            <div className="flex items-center gap-2">
              <button
                className="px-2 py-1 rounded border border-zinc-700 text-zinc-300 disabled:opacity-50"
                onClick={() => runSearch(Math.max(1, currentSearchPage - 1))}
                disabled={currentSearchPage <= 1 || loading}
              >
                Önceki
              </button>
              <button
                className="px-2 py-1 rounded border border-zinc-700 text-zinc-300 disabled:opacity-50"
                onClick={() => runSearch(currentSearchPage + 1)}
                disabled={!searchInfo.has_more || loading}
              >
                Sonraki
              </button>
            </div>
          </div>
        )}
        {selectedCategoryId && (
          <div className="mb-4">
            <button
              onClick={() => {
                const category = categories.find(c => c.id === selectedCategoryId);
                setThreadCreateModal({ 
                  isOpen: true, 
                  categoryId: selectedCategoryId, 
                  categoryName: category?.name || 'Bilinmeyen' 
                });
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition"
            >
              <Plus className="w-4 h-4" />
              Yeni Thread Oluştur
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Thread list */}
          <aside className="md:col-span-4 lg:col-span-3 space-y-2 max-h-[70vh] overflow-auto pr-2">
            {loading && <div className="text-zinc-400">Yükleniyor...</div>}
            
            {/* Normal Threads */}
            {!loading && selectedCategoryId && threads.map((t) => {
              const hasNewMessage = newMessageThreads.has(t.id);
              const additionalCount = threadMessageCounts.get(t.id) || 0;
              const backendCount = t.message_count || 0;
              
              return (
                <div 
                  key={t.id} 
                  className={`glass-effect p-3 rounded-lg transition-all duration-300 ${
                    selectedThread?.id === t.id ? 'ring-1 ring-cyan-500' : ''
                  } ${
                    hasNewMessage ? 'animate-pulse bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/50' : ''
                  }`}
                >
                  <button className="text-left w-full" onClick={() => {
                    // Thread'e tıklandığında yeni mesaj göstergesini kaldır
                    setNewMessageThreads(prev => {
                      const newSet = new Set(prev);
                      newSet.delete(t.id);
                      return newSet;
                    });
                    setThreadMessageCounts(prev => {
                      const newMap = new Map(prev);
                      newMap.delete(t.id);
                      return newMap;
                    });
                    openThread(t);
                  }}>
                    <div className="font-medium text-zinc-100 line-clamp-2 flex items-center gap-2">
                      {t.title}
                      {hasNewMessage && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-cyan-500 text-white animate-bounce">
                          Yeni!
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-zinc-400 mt-1">
                      {backendCount > 0 && (
                        <span className="ml-2 text-cyan-400">
                          💬 {backendCount}
                          {additionalCount > 0 && (
                            <span className="text-green-400 ml-1">(+{additionalCount})</span>
                          )}
                        </span>
                      )}
                    </div>
                  </button>
                  {(canDeleteThread(t)) && (
                    <button onClick={() => removeThread(t)} className="mt-2 text-xs text-red-400 hover:text-red-300">Sil</button>
                  )}
                </div>
              );
            })}

            {/* Admin Threads */}
            {!loading && selectedAdminCategoryId && adminThreads.map((t) => (
              <div key={`admin-${t.id}`} className={`glass-effect p-3 rounded-lg admin-thread-sparkles ${selectedAdminThread?.id === t.id ? 'ring-1 ring-orange-500' : ''}`}>
                <button className="text-left w-full" onClick={() => selectAdminThread(t)}>
                  <div className="font-medium text-zinc-100 line-clamp-2">✨ {t.title} ✨</div>
                  <div className="text-xs text-orange-400">
                    Reqspark 
                    {t.message_count !== undefined && (
                      <span className="ml-2 text-orange-300">💬 {t.message_count}</span>
                    )}
                  </div>
                </button>
              </div>
            ))}

            {/* No threads message */}
            {!loading && !selectedCategoryId && !selectedAdminCategoryId && (
              <div className="text-zinc-400 text-center py-8">Bir kategori seçin</div>
            )}
            {!loading && selectedCategoryId && threads.length === 0 && (
              <div className="text-zinc-400 text-center py-8">Bu kategoride thread bulunmamaktadır</div>
            )}
            {!loading && selectedAdminCategoryId && adminThreads.length === 0 && (
              <div className="text-zinc-400 text-center py-8">Bu admin kategorisinde thread bulunmamaktadır</div>
            )}
          </aside>

          {/* Thread detail */}
          <main className="md:col-span-8 lg:col-span-9">
            {!selectedThread && !selectedAdminThread && <div className="text-zinc-400">Bir thread seçin.</div>}
            
            {/* Normal Thread */}
            {selectedThread && (
              <div className="space-y-4">
                <div className="glass-effect p-4 rounded-xl">
                  <div className="text-xl font-semibold mb-1">{selectedThread.title}</div>
                </div>
                <div ref={messagesContainerRef} className="space-y-3 max-h-[60vh] overflow-auto">
                  {loadingMore && (
                    <div className="text-center text-xs text-zinc-400">Yükleniyor...</div>
                  )}
                  {messages.map((m) => {
                    const isOwn = m.user_id === (user?.id ?? -1);
                    return (
                      <MessageBubble 
                        key={m.id} 
                        message={m} 
                        isOwn={isOwn} 
                        onReport={(msg) => setReportModal({ isOpen: true, message: msg })}
                      />
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
                <MessageComposer
                  disabled={!selectedThread}
                  onSend={async (content) => {
                    if (!selectedThread) return;
                    const res = await createMessage({ thread_id: selectedThread.id, content });
                    setMessages((prev) => {
                      justAppendedRef.current = true;
                      return [...prev, res.message];
                    });
                  }}
                />
              </div>
            )}

            {/* Admin Thread */}
            {selectedAdminThread && (
              <div className="space-y-4">
                <div className="glass-effect p-4 rounded-xl border-l-4 border-orange-500">
                  <div className="text-xl font-semibold mb-1 text-orange-300">{selectedAdminThread.title}</div>
                  <div className="text-sm text-orange-400">Admin Thread</div>
                </div>
                <div ref={messagesContainerRef} className="space-y-3 max-h-[60vh] overflow-auto">
                  {loadingMore && (
                    <div className="text-center text-xs text-zinc-400">Yükleniyor...</div>
                  )}
                  {adminMessages.map((m) => {
                    const isOwn = m.user_id === (user?.id ?? -1);
                    // AdminMessageDto'yu MessageDto'ya dönüştür
                    const messageDto: MessageDto = {
                      id: m.id,
                      thread_id: m.admin_thread_id,
                      user_id: m.user_id,
                      content: m.content,
                      ip_address: m.ip_address,
                      created_at: m.created_at,
                      username: m.username,
                      align: m.align
                    };
                    return (
                      <MessageBubble 
                        key={`admin-${m.id}`} 
                        message={messageDto} 
                        isOwn={isOwn} 
                        isAdminMessage={true}
                        onReport={(msg) => setReportModal({ isOpen: true, message: msg })}
                      />
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
                <div className="glass-effect p-4 rounded-xl border border-orange-500/30">
                  <div className="text-center text-orange-300 text-sm">
                    <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Admin thread'lerine mesaj gönderemezsiniz
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
      
      <ReportModal
        message={reportModal.message}
        isOpen={reportModal.isOpen}
        onClose={() => setReportModal({ isOpen: false, message: null })}
      />
      
      <ThreadCreateModal
        categoryId={threadCreateModal.categoryId}
        categoryName={threadCreateModal.categoryName}
        isOpen={threadCreateModal.isOpen}
        onClose={() => setThreadCreateModal({ isOpen: false, categoryId: 0, categoryName: '' })}
        onCreated={(thread) => {
          setThreads((prev) => [thread, ...prev]);
          openThread(thread);
        }}
      />
    </AnimatedBackground>
  );
}

export default ForumPage;

import { Plus } from 'lucide-react';
import MessageBubble from '../components/MessageBubble';
import MessageComposer from '../components/MessageComposer';
import ReportModal from '../components/ReportModal';
import ThreadCreateModal from '../components/ThreadCreateModal';


