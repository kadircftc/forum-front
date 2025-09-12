import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import { useAuth } from '../context/AuthContext';
import { listCategories } from '../services/categoryService';
import { createMessage, listMessagesByThread } from '../services/messageService';
import { deleteThread, listThreadsByCategory, searchThreads } from '../services/threadService';
import type { CategoryDto, MessageDto, ThreadDto, ThreadSearchResponseDto } from '../types';

function ForumPage() {
  const { isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [threads, setThreads] = useState<ThreadDto[]>([]);
  const [selectedThread, setSelectedThread] = useState<ThreadDto | null>(null);
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [messagesPage, setMessagesPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [reportModal, setReportModal] = useState<{ isOpen: boolean; message: MessageDto | null }>({ isOpen: false, message: null });
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const justAppendedRef = useRef(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchInfo, setSearchInfo] = useState<Pick<ThreadSearchResponseDto, 'page' | 'limit' | 'total' | 'has_more'> | null>(null);
  const [currentSearchPage, setCurrentSearchPage] = useState(1);

  useEffect(() => {
    (async () => {
      const res = await listCategories();
      setCategories(res.categories);
    })();
  }, []);

  useEffect(() => {
    if (!selectedCategoryId) return;
    (async () => {
      setLoading(true);
      try {
        const res = await listThreadsByCategory({ category_id: selectedCategoryId });
        setThreads(res.threads);
        setSelectedThread(null);
        setMessages([]);
        navigate(`/forum/${selectedCategoryId}`, { replace: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedCategoryId]);

  // Initialize from URL
  useEffect(() => {
    const categoryId = params.categoryId ? Number(params.categoryId) : null;
    const threadId = params.threadId ? Number(params.threadId) : null;
    if (categoryId && categoryId !== selectedCategoryId) {
      setSelectedCategoryId(categoryId);
    }
    if (threadId && threads.length) {
      const t = threads.find((x) => x.id === threadId);
      if (t) {
        setSelectedThread(t);
        (async () => {
          const res = await listMessagesByThread({ thread_id: t.id, page: 1 });
          setMessages(res.messages);
          setMessagesPage(1);
          setHasMoreMessages(res.messages.length > 0); // backend total gelmiyor, boş değilse devam var varsayımı
          justAppendedRef.current = true; // ilk yüklemede alta sabitle
        })();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.categoryId, params.threadId, threads.length]);

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
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="text-sm text-white/80 font-medium">
              {user ? `Hoş geldin, ${user.username}` : 'Misafir'}
            </div>
          </div>
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
        {/* Categories row */}
        <div className="flex items-center gap-3 overflow-x-auto pb-3 mb-4">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategoryId(c.id)}
              className={`px-3 py-1 rounded-full border ${selectedCategoryId === c.id ? 'border-cyan-500 text-cyan-400' : 'border-zinc-700 text-zinc-300'} bg-black/40 hover:border-cyan-500 transition`}
              title={c.description}
            >
              {c.name}
            </button>
          ))}
        </div>

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
          <ThreadCreateForm
            categoryId={selectedCategoryId}
            onCreated={(t) => {
              setThreads((prev) => [t, ...prev]);
              openThread(t);
            }}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Thread list */}
          <aside className="md:col-span-4 lg:col-span-3 space-y-2 max-h-[70vh] overflow-auto pr-2">
            {loading && <div className="text-zinc-400">Yükleniyor...</div>}
            {!loading && threads.map((t) => (
              <div key={t.id} className={`glass-effect p-3 rounded-lg ${selectedThread?.id === t.id ? 'ring-1 ring-cyan-500' : ''}`}>
                <button className="text-left w-full" onClick={() => openThread(t)}>
                  <div className="font-medium text-zinc-100 line-clamp-2">{t.title}</div>
                  <div className="text-xs text-zinc-400">#{t.id} • Cat {t.category_id}</div>
                </button>
                {(canDeleteThread(t)) && (
                  <button onClick={() => removeThread(t)} className="mt-2 text-xs text-red-400 hover:text-red-300">Sil</button>
                )}
              </div>
            ))}
          </aside>

          {/* Thread detail */}
          <main className="md:col-span-8 lg:col-span-9">
            {!selectedThread && <div className="text-zinc-400">Bir thread seçin.</div>}
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
                    // Debug: kendi mesajlarımızı kontrol et
                    if (user?.id) {
                      console.log('Message user_id:', m.user_id, 'Current user id:', user.id, 'isOwn:', isOwn);
                    }
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
          </main>
        </div>
      </div>
      
      <ReportModal
        message={reportModal.message}
        isOpen={reportModal.isOpen}
        onClose={() => setReportModal({ isOpen: false, message: null })}
      />
    </AnimatedBackground>
  );
}

export default ForumPage;

import MessageBubble from '../components/MessageBubble';
import MessageComposer from '../components/MessageComposer';
import ReportModal from '../components/ReportModal';
import { createThread } from '../services/threadService';

function ThreadCreateForm({ categoryId, onCreated }: { categoryId: number; onCreated: (t: ThreadDto) => void }) {
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      const res = await createThread({ category_id: categoryId, title: title.trim() });
      onCreated(res.thread);
      setTitle('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="mb-6 flex items-center gap-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Yeni thread başlığı..."
        className="flex-1 rounded-lg bg-black border border-zinc-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none px-3 py-2"
      />
      <button
        type="submit"
        disabled={submitting}
        className="px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-60"
      >
        Oluştur
      </button>
    </form>
  );
}


