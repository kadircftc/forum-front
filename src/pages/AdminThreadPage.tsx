import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { listAdminCategories } from '../services/adminCategoryService';
import {
    addMessageToAdminThread,
    createAdminThread,
    createAdminThreadWithMessage,
    deleteAdminThread,
    listAdminThreadsByCategory
} from '../services/adminThreadService';
import type { AdminCategoryDto, AdminThreadDto } from '../types';

const AdminThreadPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [categories, setCategories] = useState<AdminCategoryDto[]>([]);
  const [threads, setThreads] = useState<AdminThreadDto[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateWithMessageModal, setShowCreateWithMessageModal] = useState(false);
  const [newThread, setNewThread] = useState({ 
    admin_category_id: 0, 
    title: '', 
    content: '' 
  });
  const [newMessage, setNewMessage] = useState({ thread_id: 0, content: '' });

  useEffect(() => {
    if (isAdmin) {
      loadCategories();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (selectedCategoryId) {
      loadThreads(selectedCategoryId);
    }
  }, [selectedCategoryId]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await listAdminCategories({ page: 1, limit: 50 });
      setCategories(response.items);
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadThreads = async (categoryId: number) => {
    try {
      setLoading(true);
      const response = await listAdminThreadsByCategory({ admin_category_id: categoryId });
      setThreads(response.threads);
    } catch (error) {
      console.error('Threadler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThread.title.trim() || !newThread.admin_category_id) return;

    try {
      await createAdminThread({
        admin_category_id: newThread.admin_category_id,
        title: newThread.title
      });
      setNewThread({ admin_category_id: 0, title: '', content: '' });
      setShowCreateModal(false);
      if (selectedCategoryId) loadThreads(selectedCategoryId);
    } catch (error) {
      console.error('Thread oluşturulurken hata:', error);
    }
  };

  const handleCreateThreadWithMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThread.title.trim() || !newThread.content.trim() || !newThread.admin_category_id) return;

    try {
      await createAdminThreadWithMessage({
        admin_category_id: newThread.admin_category_id,
        title: newThread.title,
        content: newThread.content
      });
      setNewThread({ admin_category_id: 0, title: '', content: '' });
      setShowCreateWithMessageModal(false);
      if (selectedCategoryId) loadThreads(selectedCategoryId);
    } catch (error) {
      console.error('Thread ve mesaj oluşturulurken hata:', error);
    }
  };

  const handleAddMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.content.trim() || !newMessage.thread_id) return;

    try {
      await addMessageToAdminThread(newMessage);
      setNewMessage({ thread_id: 0, content: '' });
      if (selectedCategoryId) loadThreads(selectedCategoryId);
    } catch (error) {
      console.error('Mesaj eklenirken hata:', error);
    }
  };

  const handleDeleteThread = async (id: number) => {
    if (!confirm('Bu threadi silmek istediğinizden emin misiniz?')) return;

    try {
      await deleteAdminThread({ id });
      if (selectedCategoryId) loadThreads(selectedCategoryId);
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
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Admin Thread Yönetimi</h1>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Yeni Thread
              </button>
              <button
                onClick={() => setShowCreateWithMessageModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Thread + Mesaj
              </button>
            </div>
          </div>

          {/* Category Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori Seçin
            </label>
            <select
              value={selectedCategoryId || ''}
              onChange={(e) => setSelectedCategoryId(e.target.value ? Number(e.target.value) : null)}
              className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Kategori seçin...</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Yükleniyor...</p>
            </div>
          ) : selectedCategoryId ? (
            <div className="space-y-4">
              {threads?.map((thread) => (
                <div key={thread.id} className="bg-gray-50 rounded-lg p-4 border">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{thread.title}</h3>
                      <p className="text-sm text-gray-500">
                        Oluşturulma: {new Date(thread.created_at).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setNewMessage({ thread_id: thread.id, content: '' })}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Mesaj Ekle
                      </button>
                      <button
                        onClick={() => handleDeleteThread(thread.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {threads?.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Bu kategoride henüz thread bulunmamaktadır.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Threadleri görüntülemek için bir kategori seçin.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Thread Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Yeni Thread Oluştur</h2>
            <form onSubmit={handleCreateThread}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori *
                </label>
                <select
                  value={newThread.admin_category_id}
                  onChange={(e) => setNewThread({ ...newThread, admin_category_id: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value={0}>Kategori seçin...</option>
                  {categories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thread Başlığı *
                </label>
                <input
                  type="text"
                  value={newThread.title}
                  onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Thread başlığını girin"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Oluştur
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Thread with Message Modal */}
      {showCreateWithMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Thread + Mesaj Oluştur</h2>
            <form onSubmit={handleCreateThreadWithMessage}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori *
                </label>
                <select
                  value={newThread.admin_category_id}
                  onChange={(e) => setNewThread({ ...newThread, admin_category_id: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value={0}>Kategori seçin...</option>
                  {categories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thread Başlığı *
                </label>
                <input
                  type="text"
                  value={newThread.title}
                  onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Thread başlığını girin"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İlk Mesaj *
                </label>
                <textarea
                  value={newThread.content}
                  onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="İlk mesajı girin"
                  rows={4}
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Oluştur
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateWithMessageModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Message Modal */}
      {newMessage.thread_id > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Mesaj Ekle</h2>
            <form onSubmit={handleAddMessage}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mesaj İçeriği *
                </label>
                <textarea
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mesaj içeriğini girin"
                  rows={4}
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Ekle
                </button>
                <button
                  type="button"
                  onClick={() => setNewMessage({ thread_id: 0, content: '' })}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminThreadPage;
