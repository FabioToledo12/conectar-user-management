import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import SetPassword from './pages/SetPassword';
import { usersApi } from './services/api';
import { toast } from 'react-hot-toast';

function App() {
  const { isAuthenticated, user, token, setUser, loginWithToken } = useAuthStore();

  useEffect(() => {
    // Se tem token mas não tem user, busca o perfil
    if (token && !user) {
      loginWithToken(token).catch(() => {
        toast.error('Sessão expirada, faça login novamente');
      });
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/profile" replace />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/profile" replace />} />
        <Route path="/set-password" element={<SetPassword />} />

        {/* Protected Routes */}
        <Route element={<Layout requireAuth />}>
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Admin Only Routes */}
        <Route element={<Layout requireAuth adminOnly />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Default Redirects */}
        <Route path="/" element={
          <Navigate to={
            isAuthenticated
              ? (user?.role === 'admin' ? '/dashboard' : '/profile')
              : '/login'
          } replace />
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;