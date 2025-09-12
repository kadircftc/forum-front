import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import AdminCategoryPage from './pages/AdminCategoryPage';
import AdminGeneralPage from './pages/AdminGeneralPage';
import AdminThreadPage from './pages/AdminThreadPage';
import ForumPage from './pages/ForumPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forum" element={<ProtectedRoute><ForumPage /></ProtectedRoute>} />
            <Route path="/forum/:categoryId" element={<ProtectedRoute><ForumPage /></ProtectedRoute>} />
            <Route path="/forum/:categoryId/:threadId" element={<ProtectedRoute><ForumPage /></ProtectedRoute>} />
            <Route path="/forum/admin-thread/:adminThreadId" element={<ProtectedRoute><ForumPage /></ProtectedRoute>} />
            <Route path="/admin/categories" element={<AdminProtectedRoute><AdminCategoryPage /></AdminProtectedRoute>} />
            <Route path="/admin/threads" element={<AdminProtectedRoute><AdminThreadPage /></AdminProtectedRoute>} />
            <Route path="/admin/general" element={<AdminProtectedRoute><AdminGeneralPage /></AdminProtectedRoute>} />
          </Routes>
        </AuthProvider>
      </Router>
  );
}

export default App;