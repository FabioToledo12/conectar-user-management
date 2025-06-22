import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />} />
        
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