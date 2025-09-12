import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { deleteCategory, listCategories } from '../services/categoryService';
import { listMessagesByThread } from '../services/messageService';
import { deleteThread, listThreadsByCategory } from '../services/threadService';
import type { CategoryDto, MessageDto, ThreadDto } from '../types';

const AdminGeneralPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [threads, setThreads] = useState<ThreadDto[]>([]);
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      loadCategories();
    }
  }, [isAdmin]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await listCategories();
      setCategories(response.categories);
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadThreads = async (categoryId: number) => {
    try {
      setLoading(true);
      const response = await listThreadsByCategory({ category_id: categoryId });
      setThreads(response.threads);
      setSelectedCategoryId(categoryId);
      setSelectedThreadId(null);
      setMessages([]);
    } catch (error) {
      console.error('Threadler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (threadId: number) => {
    try {
      setLoading(true);
      const response = await listMessagesByThread({ thread_id: threadId });
      setMessages(response.messages);
      setSelectedThreadId(threadId);
    } catch (error) {
      console.error('Mesajlar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) return;

    try {
      await deleteCategory({ id });
      loadCategories();
      if (selectedCategoryId === id) {
        setSelectedCategoryId(null);
        setThreads([]);
        setMessages([]);
      }
    } catch (error) {
      console.error('Kategori silinirken hata:', error);
    }
  };

  const handleDeleteThread = async (id: number) => {
    if (!confirm('Bu threadi silmek istediğinizden emin misiniz?')) return;

    try {
      await deleteThread({ id });
      if (selectedCategoryId) {
        loadThreads(selectedCategoryId);
      }
      if (selectedThreadId === id) {
        setSelectedThreadId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Thread silinirken hata:', error);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Yetkisiz Erişim</h1>
          <p className="text-gray-600">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Genel Admin Yönetimi</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Kategoriler */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Kategoriler</h2>
              {loading ? (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-2">
                  {categories?.map((category) => (
                    <div
                      key={category.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedCategoryId === category.id
                          ? 'bg-blue-100 border-2 border-blue-300'
                          : 'bg-white hover:bg-gray-100 border border-gray-200'
                      }`}
                      onClick={() => loadThreads(category.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">{category.name}</h3>
                          {category.description && (
                            <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(category.created_at).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(category.id);
                          }}
                          className="ml-2 text-red-600 hover:text-red-800 text-sm"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Threadler */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Threadler {selectedCategoryId && `(${threads?.length || 0})`}
              </h2>
              {selectedCategoryId ? (
                loading ? (
                  <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {threads?.map((thread) => (
                      <div
                        key={thread.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedThreadId === thread.id
                            ? 'bg-green-100 border-2 border-green-300'
                            : 'bg-white hover:bg-gray-100 border border-gray-200'
                        }`}
                        onClick={() => loadMessages(thread.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-800">{thread.title}</h3>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(thread.created_at).toLocaleDateString('tr-TR')}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteThread(thread.id);
                            }}
                            className="ml-2 text-red-600 hover:text-red-800 text-sm"
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    ))}
                    {threads?.length === 0 && (
                      <p className="text-gray-500 text-sm text-center py-4">
                        Bu kategoride thread bulunmamaktadır.
                      </p>
                    )}
                  </div>
                )
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">
                  Threadleri görmek için bir kategori seçin.
                </p>
              )}
            </div>

            {/* Mesajlar */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Mesajlar {selectedThreadId && `(${messages?.length || 0})`}
              </h2>
              {selectedThreadId ? (
                loading ? (
                  <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {messages?.map((message) => (
                      <div key={message.id} className="bg-white p-3 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-xs text-gray-500">
                            {message.username || 'Anonim'} • {new Date(message.created_at).toLocaleDateString('tr-TR')}
                          </div>
                        </div>
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">{message.content}</p>
                      </div>
                    ))}
                    {messages?.length === 0 && (
                      <p className="text-gray-500 text-sm text-center py-4">
                        Bu threadde mesaj bulunmamaktadır.
                      </p>
                    )}
                  </div>
                )
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">
                  Mesajları görmek için bir thread seçin.
                </p>
              )}
            </div>
          </div>

          {/* Seçim Bilgisi */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Seçim Bilgisi</h3>
            <div className="text-sm text-blue-700">
              {selectedCategoryId && (
                <p>Seçili Kategori: {categories?.find(c => c.id === selectedCategoryId)?.name}</p>
              )}
              {selectedThreadId && (
                <p>Seçili Thread: {threads?.find(t => t.id === selectedThreadId)?.title}</p>
              )}
              {!selectedCategoryId && (
                <p>Yönetim yapmak için bir kategori seçin.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminGeneralPage;
