import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '../store/auth';
import Header from './Header';

interface LayoutProps {
  requireAuth?: boolean;
  adminOnly?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ requireAuth = false, adminOnly = false }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/profile" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && <Header />}
      <main className={isAuthenticated ? 'pt-16' : ''}>
        <Outlet />
      </main>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
};

export default Layout;