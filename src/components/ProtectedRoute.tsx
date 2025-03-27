import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        console.log('ProtectedRoute: Checking authentication...');
        console.log('ProtectedRoute: Current path:', location.pathname);
        console.log('ProtectedRoute: Require admin:', requireAdmin);
        
        // Отримуємо дані з localStorage напряму
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        console.log('ProtectedRoute: Token from localStorage:', token ? 'exists' : 'not found');
        console.log('ProtectedRoute: User data from localStorage:', userStr);
        
        // Перевіряємо, чи користувач авторизований
        const authenticated = token !== null;
        console.log('ProtectedRoute: Is authenticated:', authenticated);
        setIsAuthenticated(authenticated);
        
        if (authenticated && userStr) {
          try {
            const userData = JSON.parse(userStr);
            console.log('ProtectedRoute: Parsed user data:', userData);
            
            if (requireAdmin) {
              // Якщо потрібні права адміністратора, перевіряємо їх
              const admin = userData.role === 'admin';
              console.log('ProtectedRoute: Is admin:', admin);
              setIsAdmin(admin);
            } else {
              // Якщо права адміністратора не потрібні, просто встановлюємо true
              setIsAdmin(true);
            }
          } catch (error) {
            console.error('ProtectedRoute: Error parsing user data:', error);
            setIsAuthenticated(false);
            setIsAdmin(false);
          }
        }
      } catch (error) {
        console.error('ProtectedRoute: Error checking authentication:', error);
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [requireAdmin, location.pathname]);

  if (isLoading) {
    console.log('ProtectedRoute: Still loading...');
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    console.log('ProtectedRoute: Not authenticated, redirecting to login...');
    // Якщо користувач не авторизований, перенаправляємо на сторінку входу
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    console.log('ProtectedRoute: Not admin, redirecting to home...');
    // Якщо потрібні права адміністратора, але користувач не адміністратор
    return <Navigate to="/" replace />;
  }

  console.log('ProtectedRoute: All checks passed, rendering children...');
  // Якщо всі перевірки пройдені, відображаємо дочірні компоненти
  return <>{children}</>;
};

export default ProtectedRoute;
