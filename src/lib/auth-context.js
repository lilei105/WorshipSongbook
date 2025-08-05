'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = sessionStorage.getItem('token');
    const savedUser = sessionStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        // 验证token是否仍然有效
        const response = await fetch('/api/auth/session', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          setUser(JSON.parse(savedUser));
        } else {
          // Token无效，清除存储
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
        }
      } catch (error) {
        console.error('验证token失败:', error);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
      }
    }
    setLoading(false);
  };

  const login = (token, userData) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  const updateUser = (userData) => {
    setUser(userData);
    sessionStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth必须在AuthProvider内使用');
  }
  return context;
}